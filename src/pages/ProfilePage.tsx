import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { BottomNavigation } from "../components/BottomNavigation";
import { SubmitButton } from "../components/SubmitButton";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

type ProfileForm = {
  username: string;
  full_name: string;
  gender: string;
  birth_date: string; // YYYY-MM-DD
  avatar: string; // URL or data URL
};

export function ProfilePage() {
  const { token, userData, setDisplayNameState } = useAuth();
  const { register, handleSubmit, reset, setValue } = useForm<ProfileForm>({
    defaultValues: {
      username: "",
      full_name: "",
      gender: "",
      birth_date: "",
      avatar: "",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [birthDateValue, setBirthDateValue] = useState<any>(null);

  // Use a proxied local path so dev server can proxy /api -> backend (configure vite proxy)
  const apiBase = "/api/accounts/profile/";

  // Load profile on mount
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setFetching(true);
      setServerMessage(null);
      try {
        const res = await fetch(apiBase, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!mounted) return;
        if (res.ok) {
          const json = await res.json();
          // normalize keys to our form
          reset({
            username: json.username ?? "",
            full_name: json.full_name ?? "",
            gender: json.gender ?? "",
            birth_date: json.birth_date ?? "",
            avatar: json.avatar ?? "",
          });
          setAvatarPreview(json.avatar ?? null);

          // set jalali datepicker value and form value if birth_date exists
          if (json.birth_date) {
            try {
              const dob = new DateObject({ date: json.birth_date, calendar: persian });
              setBirthDateValue(dob);
              setValue("birth_date", dob.format("YYYY-MM-DD"));
            } catch (e) {
              // fallback to raw value
              setValue("birth_date", json.birth_date ?? "");
            }
          }
        } else {
          setServerMessage("خطا در خواندن اطلاعات پروفایل");
        }
      } catch (err) {
        console.error("Profile fetch error", err);
        setServerMessage("خطا در ارتباط با سرور");
      } finally {
        if (mounted) setFetching(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [token, reset, setValue]);

  // helper: convert file to dataURL
  const fileToDataURL = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(String(reader.result));
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

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

    try {
      // آماده‌سازی json اولیه
      const jsonPayload = {
        username: data.username,
        full_name: data.full_name,
        gender: data.gender,
        birth_date: data.birth_date,
        avatar: data.avatar || null,
      };

      // اگر فایل آواتار انتخاب شده، ابتدا با FormData تلاش کن
      if (avatarFile) {
        const form = new FormData();
        form.append("avatar", avatarFile);
        form.append("username", data.username);
        form.append("full_name", data.full_name);
        form.append("gender", data.gender);
        form.append("birth_date", data.birth_date);

        const res = await fetch(apiBase, {
          method: "PUT",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            // DO NOT set Content-Type for FormData
          },
          body: form,
        });

        if (res.ok) {
          const updated = await res.json();
          setServerMessage("پروفایل با موفقیت بروزرسانی شد.");
          if (updated.full_name) setDisplayNameState(updated.full_name);
          if (updated.avatar) setAvatarPreview(updated.avatar);
          setLoading(false);
          return;
        }

        console.warn("Multipart upload failed, falling back to JSON/dataURL.");
      }

      // fallback: اگر فایل انتخاب شد آن را به dataURL تبدیل کن و در JSON بگذار
      let avatarValue = jsonPayload.avatar;
      if (avatarFile) {
        try {
          const dataUrl = await fileToDataURL(avatarFile);
          avatarValue = dataUrl;
        } catch (e) {
          console.warn("Failed to convert avatar file to data URL", e);
        }
      }

      const res2 = await fetch(apiBase, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...jsonPayload, avatar: avatarValue }),
      });

      if (res2.ok) {
        const updated = await res2.json();
        setServerMessage("پروفایل با موفقیت بروزرسانی شد.");
        if (updated.full_name) setDisplayNameState(updated.full_name);
        if (updated.avatar) setAvatarPreview(updated.avatar);
      } else {
        const errJson = await res2.json().catch(() => null);
        setServerMessage(errJson?.detail || "خطا در بروزرسانی پروفایل");
      }
    } catch (err) {
      console.error("Profile update error", err);
      setServerMessage("خطا در ارتباط با سرور هنگام بروزرسانی");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-background text-on-background">
      <header className="fixed top-0 w-full z-40 bg-surface/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center px-margin-mobile">
        <h1 className="mx-auto font-headline-md text-headline-md text-on-surface">پروفایل</h1>
      </header>

      <main className="pt-24 px-margin-mobile max-w-lg mx-auto">
        <section className="flex flex-col items-center mb-6">
          <label htmlFor="avatarUpload" className="relative group">
            <div className="w-28 h-28 rounded-full border-2 border-primary/30 p-1 mb-4 overflow-hidden amber-glow cursor-pointer bg-surface flex items-center justify-center">
              {avatarPreview ? (
                // pass undefined if empty to avoid empty-string src warning
                // Use inline style to enforce object-fit
                <img
                  src={avatarPreview || undefined}
                  alt={userData?.full_name || "avatar"}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="text-on-surface-variant">ارسال عکس</div>
              )}
            </div>
            <input id="avatarUpload" type="file" accept="image/*" onChange={onFileChange} className="hidden" />
            <button
              type="button"
              className="absolute bottom-0 right-0 w-8 h-8 amber-gradient rounded-full flex items-center justify-center border-2 border-background shadow-lg transition-transform hover:scale-110 active:scale-90"
            >
              <span className="material-symbols-outlined text-on-primary text-[18px]">photo_camera</span>
            </button>
          </label>

          <p className="font-headline-md text-headline-md text-on-surface">{userData?.full_name ?? "کاربر فیتوپیا"}</p>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1" dir="ltr">
            {userData?.phone_number ?? ""}
          </p>
        </section>

        <section className="glass-panel p-6 rounded-xl mb-6">
          {fetching ? (
            <div className="py-8 text-center">در حال بارگذاری اطلاعات...</div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant">نام کاربری</label>
                <input {...register("username")} className="w-full mt-2 bg-surface-container p-3 rounded-lg text-on-surface" />
              </div>

              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant">نام کامل</label>
                <input {...register("full_name")} className="w-full mt-2 bg-surface-container p-3 rounded-lg text-on-surface" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant">جنسیت</label>
                  <select {...register("gender")} className="w-full mt-2 bg-surface-container p-3 rounded-lg text-on-surface">
                    <option value="">انتخاب</option>
                    <option value="male">مرد</option>
                    <option value="female">زن</option>
                    <option value="other">سایر</option>
                  </select>
                </div>

                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant">تاریخ تولد</label>
                  {/* Use native date input as fallback; users can also paste a Jalali date if backend supports it. */}
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
                    inputClass="w-full mt-2 bg-surface-container p-3 rounded-lg text-on-surface"
                  />
                  <p className="text-xs text-on-surface-variant mt-1">تاریخ به صورت شمسی انتخاب و برای backend به YYYY-MM-DD تبدیل می‌شود.</p>
                </div>
              </div>

              {serverMessage && <p className="text-sm text-on-surface-variant">{serverMessage}</p>}

              <div className="mt-4">
                {/* SubmitButton is in repo; falls back to a native button if missing */}
                {typeof SubmitButton === "function" ? (
                  <SubmitButton loading={loading}>ذخیره تغییرات</SubmitButton>
                ) : (
                  <button type="submit" disabled={loading} className="amber-gradient text-on-primary px-5 py-2 rounded-lg font-label-sm">
                    {loading ? "در حال ارسال..." : "ذخیره تغییرات"}
                  </button>
                )}
              </div>
            </form>
          )}
        </section>

        <section className="mb-12">
          <div className="glass-panel rounded-xl overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors" onClick={() => alert('تغییر رمز به زودی')}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">lock</span>
                <span className="font-body-md text-body-md text-on-surface">تغییر رمز عبور</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/30">chevron_left</span>
            </button>
            <button className="w-full p-4 flex items-center justify-between border-t border-white/5 hover:bg-white/5 transition-colors" onClick={() => alert('اعلان‌ها')}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
                <span className="font-body-md text-body-md text-on-surface">اعلان‌ها</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/30">chevron_left</span>
            </button>
          </div>
        </section>
      </main>

      {/* Bottom nav to match home style */}
      <BottomNavigation />
    </div>
  );
};
