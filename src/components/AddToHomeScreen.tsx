/**
 * Guide: add Fitopia to home screen (iOS Share / Android ⋮ menu).
 * Shown on mobile when not already installed as PWA.
 */

import { useEffect, useState, useCallback } from "react";
import { Download, Share, MoreVertical, X, Smartphone } from "lucide-react";
import { usePWA } from "../hooks/usePWA";

const DISMISS_KEY = "fitopia_a2hs_dismissed";
const DISMISS_DAYS = 7;

function isStandalone(): boolean {
  try {
    if (window.matchMedia("(display-mode: standalone)").matches) return true;
    // iOS Safari
    if ((navigator as Navigator & { standalone?: boolean }).standalone === true) {
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isDismissed(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function setDismissed() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

export function AddToHomeScreen() {
  const { isInstallable, installApp } = usePWA();
  const [visible, setVisible] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (isStandalone() || isDismissed()) return;
    // Delay so it doesn't fight first paint / auth loader
    const t = window.setTimeout(() => setVisible(true), 1800);
    return () => window.clearTimeout(t);
  }, []);

  const dismiss = useCallback(() => {
    setDismissed();
    setVisible(false);
    setShowGuide(false);
  }, []);

  const handleInstall = async () => {
    if (isInstallable) {
      const ok = await installApp();
      if (ok) {
        dismiss();
        return;
      }
    }
    setShowGuide(true);
  };

  if (!visible) return null;

  const ios = isIOS();

  return (
    <>
      {/* Compact bottom banner */}
      {!showGuide && (
        <div
          className="fixed inset-x-0 z-[90] flex justify-center pointer-events-none px-3"
          style={{ bottom: "max(5.5rem, calc(env(safe-area-inset-bottom, 0px) + 4.5rem))" }}
        >
          <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-[#FF6A00]/25 bg-[rgba(18,18,22,0.96)] backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] p-3.5 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF6A00]/15 text-[#FF6A00]">
              <Smartphone size={22} aria-hidden />
            </div>

            <div className="flex-1 min-w-0 text-right">
              <p className="text-sm font-bold text-white leading-snug">نصب فیتوپیا روی گوشی</p>
              <p className="text-[11px] text-white/50 mt-0.5 leading-relaxed">
                برای دسترسی سریع‌تر، به صفحه اصلی اضافه کنید
              </p>
            </div>

            <button
              type="button"
              onClick={handleInstall}
              className="shrink-0 rounded-xl bg-[#FF6A00] text-white text-xs font-bold px-3.5 py-2.5 active:scale-95 transition-transform"
            >
              نصب
            </button>

            <button
              type="button"
              onClick={dismiss}
              className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white/70"
              aria-label="بستن"
            >
              <X size={16} aria-hidden />
            </button>
          </div>
        </div>
      )}

      {/* Full guide sheet */}
      {showGuide && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="بستن"
            onClick={() => setShowGuide(false)}
          />

          <div
            className="relative w-full max-w-md rounded-t-3xl border border-white/10 bg-[#121216] px-5 pt-4 pb-8 shadow-2xl"
            style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
            role="dialog"
            aria-labelledby="a2hs-title"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/15" />

            <div className="flex items-start justify-between gap-3 mb-5">
              <div>
                <h2 id="a2hs-title" className="text-base font-bold text-white">
                  افزودن به صفحه اصلی
                </h2>
                <p className="text-xs text-white/50 mt-1 leading-relaxed">
                  مثل اپلیکیشن واقعی روی گوشی‌تان باز می‌شود
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50"
                aria-label="بستن"
              >
                <X size={16} />
              </button>
            </div>

            {ios ? (
              <ol className="space-y-4 text-right">
                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6A00]/15 text-[#FF6A00] text-sm font-bold">
                    ۱
                  </span>
                  <div className="pt-1">
                    <p className="text-sm text-white/90 font-semibold flex items-center gap-1.5">
                      دکمه <Share size={14} className="inline text-[#FF6A00]" /> Share را بزنید
                    </p>
                    <p className="text-[11px] text-white/45 mt-0.5">
                      پایین یا بالای صفحه Safari
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6A00]/15 text-[#FF6A00] text-sm font-bold">
                    ۲
                  </span>
                  <div className="pt-1">
                    <p className="text-sm text-white/90 font-semibold">
                      گزینه «Add to Home Screen» را انتخاب کنید
                    </p>
                    <p className="text-[11px] text-white/45 mt-0.5">افزودن به صفحه اصلی</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6A00]/15 text-[#FF6A00] text-sm font-bold">
                    ۳
                  </span>
                  <div className="pt-1">
                    <p className="text-sm text-white/90 font-semibold">Add را تأیید کنید</p>
                  </div>
                </li>
              </ol>
            ) : (
              <ol className="space-y-4 text-right">
                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6A00]/15 text-[#FF6A00] text-sm font-bold">
                    ۱
                  </span>
                  <div className="pt-1">
                    <p className="text-sm text-white/90 font-semibold flex items-center gap-1.5">
                      منوی <MoreVertical size={14} className="inline text-[#FF6A00]" /> سه‌نقطه را باز کنید
                    </p>
                    <p className="text-[11px] text-white/45 mt-0.5">
                      معمولاً بالا-راست یا پایین مرورگر Chrome
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6A00]/15 text-[#FF6A00] text-sm font-bold">
                    ۲
                  </span>
                  <div className="pt-1">
                    <p className="text-sm text-white/90 font-semibold">
                      «Install app» یا «Add to Home screen» را بزنید
                    </p>
                    <p className="text-[11px] text-white/45 mt-0.5">نصب برنامه / افزودن به صفحه اصلی</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6A00]/15 text-[#FF6A00] text-sm font-bold">
                    ۳
                  </span>
                  <div className="pt-1">
                    <p className="text-sm text-white/90 font-semibold">نصب را تأیید کنید</p>
                  </div>
                </li>
              </ol>
            )}

            {isInstallable && (
              <button
                type="button"
                onClick={handleInstall}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-[#FF6A00] text-white text-sm font-bold py-3 active:scale-[0.98] transition-transform"
              >
                <Download size={16} aria-hidden />
                نصب مستقیم
              </button>
            )}

            <button
              type="button"
              onClick={dismiss}
              className="mt-3 w-full text-center text-xs text-white/40 py-2"
            >
              بعداً
            </button>
          </div>
        </div>
      )}
    </>
  );
}
