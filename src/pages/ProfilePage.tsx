/**
 * User profile — view & edit
 * Route: /profile
 * API: GET/PUT /accounts/profile/ (FormData for avatar)
 */

import { useEffect, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {
  User,
  Camera,
  LogOut,
  CreditCard,
  History,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Calendar,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { BottomNavigation } from "../components/BottomNavigation";
import { Header } from "../components/Header";
import { SubmitButton } from "../components/SubmitButton";
import api from "../services/api";

type ProfileForm = {
  username: string;
  full_name: string;
  gender: string;
  birth_date: string;
};

const GENDER_OPTIONS = [
  { value: "", label: "انتخاب کنید" },
  { value: "male", label: "مرد" },
  { value: "female", label: "زن" },
  { value: "other", label: "سایر" },
];

export function ProfilePage() {
  const navigate = useNavigate();
  const { token, setDisplayNameState, logout, displayName } = useAuth();
  const { register, handleSubmit, reset, setValue, watch } = useForm<ProfileForm>({
    defaultValues: {
      username: "",
      full_name: "",
      gender: "",
      birth_date: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [birthDateValue, setBirthDateValue] = useState<DateObject | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const fullNameWatch = watch("full_name");

  useEffect(() => {
    document.title = "FITOPIA | پروفایل";
  }, []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setFetching(true);
      setServerMessage(null);
      try {
        if (!token) {
          setFetching(false);
          return;
        }

        const json = await api.get<{
          username?: string;
          full_name?: string;
          gender?: string;
          birth_date?: string;
          avatar?: string;
        }>("/accounts/profile/");

        if (!mounted) return;

        reset({
          username: json.username ?? "",
          full_name: json.full_name ?? "",
          gender: json.gender ?? "",
          birth_date: json.birth_date ?? "",
        });

        if (json.avatar) setAvatarPreview(json.avatar);

        if (json.birth_date) {
          try {
            const dob = new DateObject({ date: json.birth_date, calendar: persian });
            setBirthDateValue(dob);
            setValue("birth_date", dob.format("YYYY-MM-DD"));
          } catch {
            setValue("birth_date", json.birth_date ?? "");
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "خطا در ارتباط با سرور";
        setServerMessage(msg);
        setMessageType("error");
      } finally {
        if (mounted) setFetching(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [token, reset, setValue]);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setAvatarFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setAvatarPreview(url);
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    setLoading(true);
    setServerMessage(null);
    setMessageType(null);

    try {
      const form = new FormData();
      form.append("username", data.username);
      form.append("full_name", data.full_name);
      form.append("gender", data.gender);
      form.append("birth_date", data.birth_date);
      if (avatarFile) form.append("avatar", avatarFile);

      const response = await fetch(
        "https://fitopiaapi.pythonanywhere.com/api/accounts/profile/",
        {
          method: "PUT",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: form,
        },
      );

      if (response.ok) {
        const updated = await response.json();
        setServerMessage("پروفایل با موفقیت بروزرسانی شد.");
        setMessageType("success");

        if (updated.full_name) setDisplayNameState(updated.full_name);
        if (updated.avatar) setAvatarPreview(updated.avatar);
        setAvatarFile(null);

        reset({
          username: updated.username ?? data.username,
          full_name: updated.full_name ?? data.full_name,
          gender: updated.gender ?? data.gender,
          birth_date: updated.birth_date ?? data.birth_date,
        });
      } else {
        const errJson = await response.json().catch(() => ({}));
        setServerMessage(
          (errJson as { detail?: string }).detail || "خطا در بروزرسانی پروفایل",
        );
        setMessageType("error");
      }
    } catch {
      setServerMessage("خطا در ارتباط با سرور هنگام بروزرسانی");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/welcome", { replace: true });
    } catch {
      navigate("/welcome", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  const initials = (fullNameWatch || displayName || "ک")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="min-h-dvh bg-[#07070A] text-right home-with-rail">
      <Header />

      <main className="relative z-10 home-shell home-pad pb-[calc(6.75rem+env(safe-area-inset-bottom))] md:pb-12">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-4 sm:gap-5">
          <section className="pt-1 space-y-1">
            <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              پروفایل
            </h1>
            <p className="text-xs text-white/45 sm:text-sm">
              اطلاعات حساب و تنظیمات شخصی
            </p>
          </section>

          {fetching ? (
            <div className="space-y-4" aria-busy="true" aria-label="در حال بارگذاری">
              <div className="flex justify-center">
                <div className="skeleton h-24 w-24 rounded-full" />
              </div>
              <div className="skeleton h-12 w-full rounded-xl" />
              <div className="skeleton h-12 w-full rounded-xl" />
              <div className="skeleton h-12 w-full rounded-xl" />
              <div className="skeleton h-12 w-full rounded-xl" />
              <div className="skeleton h-12 w-full rounded-xl" />
            </div>
          ) : (
            <>
              <section className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-primary/35 bg-[#121216] shadow-[0_0_24px_rgba(255,106,0,0.15)]">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-[#121216]">
                        <span className="text-2xl font-black text-primary">{initials}</span>
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="avatar-input"
                    className="absolute bottom-0 left-0 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-[#18181d] text-primary shadow-lg hover:bg-[#222]"
                    aria-label="تغییر تصویر پروفایل"
                  >
                    <Camera size={16} aria-hidden />
                    <input
                      id="avatar-input"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={onFileChange}
                    />
                  </label>
                </div>
                <p className="text-sm font-bold text-white">
                  {fullNameWatch || displayName || "کاربر فیتوپیا"}
                </p>
              </section>

              {serverMessage ? (
                <div
                  role="alert"
                  className={`flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm ${
                    messageType === "success"
                      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
                      : "border-red-500/25 bg-red-500/10 text-red-200"
                  }`}
                >
                  {messageType === "success" ? (
                    <CheckCircle2 size={18} className="shrink-0 mt-0.5" aria-hidden />
                  ) : (
                    <AlertCircle size={18} className="shrink-0 mt-0.5" aria-hidden />
                  )}
                  <p className="leading-relaxed">{serverMessage}</p>
                </div>
              ) : null}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-3 rounded-2xl border border-white/[0.08] bg-[#121216] p-4 sm:p-5"
                noValidate
              >
                <div className="field">
                  <label htmlFor="username" className="field-label">
                    نام کاربری
                  </label>
                  <div className="field-control">
                    <User size={18} className="text-white/35 shrink-0" aria-hidden />
                    <input
                      id="username"
                      type="text"
                      autoComplete="username"
                      placeholder="نام کاربری"
                      className="flex-1 bg-transparent outline-none text-white min-w-0"
                      {...register("username")}
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="full_name" className="field-label">
                    نام کامل
                  </label>
                  <div className="field-control">
                    <User size={18} className="text-white/35 shrink-0" aria-hidden />
                    <input
                      id="full_name"
                      type="text"
                      autoComplete="name"
                      placeholder="نام و نام خانوادگی"
                      className="flex-1 bg-transparent outline-none text-white min-w-0"
                      {...register("full_name")}
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="gender" className="field-label">
                    جنسیت
                  </label>
                  <div className="field-control">
                    <select
                      id="gender"
                      className="flex-1 bg-transparent outline-none text-white min-w-0 appearance-none"
                      {...register("gender")}
                    >
                      {GENDER_OPTIONS.map((o) => (
                        <option key={o.value || "empty"} value={o.value} className="bg-[#121216]">
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="birth_date" className="field-label">
                    تاریخ تولد
                  </label>
                  <div className="field-control !py-0">
                    <Calendar size={18} className="text-white/35 shrink-0" aria-hidden />
                    <DatePicker
                      value={birthDateValue}
                      onChange={(date: DateObject | DateObject[] | null) => {
                        const d = Array.isArray(date) ? date[0] : date;
                        setBirthDateValue(d || null);
                        if (d) {
                          setValue("birth_date", d.format("YYYY-MM-DD"));
                        } else {
                          setValue("birth_date", "");
                        }
                      }}
                      calendar={persian}
                      locale={persian_fa}
                      calendarPosition="bottom-right"
                      inputClass="flex-1 w-full bg-transparent border-0 outline-none text-white text-sm py-3 min-w-0"
                      containerClassName="w-full flex-1"
                      placeholder="انتخاب تاریخ"
                    />
                  </div>
                  <input type="hidden" {...register("birth_date")} />
                </div>

                <SubmitButton loading={loading} label="save" className="mt-2">
                  ذخیره تغییرات
                </SubmitButton>
              </form>

              <section className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => navigate("/subscriptions")}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white/85 hover:bg-white/[0.07]"
                >
                  <CreditCard size={16} className="text-primary" aria-hidden />
                  اشتراک‌ها
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/subscriptions/history")}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white/85 hover:bg-white/[0.07]"
                >
                  <History size={16} className="text-primary" aria-hidden />
                  تاریخچه
                </button>
              </section>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 text-sm font-bold text-red-300 hover:bg-red-500/15 disabled:opacity-60"
              >
                {loggingOut ? (
                  <Loader2 size={18} className="animate-spin" aria-hidden />
                ) : (
                  <LogOut size={18} aria-hidden />
                )}
                خروج از حساب
              </button>
            </>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
