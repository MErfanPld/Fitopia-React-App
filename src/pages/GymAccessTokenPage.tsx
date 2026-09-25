/**
 * Entry credit (اعتبار ورود) — one universal credit for all accessible gyms
 * Route: /gym-access/tokens
 */

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Copy,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Loader2,
  X,
  Building2,
  Ticket,
  RefreshCw,
  ChevronLeft,
  CreditCard,
} from "lucide-react";
import { Header } from "../components/Header";
import { BottomNavigation } from "../components/BottomNavigation";
import apiService from "../services/api";
import { formatPersianNumber } from "../utils/formatting";

interface Token {
  id: number;
  token_code: string;
  user: string;
  gym: number | null;
  gym_name?: string;
  gym_address?: string;
  status: "active" | "used" | "expired";
  is_valid: boolean;
  issued_at: string;
  valid_until: string;
  used_at: string | null;
  qr_code: string;
  is_universal?: boolean;
}

interface ExpandedToken extends Token {
  timeRemaining: string;
}

interface Gym {
  id: number;
  name: string;
  address: string;
  phone: string;
}

interface Subscription {
  id: number;
  plan_name: string;
  status: string;
  tokens_total: number;
  tokens_used: number;
  tokens_remaining: number;
  is_active: boolean;
  days_remaining: number;
}

function calculateTimeRemaining(validUntil: string): string {
  try {
    const now = new Date();
    const expiryTime = new Date(validUntil);
    const diff = expiryTime.getTime() - now.getTime();
    if (diff <= 0) return "منقضی شده";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${formatPersianNumber(hours)}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  } catch {
    return "—";
  }
}

function statusMeta(status: string) {
  switch (status) {
    case "active":
      return {
        label: "فعال",
        className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
        Icon: CheckCircle2,
      };
    case "used":
      return {
        label: "استفاده‌شده",
        className: "bg-white/8 text-white/55 border-white/10",
        Icon: Clock,
      };
    case "expired":
      return {
        label: "منقضی",
        className: "bg-red-500/15 text-red-300 border-red-500/25",
        Icon: AlertCircle,
      };
    default:
      return {
        label: status,
        className: "bg-white/8 text-white/55 border-white/10",
        Icon: Clock,
      };
  }
}

