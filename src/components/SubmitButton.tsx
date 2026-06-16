/**
 * @file SubmitButton.tsx
 * @description Flexible custom submit button that displays an active spinning
 * loader icon and disables clicks while processing async form operations.
 */

import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  id?: string;
  label: string; // The button main title
  loading?: boolean; // Toggles spinner layout replacement
  disabled?: boolean; // Toggles click eligibility attributes
}

export function SubmitButton({
  id = "submit-register",
  label,
  loading = false,
  disabled = false,
}: SubmitButtonProps) {
  return (
    <button
      id={id}
      type="submit"
      disabled={disabled || loading}
      className={`energy-gradient spring-btn w-full py-4 rounded-xl font-headline-md text-lg text-on-primary-container font-extrabold shadow-lg mt-4 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.97] select-none hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <>
          <Loader2 id="spinner-icon" className="animate-spin text-on-primary-container" size={22} />
          <span id="loading-txt">در حال ثبت‌نام...</span>
        </>
      ) : (
        <span id="btn-label">{label}</span>
      )}
    </button>
  );
}
