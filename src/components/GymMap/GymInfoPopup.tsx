/**
 * Map pin popup — premium Fitopia card
 */

import { Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";
import type { Gym } from "../../types/gym";
import "./popup.css";

interface GymInfoPopupProps {
  gym: Gym;
}

export default function GymInfoPopup({ gym }: GymInfoPopupProps) {
  const navigate = useNavigate();

  const score =
    typeof gym.popularity_score === "number" && Number.isFinite(gym.popularity_score)
      ? gym.popularity_score.toFixed(1)
      : null;

  return (
    <Popup className="fitopia-gym-popup" maxWidth={300} minWidth={260}>
      <div className="fgp" dir="rtl">
        <div className="fgp__cover">
          {gym.cover_image ? (
            <img
              src={gym.cover_image}
              alt=""
              className="fgp__img"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="fgp__img fgp__img--ph" />
          )}
          <div className="fgp__cover-fade" />
          {gym.is_popular ? (
            <span className="fgp__badge">محبوب</span>
          ) : null}
          {score ? (
            <span className="fgp__score">
              <Star size={11} fill="currentColor" aria-hidden />
              {score}
            </span>
          ) : null}
        </div>

        <div className="fgp__body">
          <h3 className="fgp__name">{gym.name}</h3>

          {gym.address ? (
            <p className="fgp__row">
              <MapPin size={13} className="fgp__ico" aria-hidden />
              <span>{gym.address}</span>
            </p>
          ) : null}

          {gym.working_hours ? (
            <p className="fgp__row">
              <Clock size={13} className="fgp__ico" aria-hidden />
              <span>{gym.working_hours}</span>
            </p>
          ) : null}

          {gym.phone ? (
            <p className="fgp__row">
              <Phone size={13} className="fgp__ico" aria-hidden />
              <span dir="ltr">{gym.phone}</span>
            </p>
          ) : null}

          <div className="fgp__actions">
            <button
              type="button"
              className="fgp__cta"
              onClick={() => navigate(`/gym/${gym.id}`)}
            >
              مشاهده باشگاه
              <ChevronLeft size={15} aria-hidden />
            </button>
            {gym.phone ? (
              <a href={`tel:${gym.phone}`} className="fgp__call">
                <Phone size={15} aria-hidden />
                تماس
              </a>
            ) : null}
          </div>

          {(gym.instagram || gym.telegram || gym.website) && (
            <div className="fgp__links">
              {gym.website ? (
                <a
                  href={gym.website.startsWith("http") ? gym.website : `https://${gym.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fgp__link"
                >
                  <ExternalLink size={12} aria-hidden />
                  وبسایت
                </a>
              ) : null}
              {gym.instagram ? (
                <a
                  href={
                    gym.instagram.startsWith("http")
                      ? gym.instagram
                      : `https://instagram.com/${gym.instagram.replace("@", "")}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fgp__link"
                >
                  اینستاگرام
                </a>
              ) : null}
              {gym.telegram ? (
                <a
                  href={
                    gym.telegram.startsWith("http")
                      ? gym.telegram
                      : `https://t.me/${gym.telegram.replace("@", "")}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fgp__link"
                >
                  تلگرام
                </a>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </Popup>
  );
}
