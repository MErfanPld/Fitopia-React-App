/**
 * @file FormInput.tsx
 * Text field — Fitopia Design System
 */

import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Eye, EyeOff, LucideIcon } from "lucide-react";

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  register: UseFormRegisterReturn;
  icon?: LucideIcon;
  dir?: "ltr" | "rtl";
}

export function FormInput({
  id,
  label,
  type = "text",
  placeholder,
  error,
  register,
  icon: Icon,
  dir,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="field" id={`container-${id}`}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className={`field-control ${error ? "!border-red-400/50" : ""}`}>
        {Icon && !isPassword && (
          <Icon
            id={`icon-${id}`}
            size={18}
            className="text-on-surface-variant/50 flex-shrink-0"
            aria-hidden
          />
        )}
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          dir={dir}
          aria-invalid={!!error}
          aria-describedby={error ? `error-msg-${id}` : undefined}
          {...register}
          className={dir === "ltr" ? "text-left" : "text-right"}
        />
        {isPassword && (
          <button
            id={`toggle-${id}`}
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="min-w-10 min-h-10 inline-flex items-center justify-center rounded-lg text-on-surface-variant/60 hover:text-on-surface"
            aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <span id={`error-msg-${id}`} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
