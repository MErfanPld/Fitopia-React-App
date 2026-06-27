import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { BottomNavigation } from "../components/BottomNavigation";
import { SubmitButton } from "../components/SubmitButton";

type ProfileForm = {
  username: string;
  full_name: string;
  gender: string;
  birth_date: string; // YYYY-MM-DD
  avatar: string; // URL
};

export function ProfilePage() {
  const { token, userData, setDisplayNameState } = useAuth();
  const { register, handleSubmit, reset, formState } = useForm<ProfileForm>({
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
  const apiBase = "https://fitopiaapi.pythonanywhere.com/api/accounts/profile/";

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
    return () => { mounted = false; };
  }, [token, reset]);

  const onSubmit = async (data: ProfileForm) => {
    setLoading(true);
    setServerMessage(null);

    try {
      const res = await fetch(apiBase, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updated = await res.json();
        setServerMessage("پروفایل با موفقیت بروزرسانی شد.");
        // update local display name if changed
        if (updated.full_name) {
          setDisplayNameState(updated.full_name);
        }
        // Also update local userData if you keep it in localStorage (AuthProvider handles storing)
        // Optionally, you could call a context setter if available.
      } else {
        const errJson = await res.json().catch(() => null);
        const msg = errJson?.detail || "خطا در بروزرسانی پروفایل";
        setServerMessage(msg);
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
          <div className="w-28 h-28 rounded-full border-2 border-primary/30 p-1 mb-4 overflow-hidden amber-glow">
            {/* avatar preview bound to form value */}
            <img
              src={formState.defaultValues?.avatar || userData?.avatar || ""}
              alt={userData?.full_name || "avatar"}
              className="w-full h-full object-cover rounded-full bg-surface"
            />
          </div>
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
                <input
                  {...register("username")}
                  className="w-full mt-2 bg-surface-container p-3 rounded-lg text-on-surface"
                />
              </div>

              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant">نام کامل</label>
                <input
                  {...register("full_name")}
                  className="w-full mt-2 bg-surface-container p-3 rounded-lg text-on-surface"
                />
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
                  <input
                    type="date"
                    {...register("birth_date")}
                    className="w-full mt-2 bg-surface-container p-3 rounded-lg text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant">آواتار (آدرس تصویر)</label>
                <input
                  {...register("avatar")}
                  placeholder="https://..."
                  className="w-full mt-2 bg-surface-container p-3 rounded-lg text-on-surface"
                />
              </div>

              {serverMessage && <p className="text-sm text-on-surface-variant">{serverMessage}</p>}

              <div className="mt-4">
                <SubmitButton loading={loading}>ذخیره تغییرات</SubmitButton>
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
}
