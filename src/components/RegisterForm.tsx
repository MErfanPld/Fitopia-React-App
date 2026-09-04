/**
 * Register form — original API/validation logic preserved; UI uses design system.
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FormInput } from "./FormInput";
import { PasswordInput } from "./PasswordInput";
import { SubmitButton } from "./SubmitButton";
import { Smartphone, User, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

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
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(8);

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

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setApiError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch(
        "https://fitopiaapi.pythonanywhere.com/api/accounts/register/",
        {
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
        },
      );

      const responseData = await response.json().catch(() => null);

      if (response.ok) {
        setSuccessMsg(
          `تبریک ${data.fullName}! حساب کاربری شما با نام کاربری ${data.username} در پایگاه داده سلامت فیتوپیا ثبت شد. در حال هدایت به بخش ورود...`,
        );

        const token =
          responseData?.token ||
          responseData?.access ||
          responseData?.auth_token;
        const refresh =
          responseData?.refresh ||
          responseData?.refresh_token ||
          responseData?.refreshToken ||
          "fallback_refresh_token";

        if (token) {
          login(token, refresh, responseData, data.fullName);
          setTimeout(() => {
            navigate("/home");
          }, 2000);
        } else {
          localStorage.setItem("fitopia_user_name", data.fullName);
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
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
      setApiError(
        "بروز اختلال در اتصال به سرور ثبت‌نام. وضعیت شبکه را بررسی کنید.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full" id="register-form-container">
      {successMsg ? (
        <div className="state-box elevation-1" id="success-alert" role="status">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container/20 text-primary-container">
            <Sparkles size={22} aria-hidden />
          </div>
          <h3 className="state-title">ثبت‌نام با موفقیت انجام شد!</h3>
          <p className="state-desc">{successMsg}</p>
          <p id="countdown-text" className="text-xs text-on-surface-variant/70">
            انتقال خودکار به صفحه ورود در {countdown} ثانیه دیگر...
          </p>
          <Link to="/login" className="btn btn-primary btn-block no-underline mt-1">
            ورود به حساب کاربری
          </Link>
          <button
            id="success-back-btn"
            type="button"
            onClick={() => {
              setSuccessMsg(null);
              setCountdown(8);
            }}
            className="text-xs text-primary font-bold hover:underline"
          >
            ایجاد یک حساب کاربری دیگر
          </button>
        </div>
      ) : (
        <form
          id="registerForm"
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4"
          noValidate
        >
          {apiError && (
            <div
              id="api-error-alert"
              className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 p-3.5 flex gap-2.5 text-sm leading-relaxed"
              role="alert"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" aria-hidden />
              <span>{apiError}</span>
            </div>
          )}

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
              },
            })}
            error={errors.username?.message}
          />

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
                message:
                  "یک شماره موبایل معتبر ۱۱ رقمی (مثلاً ۰۹۱۲۳۴۵۶۷۸۹) وارد کنید",
              },
            })}
            error={errors.phoneNumber?.message}
          />

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

          <PasswordInput
            id="confirmPassword"
            label="تکرار رمز عبور"
            placeholder="••••••••"
            register={register("confirmPassword", {
              required: "تکرار رمز عبور الزامی است",
              validate: (value) =>
                value === passwordVal ||
                "تکرار رمز عبور با رمز عبور اولیه مطابقت ندارد",
            })}
            error={errors.confirmPassword?.message}
          />

          <div className="flex flex-col gap-1" id="terms-box">
            <label className="custom-checkbox flex items-start gap-3 cursor-pointer">
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
                    aria-hidden
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>
              <span className="text-sm text-on-surface-variant leading-snug font-medium">
                قوانین و شرایط{" "}
                <span className="text-primary-container font-bold">FITOPIA</span>{" "}
                را می‌پذیرم.
              </span>
            </label>
            {errors.terms && (
              <span id="terms-error" className="field-error" role="alert">
                {errors.terms.message}
              </span>
            )}
          </div>

          <div className="pt-1">
            <SubmitButton label="register" loading={isLoading} disabled={!isValid}>
              ثبت‌نام
            </SubmitButton>
          </div>
        </form>
      )}
    </div>
  );
}
