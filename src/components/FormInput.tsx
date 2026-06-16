/**
 * @file FormInput.tsx
 * @description Highly styled custom form text field component.
 * Integrates directly with react-hook-form refs. Supports:
 * - Dynamic RTL/LTR text alignment directions
 * - Input validation error badges
 * - Optional leading utility icons (e.g., Mail, Phone)
 * - Password visibility toggle triggers (Eye/EyeOff)
 */

import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Eye, EyeOff, LucideIcon } from "lucide-react";

interface FormInputProps {
  id: string; // DOM target element ID
  label: string; // Human label shown above the input
  type?: string; // Standard input type default 'text'
  placeholder?: string; // Floating placeholder cue text
  error?: string; // Validation error message, if present
  register: UseFormRegisterReturn; // Hook form registration return binding
  icon?: LucideIcon; // Supplemental Lucide Icon
  dir?: "ltr" | "rtl"; // Readability text flow direction
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
  // Track password visibility when type is password
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="input-glow-effect group" id={`container-${id}`}>
      <label
        htmlFor={id}
        className="block font-label-sm text-xs text-on-surface-variant mb-2 pr-1 select-none font-semibold"
      >
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          dir={dir}
          {...register}
          className={`w-full bg-transparent border-none py-3 focus:outline-none focus:ring-0 text-on-surface font-body-md placeholder:text-surface-variant transition-all ${
            isPassword || Icon ? "pl-10" : ""
          } ${dir === "ltr" ? "text-left" : "text-right"}`}
        />

        {/* Input Icon Left (e.g., Mail, Phone) */}
        {Icon && !isPassword && (
          <Icon
            id={`icon-${id}`}
            size={18}
            className="text-surface-variant absolute left-0 pr-1 pointer-events-none group-focus-within:text-primary transition-colors"
          />
        )}

        {/* Password toggle icon */}
        {isPassword && (
          <button
            id={`toggle-btn-${id}`}
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-0 text-surface-variant hover:text-primary transition-colors focus:outline-none flex items-center justify-center p-1"
            title={showPassword ? "عدم نمایش رمز" : "نمایش رمز"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

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