export function GymAccessTokenPage() {
  const navigate = useNavigate();
  const [accessibleGyms, setAccessibleGyms] = useState<Gym[]>([]);
  const [activeToken, setActiveToken] = useState<ExpandedToken | null>(null);
  const [pastTokens, setPastTokens] = useState<ExpandedToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<Subscription | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const subscription = await apiService.get<Subscription>("/subscriptions/my/");
      if (!subscription || !subscription.is_active) {
        setError("هیچ اشتراک فعالی وجود ندارد");
        setSubscriptionInfo(null);
        setAccessibleGyms([]);
        setActiveToken(null);
        setPastTokens([]);
        return;
      }
      setSubscriptionInfo(subscription);
      const subscriptionGymsData = await apiService.get<{ gyms?: Gym[] }>(
        "/subscriptions/subscriptions/me/gyms/",
      );
      setAccessibleGyms(subscriptionGymsData?.gyms ?? []);
      const tokens = await apiService.get<Token[]>("/tokens/my/");
      const expanded: ExpandedToken[] = (tokens || []).map((token) => ({
        ...token,
        timeRemaining: calculateTimeRemaining(token.valid_until),
      }));
      const active = expanded.find((t) => t.status === "active" && t.is_valid) || null;
      const past = expanded
        .filter((t) => t.status !== "active")
        .sort((a, b) => new Date(b.issued_at).getTime() - new Date(a.issued_at).getTime())
        .slice(0, 6);
      setActiveToken(active);
      setPastTokens(past);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطا در بارگذاری اطلاعات";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "FITOPIA | اعتبار ورود";
    loadData();
    const interval = window.setInterval(() => {
      setActiveToken((prev) =>
        prev ? { ...prev, timeRemaining: calculateTimeRemaining(prev.valid_until) } : null,
      );
    }, 10000);
    return () => window.clearInterval(interval);
  }, [loadData]);

  useEffect(() => {
    if (!showQRModal && !showCopyModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowQRModal(false);
        setShowCopyModal(false);
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [showQRModal, showCopyModal]);

  const requestUniversalToken = async () => {
    try {
      setRequesting(true);
      setError(null);
      let newToken: Token | null = null;
      try {
        newToken = await apiService.post<Token>("/tokens/request/", {});
      } catch {
        if (accessibleGyms.length > 0) {
          newToken = await apiService.post<Token>("/tokens/request/", {
            gym_id: accessibleGyms[0].id,
          });
        } else {
          throw new Error("باشگاه قابل دسترسی برای صدور اعتبار یافت نشد");
        }
      }
      if (!newToken) throw new Error("پاسخ نامعتبر از سرور");
      const expanded: ExpandedToken = {
        ...newToken,
        timeRemaining: calculateTimeRemaining(newToken.valid_until),
      };
      setActiveToken(expanded);
      if (subscriptionInfo) {
        setSubscriptionInfo({
          ...subscriptionInfo,
          tokens_remaining: Math.max(0, subscriptionInfo.tokens_remaining - 1),
          tokens_used: subscriptionInfo.tokens_used + 1,
        });
      }
      setShowQRModal(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطا در دریافت اعتبار";
      setError(msg);
    } finally {
      setRequesting(false);
    }
  };

  const copyToClipboard = async () => {
    if (!activeToken) return;
    try {
      await navigator.clipboard.writeText(activeToken.token_code);
      setCopyFeedback(true);
      window.setTimeout(() => {
        setCopyFeedback(false);
        setShowCopyModal(false);
      }, 1400);
    } catch {
      /* ignore */
    }
  };

  const downloadQr = (token: ExpandedToken) => {
    if (!token.qr_code) return;
    const link = document.createElement("a");
    link.href = token.qr_code;
    link.download = `credit-${token.token_code}.png`;
    link.click();
  };

  const remaining = subscriptionInfo?.tokens_remaining ?? 0;
  const canGenerate = remaining > 0 && !activeToken && !requesting;

  return (
    <div className="min-h-dvh bg-[#07070A] text-right home-with-rail">
      <Header />
      <main className="relative z-10 home-shell home-pad pb-[calc(6.75rem+env(safe-area-inset-bottom))] md:pb-12">
        <div className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-xl flex flex-col gap-4">
          <div className="flex items-center gap-3 pt-1">
            <button type="button" onClick={() => navigate(-1)} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] transition-colors" aria-label="بازگشت">
              <ArrowRight size={20} aria-hidden />
            </button>
            <div className="min-w-0 flex-1 text-right">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">اعتبار ورود</h1>
              <p className="text-[11px] sm:text-xs text-white/45 mt-0.5 truncate">یک اعتبار برای همه باشگاه‌های قابل دسترس</p>
            </div>
            <button type="button" onClick={loadData} disabled={loading} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/80 disabled:opacity-50 hover:bg-white/[0.08] transition-colors" aria-label="بروزرسانی">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} aria-hidden />
            </button>
          </div>

          {loading ? (
            <div className="space-y-3" aria-busy="true" aria-label="در حال بارگذاری">
              <div className="skeleton h-28 w-full rounded-2xl" />
              <div className="skeleton h-44 w-full rounded-2xl" />
              <div className="skeleton h-14 w-full rounded-2xl" />
            </div>
          ) : null}

          {!loading && error && !subscriptionInfo ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-10 text-center space-y-4">
              <AlertCircle className="mx-auto h-10 w-10 text-red-300/80" aria-hidden />
              <p className="text-sm font-semibold text-white">{error}</p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 pt-1">
                <button type="button" onClick={loadData} className="btn btn-primary min-h-12 px-5 text-sm inline-flex items-center justify-center gap-2">
                  <RefreshCw size={16} aria-hidden /> تلاش مجدد
                </button>
                <button type="button" onClick={() => navigate("/subscriptions")} className="min-h-12 rounded-xl border border-white/12 bg-white/[0.04] px-5 text-sm font-semibold text-white/80">
                  مشاهده اشتراک‌ها
                </button>
              </div>
            </div>
          ) : null}

          {!loading && subscriptionInfo ? (
            <section className="relative overflow-hidden rounded-2xl border border-primary/35 bg-gradient-to-br from-primary/[0.14] via-[#141418] to-[#101014] p-4 sm:p-5">
              <div aria-hidden className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full bg-primary/25 blur-3xl" />
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                  <Ticket size={12} aria-hidden />
                  {subscriptionInfo.plan_name || "اشتراک فعال"}
                </span>
                {subscriptionInfo.days_remaining != null ? (
                  <span className="text-xs font-semibold text-primary">
                    {formatPersianNumber(subscriptionInfo.days_remaining)} روز باقی
                  </span>
                ) : null}
              </div>
              <div className="relative z-10 mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-xl bg-black/30 border border-white/[0.06] px-2 py-3 text-center">
                  <p className="text-[10px] sm:text-[11px] text-white/45">باقی‌مانده</p>
                  <p className="mt-1 text-xl sm:text-2xl font-black text-primary tabular-nums">{formatPersianNumber(subscriptionInfo.tokens_remaining ?? 0)}</p>
                </div>
                <div className="rounded-xl bg-black/30 border border-white/[0.06] px-2 py-3 text-center">
                  <p className="text-[10px] sm:text-[11px] text-white/45">مصرف‌شده</p>
                  <p className="mt-1 text-xl sm:text-2xl font-black text-white tabular-nums">{formatPersianNumber(subscriptionInfo.tokens_used ?? 0)}</p>
                </div>
                <div className="rounded-xl bg-black/30 border border-white/[0.06] px-2 py-3 text-center">
                  <p className="text-[10px] sm:text-[11px] text-white/45">کل اعتبار</p>
                  <p className="mt-1 text-xl sm:text-2xl font-black text-white tabular-nums">{formatPersianNumber(subscriptionInfo.tokens_total ?? 0)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/subscriptions")}
                className="relative z-10 mt-4 w-full min-h-12 inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/15 px-4 text-sm font-bold text-primary hover:bg-primary/25 active:scale-[0.98] transition-all"
              >
                <CreditCard size={18} aria-hidden />
                مشاهده پلن‌ها
                <ChevronLeft size={16} aria-hidden />
              </button>
            </section>
          ) : null}

          {!loading && error && subscriptionInfo ? (
            <div role="alert" className="flex items-start gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              <AlertCircle size={18} className="shrink-0 mt-0.5" aria-hidden />
              <p className="leading-relaxed">{error}</p>
            </div>
          ) : null}

          {!loading && subscriptionInfo ? (
            <section>
              {activeToken ? (
                <article className="rounded-2xl border border-emerald-500/35 bg-gradient-to-b from-emerald-500/[0.08] to-[#121216] p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden /> اعتبار فعال
                    </span>
                    <span className="font-mono text-xs sm:text-sm text-white/75 tabular-nums" dir="ltr">{activeToken.timeRemaining}</span>
                  </div>
                  <p className="text-[12px] text-white/50 text-center leading-relaxed px-2">این اعتبار در همه باشگاه‌های قابل دسترس شما معتبر است</p>
                  <div className="flex items-center gap-2 rounded-xl bg-black/40 border border-white/[0.08] px-3 py-3">
                    <code className="flex-1 min-w-0 truncate text-sm sm:text-base font-mono text-white text-left tracking-wide" dir="ltr">{activeToken.token_code}</code>
                    <button type="button" onClick={() => setShowCopyModal(true)} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary hover:bg-white/5 transition-colors" aria-label="کپی اعتبار">
                      <Copy size={18} aria-hidden />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button type="button" onClick={() => setShowQRModal(true)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-black shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform">
                      <QrCode size={18} aria-hidden /> نمایش QR
                    </button>
                    <button type="button" onClick={() => downloadQr(activeToken)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] text-sm font-semibold text-white/85 hover:bg-white/[0.08] transition-colors">
                      <Download size={18} aria-hidden /> دانلود
                    </button>
                  </div>
                </article>
              ) : (
                <article className="rounded-2xl border border-white/[0.1] bg-[#121216] p-5 sm:p-6 text-center space-y-5">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-primary/10 text-primary border border-primary/20">
                    <Ticket size={32} strokeWidth={1.75} aria-hidden />
                  </div>
                  <div className="space-y-1.5 px-1">
                    <h2 className="text-base sm:text-lg font-extrabold text-white">صدور اعتبار ورود</h2>
                    <p className="text-xs sm:text-[13px] text-white/50 leading-relaxed max-w-sm mx-auto">یک اعتبار صادر می‌شود و در همه باشگاه‌های اشتراک شما قابل استفاده است.</p>
                  </div>
                  <button type="button" onClick={requestUniversalToken} disabled={!canGenerate} className="btn btn-primary w-full min-h-14 text-sm sm:text-base font-bold inline-flex items-center justify-center gap-2 disabled:opacity-45 shadow-lg shadow-primary/20">
                    {requesting ? (<><Loader2 size={20} className="animate-spin" aria-hidden /> در حال صدور…</>) : remaining <= 0 ? ("اعتبار باقی‌مانده ندارید") : (<><Ticket size={20} aria-hidden /> صدور اعتبار ورود</>)}
                  </button>
                </article>
              )}
            </section>
          ) : null}

          {!loading && subscriptionInfo ? (
            <section className="rounded-2xl border border-white/[0.08] bg-[#121216] p-4">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-sm font-bold text-white">باشگاه‌های قابل دسترس</h3>
                <span className="text-[11px] text-white/45">{accessibleGyms.length > 0 ? `${formatPersianNumber(accessibleGyms.length)} باشگاه` : "—"}</span>
              </div>
              {accessibleGyms.length === 0 ? (
                <p className="text-xs text-white/45 py-2">باشگاهی در اشتراک شما نیست.</p>
              ) : (
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {accessibleGyms.slice(0, 8).map((g) => (
                    <li key={g.id} className="flex items-center gap-2 rounded-xl bg-black/25 border border-white/[0.05] px-3 py-2">
                      <Building2 size={14} className="text-primary shrink-0" aria-hidden />
                      <span className="text-xs text-white/85 truncate">{g.name}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button type="button" onClick={() => navigate("/gym/all?access=mine")} className="mt-3 w-full min-h-11 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-semibold text-white/80 hover:bg-white/[0.07] transition-colors inline-flex items-center justify-center gap-1.5">
                مشاهده همه <ChevronLeft size={14} aria-hidden />
              </button>
            </section>
          ) : null}

          {!loading && pastTokens.length > 0 ? (
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-white px-0.5">اعتبارهای قبلی</h3>
              <ul className="space-y-2">
                {pastTokens.map((t) => {
                  const meta = statusMeta(t.status);
                  const StatusIcon = meta.Icon;
                  return (
                    <li key={t.id} className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#121216] px-3.5 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${meta.className}`}>
                        <StatusIcon size={11} aria-hidden />
                        {meta.label}
                      </span>
                      <code className="flex-1 min-w-0 truncate text-xs font-mono text-white/55 text-left" dir="ltr">{t.token_code}</code>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}
        </div>
      </main>

      {showQRModal && activeToken ? (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-label="بستن" onClick={() => setShowQRModal(false)} />
          <div className="relative z-10 w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-white/10 bg-[#121216] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">کد QR اعتبار</h2>
              <button type="button" onClick={() => setShowQRModal(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/50" aria-label="بستن">
                <X size={18} />
              </button>
            </div>
            <div className="bg-white rounded-2xl p-4 mb-4">
              <img src={activeToken.qr_code} alt="QR Code" className="w-full max-w-[260px] mx-auto" />
            </div>
            <p className="text-center text-xs text-white/50 mb-4">این کد را برای ورود به باشگاه نشان دهید</p>
            <button type="button" onClick={() => setShowQRModal(false)} className="btn btn-primary w-full min-h-12">بستن</button>
          </div>
        </div>
      ) : null}

      {showCopyModal && activeToken ? (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-label="بستن" onClick={() => setShowCopyModal(false)} />
          <div className="relative z-10 w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-white/10 bg-[#121216] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">کپی کد اعتبار</h2>
              <button type="button" onClick={() => setShowCopyModal(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/50" aria-label="بستن">
                <X size={18} />
              </button>
            </div>
            <code className="block w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-center font-mono text-sm text-white" dir="ltr">{activeToken.token_code}</code>
            <button type="button" onClick={copyToClipboard} className="btn btn-primary w-full min-h-12 inline-flex items-center justify-center gap-2">
              <Copy size={16} aria-hidden />
              {copyFeedback ? "کپی شد!" : "کپی کد"}
            </button>
          </div>
        </div>
      ) : null}

      <BottomNavigation />
    </div>
  );
}
