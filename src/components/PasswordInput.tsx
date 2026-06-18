/**
 * @file PasswordInput.tsx
 * @description Specialized form password input field that supports forgot password links,
 * standard absolute icon adornments, dynamic eye icon click listeners, and robust hook form binding.
 */

import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordInputProps {
  id: string; // DOM target element identifier
  label: string; // Input title shown above
  placeholder?: string; // Default password masked values
  error?: string; // Potential field-level schema errors
  register: UseFormRegisterReturn; // Form schema hook register binding
  forgotPasswordHref?: string; // Click destination for backup recoveries
}

export function PasswordInput({
  id,
  label,
  placeholder = "••••••••",
  error,
  register,
  forgotPasswordHref,
}: PasswordInputProps) {
  // Eye icon visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input-glow-effect group" id={`container-${id}`}>
      <div className="flex justify-between items-center mb-2 pr-1 select-none">
        <label
          htmlFor={id}
          className="block font-label-sm text-xs text-on-surface-variant font-semibold"
        >
          {label}
        </label>
        {forgotPasswordHref && (
          <a
            href={forgotPasswordHref}
            onClick={(e) => {
              if (forgotPasswordHref === "#") {
                e.preventDefault();
                alert("بازیابی رمز عبور شبیه‌سازی شد. ایمیلی برای شما ارسال خواهد شد.");
              }
            }}
            className="text-xs text-primary/70 hover:text-primary transition-colors font-medium"
          >
            فراموشی رمز عبور
          </a>
        )}
      </div>
      
      <div className="relative flex items-center">
        {/* Lock Icon on the right side since RTL */}
        <Lock
          id={`lock-icon-${id}`}
          size={18}
          className="text-on-surface-variant/40 absolute right-0 group-focus-within:text-primary transition-colors pointer-events-none"
        />
        
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...register}
          className="w-full bg-transparent border-none py-3 pr-9 pl-10 focus:outline-none focus:ring-0 text-on-surface font-body-md placeholder:text-surface-variant/30 transition-all text-right"
        />

        {/* Toggle password visibility on the left side */}
        <button
          id={`toggle-${id}`}
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute left-0 text-on-surface-variant/40 hover:text-on-surface transition-colors focus:outline-none flex items-center justify-center p-1"
          title={showPassword ? "عدم نمایش رمز" : "نمایش رمز"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>

        <div
          className={`input-underline ${
            error ? "w-full bg-red-400 shadow-[0_4px_12px_rgba(239,68,68,0.5)]" : "bg-secondary-container"
          }`}
        ></div>
      </div>

      {error && (
        <span
          id={`error-msg-${id}`}
          className="text-red-400 text-xs mt-1 block pr-1 leading-tight animate-[pulse_2s_infinite]"
        >
          {error}
        </span>
      )}
    </div>
  );
}
