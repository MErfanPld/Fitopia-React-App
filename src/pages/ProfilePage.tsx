import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { BottomNavigation } from "../components/BottomNavigation";
import { Header } from "../components/Header";
import { ShaderBackground } from "../components/ShaderBackground";
import { ParticleOverlay } from "../components/ParticleOverlay";
import { SubmitButton } from "../components/SubmitButton";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import api from "../services/api";

type ProfileForm = {
  username: string;
  full_name: string;
  gender: string;
  birth_date: string;
};

export function ProfilePage() {
  const { token, userData, setDisplayNameState } = useAuth();
  const { register, handleSubmit, reset, setValue } = useForm<ProfileForm>({
    defaultValues: {
      username: "",
      full_name: "",
      gender: "",
      birth_date: "",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [birthDateValue, setBirthDateValue] = useState<any>(null);

  // Load profile on mount
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

        const json = await api.get("/accounts/profile/");
        if (!mounted) return;

        reset({
          username: json.username ?? "",
          full_name: json.full_name ?? "",
          gender: json.gender ?? "",
          birth_date: json.birth_date ?? "",
        });

        if (json.avatar) {
          setAvatarPreview(json.avatar);
        }

        // set jalali datepicker value
        if (json.birth_date) {
          try {
            const dob = new DateObject({ date: json.birth_date, calendar: persian });
            setBirthDateValue(dob);
            setValue("birth_date", dob.format("YYYY-MM-DD"));
          } catch (e) {
            setValue("birth_date", json.birth_date ?? "");
          }
        }
      } catch (err: any) {
        console.error("Profile fetch error", err);
        setServerMessage(err.message || "خطا در ارتباط با سرور");
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

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      if (avatarFile) {
        form.append("avatar", avatarFile);
      }

      const response = await fetch("https://fitopiaapi.pythonanywhere.com/api/accounts/profile/", {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: form,
      });

      if (response.ok) {
        const updated = await response.json();
        setServerMessage("پروفایل با موفقیت بروزرسانی شد.");
        setMessageType("success");

        if (updated.full_name) {
          setDisplayNameState(updated.full_name);
        }
        if (updated.avatar) {
          setAvatarPreview(updated.avatar);
        }

        setAvatarFile(null);

        reset({
          username: updated.username ?? data.username,
          full_name: updated.full_name ?? data.full_name,
          gender: updated.gender ?? data.gender,
          birth_date: updated.birth_date ?? data.birth_date,
        });
      } else {
        const errJson = await response.json().catch(() => ({}));
        setServerMessage(errJson.detail || "خطا در بروزرسانی پروفایل");
        setMessageType("error");
      }
    } catch (err: any) {
      console.error("Profile update error", err);
      setServerMessage("خطا در ارتباط با سرور هنگام بروزرسانی");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-on-surface-variant">لطفاً ابتدا وارد شوید</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-background text-on-background">
      <ShaderBackground />
      <ParticleOverlay />
      <Header />

      <main className="relative z-10 pt-24 px-margin-mobile max-w-lg mx-auto">
        {/* Avatar Section */}
        <section className="flex flex-col items-center mb-8">
          <label htmlFor="avatarUpload" className="relative group">
            <div className="w-32 h-32 rounded-full border-2 border-primary/30 p-1 mb-4 overflow-hidden cursor-pointer bg-surface flex items-center justify-center relative">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={userData?.full_name || "avatar"}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-on-surface-variant">
                  <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <span className="text-xs">ارسال عکس</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54h2.86l2.3-3.54z" />
                </svg>
              </div>
            </div>
            <input
              id="avatarUpload"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
            <button
              type="button"
              className="absolute bottom-0 right-0 w-10 h-10 amber-gradient rounded-full flex items-center justify-center border-2 border-background shadow-lg transition-transform hover:scale-110"
            >
              <svg className="w-5 h-5 text-on-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            </button>
          </label>

          <p className="font-headline-md text-headline-md text-on-surface text-center">
            {userData?.full_name ?? "کاربر فیتوپیا"}
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 text-center" dir="ltr">
            {userData?.phone_number ?? ""}
          </p>
        </section>

        {/* Form Section */}
        <section className="glass-panel p-6 rounded-2xl mb-6">
          {fetching ? (
            <div className="py-8 text-center text-on-surface-variant">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant">نام کاربری</label>
                <input
                  {...register("username")}
                  placeholder="نام کاربری خود را وارد کنید"
                  className="w-full mt-2 bg-surface-container p-3 rounded-lg text-on-surface placeholder-on-surface-variant/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant">نام کامل</label>
                <input
                  {...register("full_name")}
                  placeholder="نام کامل خود را وارد کنید"
                  className="w-full mt-2 bg-surface-container p-3 rounded-lg text-on-surface placeholder-on-surface-variant/40 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant">جنسیت</label>
                  <select
                    {...register("gender")}
                    className="w-full mt-2 bg-surface-container p-3 rounded-lg text-on-surface focus:outline-none"
                  >
                    <option value="">انتخاب</option>
                    <option value="male">مرد</option>
                    <option value="female">زن</option>
                    <option value="other">سایر</option>
                  </select>
                </div>

                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant">تاریخ تولد</label>
                  <DatePicker
                    value={birthDateValue}
                    onChange={(d: any) => {
                      const formatted = d?.format ? d.format("YYYY-MM-DD") : "";
                      setBirthDateValue(d);
                      setValue("birth_date", formatted);
                    }}
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY-MM-DD"
                    inputClass="w-full mt-2 bg-surface-container p-3 rounded-lg text-on-surface focus:outline-none"
                  />
                </div>
              </div>

              {serverMessage && (
                <div
                  className={`text-sm p-3 rounded-lg ${
                    messageType === "success"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {serverMessage}
                </div>
              )}

              <div className="mt-6">
                <SubmitButton loading={loading}>ذخیره تغییرات</SubmitButton>
              </div>
            </form>
          )}
        </section>

        {/* Settings Section */}
        <section className="mb-12">
          <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/5">
            <button
              type="button"
              className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              onClick={() => alert("تغییر رمز عبور - به زودی")}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-on-surface-variant" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.1l6.33 3.16v4.74c0 4.59-2.85 8.86-6.33 10.28-3.48-1.42-6.33-5.69-6.33-10.28V6.26L12 3.1zm3-1.1H9v2h6V2z" />
                </svg>
                <span className="font-body-md text-body-md text-on-surface">تغییر رمز عبور</span>
              </div>
              <svg className="w-5 h-5 text-on-surface-variant/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <button
              type="button"
              className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              onClick={() => alert("اعلان‌ها - به زودی")}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-on-surface-variant" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
                <span className="font-body-md text-body-md text-on-surface">اعلان‌ها</span>
              </div>
              <svg className="w-5 h-5 text-on-surface-variant/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}
