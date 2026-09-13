/**
 * Gym detail — reviews + videos + core info
 */
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Star, Play, Send, AlertCircle, RefreshCw } from "lucide-react";
import type { Gym } from "../hooks/useGymAPI";
import { BottomNavigation } from "../components/BottomNavigation";
import Toast from "../components/Toast";

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
      const id = u.pathname.replace("/", "").split("/")[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function GymDetailPage() {
  const { gymId } = useParams<{ gymId: string }>();
  const navigate = useNavigate();
  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [commentRating, setCommentRating] = useState(5);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [comments, setComments] = useState<
    { id: number; user_name: string; text: string; rating?: number }[]
  >([]);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
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
        setComments(
          data.reviews.map((r: Record<string, unknown>) => ({
            id: Number(r.id),
            user_name: String(r.name ?? r.user_name ?? "کاربر"),
            text: String(r.comment ?? r.text ?? ""),
            rating: typeof r.rating === "number" ? r.rating : undefined,
          })),
        );
      } else {
        setComments([]);
      }
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

  const coverUrl = useMemo(
    () => resolveMedia(gym?.cover_image ?? null),
    [gym?.cover_image],
  );

  const handleAddComment = async () => {
    if (!newComment.trim() || !gymId || commentSubmitting) return;
    setCommentSubmitting(true);
    try {
      const token =
        localStorage.getItem("access") ||
        localStorage.getItem("fitopia_auth_token") ||
        "";
      const body = {
        comment: newComment.trim(),
        rating: commentRating,
        gym: Number(gymId),
        name: "شما",
      };
      const endpoints = [
        `${API_BASE}/api/gym/${gymId}/reviews/`,
        `${API_BASE}/api/gym/${gymId}/review/`,
        `${API_BASE}/api/gym/reviews/`,
      ];
      let created: Record<string, unknown> | null = null;
      for (const url of endpoints) {
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(body),
          });
          if (res.status === 401) {
            setToast({
              message: "نشست منقضی شده؛ دوباره وارد شوید",
              type: "error",
            });
            window.dispatchEvent(new CustomEvent("fitopia:auth-expired"));
            return;
          }
          if (res.ok) {
            created = await res.json();
            break;
          }
        } catch {
          /* next */
        }
      }
      setComments((prev) => [
        {
          id: Number(created?.id ?? Date.now()),
          user_name: String(created?.name ?? created?.user_name ?? "شما"),
          text: String(
            created?.comment ?? created?.text ?? newComment.trim(),
          ),
          rating:
            typeof created?.rating === "number"
              ? (created!.rating as number)
              : commentRating,
        },
        ...prev,
      ]);
      setNewComment("");
      setCommentRating(5);
      setToast({
        message: created
          ? "نظر شما ثبت شد"
          : "نظر نمایش داده شد (API ثبت عمومی در دسترس نبود)",
        type: created ? "success" : "warning",
      });
    } finally {
      setCommentSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#07070A]">
        <div className="fitopia-loader-ring" aria-label="بارگذاری" />
      </div>
    );
  }

  if (error || !gym) {
    return (
      <div className="min-h-dvh bg-[#07070A] flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="h-10 w-10 text-red-300/80" />
        <p className="text-sm font-semibold text-white">
          {error || "اطلاعات باشگاه یافت نشد"}
        </p>
        <button
          type="button"
          onClick={loadGym}
          className="btn btn-primary min-h-11 px-5 text-sm inline-flex items-center gap-2"
        >
          <RefreshCw size={16} /> تلاش مجدد
        </button>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#07070A] text-right home-with-rail">
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#07070A]/88 backdrop-blur-md">
        <div className="home-shell home-pad flex items-center justify-between gap-3 py-2.5 pt-[max(0.5rem,env(safe-area-inset-top))]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white"
            aria-label="بازگشت"
          >
            <ArrowRight size={20} />
          </button>
          <h1 className="min-w-0 flex-1 truncate text-center text-sm font-bold text-white/90">
            {gym.name}
          </h1>
          <span className="min-w-11" />
        </div>
      </header>

      <main className="home-shell home-pad pb-[calc(6.75rem+env(safe-area-inset-bottom))] space-y-4 max-w-3xl mx-auto">
        {coverUrl ? (
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/[0.08]">
            <img
              src={coverUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ) : null}

        <section className="rounded-2xl border border-white/[0.08] bg-[#121216] p-4">
          <h2 className="text-lg font-extrabold text-white mb-1">{gym.name}</h2>
          {gym.address ? (
            <p className="text-xs text-white/60">{gym.address}</p>
          ) : null}
          {gym.description ? (
            <p className="mt-3 text-sm text-white/65 leading-relaxed whitespace-pre-wrap">
              {gym.description}
            </p>
          ) : null}
        </section>

        {Array.isArray(gym.videos) && gym.videos.length > 0 ? (
          <section className="rounded-2xl border border-white/[0.08] bg-[#121216] p-4 space-y-3">
            <h2 className="text-[0.95rem] font-bold text-white">ویدیوها</h2>
            {gym.videos.map((vid: unknown, idx: number) => {
              const raw =
                typeof vid === "string"
                  ? vid
                  : vid && typeof vid === "object"
                    ? String((vid as { video_url?: string }).video_url || "")
                    : "";
              const src = resolveMedia(raw) || raw;
              const yt = src ? getYoutubeEmbed(src) : null;
              const title =
                vid && typeof vid === "object"
                  ? (vid as { title?: string }).title
                  : undefined;
              const key =
                vid && typeof vid === "object" && "id" in vid
                  ? Number((vid as { id: number }).id)
                  : idx;
              return (
                <div
                  key={key}
                  className="overflow-hidden rounded-xl border border-white/10 bg-black/40"
                >
                  {title ? (
                    <p className="px-3 pt-2 text-xs font-bold text-white/80 flex items-center gap-1.5">
                      <Play size={12} className="text-primary" /> {title}
                    </p>
                  ) : null}
                  {yt ? (
                    <div className="relative aspect-video w-full">
                      <iframe
                        title={title || "ویدیو"}
                        src={yt}
                        className="absolute inset-0 h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : src ? (
                    <video
                      controls
                      playsInline
                      className="w-full max-h-64 bg-black"
                      preload="metadata"
                      src={src}
                    />
                  ) : null}
                </div>
              );
            })}
          </section>
        ) : null}

        <section className="rounded-2xl border border-white/[0.08] bg-[#121216] p-4">
          <h2 className="text-[0.95rem] font-bold text-white mb-3">نظرات</h2>
          <div className="mb-3 space-y-2">
            <div className="flex items-center justify-end gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCommentRating(n)}
                  className="p-1"
                  aria-label={`${n} ستاره`}
                >
                  <Star
                    size={18}
                    className={
                      commentRating >= n
                        ? "fill-amber-300 text-amber-300"
                        : "text-white/25"
                    }
                  />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleAddComment();
                }}
                placeholder="نظر خود را بنویسید…"
                className="field min-h-11 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/35 focus:border-primary/45 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => void handleAddComment()}
                disabled={!newComment.trim() || commentSubmitting}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-primary text-black disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
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
                    <span className="text-xs font-bold text-white/90">
                      {c.user_name}
                    </span>
                    {typeof c.rating === "number" ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-200/90">
                        <Star
                          size={10}
                          className="fill-amber-300 text-amber-300"
                        />{" "}
                        {c.rating}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-white/65 leading-relaxed">{c.text}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {toast ? (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      ) : null}
      <BottomNavigation />
    </div>
  );
}
