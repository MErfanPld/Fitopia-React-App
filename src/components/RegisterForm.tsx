/**
 * @file RegisterForm.tsx
 * @description Native registration layout using react-hook-form to register new athletes.
 * Enforces dynamic schema constraints including email format, telephone format,
 * password matching criteria, and legal terms agreement checking.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "./FormInput";
import { SubmitButton } from "./SubmitButton";
import { Smartphone, Mail, Sparkles } from "lucide-react";

interface RegisterFormValues {
  fullName: string;
  mobileNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Intransitive fields registration mode
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<RegisterFormValues>({
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      mobileNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setSuccessMsg(null);

    // Simulate robust API call for 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setSuccessMsg(
      `تبریک ${data.fullName}! حساب کاربری شما در فیتوپیا با موفقیت ساخته شد.`
    );
    reset();
  };

  return (
    <div className="w-full" id="register-form-container">
      {successMsg ? (
        <div
          id="success-alert"
          className="bg-primary/10 border border-primary-container p-6 rounded-2xl text-center mb-6 flex flex-col items-center gap-3 animate-[fadeIn_0.5s_ease-out]"
        >
          <div
            id="sparkles-circle"
            className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container"
          >
            <Sparkles size={24} />
          </div>
          <h3 className="font-bold text-on-surface text-lg">ساخت حساب موفقیت‌آمیز بود!</h3>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            {successMsg}
          </p>
          <button
            id="success-back-btn"
            onClick={() => setSuccessMsg(null)}
            className="text-xs text-primary font-bold hover:underline mt-2 cursor-pointer"
          >
            ایجاد یک حساب کاربری دیگر
          </button>
        </div>
      ) : (
        <form
          id="registerForm"
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-7"
        >
          {/* Full Name */}
          <FormInput
            id="fullName"
            label="نام کامل"
            placeholder="نام خود را وارد کنید"
            register={register("fullName", {
              required: "نام کامل الزامی است",
              minLength: {
                value: 3,
                message: "نام حداقل باید ۳ کاراکتر باشد",
              },
            })}
            error={errors.fullName?.message}
          />

          {/* Mobile Number */}
          <FormInput
            id="mobileNumber"
            label="شماره موبایل"
            type="tel"
            dir="ltr"
            placeholder="09123456789"
            icon={Smartphone}
            register={register("mobileNumber", {
              required: "شماره موبایل الزامی است",
              pattern: {
                value: /^09\d{9}$/,
                message: "یک شماره موبایل معتبر ۱۱ رقمی (مانند ۰۹۱۲۳۴۵۶۷۸۹) وارد کنید",
              },
            })}
            error={errors.mobileNumber?.message}
          />

          {/* Email */}
          <FormInput
            id="email"
            label="ایمیل"
            type="email"
            dir="ltr"
            placeholder="example@fitopia.pro"
            icon={Mail}
            register={register("email", {
              required: "ایمیل الزامی است",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "آدرس ایمیل معتبر نیست",
              },
            })}
            error={errors.email?.message}
          />

          {/* Password */}
          <FormInput
            id="password"
            label="رمز عبور"
            type="password"
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

          {/* Confirm Password */}
          <FormInput
            id="confirmPassword"
            label="تکرار رمز عبور"
            type="password"
            placeholder="••••••••"
            register={register("confirmPassword", {
              required: "تکرار رمز عبور الزامی است",
              validate: (value) =>
                value === passwordValue || "رمز عبور و تکرار آن یکسان نیستند",
            })}
            error={errors.confirmPassword?.message}
          />

          {/* Terms & Conditions */}
          <div className="flex flex-col gap-1 pr-1" id="terms-box">
            <label className="custom-checkbox flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  id="terms"
                  type="checkbox"
                  {...register("terms", {
                    required: "پذیرش قوانین برای ثبت‌نام الزامی است",
                  })}
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
                قوانین و شرایط{" "}
                <span className="text-primary-container font-black">FITOPIA</span> را
                می‌پذیرم.
              </span>
            </label>
            {errors.terms && (
              <span id="terms-error" className="text-red-400 text-xs mt-1 block leading-tight">
                {errors.terms.message}
              </span>
            )}
          </div>

          {/* Submit */}
          <SubmitButton label="ساخت حساب" loading={isLoading} disabled={!isValid} />
        </form>
      )}
    </div>
  );
}
