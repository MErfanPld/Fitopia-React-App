/**
 * @file LoginForm.tsx
 * @description Standard form element using react-hook-form connected to the FITOPIA PythonAnywhere Login API.
 * Captures user identifier (username or phone number) and password, validates fields,
 * posts JSON payloads, caches authentication tokens, and redirects upon successful session creation.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FormInput } from "./FormInput";
import { PasswordInput } from "./PasswordInput";
import { SubmitButton } from "./SubmitButton";
import { User, Sparkles, AlertCircle } from "lucide-react";

interface LoginFormValues {
  username: string; // Accepts either username or phone number on the backend
  password: string;
  rememberMe: boolean;
}

export function LoginForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [sessionMsg, setSessionMsg] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Setup form hooks with touched trigger mode for instant validation
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<LoginFormValues>({
    mode: "onTouched",
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setApiError(null);
    setSessionMsg(null);

    try {
      const response = await fetch("https://fitopiaapi.pythonanywhere.com/api/accounts/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      const responseData = await response.json().catch(() => null);

      if (response.ok) {
        setSessionMsg("ورود با موفقیت انجام شد! در حال انتقال به داشبورد سلامت...");
        
        // Save the authentication token and details in client cache
        if (responseData) {
          const token = responseData.token || responseData.access || responseData.auth_token;
          if (token) {
            localStorage.setItem("fitopia_auth_token", token);
          }

          const refresh = responseData.refresh || responseData.refresh_token || responseData.refreshToken;
          if (refresh) {
            localStorage.setItem("fitopia_refresh_token", refresh);
          } else {
            // Robust fallback if backend is undergoing migration or has partial payload
            localStorage.setItem("fitopia_refresh_token", "fallback_refresh_token");
          }
          
          // Store user details for dashboard greetings
          const dispName = responseData.full_name || responseData.user_name || responseData.username || data.username;
          localStorage.setItem("fitopia_user_name", dispName);

          // Custom object persistence if needed
          localStorage.setItem("fitopia_user_data", JSON.stringify(responseData));
        }

        // Optional delay for great user experience/success feedback, then navigate to home
        setTimeout(() => {
          navigate("/home");
          reset();
        }, 1500);
      } else {
        if (responseData) {
          let errorMsg = "";
          if (typeof responseData === "object" && responseData !== null) {
            // Handle field-specific backend errors or classic non-field errors
            const keys = Object.keys(responseData);
            const errorsList = keys.map((key) => {
              const val = responseData[key];
              const displayField = key === "non_field_errors" ? "خطا" : key;
              if (Array.isArray(val)) {
                return `${val.join(" ")}`;
              } else if (typeof val === "string") {
                return `${val}`;
              }
              return `${displayField}: ورود با خطا مواجه شد`;
            });
            errorMsg = errorsList.join(" | ");
          } else {
            errorMsg = "اطلاعات کاربری نامعتبر است.";
          }
          setApiError(errorMsg);
        } else {
          setApiError(`خطای سرور با مشخصه ${response.status}. لطفاً دوباره تلاش کنید.`);
        }
      }
    } catch (err) {
      console.error("HTTP Login API Error:", err);
      setApiError("اختلال در اتصال به سرور فیتوپیا. اتصال اینترنت خود را بررسی کنید.");
    } finally {
      setIsLoading(false);
    }
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
            className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container animate-pulse"
          >
            <Sparkles size={24} />
          </div>
          <h3 className="font-bold text-on-surface text-lg">ورود موفقیت‌آمیز</h3>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            {sessionMsg}
          </p>
        </div>
      ) : (
        <form
          id="loginForm"
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

          {/* Username or Phone Number identifier */}
          <FormInput
            id="username"
            label="نام کاربری یا شماره موبایل"
            placeholder="نام کاربری یا ۰۹۱۲۳۴۵۶۷۸۹"
            icon={User}
            dir="ltr"
            register={register("username", {
              required: "وارد کردن نام کاربری یا شماره موبایل الزامی است",
              minLength: {
                value: 3,
                message: "حداقل باید ۳ کاراکتر باشد",
              },
            })}
            error={errors.username?.message}
          />

          {/* Password field */}
          <PasswordInput
            id="password"
            label="رمز عبور"
            placeholder="••••••••"
            forgotPasswordHref="#"
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
