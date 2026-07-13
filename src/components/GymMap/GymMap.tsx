// src/components/GymMap/GymMap.tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useUserLocation } from '../../hooks/useUserLocation';
import { useNearbyGyms } from '../../hooks/useNearbyGyms';
import GymMarker from './GymMarker';
import GymInfoPopup from './GymInfoPopup';
import GymListView from './GymListView';
import './styles.css';

const GymMap = () => {
  const { 
    location, 
    loading: locLoading, 
    error: locError, 
    retry: retryLocation,
    isFallback 
  } = useUserLocation();
  
  const { 
    gyms, 
    loading: gymsLoading, 
    error: gymsError, 
    refetch 
  } = useNearbyGyms(location.lat, location.lon);

  const handleRetry = () => {
    retryLocation();
    refetch();
  };

  // نمایش پیام خطا با گزینه تلاش مجدد
  if (locLoading) {
    return (
      <div className="gym-map-loading">
        <div className="spinner"></div>
        <p>درحال دریافت موقعیت شما...</p>
        <p className="loading-hint">لطفاً دسترسی به موقعیت را در مرورگر مجاز کنید</p>
      </div>
    );
  }

  // نمایش پیام خطا
  if (locError) {
    return (
      <div className="gym-map-error">
        <p>⚠️ {locError}</p>
        <p className="error-hint">
          {isFallback 
            ? 'موقعیت پیش‌فرض (تهران) استفاده شده است.' 
            : 'لطفاً مجدداً تلاش کنید یا موقعیت را به صورت دستی وارد کنید.'}
        </p>
        <button onClick={handleRetry} className="retry-btn">
          🔄 تلاش مجدد
        </button>
      </div>
    );
  }

  // موقعیت پیش‌فرض
  const defaultCenter: [number, number] = [location.lat, location.lon];

  // آیکون موقعیت کاربر
  const userIcon = L.divIcon({
    className: `user-marker ${isFallback ? 'fallback' : ''}`,
    html: `
      <div class="user-location-icon">
        <div class="pulse"></div>
        <div class="inner"></div>
        ${isFallback ? '<div class="fallback-badge">پیش‌فرض</div>' : ''}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

  return (
    <div className="gym-map-container">
      <div className="map-header">
        <h2>🏋️ باشگاه‌های نزدیک</h2>
        <p className="gym-count">
          {gymsLoading ? 'درحال جستجو...' : `${gyms.length} باشگاه یافت شد`}
        </p>
        <p className="location-coords">
          📍 {isFallback ? 'موقعیت پیش‌فرض' : 'موقعیت شما'}: 
          {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
        </p>
        {isFallback && (
          <button onClick={handleRetry} className="retry-small-btn">
            دریافت موقعیت واقعی
          </button>
        )}
        {gymsError && (
          <div className="gyms-error-banner">
            <span>⚠️ {gymsError}</span>
            <button onClick={handleRetry} className="retry-small-btn">
              تلاش مجدد
            </button>
          </div>
        )}
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          className="gym-map"
          style={{
            height: '500px',
            width: '100%',
            borderRadius: '12px',
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
            className="gym-map-tiles"
          />

          {/* نشانگر موقعیت کاربر */}
          <Marker position={defaultCenter} icon={userIcon}>
            <Popup className="user-popup">
              <div className="popup-content">
                <p>📍 {isFallback ? 'موقعیت پیش‌فرض (تهران)' : 'موقعیت شما'}</p>
                {isFallback && (
                  <button onClick={handleRetry} className="retry-small-btn">
                    دریافت موقعیت دقیق
                  </button>
                )}
              </div>
            </Popup>
          </Marker>

          {/* نشانگرهای باشگاه‌ها */}
          {gyms.map((gym) => (
            <GymMarker key={gym.id} gym={gym}>
              <GymInfoPopup gym={gym} />
            </GymMarker>
          ))}
        </MapContainer>
      </div>

      {/* نمایش لیست باشگاه‌ها */}
      <GymListView 
        gyms={gyms} 
        loading={gymsLoading} 
        error={gymsError} 
        onRetry={handleRetry}
      />
    </div>
  );
};

export default GymMap;