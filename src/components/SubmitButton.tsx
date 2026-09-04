/**
 * @file SubmitButton.tsx
 * Primary submit control — Fitopia Design System
 */

import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  id?: string;
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  label?: "register" | "login" | "save";
  type?: "submit" | "button";
  onClick?: () => void;
  className?: string;
}

export function SubmitButton({
  id = "submit-btn",
  loading = false,
  disabled = false,
  children = "ثبت",
  label = "save",
  type = "submit",
  onClick,
  className = "",
}: SubmitButtonProps) {
  const loadingText =
    label === "login" ? "ورود" : label === "register" ? "ثبت نام" : "ذخیره";

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-primary btn-block ${className}`}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={20} aria-hidden />
          <span>در حال {loadingText}...</span>
        </>
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
}
