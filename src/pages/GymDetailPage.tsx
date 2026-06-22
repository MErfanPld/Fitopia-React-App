/**
 * @file GymDetailPage.tsx
 * @description Comprehensive gym detail page showing full information, images, amenities, prices, and reviews
 * Connects to API endpoint: /api/gym/{id}/
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, MapPin, Clock, Star, Dumbbell, Wallet } from "lucide-react";
import { Gym } from "../hooks/useGymAPI";

export function GymDetailPage() {
  const { gymId } = useParams<{ gymId: string }>();
  const navigate = useNavigate();
  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "FITOPIA | جزئیات باشگاه";
    
    const fetchGymDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://fitopiaapi.pythonanywhere.com/api/gym/${gymId}/`
        );
        if (!response.ok) throw new Error("باشگاه یافت نشد");
        const data = await response.json();
        setGym(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطایی رخ داد");
        console.error("Error fetching gym details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (gymId) fetchGymDetails();
  }, [gymId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070A] flex items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 bg-primary/25 rounded-full blur-2xl animate-pulse" />
          <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !gym) {
    return (
      <div className="min-h-screen bg-[#07070A] flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <p className="text-error mb-4">{error || "اطلاعات باشگاه یافت نشد"}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-primary text-on-primary rounded-lg font-bold"
          >
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  const rating = gym.popularity_score ? gym.popularity_score / 20 : 4.5;
  const mainPrice = gym.prices && gym.prices.length > 0 ? gym.prices[0] : null;

  return (
    <div className="min-h-screen bg-[#07070A] text-on-surface pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-surface-container/60 backdrop-blur-md border-b border-white/5">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:opacity-80 transition-opacity active:scale-95"
        >
          <ArrowLeft size={20} className="text-primary" />
        </button>
        <span className="font-bold text-primary">FITOPIA</span>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:opacity-80 transition-opacity active:scale-95">
          <Share2 size={20} className="text-primary" />
        </button>
      </header>

      {/* Hero Image */}
      <div className="relative w-full h-72 -mt-0 overflow-hidden">
        {gym.cover_image ? (
          <img
            src={gym.cover_image}
            alt={gym.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80";
            }}
          />
        ) : (
          <div className="w-full h-full bg-surface-container" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070A] via-transparent to-black/30" />

        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary-container text-on-primary px-3 py-1 rounded-full text-xs font-bold">
              {gym.is_popular ? "پیشنهادی" : "معمولی"}
            </div>
            <div className="flex items-center gap-1 bg-surface-container/60 backdrop-blur px-2 py-1 rounded-full text-xs">
              <Star size={14} className="text-primary fill-primary" />
              <span className="font-bold">{rating.toFixed(1)}</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">{gym.name}</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 -mt-8 px-4 flex flex-col gap-8">
        {/* Address & Info Card */}
        <div className="bg-surface-container/70 backdrop-blur border border-white/5 p-6 rounded-2xl">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs text-on-surface-variant mb-1">آدرس</p>
                <p className="text-sm font-bold text-on-surface">{gym.address}</p>
              </div>
              <button className="text-primary flex items-center gap-1 text-sm font-bold whitespace-nowrap">
                <MapPin size={16} />
                نقشه
              </button>
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <Clock size={16} className="text-primary" />
              <span>۰۹ صبح تا ۲۳ شب</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <a href={`tel:${gym.phone}`} className="text-primary hover:underline">
                {gym.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Sports Section */}
        <section>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-primary-container rounded-full" />
            رشته‌های ورزشی
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {gym.sports && gym.sports.length > 0 ? (
              gym.sports.map((sport) => (
                <div
                  key={sport.id}
                  className="bg-surface-container/70 backdrop-blur border border-white/5 p-4 rounded-xl flex items-center gap-3"
                >
                  <Dumbbell size={18} className="text-primary-container" />
                  <span className="text-sm font-bold">{sport.name}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-on-surface-variant">رشته‌ای موجود نیست</p>
            )}
          </div>
        </section>

        {/* Pricing Section */}
        {mainPrice && (
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary-container rounded-full" />
              پکیج‌های قیمت
            </h3>
            <div className="space-y-3">
              <div className="bg-primary/10 border border-primary/20 p-6 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-primary/70 mb-1">اشتراک ماهانه</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-primary">
                      {mainPrice.monthly_price.toLocaleString("fa-IR")}
                    </span>
                    <span className="text-sm text-primary/70">تومان</span>
                  </div>
                </div>
                <Wallet size={32} className="text-primary" />
              </div>
              {mainPrice.yearly_price && (
                <div className="bg-surface-container/70 backdrop-blur border border-white/5 p-6 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs text-on-surface-variant mb-1">اشتراک سالیانه</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-on-surface">
                        {mainPrice.yearly_price.toLocaleString("fa-IR")}
                      </span>
                      <span className="text-sm text-on-surface-variant">تومان</span>
                    </div>
                  </div>
                  <div className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-bold">
                    صرفه‌جویی {Math.round((1 - mainPrice.yearly_price / (mainPrice.monthly_price * 12)) * 100)}%
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Images Gallery */}
        {gym.images && gym.images.length > 0 && (
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary-container rounded-full" />
              گالری تصاویر
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
              {gym.images.map((img, idx) => (
                <div
                  key={idx}
                  className="snap-center shrink-0 w-64 h-40 rounded-2xl overflow-hidden border border-white/5"
                >
                  <img
                    src={img}
                    alt={`تصویر ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Description */}
        <section className="bg-surface-container/70 backdrop-blur border border-white/5 p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-primary-container rounded-full" />
            درباره
          </h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            باشگاه {gym.name} یک مرکز فیتنس حرفه‌ای و مجهز به تجهیزات مدرن است. این باشگاه
            امکانات بسیار خوبی برای تمام سطوح فیتنسی فراهم می‌کند.
          </p>
        </section>
      </main>

      {/* CTA Button */}
      <div className="fixed bottom-0 left-0 w-full z-50 p-4">
        <div className="bg-surface-container/70 backdrop-blur border border-white/5 p-4 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex flex-col">
            <span className="text-primary font-black text-lg">رزرو جلسه</span>
            <span className="text-xs text-on-surface-variant">
              {mainPrice ? `${mainPrice.monthly_price.toLocaleString("fa-IR")} تومان` : "قیمت موجود نیست"}
            </span>
          </div>
          <button className="bg-gradient-to-r from-primary-container to-primary text-on-primary px-8 py-3 rounded-xl font-black hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95">
            رزرو
          </button>
        </div>
      </div>
    </div>
  );
}
