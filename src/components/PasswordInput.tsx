/**
 * @file PasswordInput.tsx
 * Password field — Fitopia Design System
 */

import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordInputProps {
  id: string;
  label: string;
  placeholder?: string;
  error?: string;
  register: UseFormRegisterReturn;
  forgotPasswordHref?: string;
}

export function PasswordInput({
  id,
  label,
  placeholder = "••••••••",
  error,
  register,
  forgotPasswordHref,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="field" id={`container-${id}`}>
      <div className="flex justify-between items-center gap-2">
        <label htmlFor={id} className="field-label">
          {label}
        </label>
        {forgotPasswordHref && (
          <a
            href={forgotPasswordHref}
            onClick={(e) => {
              if (forgotPasswordHref === "#") e.preventDefault();
            }}
            className="text-xs font-medium text-primary hover:opacity-80 transition-opacity"
          >
            فراموشی رمز
          </a>
        )}
      </div>
      <div className={`field-control ${error ? "!border-red-400/50" : ""}`}>
        <Lock size={18} className="text-on-surface-variant/50 flex-shrink-0" aria-hidden />
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `error-msg-${id}` : undefined}
          {...register}
          className="text-right"
        />
        <button
          id={`toggle-${id}`}
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="min-w-10 min-h-10 inline-flex items-center justify-center rounded-lg text-on-surface-variant/60 hover:text-on-surface"
          aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <span id={`error-msg-${id}`} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
