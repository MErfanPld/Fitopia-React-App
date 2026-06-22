/**
 * @file GymDetailPage.tsx
 * @description Comprehensive gym detail page showing full information, images, amenities, prices, and reviews
 * Connects to API endpoint: /api/gym/{id}/
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Share2, MapPin, Clock, Star, Dumbbell, Wallet, 
  Phone, Mail, Globe, Instagram, MessageCircle, Users, Award,
  Heart, AlertCircle, Image as ImageIcon, Play, MapPinIcon
} from "lucide-react";
import { Gym } from "../hooks/useGymAPI";

export function GymDetailPage() {
  const { gymId } = useParams<{ gymId: string }>();
  const navigate = useNavigate();
  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
              <button 
                onClick={() => window.open(gym.google_map_url || `https://maps.google.com/?q=${gym.latitude},${gym.longitude}`, '_blank')}
                className="text-primary flex items-center gap-1 text-sm font-bold whitespace-nowrap hover:opacity-80 transition-opacity"
              >
                <MapPin size={16} />
                نقشه
              </button>
            </div>
            <div className="h-px bg-white/5" />
            
            {/* Working Hours */}
            {gym.working_hours && (
              <>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <Clock size={16} className="text-primary" />
                  <span>{gym.working_hours}</span>
                </div>
                <div className="h-px bg-white/5" />
              </>
            )}

            {/* Phone */}
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <a href={`tel:${gym.phone}`} className="text-primary hover:underline font-bold flex items-center gap-2">
                <Phone size={16} />
                {gym.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        {(gym.instagram || gym.telegram || gym.whatsapp || gym.website) && (
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary-container rounded-full" />
              شبکه‌های اجتماعی
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {gym.instagram && (
                <a
                  href={gym.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-surface-container/70 hover:bg-surface-container/90 backdrop-blur border border-white/5 p-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:border-primary/30"
                >
                  <Instagram size={20} className="text-primary" />
                  <span className="text-xs font-bold">Instagram</span>
                </a>
              )}
              {gym.telegram && (
                <a
                  href={gym.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-surface-container/70 hover:bg-surface-container/90 backdrop-blur border border-white/5 p-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:border-primary/30"
                >
                  <MessageCircle size={20} className="text-primary" />
                  <span className="text-xs font-bold">Telegram</span>
                </a>
              )}
              {gym.whatsapp && (
                <a
                  href={`https://wa.me/${gym.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-surface-container/70 hover:bg-surface-container/90 backdrop-blur border border-white/5 p-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:border-primary/30"
                >
                  <MessageCircle size={20} className="text-primary" />
                  <span className="text-xs font-bold">WhatsApp</span>
                </a>
              )}
              {gym.website && (
                <a
                  href={gym.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-surface-container/70 hover:bg-surface-container/90 backdrop-blur border border-white/5 p-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:border-primary/30"
                >
                  <Globe size={20} className="text-primary" />
                  <span className="text-xs font-bold">Website</span>
                </a>
              )}
            </div>
          </section>
        )}

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

        {/* Facilities Section */}
        {gym.facilities && gym.facilities.length > 0 && (
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary-container rounded-full" />
              تسهیلات
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {gym.facilities.map((facility) => (
                <div
                  key={facility.id}
                  className="bg-surface-container/70 backdrop-blur border border-white/5 p-4 rounded-xl flex items-center gap-3"
                >
                  <Award size={18} className="text-primary-container" />
                  <span className="text-sm font-bold">{facility.title}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pricing Section */}
        {gym.prices && gym.prices.length > 0 && (
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary-container rounded-full" />
              پکیج‌های قیمت
            </h3>
            <div className="space-y-3">
              {gym.prices.map((price, idx) => (
                <div
                  key={idx}
                  className={idx === 0 ? "bg-primary/10 border border-primary/20" : "bg-surface-container/70 backdrop-blur border border-white/5"} 
                  style={{ padding: '1.5rem', borderRadius: '0.75rem' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs mb-1 ${idx === 0 ? "text-primary/70" : "text-on-surface-variant"}`}>
                        رشته: {price.sport?.name || "نامشخص"}
                      </p>
                      <div className="flex items-baseline gap-4">
                        {price.session_price && (
                          <div>
                            <p className={`text-xs mb-1 ${idx === 0 ? "text-primary/70" : "text-on-surface-variant"}`}>یک جلسه</p>
                            <span className={`text-lg font-black ${idx === 0 ? "text-primary" : "text-on-surface"}`}>
                              {price.session_price.toLocaleString("fa-IR")}
                            </span>
                            <span className={`text-xs ${idx === 0 ? "text-primary/70" : "text-on-surface-variant"}`}> تومان</span>
                          </div>
                        )}
                        {price.monthly_price && (
                          <div>
                            <p className={`text-xs mb-1 ${idx === 0 ? "text-primary/70" : "text-on-surface-variant"}`}>ماهانه</p>
                            <span className={`text-lg font-black ${idx === 0 ? "text-primary" : "text-on-surface"}`}>
                              {price.monthly_price.toLocaleString("fa-IR")}
                            </span>
                            <span className={`text-xs ${idx === 0 ? "text-primary/70" : "text-on-surface-variant"}`}> تومان</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Wallet size={32} className={idx === 0 ? "text-primary" : "text-on-surface-variant"} />
                  </div>
                  
                  {/* Quarterly & Yearly */}
                  {(price.quarterly_price || price.yearly_price) && (
                    <div className="mt-4 pt-4 border-t border-white/10 flex gap-4">
                      {price.quarterly_price && (
                        <div>
                          <p className={`text-xs mb-1 ${idx === 0 ? "text-primary/70" : "text-on-surface-variant"}`}>فصلی (3 ماه)</p>
                          <span className={`text-base font-black ${idx === 0 ? "text-primary" : "text-on-surface"}`}>
                            {price.quarterly_price.toLocaleString("fa-IR")}
                          </span>
                          <span className={`text-xs ${idx === 0 ? "text-primary/70" : "text-on-surface-variant"}`}> تومان</span>
                        </div>
                      )}
                      {price.yearly_price && (
                        <div>
                          <p className={`text-xs mb-1 ${idx === 0 ? "text-primary/70" : "text-on-surface-variant"}`}>سالیانه</p>
                          <span className={`text-base font-black ${idx === 0 ? "text-primary" : "text-on-surface"}`}>
                            {price.yearly_price.toLocaleString("fa-IR")}
                          </span>
                          <span className={`text-xs ${idx === 0 ? "text-primary/70" : "text-on-surface-variant"}`}> تومان</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Banners */}
        {gym.banners && gym.banners.length > 0 && (
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary-container rounded-full" />
              بنرها
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
              {gym.banners.map((banner, idx) => (
                <div
                  key={idx}
                  className="snap-center shrink-0 w-80 h-48 rounded-2xl overflow-hidden border border-white/5"
                >
                  <img
                    src={banner.image}
                    alt={`بنر ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Images Gallery */}
        {gym.images && gym.images.length > 0 && (
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary-container rounded-full" />
              گالری تصاویر ({gym.images.length})
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
              {gym.images.map((img, idx) => (
                <div
                  key={idx}
                  className="snap-center shrink-0 w-64 h-40 rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => setCurrentImageIndex(idx)}
                >
                  <img
                    src={typeof img === 'string' ? img : img}
                    alt={`تصویر ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Videos Section */}
        {gym.videos && gym.videos.length > 0 && (
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary-container rounded-full" />
              ویدیو‌ها ({gym.videos.length})
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
              {gym.videos.map((video, idx) => (
                <a
                  key={idx}
                  href={video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="snap-center shrink-0 w-64 h-40 rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all flex items-center justify-center bg-surface-container/70"
                >
                  <Play size={40} className="text-primary" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Coaches Section */}
        {gym.coaches && gym.coaches.length > 0 && (
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary-container rounded-full" />
              مربیان ({gym.coaches.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gym.coaches.map((coach: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-surface-container/70 backdrop-blur border border-white/5 p-4 rounded-xl text-center"
                >
                  {coach.image && (
                    <img
                      src={coach.image}
                      alt={coach.name}
                      className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                    />
                  )}
                  <p className="font-bold text-sm">{coach.name}</p>
                  {coach.specialty && (
                    <p className="text-xs text-on-surface-variant">{coach.specialty}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rules Section */}
        {gym.rules && (
          <section className="bg-surface-container/70 backdrop-blur border border-white/5 p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary-container rounded-full" />
              قوانین و مقررات
            </h3>
            <div className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">
              {gym.rules}
            </div>
          </section>
        )}

        {/* Description */}
        {gym.description && (
          <section className="bg-surface-container/70 backdrop-blur border border-white/5 p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary-container rounded-full" />
              درباره
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">
              {gym.description}
            </p>
          </section>
        )}

        {/* Reviews Section */}
        {gym.reviews && gym.reviews.length > 0 && (
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary-container rounded-full" />
              نظرات کاربران ({gym.reviews.length})
            </h3>
            <div className="space-y-3">
              {gym.reviews.map((review: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-surface-container/70 backdrop-blur border border-white/5 p-4 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-sm">{review.user_name || "کاربر"}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? "text-primary fill-primary" : "text-white/20"}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-on-surface-variant">
                      {review.date && new Date(review.date).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant">{review.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* CTA Button */}
      <div className="fixed bottom-0 left-0 w-full z-50 p-4">
        <div className="bg-surface-container/70 backdrop-blur border border-white/5 p-4 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex flex-col">
            <span className="text-primary font-black text-lg">رزرو جلسه</span>
            <span className="text-xs text-on-surface-variant">
              {mainPrice ? `${mainPrice.session_price?.toLocaleString("fa-IR") || mainPrice.monthly_price?.toLocaleString("fa-IR")} تومان` : "قیمت موجود نیست"}
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
