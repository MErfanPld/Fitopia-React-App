// src/components/GymMap/GymListView.tsx
import type { Gym } from '../../types/gym';
import './list.css';

interface GymListViewProps {
  gyms: Gym[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

const GymListView = ({ gyms, loading, error, onRetry }: GymListViewProps) => {
  if (error) {
    return (
      <div className="gym-list-error">
        <p>⚠️ {error}</p>
        {onRetry && (
          <button onClick={onRetry} className="retry-btn">
            تلاش مجدد
          </button>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="gym-list-loading">
        <div className="spinner-small"></div>
        <p>درحال بارگذاری باشگاه‌ها...</p>
      </div>
    );
  }

  if (gyms.length === 0) {
    return (
      <div className="gym-list-empty">
        <p>😕 متاسفانه باشگاهی در نزدیکی شما یافت نشد</p>
        <p className="empty-hint">شعاع جستجو را افزایش دهید یا موقعیت خود را تغییر دهید</p>
      </div>
    );
  }

  return (
    <div className="gym-list">
      <h3 className="list-title">لیست باشگاه‌ها</h3>
      <div className="gym-cards">
        {gyms.map((gym) => (
          <div key={gym.id} className="gym-card">
            <div className="gym-card-image">
              <img src={gym.cover_image || '/placeholder-gym.jpg'} alt={gym.name} />
              {gym.is_popular && <div className="popular-badge">🔥 محبوب</div>}
            </div>
            <div className="gym-card-content">
              <h4 className="gym-name">{gym.name}</h4>
              <p className="gym-address">📍 {gym.address}</p>
              <p className="gym-phone">📞 {gym.phone}</p>
              <p className="gym-hours">⏰ {gym.working_hours}</p>
              <div className="gym-score">
                <span>⭐ {gym.popularity_score.toFixed(1)}</span>
                <span className="facilities-count">
                  {gym.facilities?.length || 0} تجهیزات
                </span>
              </div>
              <div className="gym-card-actions">
                <a href={`tel:${gym.phone}`} className="action-btn call-btn">
                  تماس
                </a>
                {gym.whatsapp && (
                  <a
                    href={`https://wa.me/${gym.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn whatsapp-btn"
                  >
                    واتس
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GymListView;