/**
 * @file RegisterForm.tsx
 * @description Integration with FITOPIA PythonAnywhere registration backend.
 * Captures user full name, custom alphanumeric username, phone number, and password,
 * validating fields gracefully inside react-hook-form and posting secure JSON mock registration models.
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FormInput } from "./FormInput";
import { PasswordInput } from "./PasswordInput";
import { SubmitButton } from "./SubmitButton";
import { Smartphone, User, Sparkles, AlertCircle } from "lucide-react";

interface RegisterFormValues {
  fullName: string;
  username: string;
  phoneNumber: string;
  password?: string;
  confirmPassword?: string;
  terms: boolean;
}

export function RegisterForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(8);

  // Setup hook form tracking validation states
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
      username: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const passwordVal = watch("password");

  // Quick Countdown loop for automatic redirect after registration success
  useEffect(() => {
    if (successMsg) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [successMsg, navigate]);

  // Submission handler connecting with standard PythonAnywhere Registration API
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setApiError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch("https://fitopiaapi.pythonanywhere.com/api/accounts/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: data.phoneNumber,
          username: data.username,
          full_name: data.fullName,
          password: data.password,
        }),
      });

      const responseData = await response.json().catch(() => null);

      if (response.ok) {
        setSuccessMsg(
          `تبریک ${data.fullName}! حساب کاربری شما با نام کاربری ${data.username} در پایگاه داده سلامت فیتوپیا ثبت شد.`
        );
        // Persist name locally to customize dashboard greetings on first run
        localStorage.setItem("fitopia_user_name", data.fullName);
        reset();
      } else {
        if (responseData) {
          let errorMsg = "";
          if (typeof responseData === "object" && responseData !== null) {
            const keys = Object.keys(responseData);
            const fieldTranslations: Record<string, string> = {
              phone_number: "شماره موبایل",
              username: "نام کاربری",
              full_name: "نام کامل",
              password: "رمز عبور",
              non_field_errors: "خطا",
              detail: "جزئیات",
            };

            const errorsList = keys.map((key) => {
              const val = responseData[key];
              const displayField = fieldTranslations[key] || key;
              if (Array.isArray(val)) {
                return `${displayField}: ${val.join(" ")}`;
              } else if (typeof val === "string") {
                return `${displayField}: ${val}`;
              }
              return `${displayField}: خطای مقداردهی مکرر`;
            });
            errorMsg = errorsList.join(" | ");
          } else {
            errorMsg = "اطلاعات ارسالی با قالب مد نظر سرور همخوانی ندارد.";
          }
          setApiError(errorMsg);
        } else {
          setApiError(`خطای سرور با مشخصه ${response.status}`);
        }
      }
    } catch (err) {
      console.error("HTTP Registration API Error:", err);
      setApiError("بروز اختلال در اتصال به سرور ثبت‌نام. وضعیت شبکه را بررسی کنید.");
    } finally {
      setIsLoading(false);
    }
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
            className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container animate-[pulse_2s_infinite]"
          >
            <Sparkles size={24} />
          </div>
          <h3 className="font-bold text-on-surface text-lg">ثبت‌نام با موفقیت انجام شد!</h3>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            {successMsg}
          </p>
          <p id="countdown-text" className="text-xs text-on-surface-variant/60 font-medium">
            انتقال خودکار به صفحه ورود در {countdown} ثانیه دیگر...
          </p>
          <Link
            to="/login"
            className="w-full mt-4 py-3 bg-gradient-to-r from-[#FF6A00] to-[#FFB000] text-center text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-95 hover:brightness-110 duration-200 transition-all block text-sm"
          >
            ورود به حساب کاربری
          </Link>
          <button
            id="success-back-btn"
            onClick={() => {
              setSuccessMsg(null);
              setCountdown(8);
            }}
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
          {apiError && (
            <div
              id="api-error-alert"
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs flex items-start gap-2.5 leading-relaxed"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

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

          {/* Username */}
          <FormInput
            id="username"
            label="نام کاربری"
            dir="ltr"
            placeholder="example_username"
            icon={User}
            register={register("username", {
              required: "نام کاربری الزامی است",
              minLength: {
                value: 3,
                message: "نام کاربری حداقل باید ۳ کاراکتر باشد",
              },
              pattern: {
                value: /^[a-zA-Z0-9_.-]+$/,
                message: "فقط حروف انگلیسی، اعداد، نقطه و خط تیره مجاز است",
              }
            })}
            error={errors.username?.message}
          />

          {/* Phone Number */}
          <FormInput
            id="phoneNumber"
            label="شماره موبایل"
            type="tel"
            dir="ltr"
            placeholder="09123456789"
            icon={Smartphone}
            register={register("phoneNumber", {
              required: "شماره موبایل الزامی است",
              pattern: {
                value: /^09\d{9}$/,
                message: "یک شماره موبایل معتبر ۱۱ رقمی (مثلاً ۰۹۱۲۳۴۵۶۷۸۹) وارد کنید",
              },
            })}
            error={errors.phoneNumber?.message}
          />

          {/* Password (required) */}
          <PasswordInput
            id="password"
            label="رمز عبور"
            placeholder="••••••••"
            register={register("password", {
              required: "رمز عبور الزامی است",
              minLength: {
                value: 6,
                message: "رمز عبور باید حداقل ۶ کاراکتر باشد",
              },
              maxLength: {
                value: 30,
                message: "رمز عبور نمی‌تواند بیش از ۳۰ کاراکتر باشد",
              },
            })}
            error={errors.password?.message}
          />

          {/* Confirm Password (frontend only validation) */}
          <PasswordInput
            id="confirmPassword"
            label="تکرار رمز عبور"
            placeholder="••••••••"
            register={register("confirmPassword", {
              required: "تکرار رمز عبور الزامی است",
              validate: (value) =>
                value === passwordVal || "تکرار رمز عبور با رمز عبور اولیه مطابقت ندارد",
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
