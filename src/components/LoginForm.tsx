/**
 * @file LoginForm.tsx
 * @description Standard form element using react-hook-form to collect and validate
 * user logins with RTL visual direction, active loading submission buttons, and mock token delivery.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "./FormInput";
import { PasswordInput } from "./PasswordInput";
import { SubmitButton } from "./SubmitButton";
import { Mail, Sparkles, LogIn } from "lucide-react";

interface LoginFormValues {
  identifier: string; // email or mobile number
  password: string;
  rememberMe: boolean;
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionMsg, setSessionMsg] = useState<string | null>(null);

  // Setup form hooks withtouched trigger mode for instant interactive inputs warning
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<LoginFormValues>({
    mode: "onTouched",
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setSessionMsg(null);

    // Simulate robust login processing with 1.5s delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setSessionMsg(
      `ورود موفقیت‌آمیز بود! خوش آمدید به فیتوپیا. ${
        data.rememberMe ? "(حساب شما ذخیره شد)" : ""
      }`
    );
    reset();
  };

  return (
    <div className="w-full" id="login-form-container">
      {sessionMsg ? (
        <div
          id="success-login-alert"
          className="bg-primary/10 border border-primary-container p-6 rounded-2xl text-center mb-4 flex flex-col items-center gap-3 animate-[fadeIn_0.5s_ease-out]"
        >
          <div
            id="login-success-circle"
            className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container animate-bounce"
          >
            <Sparkles size={24} />
          </div>
          <h3 className="font-bold text-on-surface text-lg">خوش آمدید!</h3>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            {sessionMsg}
          </p>
          <button
            id="success-login-btn"
            onClick={() => setSessionMsg(null)}
            className="text-xs text-primary font-bold hover:underline mt-2 cursor-pointer"
          >
            ورود مجدد
          </button>
        </div>
      ) : (
        <form
          id="loginForm"
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-7"
        >
          {/* Email or phone identifier */}
          <FormInput
            id="identifier"
            label="ایمیل یا شماره موبایل"
            placeholder="example@gmail.com یا ۰۹۱۲۳۴۵۶۷۸۹"
            icon={Mail}
            dir="ltr"
            register={register("identifier", {
              required: "وارد کردن ایمیل یا شماره موبایل الزامی است",
              validate: (value) => {
                // Must be either correct email format or correct 11-digit mobile number format
                const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                const phoneRegex = /^09\d{9}$/;
                if (emailRegex.test(value) || phoneRegex.test(value)) {
                  return true;
                }
                return "یک ایمیل معتبر یا شماره موبایل ۱۱ رقمی وارد کنید";
              },
            })}
            error={errors.identifier?.message}
          />

          {/* Password field */}
          <PasswordInput
            id="password"
            label="رمز عبور"
            placeholder="••••••••"
            register={register("password", {
              required: "رمز عبور الزامی است",
              minLength: {
                value: 6,
                message: "رمز عبور حداقل باید ۶ کاراکتر باشد",
              },
            })}
            error={errors.password?.message}
          />

          {/* Remember me option */}
          <div className="flex items-center justify-between pr-1 select-none" id="remember-me-container">
            <label className="custom-checkbox flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  id="rememberMe"
                  type="checkbox"
                  {...register("rememberMe")}
                  className="peer absolute opacity-0 w-6 h-6 cursor-pointer"
                />
                <div className="checkmark-container w-6 h-6 rounded-lg border-2 border-surface-variant peer-checked:border-primary-container transition-all flex items-center justify-center bg-surface-container/50">
                  <svg
                    className="checkmark-svg w-4 h-4 text-primary-container"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>
              <span className="font-label-sm text-sm text-on-surface-variant leading-tight select-none font-medium">
                مرا به خاطر بسپار
              </span>
            </label>
          </div>

          {/* Action Login Button */}
          <SubmitButton label="ورود به حساب" loading={isLoading} disabled={!isValid} />
        </form>
      )}
    </div>
  );
}
