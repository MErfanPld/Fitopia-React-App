/**
 * @file RegisterPage.tsx
 * @description The user registration gateway of FITOPIA. Provides a crisp,
 * secure form wrapper that integrates with React Hook Form, featuring custom
 * Persian locale inputs, error statuses, and validation guidelines.
 */

import { Link } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { RegisterForm } from "../components/RegisterForm";
import { ShaderBackground } from "../components/ShaderBackground";
import { ParticleOverlay } from "../components/ParticleOverlay";

export function RegisterPage() {
  return (
    <>
      {/* Dynamic interactive WebGL organic background */}
      <ShaderBackground />

      {/* Floating organic amber particle system */}
      <ParticleOverlay />

      <AuthLayout>
        {/* Title and subtitle header */}
        <div className="text-center mb-8 select-none" id="title-header">
          <h1 className="text-xl md:text-2xl font-black mb-1.5 text-on-surface animate-[fadeIn_0.5s_ease-out]">
            ساخت حساب جدید
          </h1>
          <p className="text-sm text-on-surface-variant opacity-75 font-medium">
            به دنیای عملکرد حرفه‌ای خوش آمدید
          </p>
        </div>

        {/* Default: Registration Form */}
        <RegisterForm />

        {/* Bottom Navigation Toggle */}
        <div className="mt-6 text-center select-none" id="bottom-navigation-toggle">
          <p className="text-sm text-on-surface-variant font-medium">
            قبلاً حساب دارید؟{" "}
            <Link
              to="/login"
              className="text-primary font-black hover:underline decoration-2 underline-offset-4 transition-all bg-transparent border-none"
            >
              ورود
            </Link>
          </p>
        </div>
      </AuthLayout>
    </>
  );
}

