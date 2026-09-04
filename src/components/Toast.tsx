import React, { useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose?: () => void;
}

const styles: Record<ToastProps["type"], string> = {
  success: "border-emerald-500/40 bg-emerald-500/15 text-emerald-200",
  error: "border-red-500/40 bg-red-500/15 text-red-200",
  warning: "border-amber-500/40 bg-amber-500/15 text-amber-200",
  info: "border-sky-500/40 bg-sky-500/15 text-sky-200",
};

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const Toast: React.FC<ToastProps> = ({ message, type, duration = 4000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const Icon = icons[type];

  return (
    <div
      className={`fixed bottom-24 left-4 right-4 z-[60] md:left-auto md:right-6 max-w-md rounded-2xl p-4 border flex items-center gap-3 elevation-2 backdrop-blur-xl ${styles[type]}`}
      role="alert"
      aria-live="polite"
    >
      <Icon size={20} className="flex-shrink-0" aria-hidden />
      <p className="text-sm font-medium flex-1 leading-relaxed">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="flex-shrink-0 min-w-10 min-h-10 inline-flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
        aria-label="بستن"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
