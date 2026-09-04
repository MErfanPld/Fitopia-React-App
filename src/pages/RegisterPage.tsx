/**
 * Register page shell — registration logic lives in RegisterForm.
 */

import { Link } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { RegisterForm } from "../components/RegisterForm";
import { ShaderBackground } from "../components/ShaderBackground";

export function RegisterPage() {
  return (
    <>
      <ShaderBackground />
      <AuthLayout
        title="ساخت حساب کاربری"
        subtitle="برای شروع در فیتوپیا ثبت‌نام کن."
      >
        <RegisterForm />

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          قبلاً حساب داری؟{" "}
          <Link
            to="/login"
            className="text-primary font-bold hover:opacity-90 transition-opacity"
          >
            ورود
          </Link>
        </p>
      </AuthLayout>
    </>
  );
}
