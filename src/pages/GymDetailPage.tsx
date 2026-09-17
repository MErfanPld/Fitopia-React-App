/**
 * Gym detail — tour hero, sport/coach sheets, share sheet, Persian phone, no prices.
 * Sport sheet opens for ALL sports (locked or unlocked).
 * Wired to real APIs: sports-access, coaches, schedule, gender, reviews.
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowRight, Share2, MapPin, Clock, Star, Phone, Globe, Instagram,
  MessageCircle, Users, AlertCircle, ChevronLeft, ChevronRight, Check, Lock,
  Building2, RefreshCw, Navigation, Dumbbell, Send, Play, X, Copy, Link2,
} from "lucide-react";
import type { Gym, Sport } from "../hooks/useGymAPI";
import { BottomNavigation } from "../components/BottomNavigation";
import { useAuth } from "../context/AuthContext";
import { useGymAccess, dayOfWeekFa, formatTimeFa } from "../hooks/useGymAccess";
import Toast from "../components/Toast";
import { inferGymGender, type GymGender } from "../components/GymCard";

const API_BASE = "https://fitopiaapi.pythonanywhere.com";

function resolveMedia(src?: string | null): string | null {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${API_BASE}${src.startsWith("/") ? "" : "/"}${src}`;
}

function getYoutubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  } catch { /* ignore */ }
  return null;
}

function getImageUrl(image: unknown): string | null {
  if (typeof image === "string") return resolveMedia(image);
  if (image && typeof image === "object" && "image" in image) {
    return resolveMedia((image as { image?: string }).image);
  }
  return null;
}

function toPersianDigits(input?: string | number | null): string {
  if (input == null) return "";
  const map: Record<string, string> = {
    "0": "۰", "1": "۱", "2": "۲", "3": "۳", "4": "۴",
    "5": "۵", "6": "۶", "7": "۷", "8": "۸", "9": "۹",
  };
  return String(input).replace(/[0-9]/g, (d) => map[d] ?? d);
}

function genderLabelFa(g: GymGender): string {
  if (g === "women") return "زنانه";
  if (g === "men") return "مردانه";
  return "آقایان و بانوان";
}

type CoachView = { id: number; name: string; specialty?: string; image?: string | null; bio?: string };

