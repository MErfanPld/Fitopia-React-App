/**
 * @file SubmitButton.tsx
 * @description Flexible custom submit button that displays an active spinning
 * loader icon and disables clicks while processing async form operations.
 */

import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  id?: string;
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  /** Used only for login/register loading text. Optional for generic forms. */
  label?: "register" | "login" | "save";
}

export function SubmitButton({
  id = "submit-btn",
  loading = false,
  disabled = false,
  children = "ثبت",
  label = "save",
}: SubmitButtonProps) {
  const loadingText =
    label === "login"
      ? "ورود"
      : label === "register"
        ? "ثبت نام"
        : "ذخیره";

  return (
    <button
      id={id}
      type="submit"
      disabled={disabled || loading}
      className="w-full py-3 rounded-xl font-bold text-on-primary active:scale-95 transition-transform amber-gradient shadow-[0_0_20px_rgba(255,106,0,0.2)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          <span>در حال {loadingText}...</span>
        </>
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
}
