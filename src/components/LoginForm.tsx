import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FormInput } from "./FormInput";
import { PasswordInput } from "./PasswordInput";
import { SubmitButton } from "./SubmitButton";
import { User, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

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

    try {
      const response = await fetch(
        "https://fitopiaapi.pythonanywhere.com/api/accounts/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: data.username,
            password: data.password,
          }),
        },
      );

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        setApiError(responseData?.detail || "اطلاعات ورود اشتباه است");
        setIsLoading(false);
        return;
      }

      const token = responseData?.tokens?.access;
      const refresh = responseData?.tokens?.refresh;
      const user = responseData?.user;

      if (!token || !refresh) {
        setApiError("توکن از سرور دریافت نشد");
        setIsLoading(false);
        return;
      }

      const displayName = user?.full_name || user?.username || data.username;

      login(token, refresh, user, displayName);
      reset();
      navigate("/home", { replace: true });
    } catch (err) {
      console.error(err);
      setApiError("خطا در ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
        noValidate
      >
        {apiError && (
          <div
            className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 p-3.5 flex gap-2.5 text-sm leading-relaxed"
            role="alert"
          >
            <AlertCircle size={18} className="shrink-0 mt-0.5" aria-hidden />
            <span>{apiError}</span>
          </div>
        )}

        <FormInput
          id="username"
          label="نام کاربری یا شماره موبایل"
          placeholder="نام کاربری یا ۰۹۱۲۳۴۵۶۷۸۹"
          icon={User}
          register={register("username", {
            required: "الزامی است",
            minLength: { value: 3, message: "حداقل ۳ کاراکتر" },
          })}
          error={errors.username?.message}
        />

        <PasswordInput
          id="password"
          label="رمز عبور"
          forgotPasswordHref="#"
          register={register("password", {
            required: "رمز الزامی است",
            minLength: { value: 6, message: "حداقل ۶ کاراکتر" },
          })}
          error={errors.password?.message}
        />

        <div className="pt-1">
          <SubmitButton label="login" loading={isLoading} disabled={!isValid}>
            ورود
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
