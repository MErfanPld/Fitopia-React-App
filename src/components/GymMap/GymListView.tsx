/**
 * Nearby gyms panel — primary UI for /gym-map
 * Mobile: bottom sheet cards · Tablet/Desktop: denser grid
 */

import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  ChevronLeft,
  AlertCircle,
  RefreshCw,
  Dumbbell,
} from "lucide-react";
import type { Gym } from "../../types/gym";
import "./list.css";

interface GymListViewProps {
  gyms: Gym[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  onSelectGym?: (gym: Gym) => void;
  selectedId?: number | null;
}

function GymListView({
  gyms,
  loading,
  error,
  onRetry,
  onSelectGym,
  selectedId,
}: GymListViewProps) {
  const navigate = useNavigate();

  if (error) {
    return (
      <div className="nearby-state nearby-state--error" role="alert">
        <AlertCircle size={22} className="text-red-300" aria-hidden />
        <p className="nearby-state__title">خطا در دریافت باشگاه‌ها</p>
        <p className="nearby-state__desc">{error}</p>
        {onRetry ? (
          <button type="button" className="nearby-retry" onClick={onRetry}>
            <RefreshCw size={15} aria-hidden />
            تلاش مجدد
          </button>
        ) : null}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="nearby-skel" aria-busy="true" aria-label="در حال بارگذاری">
        {[1, 2, 3].map((i) => (
          <div key={i} className="nearby-skel__card">
            <div className="nearby-skel__img" />
            <div className="nearby-skel__lines">
              <div className="nearby-skel__line nearby-skel__line--lg" />
              <div className="nearby-skel__line" />
              <div className="nearby-skel__line nearby-skel__line--sm" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!gyms.length) {
    return (
      <div className="nearby-state">
        <Dumbbell size={28} className="text-white/25" strokeWidth={1.5} aria-hidden />
        <p className="nearby-state__title">باشگاهی نزدیک شما نیست</p>
        <p className="nearby-state__desc">
          شعاع جستجو را بعداً بزرگ‌تر کنید یا موقعیت را بروزرسانی کنید.
        </p>
        {onRetry ? (
          <button type="button" className="nearby-retry" onClick={onRetry}>
            <RefreshCw size={15} aria-hidden />
            بروزرسانی موقعیت
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <ul className="nearby-list" aria-label="باشگاه‌های نزدیک">
      {gyms.map((gym) => {
        const active = selectedId === gym.id;
        return (
          <li key={gym.id}>
            <article
              className={`nearby-card ${active ? "nearby-card--active" : ""}`}
            >
              <button
                type="button"
                className="nearby-card__hit"
                onClick={() => onSelectGym?.(gym)}
                aria-label={gym.name}
              >
                <div className="nearby-card__media">
                  {gym.cover_image ? (
                    <img
                      src={gym.cover_image}
                      alt=""
                      loading="lazy"
                      className="nearby-card__img"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="nearby-card__img nearby-card__img--ph">
                      <Dumbbell size={22} className="text-white/30" aria-hidden />
                    </div>
                  )}
                  {gym.is_popular ? (
                    <span className="nearby-card__badge">محبوب</span>
                  ) : null}
                </div>

                <div className="nearby-card__body">
                  <div className="nearby-card__top">
                    <h3 className="nearby-card__name">{gym.name}</h3>
                    {typeof gym.popularity_score === "number" ? (
                      <span className="nearby-card__score">
                        <Star size={11} fill="currentColor" aria-hidden />
                        {gym.popularity_score.toFixed(1)}
                      </span>
                    ) : null}
                  </div>

                  {gym.address ? (
                    <p className="nearby-card__meta">
                      <MapPin size={12} className="shrink-0 text-primary" aria-hidden />
                      <span className="line-clamp-1">{gym.address}</span>
                    </p>
                  ) : null}

                  <div className="nearby-card__row">
                    {gym.working_hours ? (
                      <span className="nearby-card__chip">
                        <Clock size={11} aria-hidden />
                        <span className="line-clamp-1">{gym.working_hours}</span>
                      </span>
                    ) : null}
                    {gym.phone ? (
                      <span className="nearby-card__chip">
                        <Phone size={11} aria-hidden />
                        <span dir="ltr">{gym.phone}</span>
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>

              <div className="nearby-card__actions">
                <button
                  type="button"
                  className="nearby-card__cta"
                  onClick={() => navigate(`/gym/${gym.id}`)}
                >
                  جزئیات
                  <ChevronLeft size={14} aria-hidden />
                </button>
                {gym.phone ? (
                  <a href={`tel:${gym.phone}`} className="nearby-card__call">
                    تماس
                  </a>
                ) : null}
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}

export default GymListView;
