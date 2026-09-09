/**
 * Gym detail — premium marketplace profile
 * Route: /gym/:gymId
 * API: GET /api/gym/{id}/ + useGymAccess sports/coaches
 * Real data only; preserves access lock, coaches modal, contact, gallery.
 */

import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Share2,
  MapPin,
  Clock,
  Star,
  Phone,
  Globe,
  Instagram,
  MessageCircle,
  Users,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  Lock,
  Building2,
  RefreshCw,
  Navigation,
  Dumbbell,
  Wallet,
  Image as ImageIcon,
  Send,
} from "lucide-react";
import type { Gym, Sport } from "../hooks/useGymAPI";
import { BottomNavigation } from "../components/BottomNavigation";
import { useAuth } from "../context/AuthContext";
import { useGymAccess } from "../hooks/useGymAccess";
import SportCoachesModal, { type CoachLite } from "../components/SportCoachesModal";
import Toast from "../components/Toast";

const API_BASE = "https://fitopiaapi.pythonanywhere.com";

function resolveMedia(src?: string | null): string | null {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${API_BASE}${src.startsWith("/") ? "" : "/"}${src}`;
}

function getImageUrl(image: unknown): string | null {
  if (typeof image === "string") return resolveMedia(image);
  if (image && typeof image === "object" && "image" in image) {
    const v = (image as { image?: string }).image;
    return resolveMedia(v);
  }
  return null;
}

function formatToman(n?: number | null): string {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return n.toLocaleString("fa-IR");
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-[0.95rem] font-bold text-white tracking-tight">
      <span className="inline-block h-4 w-1 rounded-full bg-primary-container shrink-0" aria-hidden />
      {children}
    </h2>
  );
}

function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-white/[0.08] bg-[#121216] p-4 sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-dvh bg-[#07070A] home-with-rail" aria-busy="true" aria-label="در حال بارگذاری">
      <div className="home-shell home-pad pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="mx-auto max-w-3xl space-y-4 pb-28">
          <div className="flex items-center justify-between">
            <div className="skeleton h-11 w-11 rounded-2xl" />
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-11 w-11 rounded-2xl" />
          </div>
          <div className="skeleton aspect-[16/10] w-full rounded-2xl" />
          <div className="space-y-2">
            <div className="skeleton h-6 w-2/3 rounded ms-auto" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-1/2 rounded ms-auto" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="skeleton h-20 rounded-2xl" />
            <div className="skeleton h-20 rounded-2xl" />
          </div>
          <div className="skeleton h-32 w-full rounded-2xl" />
          <div className="skeleton h-40 w-full rounded-2xl" />
        </div>
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<
    { id: number; user_name: string; text: string; date?: string; rating?: number }[]
  >([]);

  const { isAuthenticated } = useAuth();
  const {
    sports: accessSports,
    loading: accessLoading,
    hasSportAccess,
    fetchCoaches,
  } = useGymAccess(Number(gymId));

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState<{ id: number; name: string } | null>(null);
  const [coaches, setCoaches] = useState<CoachLite[] | null>(null);
  const [coachesLoading, setCoachesLoading] = useState(false);
  const [coachesError, setCoachesError] = useState<string | null>(null);
  const socialMediaRef = useRef<HTMLElement>(null);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
  } | null>(null);

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
        setComments(data.reviews);
      } else {
        setComments([]);
      }
      setCurrentImageIndex(0);
      document.title = data?.name ? `FITOPIA | ${data.name}` : "FITOPIA | جزئیات باشگاه";
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطایی رخ داد");
      setGym(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGym();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gymId]);

  const coverUrl = useMemo(() => resolveMedia(gym?.cover_image ?? null), [gym?.cover_image]);

  const gallery = useMemo(() => {
    if (!gym?.images?.length) return [] as string[];
    return gym.images
      .map((img) => getImageUrl(img))
      .filter((u): u is string => Boolean(u));
  }, [gym?.images]);

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

  const hasSocial =
    Boolean(gym?.instagram || gym?.telegram || gym?.whatsapp || gym?.website);

  const handleShare = async () => {
    const url = window.location.href;
    const title = gym?.name || "Fitopia";
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
    } catch {
      /* user cancelled */
    }
    try {
      await navigator.clipboard.writeText(url);
      setToast({ message: "لینک کپی شد", type: "success" });
    } catch {
      socialMediaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newReview = {
      id: Date.now(),
      user_name: "شما",
      text: newComment.trim(),
      date: new Date().toISOString(),
      rating: 5,
    };
    setComments([newReview, ...comments]);
    setNewComment("");
  };

  const nextImage = () => {
    if (gallery.length < 2) return;
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    if (gallery.length < 2) return;
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const openSport = async (sport: Sport) => {
    const allowed = hasSportAccess(sport.id);
    if (!allowed) {
      if (!isAuthenticated) {
        setToast({ message: "برای دسترسی باید وارد شوید", type: "info" });
      } else {
        setToast({
          message: "این رشته در اشتراک شما فعال نیست. لطفاً اشتراک خریداری کنید.",
          type: "warning",
        });
      }
      return;
    }

    setSelectedSport({ id: sport.id, name: sport.name });
    setModalOpen(true);
    setCoachesLoading(true);
    setCoachesError(null);

    try {
      const list = await fetchCoaches(sport.id);
      setCoaches((list as CoachLite[]) || []);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message)
          : "خطا در دریافت مربیان";
      setCoachesError(msg);
      setCoaches(null);
    } finally {
      setCoachesLoading(false);
    }
  };

  const openMap = () => {
    if (!gym) return;
    if (gym.google_map_url) {
      window.open(gym.google_map_url, "_blank", "noopener,noreferrer");
      return;
    }
    if (gym.latitude && gym.longitude) {
      window.open(
        `https://www.google.com/maps?q=${gym.latitude},${gym.longitude}`,
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }
    navigate("/gym-map");
  };

  if (loading) return <DetailSkeleton />;

  if (error || !gym) {
    return (
      <div className="min-h-dvh bg-[#07070A] home-with-rail flex flex-col">
        <div className="home-shell home-pad pt-[max(0.75rem,env(safe-area-inset-top))] flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <AlertCircle className="h-10 w-10 text-red-300/80" aria-hidden />
          <p className="text-sm font-semibold text-white">{error || "اطلاعات باشگاه یافت نشد"}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary min-h-11 px-5 text-sm"
            >
              بازگشت
            </button>
            <button
              type="button"
              onClick={loadGym}
              className="btn btn-primary min-h-11 px-5 text-sm inline-flex items-center gap-2"
            >
              <RefreshCw size={16} aria-hidden />
              تلاش مجدد
            </button>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#07070A] text-right home-with-rail">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#07070A]/88 backdrop-blur-md">
        <div className="home-shell home-pad flex items-center justify-between gap-3 py-2.5 pt-[max(0.5rem,env(safe-area-inset-top))]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.07] transition-colors"
            aria-label="بازگشت"
          >
            <ArrowRight size={20} aria-hidden />
          </button>
          <h1 className="min-w-0 flex-1 truncate text-center text-sm font-bold text-white/90">
            {gym.name}
          </h1>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.07] transition-colors"
            aria-label="اشتراک‌گذاری"
          >
            <Share2 size={18} aria-hidden />
          </button>
        </div>
      </header>

      <main className="relative z-10 home-shell home-pad pb-[calc(6.75rem+env(safe-area-inset-bottom))] md:pb-12">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-5 lg:max-w-4xl">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121216]">
            <div className="relative aspect-[16/10] sm:aspect-[2/1] bg-white/[0.03]">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1410] to-[#0e0e12] flex items-center justify-center">
                  <Building2 className="h-12 w-12 text-white/20" aria-hidden />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070A] via-[#07070A]/35 to-transparent" />

              <div className="absolute top-3 inset-x-3 flex items-start justify-between gap-2">
                {gym.is_popular ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-black">
                    <Star size={11} className="fill-current" aria-hidden />
                    محبوب
                  </span>
                ) : (
                  <span />
                )}
                {rating ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/55 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-amber-200">
                    <Star size={12} className="fill-amber-300 text-amber-300" aria-hidden />
                    {rating}
                  </span>
                ) : null}
              </div>

              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 space-y-1.5">
                <h2 className="text-[clamp(1.15rem,4vw,1.5rem)] font-extrabold text-white leading-tight tracking-tight">
                  {gym.name}
                </h2>
                {gym.address ? (
                  <p className="flex items-start justify-end gap-1.5 text-[12px] text-white/65 leading-snug">
                    <span className="line-clamp-2 min-w-0">{gym.address}</span>
                    <MapPin size={14} className="shrink-0 mt-0.5 text-primary" aria-hidden />
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={openMap}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white/90 hover:bg-white/[0.07] transition-colors"
            >
              <Navigation size={16} className="text-primary" aria-hidden />
              مسیر / نقشه
            </button>
            {gym.phone ? (
              <a
                href={`tel:${gym.phone}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-primary/35 bg-primary/10 text-sm font-semibold text-primary hover:bg-primary/15 transition-colors"
              >
                <Phone size={16} aria-hidden />
                تماس
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] text-sm font-semibold text-white/35"
              >
                <Phone size={16} aria-hidden />
                تماس
              </button>
            )}
          </div>

          {/* Info chips */}
          <div className="flex flex-wrap gap-2">
            {gym.working_hours ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/70">
                <Clock size={13} className="text-primary/90" aria-hidden />
                {gym.working_hours}
              </span>
            ) : null}
            {gym.phone ? (
              <a
                href={`tel:${gym.phone}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/70"
                dir="ltr"
              >
                <Phone size={13} className="text-primary/90" aria-hidden />
                {gym.phone}
              </a>
            ) : null}
          </div>

          {/* Sports */}
          <Card>
            <div className="mb-3 flex items-center justify-between gap-2">
              <SectionTitle>
                <span className="inline-flex items-center gap-1.5">
                  <Dumbbell size={15} className="text-primary" aria-hidden />
                  رشته‌ها
                </span>
              </SectionTitle>
              {accessLoading ? (
                <span className="text-[11px] text-white/40">بررسی دسترسی…</span>
              ) : null}
            </div>
            {sportsList.length === 0 ? (
              <p className="text-sm text-white/45">رشته‌ای ثبت نشده است.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {sportsList.map((sport) => {
                  const allowed = hasSportAccess(sport.id);
                  return (
                    <button
                      key={sport.id}
                      type="button"
                      onClick={() => openSport(sport)}
                      className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-xs font-semibold transition-colors ${
                        allowed
                          ? "border-primary/40 bg-primary/12 text-primary"
                          : "border-white/10 bg-white/[0.04] text-white/70"
                      }`}
                    >
                      {allowed ? (
                        <Check size={13} aria-hidden />
                      ) : (
                        <Lock size={12} className="opacity-70" aria-hidden />
                      )}
                      {sport.name}
                    </button>
                  );
                })}
              </div>
            )}
            <p className="mt-3 text-[11px] text-white/40 leading-relaxed">
              روی رشته‌های فعال بزن تا مربیان را ببینی. رشته‌های قفل‌شده نیاز به اشتراک دارند.
            </p>
          </Card>

          {/* Prices */}
          {gym.prices && gym.prices.length > 0 ? (
            <Card>
              <div className="mb-3">
                <SectionTitle>
                  <span className="inline-flex items-center gap-1.5">
                    <Wallet size={15} className="text-primary" aria-hidden />
                    پکیج‌های قیمتی
                  </span>
                </SectionTitle>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gym.prices.map((price, idx) => (
                  <div
                    key={price.id ?? idx}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 space-y-3"
                  >
                    <p className="text-sm font-bold text-primary">
                      {price.sport?.name || "پکیج عمومی"}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {price.session_price != null && price.session_price > 0 ? (
                        <div className="rounded-lg bg-black/25 px-2.5 py-2">
                          <p className="text-[10px] text-white/45">جلسه‌ای</p>
                          <p className="text-sm font-extrabold text-white tabular-nums">
                            {formatToman(price.session_price)}
                          </p>
                          <p className="text-[10px] text-white/40">تومان</p>
                        </div>
                      ) : null}
                      {price.monthly_price != null && price.monthly_price > 0 ? (
                        <div className="rounded-lg bg-black/25 px-2.5 py-2">
                          <p className="text-[10px] text-white/45">ماهانه</p>
                          <p className="text-sm font-extrabold text-white tabular-nums">
                            {formatToman(price.monthly_price)}
                          </p>
                          <p className="text-[10px] text-white/40">تومان</p>
                        </div>
                      ) : null}
                      {price.quarterly_price != null && price.quarterly_price > 0 ? (
                        <div className="rounded-lg bg-black/25 px-2.5 py-2">
                          <p className="text-[10px] text-white/45">سه‌ماهه</p>
                          <p className="text-sm font-extrabold text-white tabular-nums">
                            {formatToman(price.quarterly_price)}
                          </p>
                          <p className="text-[10px] text-white/40">تومان</p>
                        </div>
                      ) : null}
                      {price.yearly_price != null && price.yearly_price > 0 ? (
                        <div className="rounded-lg bg-black/25 px-2.5 py-2">
                          <p className="text-[10px] text-white/45">سالیانه</p>
                          <p className="text-sm font-extrabold text-white tabular-nums">
                            {formatToman(price.yearly_price)}
                          </p>
                          <p className="text-[10px] text-white/40">تومان</p>
                        </div>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/subscriptions")}
                      className="btn btn-primary w-full min-h-11 text-sm"
                    >
                      انتخاب و پرداخت
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          {/* Facilities */}
          {gym.facilities && gym.facilities.length > 0 ? (
            <Card>
              <div className="mb-3">
                <SectionTitle>امکانات</SectionTitle>
              </div>
              <div className="flex flex-wrap gap-2">
                {gym.facilities.map((f) => (
                  <span
                    key={f.id}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-white/75"
                  >
                    {f.title}
                  </span>
                ))}
              </div>
            </Card>
          ) : null}

          {/* Coaches */}
          {gym.coaches && gym.coaches.length > 0 ? (
            <Card>
              <div className="mb-3 flex items-center justify-between">
                <SectionTitle>
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={15} className="text-primary" aria-hidden />
                    مربیان
                  </span>
                </SectionTitle>
                <span className="text-[11px] text-white/40">{gym.coaches.length} نفر</span>
              </div>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
                {gym.coaches.map((coach, idx) => {
                  const img = resolveMedia(coach.image ?? null);
                  return (
                    <div
                      key={coach.id ?? idx}
                      className="shrink-0 w-[7.5rem] rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-center"
                    >
                      <div className="mx-auto mb-2 h-14 w-14 overflow-hidden rounded-full border border-white/10 bg-white/[0.05]">
                        {img ? (
                          <img
                            src={img}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Users size={20} className="text-white/25" aria-hidden />
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-bold text-white line-clamp-1">{coach.name}</p>
                      {coach.specialty ? (
                        <p className="mt-0.5 text-[10px] text-white/45 line-clamp-1">
                          {coach.specialty}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </Card>
          ) : null}

          {/* Gallery */}
          {gallery.length > 0 ? (
            <Card className="!p-0 overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-4 pb-3">
                <SectionTitle>
                  <span className="inline-flex items-center gap-1.5">
                    <ImageIcon size={15} className="text-primary" aria-hidden />
                    گالری
                  </span>
                </SectionTitle>
                <span className="text-[11px] text-white/40">
                  {currentImageIndex + 1} / {gallery.length}
                </span>
              </div>
              <div className="relative aspect-[16/10] bg-black/40">
                <img
                  src={gallery[currentImageIndex]}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = "0.3";
                  }}
                />
                {gallery.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      className="absolute start-2 top-1/2 -translate-y-1/2 inline-flex min-h-10 min-w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm"
                      aria-label="تصویر قبلی"
                    >
                      <ChevronRight size={18} aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute end-2 top-1/2 -translate-y-1/2 inline-flex min-h-10 min-w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm"
                      aria-label="تصویر بعدی"
                    >
                      <ChevronLeft size={18} aria-hidden />
                    </button>
                  </>
                ) : null}
              </div>
              {gallery.length > 1 ? (
                <div className="flex gap-2 overflow-x-auto hide-scrollbar p-3">
                  {gallery.map((src, idx) => (
                    <button
                      key={src + idx}
                      type="button"
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`shrink-0 h-14 w-14 overflow-hidden rounded-lg border-2 transition-all ${
                        idx === currentImageIndex
                          ? "border-primary scale-[1.02]"
                          : "border-white/10 opacity-60"
                      }`}
                      aria-label={`تصویر ${idx + 1}`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              ) : null}
            </Card>
          ) : null}

          {/* Description */}
          {gym.description ? (
            <Card>
              <div className="mb-2">
                <SectionTitle>درباره</SectionTitle>
              </div>
              <p className="text-sm text-white/65 leading-relaxed whitespace-pre-wrap">
                {gym.description}
              </p>
            </Card>
          ) : null}

          {/* Rules */}
          {gym.rules ? (
            <Card>
              <div className="mb-2">
                <SectionTitle>قوانین و مقررات</SectionTitle>
              </div>
              <p className="text-sm text-white/65 leading-relaxed whitespace-pre-wrap">{gym.rules}</p>
            </Card>
          ) : null}

          {/* Reviews */}
          <Card>
            <div className="mb-3">
              <SectionTitle>نظرات</SectionTitle>
            </div>
            <div className="mb-3 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddComment();
                }}
                placeholder="نظر خود را بنویسید…"
                className="field min-h-11 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/35 focus:border-primary/45 focus:outline-none"
                aria-label="نظر جدید"
              />
              <button
                type="button"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-primary text-black disabled:opacity-40"
                aria-label="ارسال نظر"
              >
                <Send size={16} aria-hidden />
              </button>
            </div>
            {comments.length === 0 ? (
              <p className="text-sm text-white/40 py-2">هنوز نظری ثبت نشده است.</p>
            ) : (
              <ul className="space-y-3">
                {comments.map((c) => (
                  <li
                    key={c.id}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 text-right"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-white/90">{c.user_name}</span>
                      {typeof c.rating === "number" ? (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-200/90">
                          <Star size={10} className="fill-amber-300 text-amber-300" aria-hidden />
                          {c.rating}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-white/65 leading-relaxed">{c.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Social / contact */}
          {hasSocial ? (
            <Card>
              <div className="mb-3" ref={socialMediaRef as RefObject<HTMLDivElement>}>
                <SectionTitle>شبکه‌های اجتماعی</SectionTitle>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {gym.instagram ? (
                  <a
                    href={gym.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] text-[11px] font-semibold text-white/80 hover:border-primary/30"
                  >
                    <Instagram size={18} className="text-primary" aria-hidden />
                    اینستاگرام
                  </a>
                ) : null}
                {gym.telegram ? (
                  <a
                    href={gym.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] text-[11px] font-semibold text-white/80 hover:border-primary/30"
                  >
                    <Send size={18} className="text-primary" aria-hidden />
                    تلگرام
                  </a>
                ) : null}
                {gym.whatsapp ? (
                  <a
                    href={`https://wa.me/${String(gym.whatsapp).replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] text-[11px] font-semibold text-white/80 hover:border-primary/30"
                  >
                    <MessageCircle size={18} className="text-primary" aria-hidden />
                    واتساپ
                  </a>
                ) : null}
                {gym.website ? (
                  <a
                    href={gym.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] text-[11px] font-semibold text-white/80 hover:border-primary/30"
                  >
                    <Globe size={18} className="text-primary" aria-hidden />
                    وب‌سایت
                  </a>
                ) : null}
              </div>
            </Card>
          ) : null}
        </div>
      </main>

      <SportCoachesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sportName={selectedSport?.name || ""}
        coaches={coaches}
        loading={coachesLoading}
        error={coachesError}
      />

      {toast ? (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      ) : null}

      <BottomNavigation />
    </div>
  );
}
