import { Popup } from 'react-leaflet';
import type { Gym } from '../../types/gym';
import './popup.css';

interface GymInfoPopupProps {
  gym: Gym;
}

const GymInfoPopup = ({ gym }: GymInfoPopupProps) => {
  const handleCall = () => {
    window.location.href = `tel:${gym.phone}`;
  };

  const handleWhatsApp = () => {
    if (gym.whatsapp) {
      window.open(`https://wa.me/${gym.whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
    }
  };

  return (
    <Popup className="gym-popup" maxWidth={280}>
      <div className="popup-content">
        <h3 className="gym-name">{gym.name}</h3>
        
        {gym.is_popular && (
          <div className="popular-badge">🔥 محبوب</div>
        )}

        <div className="popup-section">
          <p className="address">
            <span className="icon">📍</span>
            {gym.address}
          </p>
        </div>

        <div className="popup-section">
          <p className="phone">
            <span className="icon">📞</span>
            {gym.phone}
          </p>
        </div>

        <div className="popup-section">
          <p className="hours">
            <span className="icon">⏰</span>
            {gym.working_hours}
          </p>
        </div>

        <div className="popup-section">
          <p className="score">
            <span className="icon">⭐</span>
            امتیاز: {gym.popularity_score.toFixed(1)}
          </p>
        </div>

        <div className="action-buttons">
          <button onClick={handleCall} className="btn btn-call">
            تماس
          </button>
          {gym.whatsapp && (
            <button onClick={handleWhatsApp} className="btn btn-whatsapp">
              واتس
            </button>
          )}
        </div>

        <div className="social-links">
          {gym.instagram && (
            <a
              href={`https://instagram.com/${gym.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title="اینستاگرام"
            >
              📷
            </a>
          )}
          {gym.telegram && (
            <a
              href={`https://t.me/${gym.telegram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title="تلگرام"
            >
              ✈️
            </a>
          )}
          {gym.website && (
            <a
              href={gym.website}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title="وبسایت"
            >
              🌐
            </a>
          )}
        </div>
      </div>
    </Popup>
  );
};

export default GymInfoPopup;
