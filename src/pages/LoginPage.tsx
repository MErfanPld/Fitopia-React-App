/**
 * Login page shell — auth logic lives in LoginForm.
 */

import { Link } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { LoginForm } from "../components/LoginForm";
import { ShaderBackground } from "../components/ShaderBackground";

export function LoginPage() {
  return (
    <>
      <ShaderBackground />
      <AuthLayout
        title="ورود به حساب"
        subtitle="برای ادامه وارد حساب فیتوپیا شو."
      >
        <LoginForm />

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          حساب کاربری نداری؟{" "}
          <Link
            to="/register"
            className="text-primary font-bold hover:opacity-90 transition-opacity"
          >
            ثبت‌نام کن
          </Link>
        </p>
      </AuthLayout>
    </>
  );
}
