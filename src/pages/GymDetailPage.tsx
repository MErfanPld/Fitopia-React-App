/**
 * @file GymDetailPage.tsx
 * @description Comprehensive gym detail page showing full information, images, amenities, prices, and reviews
 * Connects to API endpoint: /api/gym/{id}/
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft, Share2, MapPin, Clock, Star, Dumbbell, Wallet,
  Phone, Mail, Globe, Instagram, MessageCircle, Users, Award,
  Heart, AlertCircle, Image as ImageIcon, Play, MapPinIcon,
  ChevronLeft, ChevronRight, Send, Home, Search, Check, Lock
} from "lucide-react";
import { Gym } from "../hooks/useGymAPI";
import { BottomNavigation } from "../components/BottomNavigation";
import { useAuth } from "../context/AuthContext";
import { useGymAccess } from "../hooks/useGymAccess";
import SportCoachesModal from "../components/SportCoachesModal";
import Toast from "../components/Toast";

export function GymDetailPage() {
  const { gymId } = useParams<{ gymId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);

  // Subscription & access
  const { isAuthenticated } = useAuth();
  const { sports: accessSports, loading: accessLoading, error: accessError, hasSportAccess, fetchCoaches } = useGymAccess(Number(gymId));

  // Modal and coaches
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState<{ id: number; name: string } | null>(null);
  const [coaches, setCoaches] = useState<any[] | null>(null);
  const [coachesLoading, setCoachesLoading] = useState(false);
  const [coachesError, setCoachesError] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

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

        // بهتر هندل کردن نظرات - console log برای debug
        console.log("API Response Reviews:", data.reviews);

        if (data.reviews && Array.isArray(data.reviews)) {
          setComments(data.reviews);
        }
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

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newReview = {
        id: Date.now(),
        user_name: "شما",
        text: newComment,
        date: new Date().toISOString(),
        rating: 5
      };
      setComments([newReview, ...comments]);
      setNewComment("");
    }
  };

  const nextImage = () => {
    if (gym?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % gym.images.length);
    }
  };

  const prevImage = () => {
    if (gym?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + gym.images.length) % gym.images.length);
    }
  };

  // تابع برای گرفتن URL تصویر
  const getImageUrl = (image: any): string => {
    if (typeof image === 'string') {
      return image;
    }
    if (image && image.image) {
      return image.image;
    }
    return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80";
  };

  const openSport = async (sport: any) => {
    const allowed = hasSportAccess(sport.id);
    if (!allowed) {
      if (!isAuthenticated) {
        setToast({ message: 'برای دسترسی باید وارد شوید', type: 'info' });
      } else {
        setToast({ message: 'این رشته در اشتراک شما فعال نیست. لطفاً اشتراک خریداری کنید.', type: 'warning' });
      }
      return;
    }

    setSelectedSport({ id: sport.id, name: sport.name });
    setModalOpen(true);
    setCoachesLoading(true);
    setCoachesError(null);

    try {
      const list = await fetchCoaches(sport.id);
      setCoaches(list || []);
    } catch (err: any) {
      console.error('Error fetching coaches:', err);
      const msg = err?.response?.data?.detail || err?.message || 'خطا در دریافت مربیان';
      setCoachesError(msg);
      setCoaches(null);
    } finally {
      setCoachesLoading(false);
    }
  };

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
    <div className="min-h-screen bg-[#07070A] text-on-surface pb-24">
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

        {/* Sports Section */}
        <section>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-primary-container rounded-full" />
            رشته‌های ورزشی
          </h3>

          {accessLoading ? (
            <div className="p-4 bg-surface-container/70 rounded-xl">در حال بارگذاری رشته‌ها...</div>
          ) : accessError ? (
            <div className="p-4 text-error">{accessError}</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {gym.sports && gym.sports.length > 0 ? (
                gym.sports.map((sport) => {
                  const allowed = hasSportAccess(sport.id);
                  const base = "p-4 rounded-xl flex items-center gap-3 transition-all";
                  const classes = allowed
                    ? `${base} bg-green-800/10 border border-green-500 hover:shadow-lg cursor-pointer`
                    : `${base} bg-red-800/10 border border-red-500 opacity-70 cursor-not-allowed`;

                  return (
                    <button
                      key={sport.id}
                      onClick={() => openSport(sport)}
                      className={classes}
                      aria-disabled={!allowed}
                      disabled={!allowed}
                    >
                      {allowed ? <Check className="text-green-400" /> : <Lock className="text-red-400" />}
                      <span className="text-sm font-bold">{sport.name}</span>
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-on-surface-variant">رشته‌ای موجود نیست</p>
              )}
            </div>
          )}
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
                  className="bg-surface-container/70 backdrop-blur border border-white/5 p-4 rounded-xl flex items-center gap-3 hover:border-primary/30 transition-all"
                >
                  <Award size={18} className="text-primary-container" />
                  <span className="text-sm font-bold">{facility.title}</span>
                </div>
              ))}
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

        {/* Image Gallery Slider */}
        {gym.images && gym.images.length > 0 && (
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary-container rounded-full" />
              گالری تصاویر ({gym.images.length})
            </h3>
            <div className="relative group">
              <div className="relative w-full h-96 rounded-2xl overflow-hidden border border-white/5">
                <img
                  key={currentImageIndex}
                  src={getImageUrl(gym.images[currentImageIndex])}
                  alt={`تصویر ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover transition-all duration-500"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary/80 hover:bg-primary text-on-primary flex items-center justify-center transition-all active:s[...]
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary/80 hover:bg-primary text-on-primary flex items-center justify-center transition-all active:sc[...]
              >
                <ChevronLeft size={20} />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs text-on-surface font-bold">
                {currentImageIndex + 1} / {gym.images.length}
              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {gym.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex
                        ? "border-primary scale-105"
                        : "border-white/10 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`تصویر ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=100&q=80";
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Pricing Section - With Select Button */}
        {gym.prices && gym.prices.length > 0 && (
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary-container rounded-full" />
              پکیج‌های قیمتی
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gym.prices.map((price, idx) => (
                <div
                  key={idx}
                  className="group relative bg-gradient-to-br from-surface-container/50 to-surface-container/20 backdrop-blur border border-white/10 hover:border-primary/30 p-6 rounded-2xl transi[...]
                >
                  {/* Decorative Background */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative">
                    {/* Sport Name */}
                    <p className="text-sm font-bold text-primary mb-4">
                      {price.sport?.name || "پکیج عمومی"}
                    </p>

                    {/* Price Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {price.session_price && (
                        <div className="bg-surface-container/50 p-3 rounded-lg">
                          <p className="text-xs text-on-surface-variant mb-1">یک جلسه</p>
                          <p className="text-lg font-black text-primary">
                            {price.session_price.toLocaleString("fa-IR")}
                          </p>
                          <p className="text-xs text-on-surface-variant">تومان</p>
                        </div>
                      )}
                      {price.monthly_price && (
                        <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg">
                          <p className="text-xs text-primary mb-1 font-bold">ماهانه</p>
                          <p className="text-lg font-black text-primary">
                            {price.monthly_price.toLocaleString("fa-IR")}
                          </p>
                          <p className="text-xs text-primary/70">تومان</p>
                        </div>
                      )}
                    </div>

                    {/* Quarterly & Yearly */}
                    {(price.quarterly_price || price.yearly_price) && (
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {price.quarterly_price && (
                          <div className="bg-surface-container/50 p-3 rounded-lg">
                            <p className="text-xs text-on-surface-variant mb-1">فصلی (3 ماه)</p>
                            <p className="text-base font-black text-on-surface">
                              {price.quarterly_price.toLocaleString("fa-IR")}
                            </p>
                            <p className="text-xs text-on-surface-variant">تومان</p>
                          </div>
                        )}
                        {price.yearly_price && (
                          <div className="bg-surface-container/50 p-3 rounded-lg border border-white/5">
                            <p className="text-xs text-on-surface-variant mb-1">سالیانه</p>
                            <p className="text-base font-black text-on-surface">
                              {price.yearly_price.toLocaleString("fa-IR")}
                            </p>
                            <p className="text-xs text-on-surface-variant">تومان</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Select/Payment Button */}
                    <button className="w-full mt-4 bg-gradient-to-r from-primary-container to-primary text-on-primary px-4 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transi[...]
                      انتخاب و پرداخت
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Coaches Section - Animated */}
        {gym.coaches && gym.coaches.length > 0 && (
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary-container rounded-full" />
              مربیان ({gym.coaches.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {gym.coaches.map((coach: any, idx: number) => (
                <div
                  key={idx}
                  className="group relative bg-surface-container/70 backdrop-blur border border-white/5 hover:border-primary/30 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:s[...]
                  style={{
                    animation: `slideIn 0.5s ease-out ${idx * 0.1}s backwards`
                  }}
                >
                  <style>{`
                    @keyframes slideIn {
                      from {
                        opacity: 0;
                        transform: translateY(20px);
                      }
                      to {
                        opacity: 1;
                        transform: translateY(0);
                      }
                    }
                  `}</style>

                  <div className="relative mb-3">
                    {coach.image ? (
                      <img
                        src={coach.image}
                        alt={coach.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-primary/30 group-hover:border-primary transition-all group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80";
                        }}
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full mx-auto bg-primary/20 flex items-center justify-center">
                        <Users size={32} className="text-primary" />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <p className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                      {coach.name}
                    </p>
                    {coach.specialty && (
                      <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                        {coach.specialty}
                      </p>
                    )}
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section - Fixed Display */}
        <section>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-primary-container rounded-full" />
            نظرات کاربران ({comments.length})
          </h3>

          {/* Add Comment Section */}
          <div className="bg-surface-container/70 backdrop-blur border border-white/5 p-6 rounded-2xl mb-6">
            <p className="text-sm text-on-surface-variant mb-3 font-bold">نظر خود را بنویسید</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="نظر خود را اینجا بنویسید..."
                className="flex-1 bg-surface-container/50 border border-white/10 text-on-surface placeholder-on-surface-variant/50 px-4 py-3 rounded-xl focus:outline-none focus:border-primary/50 [...]"
              />
              <button
                onClick={handleAddComment}
                className="bg-primary hover:bg-primary-container text-on-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95"
              >
                <Send size={16} />
                ارسال
              </button>
            </div>
          </div>

          {/* Comments List - Debug Info */}
          {comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((review: any, idx: number) => {
                console.log("Rendering review:", review); // Debug
                return (
                  <div
                    key={review.id || idx}
                    className="bg-surface-container/70 backdrop-blur border border-white/5 p-5 rounded-xl hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-bold text-sm text-on-surface">
                          {review.user_name || review.userName || review.name || "کاربر ناشناس"}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-1">
                          {review.date 
                            ? new Date(review.date).toLocaleDateString('fa-IR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : "امروز"
                          }
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-on-surface leading-relaxed mb-3">
                      {review.text || review.comment || "بدون متن"}
                    </p>

                    {/* Rating Display */}
                    {review.rating && (
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-on-surface-variant">امتیاز:</span>
                        <span className="bg-primary/20 text-primary px-2 py-1 rounded-full font-bold">
                          {review.rating}/5
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-surface-container/70 backdrop-blur border border-white/5 p-8 rounded-2xl text-center">
              <p className="text-on-surface-variant text-sm">هنوز نظری ثبت نشده است</p>
            </div>
          )}
        </section>

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
                  className="snap-center shrink-0 w-64 h-40 rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all flex items-center justify-center bg-surface-co[...]"
                >
                  <Play size={40} className="text-primary group-hover:scale-125 transition-transform" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Social Media Links - Last */}
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
                  className="bg-surface-container/70 hover:bg-surface-container/90 backdrop-blur border border-white/5 hover:border-primary/30 p-4 rounded-xl flex items-center justify-center gap-[...]"
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
                  className="bg-surface-container/70 hover:bg-surface-container/90 backdrop-blur border border-white/5 hover:border-primary/30 p-4 rounded-xl flex items-center justify-center gap-[...]"
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
                  className="bg-surface-container/70 hover:bg-surface-container/90 backdrop-blur border border-white/5 hover:border-primary/30 p-4 rounded-xl flex items-center justify-center gap-[...]"
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
                  className="bg-surface-container/70 hover:bg-surface-container/90 backdrop-blur border border-white/5 hover:border-primary/30 p-4 rounded-xl flex items-center justify-center gap-[...]"
                >
                  <Globe size={20} className="text-primary" />
                  <span className="text-xs font-bold">Website</span>
                </a>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Sport Coaches Modal */}
      <SportCoachesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sportName={selectedSport?.name || ''}
        coaches={coaches}
        loading={coachesLoading}
        error={coachesError}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
