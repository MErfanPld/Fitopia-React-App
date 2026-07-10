import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useUserLocation } from '../../hooks/useUserLocation';
import { useNearbyGyms } from '../../hooks/useNearbyGyms';
import GymMarker from './GymMarker';
import GymInfoPopup from './GymInfoPopup';
import GymListView from './GymListView';
import './styles.css';

const GymMap = () => {
  const { location, loading: locLoading, error: locError } = useUserLocation();
  const { gyms, loading: gymsLoading, error: gymsError } = useNearbyGyms(
    location.lat,
    location.lon
  );

  if (locLoading) {
    return (
      <div className="gym-map-loading">
        <div className="spinner"></div>
        <p>درحال بارگذاری موقعیت...</p>
      </div>
    );
  }

  if (locError) {
    return (
      <div className="gym-map-error">
        <p>⚠️ {locError}</p>
        <p className="error-hint">لطفاً مرورگر را دوباره بارگذاری کرده و دسترسی را مجاز کنید</p>
      </div>
    );
  }

  const defaultCenter: [number, number] = location.lat && location.lon
    ? [location.lat, location.lon]
    : [35.6892, 51.389]; // Tehran default

  // User location marker icon
  const userIcon = L.divIcon({
    className: 'user-marker',
    html: `
      <div class="user-location-icon">
        <div class="pulse"></div>
        <div class="inner"></div>
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
        {location.lat && location.lon && (
          <p className="location-coords">
            📍 موقعیت شما: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
          </p>
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
          {/* OSM Tile Layer */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
            className="gym-map-tiles"
          />

          {/* User location marker */}
          {location.lat && location.lon && (
            <Marker position={[location.lat, location.lon]} icon={userIcon}>
              <Popup className="user-popup">
                <div className="popup-content">
                  <p>📍 موقعیت شما</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Gym markers */}
          {gyms.map((gym) => (
            <GymMarker key={gym.id} gym={gym}>
              <GymInfoPopup gym={gym} />
            </GymMarker>
          ))}
        </MapContainer>
      </div>

      {/* List view */}
      <GymListView gyms={gyms} loading={gymsLoading} error={gymsError} />
    </div>
  );
};

export default GymMap;
