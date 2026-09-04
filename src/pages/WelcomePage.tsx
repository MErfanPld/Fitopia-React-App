/**
 * Welcome — brand entry. Redirects authenticated users to /home.
 */

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import { ShaderBackground } from "../components/ShaderBackground";
import { useAuth } from "../context/AuthContext";

export function WelcomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-[#07070A] z-50 flex flex-col justify-center items-center select-none">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <ShaderBackground />

      <div className="relative z-10 min-h-dvh flex flex-col items-center justify-center px-5 py-10">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container/15 border border-primary-container/30 elevation-brand">
            <Dumbbell className="text-primary-container" size={28} aria-hidden />
          </div>

          <p className="text-primary font-black text-2xl tracking-tight font-vazir">
            FITOPIA
          </p>

          <h1 className="mt-5 text-xl sm:text-2xl font-bold text-on-surface leading-snug">
            باشگاهت، هوشمندتر از همیشه
          </h1>

          <p className="mt-3 text-sm text-on-surface-variant leading-relaxed max-w-sm mx-auto">
            اشتراک، دسترسی و پیگیری وضعیت عضویت — همه در یک اپلیکیشن.
          </p>

          <div className="mt-10 flex flex-col gap-3">
            <Link
              to="/login"
              className="btn btn-primary btn-block no-underline"
              id="welcome-login-cta"
            >
              ورود به حساب
            </Link>

            <Link
              to="/register"
              className="btn btn-secondary btn-block no-underline"
              id="welcome-register-cta"
            >
              ثبت‌نام
            </Link>
          </div>

          <p className="mt-8 text-xs text-on-surface-variant/70">
            با ادامه، شرایط استفاده از فیتوپیا را می‌پذیرید.
          </p>
        </div>
      </div>
    </>
  );
}