function normalizeCoach(raw: Record<string, unknown>, idx: number): CoachView {
  return {
    id: Number(raw.id ?? idx),
    name: String(raw.full_name ?? raw.name ?? raw.coach_name ?? "مربی"),
    specialty: typeof raw.specialty === "string" ? raw.specialty : undefined,
    image: resolveMedia((raw.image as string) ?? null),
    bio: typeof raw.bio === "string" ? raw.bio : undefined,
  };
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-[0.95rem] font-bold text-white tracking-tight">
      <span className="inline-block h-4 w-1 rounded-full bg-primary shrink-0" aria-hidden />
      {children}
    </h2>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-white/[0.08] bg-[#121216] p-4 sm:p-5 ${className}`}>
      {children}
    </section>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-dvh bg-[#07070A] home-with-rail" aria-busy="true">
      <div className="home-shell home-pad pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="mx-auto max-w-3xl space-y-5 pb-28">
          <div className="skeleton aspect-[16/10] w-full rounded-2xl" />
          <div className="skeleton h-12 w-full rounded-2xl" />
          <div className="skeleton h-32 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function BottomSheet({
  open, onClose, title, children, z = 60,
}: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; z?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev || "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-end justify-center sm:items-center" style={{ zIndex: z }} role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-white/10 bg-[#121216] shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/[0.06] bg-[#121216]/95 px-4 py-3.5">
          <button type="button" onClick={onClose} className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl text-white/70" aria-label="بستن">
            <X size={20} aria-hidden />
          </button>
          <h3 className="min-w-0 flex-1 truncate text-center text-base font-bold text-white">{title}</h3>
          <span className="w-10" aria-hidden />
        </div>
        <div className="p-4 pb-8">{children}</div>
      </div>
    </div>
  );
}

export function GymDetailPage() {
  const { gymId } = useParams<{ gymId: string }>();
  const navigate = useNavigate();
  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [commentRating, setCommentRating] = useState(5);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [comments, setComments] = useState<{ id: number; user_name: string; text: string; rating?: number }[]>([]);
  const { isAuthenticated } = useAuth();
  const {
    sports: accessSports,
    loading: accessLoading,
    hasSportAccess,
    fetchCoaches,
    fetchSchedule,
  } = useGymAccess(Number(gymId));
  const [sportOpen, setSportOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState<{ id: number; name: string } | null>(null);
  const [sportCoaches, setSportCoaches] = useState<CoachView[] | null>(null);
  const [sportSchedule, setSportSchedule] = useState<
    { day: string; start: string; end: string; gender?: string }[]
  >([]);
  const [sportLoading, setSportLoading] = useState(false);
  const [sportError, setSportError] = useState<string | null>(null);
  const [coachOpen, setCoachOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<CoachView | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "warning" } | null>(null);
  const touchStartX = useRef<number | null>(null);

  const loadGym = async () => {
    if (!gymId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/api/gym/${gymId}/`);
      if (!response.ok) throw new Error("باشگاه یافت نشد");
      const data = await response.json();
      setGym(data);
      if (data.reviews && Array.isArray(data.reviews)) {
        setComments(data.reviews.map((r: Record<string, unknown>) => ({
          id: Number(r.id),
          user_name: String(r.name ?? r.user_name ?? "کاربر"),
          text: String(r.comment ?? r.text ?? ""),
          rating: typeof r.rating === "number" ? r.rating : undefined,
        })));
      } else setComments([]);
      setSlideIndex(0);
      document.title = data?.name ? `FITOPIA | ${data.name}` : "FITOPIA | جزئیات باشگاه";
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطایی رخ داد");
      setGym(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadGym(); }, [gymId]);

  const slides = useMemo(() => {
    const list: string[] = [];
    const cover = resolveMedia(gym?.cover_image ?? null);
    if (cover) list.push(cover);
    if (gym?.images?.length) {
      for (const img of gym.images) {
        const u = getImageUrl(img);
        if (u && !list.includes(u)) list.push(u);
      }
    }
    return list;
  }, [gym?.cover_image, gym?.images]);

  const rating =
    typeof gym?.popularity_score === "number" && gym.popularity_score > 0
      ? gym.popularity_score.toFixed(1)
      : typeof gym?.average_rating === "number" && gym.average_rating > 0
        ? gym.average_rating.toFixed(1)
        : null;

  const sportsList: Sport[] = useMemo(() => {
    if (accessSports && accessSports.length > 0) return accessSports;
    if (gym?.sports?.length) return gym.sports;
    return [];
  }, [accessSports, gym?.sports]);

  const coachesList: CoachView[] = useMemo(() => {
    if (!gym?.coaches?.length) return [];
    return gym.coaches.map((c, i) => normalizeCoach(c as unknown as Record<string, unknown>, i));
  }, [gym?.coaches]);

  const gymGender = useMemo(
    () =>
      inferGymGender({
        id: gym?.id ?? 0,
        name: gym?.name,
        description: gym?.description,
        gender: gym?.gender,
      }),
    [gym?.id, gym?.name, gym?.description, gym?.gender],
  );

  const hasSocial = Boolean(gym?.instagram || gym?.telegram || gym?.whatsapp || gym?.website);

  const nextSlide = () => { if (slides.length > 1) setSlideIndex((p) => (p + 1) % slides.length); };
  const prevSlide = () => { if (slides.length > 1) setSlideIndex((p) => (p - 1 + slides.length) % slides.length); };

  /** Always open sheet — access only affects lock badge, not sheet visibility. */
  const openSport = async (sport: Sport) => {
    setSelectedSport({ id: sport.id, name: sport.name });
    setSportOpen(true);
    setSportLoading(true);
    setSportError(null);
    setSportSchedule([]);
    setSportCoaches(null);
    try {
      const [coachesRes, scheduleRes] = await Promise.allSettled([
        fetchCoaches(sport.id),
        fetchSchedule(sport.id),
      ]);

      if (coachesRes.status === "fulfilled") {
        setSportCoaches(
          (coachesRes.value || []).map((c, i) =>
            normalizeCoach(c as unknown as Record<string, unknown>, i),
          ),
        );
      } else {
        setSportCoaches([]);
      }

      if (scheduleRes.status === "fulfilled" && scheduleRes.value?.schedules) {
        setSportSchedule(
          scheduleRes.value.schedules.map((s) => ({
            day: dayOfWeekFa(Number(s.day_of_week)),
            start: formatTimeFa(s.start_time),
            end: formatTimeFa(s.end_time),
            gender: s.gender_restriction,
          })),
        );
      }
    } catch (err: unknown) {
      setSportError(err instanceof Error ? err.message : "خطا در دریافت اطلاعات رشته");
      setSportCoaches(null);
    } finally {
      setSportLoading(false);
    }
  };

  const openMap = () => {
    if (!gym) return;
    if (gym.google_map_url) { window.open(gym.google_map_url, "_blank", "noopener,noreferrer"); return; }
    if (gym.latitude && gym.longitude) {
      window.open(`https://www.google.com/maps?q=${gym.latitude},${gym.longitude}`, "_blank", "noopener,noreferrer");
      return;
    }
    navigate("/gym-map");
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !gymId || commentSubmitting) return;
    setCommentSubmitting(true);
    try {
      const token =
        localStorage.getItem("access") ||
        localStorage.getItem("fitopia_auth_token") ||
        "";
      const res = await fetch(`${API_BASE}/api/gym/${gymId}/reviews/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          comment: newComment.trim(),
          rating: commentRating,
        }),
      });
      if (res.status === 401) {
        setToast({ message: "نشست منقضی شده؛ دوباره وارد شوید", type: "error" });
        window.dispatchEvent(new CustomEvent("fitopia:auth-expired"));
        return;
      }
      if (!res.ok) {
        setToast({ message: "ثبت نظر ناموفق بود", type: "error" });
        return;
      }
      const created = (await res.json()) as Record<string, unknown>;
      setComments((prev) => [
        {
          id: Number(created?.id ?? Date.now()),
          user_name: String(created?.name ?? created?.user_name ?? "شما"),
          text: String(created?.comment ?? created?.text ?? newComment.trim()),
          rating:
            typeof created?.rating === "number"
              ? (created.rating as number)
              : commentRating,
        },
        ...prev,
      ]);
      setNewComment("");
      setCommentRating(5);
      setToast({ message: "نظر شما ثبت شد", type: "success" });
    } finally {
      setCommentSubmitting(false);
    }
  };

  if (loading) return <DetailSkeleton />;
  if (error || !gym) {
    return (
      <div className="min-h-dvh bg-[#07070A] home-with-rail flex flex-col">
        <div className="home-shell home-pad flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <AlertCircle className="h-10 w-10 text-red-300/80" aria-hidden />
          <p className="text-sm font-semibold text-white">{error || "اطلاعات باشگاه یافت نشد"}</p>
          <button type="button" onClick={loadGym} className="btn btn-primary min-h-11 px-5 text-sm inline-flex items-center gap-2">
            <RefreshCw size={16} aria-hidden /> تلاش مجدد
          </button>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  const phoneDisplay = gym.phone ? toPersianDigits(gym.phone) : null;
  const phoneHref = gym.phone ? `tel:${String(gym.phone).replace(/\s/g, "")}` : null;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-dvh bg-[#07070A] text-right home-with-rail">
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#07070A]/88 backdrop-blur-md">
        <div className="home-shell home-pad flex items-center justify-between gap-3 py-2.5 pt-[max(0.5rem,env(safe-area-inset-top))]">
          <button type="button" onClick={() => navigate(-1)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white" aria-label="بازگشت">
            <ArrowRight size={20} aria-hidden />
          </button>
          <h1 className="min-w-0 flex-1 truncate text-center text-sm font-bold text-white/90">{gym.name}</h1>
          <button type="button" onClick={() => setShareOpen(true)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white" aria-label="اشتراک‌گذاری">
            <Share2 size={18} aria-hidden />
          </button>
        </div>
      </header>

      <main className="relative z-10 home-shell home-pad pb-[calc(6.75rem+env(safe-area-inset-bottom))] md:pb-12">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 sm:gap-6 lg:max-w-4xl">
          {/* HERO + rest of UI preserved from origin; sport sheet has schedule */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121216]">
            <div
              className="relative aspect-[16/10] sm:aspect-[2/1] bg-white/[0.03]"
              onTouchStart={(e) => { touchStartX.current = e.changedTouches[0]?.clientX ?? null; }}
              onTouchEnd={(e) => {
                if (touchStartX.current == null || slides.length < 2) return;
                const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
                touchStartX.current = null;
                if (Math.abs(dx) < 40) return;
                if (dx > 0) prevSlide(); else nextSlide();
              }}
            >
              {slides.length > 0 ? (
                <img src={slides[slideIndex]} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1410] to-[#0e0e12] flex items-center justify-center">
                  <Building2 className="h-12 w-12 text-white/20" aria-hidden />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070A] via-[#07070A]/35 to-transparent" />
              <div className="absolute top-3 inset-x-3 flex items-start justify-between gap-2">
                {gym.is_popular ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-black">
                    <Star size={11} className="fill-current" aria-hidden /> محبوب
                  </span>
                ) : <span />}
                <div className="flex items-center gap-1.5">
                  {slides.length > 1 && (
                    <span className="rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold text-white/85">
                      {toPersianDigits(slideIndex + 1)} / {toPersianDigits(slides.length)}
                    </span>
                  )}
                  {rating && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-amber-200">
                      <Star size={12} className="fill-amber-300 text-amber-300" aria-hidden />
                      {toPersianDigits(rating)}
                    </span>
                  )}
                </div>
              </div>
              {slides.length > 1 && (
                <>
                  <button type="button" onClick={prevSlide} className="absolute start-2 top-1/2 -translate-y-1/2 inline-flex min-h-10 min-w-10 items-center justify-center rounded-full bg-black/45 text-white" aria-label="قبلی">
                    <ChevronRight size={18} aria-hidden />
                  </button>
                  <button type="button" onClick={nextSlide} className="absolute end-2 top-1/2 -translate-y-1/2 inline-flex min-h-10 min-w-10 items-center justify-center rounded-full bg-black/45 text-white" aria-label="بعدی">
                    <ChevronLeft size={18} aria-hidden />
                  </button>
                </>
              )}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white drop-shadow">{gym.name}</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    gymGender === "women" ? "bg-pink-500/20 text-pink-200" : gymGender === "men" ? "bg-sky-500/20 text-sky-200" : "bg-white/15 text-white/90"
                  }`}>
                    <Users size={12} aria-hidden /> {genderLabelFa(gymGender)}
                  </span>
                  {gym.address && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] text-white/80">
                      <MapPin size={12} aria-hidden /> {gym.address}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button type="button" onClick={openMap} className="btn btn-primary w-full min-h-12 text-sm font-bold inline-flex items-center justify-center gap-2">
            <Navigation size={18} aria-hidden /> مسیریابی روی نقشه
          </button>

          {sportsList.length > 0 && (
            <Card>
              <div className="mb-3"><SectionTitle>رشته‌های ورزشی</SectionTitle></div>
              <div className="flex flex-wrap gap-2 justify-end">
                {sportsList.map((sport) => {
                  const locked = !hasSportAccess(sport.id);
                  return (
                    <button key={sport.id} type="button" onClick={() => openSport(sport)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/85 hover:bg-white/[0.08]">
                      {locked ? <Lock size={12} className="text-amber-300" aria-hidden /> : <Dumbbell size={12} className="text-primary" aria-hidden />}
                      {sport.name}
                    </button>
                  );
                })}
              </div>
              {accessLoading && <p className="mt-2 text-[11px] text-white/40">در حال بررسی دسترسی…</p>}
            </Card>
          )}

          {coachesList.length > 0 && (
            <Card>
              <div className="mb-3"><SectionTitle>مربیان</SectionTitle></div>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
                {coachesList.map((c) => (
                  <button key={c.id} type="button" onClick={() => { setSelectedCoach(c); setCoachOpen(true); }}
                    className="flex w-28 shrink-0 flex-col items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-center hover:bg-white/[0.06]">
                    <div className="h-14 w-14 overflow-hidden rounded-full border border-white/10 bg-white/[0.05]">
                      {c.image ? <img src={c.image} alt="" className="h-full w-full object-cover" /> : (
                        <div className="flex h-full w-full items-center justify-center"><Users size={20} className="text-white/30" aria-hidden /></div>
                      )}
                    </div>
                    <p className="text-xs font-bold text-white truncate w-full">{c.name}</p>
                    {c.specialty && <p className="text-[10px] text-white/45 truncate w-full">{c.specialty}</p>}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {gym.description && (
            <Card>
              <div className="mb-2"><SectionTitle>درباره باشگاه</SectionTitle></div>
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{gym.description}</p>
            </Card>
          )}

          {phoneDisplay && (
            <Card className="!p-3.5">
              <div className="flex items-center justify-between gap-3">
                <a href={phoneHref || undefined} className="text-sm font-semibold text-primary tabular-nums" dir="ltr">{phoneDisplay}</a>
                <span className="inline-flex items-center gap-1.5 text-xs text-white/50"><Phone size={14} aria-hidden /> تماس</span>
              </div>
            </Card>
          )}

          {hasSocial && (
            <Card className="!p-3.5">
              <div className="mb-2.5"><SectionTitle>شبکه‌های اجتماعی</SectionTitle></div>
              <div className="flex flex-wrap justify-end gap-2">
                {gym.instagram && <a href={gym.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 text-[11px] font-semibold text-white/75"><Instagram size={14} className="text-primary" aria-hidden /> اینستاگرام</a>}
                {gym.telegram && <a href={gym.telegram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 text-[11px] font-semibold text-white/75"><Send size={14} className="text-primary" aria-hidden /> تلگرام</a>}
                {gym.whatsapp && <a href={`https://wa.me/${String(gym.whatsapp).replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 text-[11px] font-semibold text-white/75"><MessageCircle size={14} className="text-primary" aria-hidden /> واتساپ</a>}
                {gym.website && <a href={gym.website} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 text-[11px] font-semibold text-white/75"><Globe size={14} className="text-primary" aria-hidden /> وب‌سایت</a>}
              </div>
            </Card>
          )}

          <Card>
            <div className="mb-3"><SectionTitle>نظرات</SectionTitle></div>
            {isAuthenticated && (
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-1 justify-end">
                  {[1,2,3,4,5].map((n) => (
                    <button key={n} type="button" onClick={() => setCommentRating(n)} aria-label={`${n} ستاره`}>
                      <Star size={18} className={commentRating >= n ? "fill-amber-300 text-amber-300" : "text-white/25"} aria-hidden />
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newComment} onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") void handleAddComment(); }}
                    placeholder="نظر خود را بنویسید…"
                    className="field min-h-11 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/35" />
                  <button type="button" onClick={() => void handleAddComment()} disabled={!newComment.trim() || commentSubmitting}
                    className="btn btn-primary min-h-11 px-4 text-sm disabled:opacity-40">ارسال</button>
                </div>
              </div>
            )}
            {comments.length === 0 ? (
              <p className="text-sm text-white/45 text-center py-4">هنوز نظری ثبت نشده</p>
            ) : (
              <ul className="space-y-3">
                {comments.map((c) => (
                  <li key={c.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-white/80">{c.user_name}</span>
                      {c.rating != null && (
                        <span className="inline-flex items-center gap-0.5 text-[11px] text-amber-200">
                          <Star size={11} className="fill-amber-300 text-amber-300" aria-hidden />
                          {toPersianDigits(c.rating)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/65 leading-relaxed">{c.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </main>

      <BottomSheet open={sportOpen} onClose={() => setSportOpen(false)} title={selectedSport?.name || ""}>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 justify-end">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              gymGender === "women" ? "bg-pink-500/15 text-pink-300" : gymGender === "men" ? "bg-sky-500/15 text-sky-300" : "bg-white/[0.08] text-white/75"
            }`}>
              <Users size={12} aria-hidden /> {genderLabelFa(gymGender)}
            </span>
            {selectedSport && !hasSportAccess(selectedSport.id) && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-200 px-2.5 py-1 text-[11px] font-semibold">
                <Lock size={11} aria-hidden /> نیاز به اشتراک
              </span>
            )}
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-white/80">برنامه این رشته</p>
            {sportLoading ? (
              <p className="py-4 text-center text-sm text-white/45">در حال بارگذاری…</p>
            ) : sportSchedule.length === 0 ? (
              <p className="py-4 text-center text-sm text-white/45">برنامه‌ای ثبت نشده است</p>
            ) : (
              <ul className="space-y-1.5">
                {sportSchedule.map((item, i) => (
                  <li key={`${item.day}-${item.start}-${i}`} className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5">
                    <span className="text-xs text-white/55 tabular-nums" dir="ltr">
                      {toPersianDigits(item.start)} – {toPersianDigits(item.end)}
                    </span>
                    <span className="text-sm font-semibold text-white">{item.day}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-white/80">مربیان این رشته</p>
            {sportLoading ? <p className="py-6 text-center text-sm text-white/45">در حال بارگذاری…</p>
            : sportError ? <p className="py-6 text-center text-sm text-red-300/90">{sportError}</p>
            : !sportCoaches || sportCoaches.length === 0 ? <p className="py-6 text-center text-sm text-white/45">مربی‌ای ثبت نشده است</p>
            : (
              <ul className="space-y-2">
                {sportCoaches.map((c) => (
                  <li key={c.id}>
                    <button type="button" onClick={() => { setSelectedCoach(c); setCoachOpen(true); }}
                      className="flex w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-right hover:bg-white/[0.06]">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/[0.05]">
                        {c.image ? <img src={c.image} alt="" className="h-full w-full object-cover" /> : (
                          <div className="flex h-full w-full items-center justify-center"><Users size={18} className="text-white/30" aria-hidden /></div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white truncate">{c.name}</p>
                        {c.specialty && <p className="text-[11px] text-white/50 truncate">{c.specialty}</p>}
                      </div>
                      <ChevronLeft size={16} className="text-white/30 shrink-0" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </BottomSheet>

      <BottomSheet open={coachOpen} onClose={() => setCoachOpen(false)} title="پروفایل مربی" z={70}>
        {selectedCoach && (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-primary/40 bg-white/[0.05]">
              {selectedCoach.image ? <img src={selectedCoach.image} alt="" className="h-full w-full object-cover" /> : (
                <div className="flex h-full w-full items-center justify-center"><Users size={36} className="text-white/25" aria-hidden /></div>
              )}
            </div>
            <p className="text-lg font-extrabold text-white">{selectedCoach.name}</p>
            {selectedCoach.specialty && <p className="text-sm text-primary/90 font-semibold">{selectedCoach.specialty}</p>}
            {selectedCoach.bio ? (
              <p className="mt-2 text-sm text-white/65 leading-relaxed text-right w-full whitespace-pre-wrap">{selectedCoach.bio}</p>
            ) : (
              <p className="text-xs text-white/40">بیوگرافی ثبت نشده است.</p>
            )}
          </div>
        )}
      </BottomSheet>

      <BottomSheet open={shareOpen} onClose={() => setShareOpen(false)} title="اشتراک‌گذاری">
        <p className="text-center text-xs text-white/45 mb-4">می‌خواهید در کدام برنامه منتشر کنید؟</p>
        <div className="grid grid-cols-2 gap-2">
          <a href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white/85">تلگرام</a>
          <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(shareUrl); setToast({ message: "لینک کپی شد", type: "success" }); setShareOpen(false); } catch { /* */ } }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white/85"><Copy size={16} aria-hidden /> کپی لینک</button>
        </div>
      </BottomSheet>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <BottomNavigation />
    </div>
  );
}
