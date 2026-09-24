/**
 * Soft branded loading states for route transitions and auth gate.
 * Prefer thin top progress + logo pulse over aggressive dual spinners.
 */

type PageLoaderProps = {
  /** full viewport overlay (default) vs compact inline vs thin top bar */
  variant?: "fullscreen" | "inline" | "bar";
  label?: string;
};

const progressCss = `
@keyframes fitopia-progress {
  0% { transform: translateX(120%); }
  100% { transform: translateX(-120%); }
}
@keyframes fitopia-spin-soft {
  to { transform: rotate(360deg); }
}
.fitopia-pl-bar {
  position: fixed;
  top: 0;
  inset-inline: 0;
  height: 2px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  z-index: 200;
  pointer-events: none;
}
.fitopia-pl-bar > span {
  display: block;
  height: 100%;
  width: 40%;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, #ff6a00, #ffb000, transparent);
  animation: fitopia-progress 1.15s ease-in-out infinite;
}
.fitopia-pl-orbit {
  animation: fitopia-spin-soft 1.1s linear infinite;
}
`;

function ProgressStyles() {
  return <style dangerouslySetInnerHTML={{ __html: progressCss }} />;
}

export function PageLoader({
  variant = "fullscreen",
  label = "در حال بارگذاری…",
}: PageLoaderProps) {
  if (variant === "bar") {
    return (
      <>
        <ProgressStyles />
        <div className="fitopia-pl-bar" role="progressbar" aria-label={label}>
          <span />
        </div>
      </>
    );
  }

  if (variant === "inline") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 select-none" role="status">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-[#FF6A00]/15 blur-lg animate-pulse" />
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#FF6A00]/20 bg-[#121216]">
            <span className="text-[13px] font-black text-[#FF6A00] tracking-tight">F</span>
          </div>
        </div>
        <p className="text-[11px] font-semibold text-white/40">{label}</p>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07070A]/92 backdrop-blur-[2px] select-none pointer-events-none"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <ProgressStyles />
      <div className="fitopia-pl-bar">
        <span />
      </div>

      <div className="flex flex-col items-center gap-5">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-[1.15rem] bg-[#FF6A00]/20 blur-2xl animate-pulse" />

          <div className="relative flex h-14 w-14 items-center justify-center rounded-[1.15rem] border border-[#FF6A00]/25 bg-gradient-to-b from-[#16161c] to-[#0e0e12] shadow-[0_8px_28px_rgba(0,0,0,0.45)]">
            <span className="text-lg font-black text-[#FF6A00] tracking-tight">F</span>
          </div>

          <div
            className="fitopia-pl-orbit absolute inset-[-3px] rounded-[1.25rem] border border-transparent border-t-[#FF6A00]/70 border-e-[#FF6A00]/25"
            aria-hidden
          />
        </div>

        <div className="text-center">
          <p className="text-[12px] font-bold text-white/55 tracking-wide">FITOPIA</p>
          <p className="mt-1 text-[11px] font-medium text-white/30">{label}</p>
        </div>
      </div>
    </div>
  );
}
