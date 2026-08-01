// src/components/GymMap/GymMap.tsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useUserLocation } from "../../hooks/useUserLocation";
import { useNearbyGyms } from "../../hooks/useNearbyGyms";
import GymMarker from "./GymMarker";
import GymInfoPopup from "./GymInfoPopup";
import GymListView from "./GymListView";
import "./styles.css";
import MapResizeFix from "./MapResizeFix";
import { MapPin, RefreshCcw, TriangleAlert } from "lucide-react";

const GymMap = () => {
  const {
    location,
    loading: locLoading,
    error: locError,
    retry: retryLocation,
    isFallback,
  } = useUserLocation();

  const {
    gyms,
    loading: gymsLoading,
    error: gymsError,
    refetch,
  } = useNearbyGyms(location.lat, location.lon);

  const handleRetry = () => {
    retryLocation();
    refetch();
  };

  // Loading state - Full screen
  if (locLoading) {
    return (
      <div className="fixed inset-0 bg-[#07070A] flex flex-col items-center justify-center z-50">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 bg-primary/25 rounded-full blur-2xl animate-pulse" />
          <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-primary animate-spin" />
        </div>
        <p className="text-on-surface mt-6 text-lg font-bold">
          درحال دریافت موقعیت شما...
        </p>
        <p className="text-on-surface-variant text-sm mt-2">
          لطفاً دسترسی به موقعیت را در مرورگر مجاز کنید
        </p>
      </div>
    );
  }

  // Error state - Full screen
  if (locError) {
    return (
      <div className="fixed inset-0 bg-[#07070A] flex flex-col items-center justify-center z-50 p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">
            <TriangleAlert />
          </div>
          <p className="text-error text-lg font-bold mb-2">{locError}</p>
          <p className="text-on-surface-variant text-sm mb-6">
            {isFallback
              ? "موقعیت پیش‌فرض (تهران) استفاده شده است."
              : "لطفاً مجدداً تلاش کنید یا موقعیت را به صورت دستی وارد کنید."}
          </p>
          <button
            onClick={handleRetry}
            className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
          >
            <RefreshCcw className="text-xl" />
            <span className="ml-2">
              <RefreshCcw /> تلاش مجدد
            </span>
          </button>
        </div>
      </div>
    );
  }

  const defaultCenter: [number, number] = [location.lat, location.lon];

  const userIcon = L.divIcon({
    className: `user-marker ${isFallback ? "fallback" : ""}`,
    html: `
      <div class="user-location-icon">
        <div class="pulse"></div>
        <div class="inner"></div>
        ${isFallback ? '<div class="fallback-badge">پیش‌فرض</div>' : ""}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

  return (
    <>
      {/* Full Screen Map */}
      <MapContainer
        center={defaultCenter}
        zoom={13}
        className="gym-map"
        style={{
          height: "100vh",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      >
        <MapResizeFix />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
          className="gym-map-tiles"
        />

        {/* User location marker */}
        <Marker position={defaultCenter} icon={userIcon}>
          <Popup className="user-popup">
            <div className="popup-content">
              <p>
                <MapPin />{" "}
                {isFallback ? "موقعیت پیش‌فرض (تهران)" : "موقعیت شما"}
              </p>
              {isFallback && (
                <button onClick={handleRetry} className="retry-small-btn">
                  دریافت موقعیت دقیق
                </button>
              )}
            </div>
          </Popup>
        </Marker>

        {/* Gym markers */}
        {gyms.map((gym) => (
          <GymMarker key={gym.id} gym={gym}>
            <GymInfoPopup gym={gym} />
          </GymMarker>
        ))}
      </MapContainer>

      {/* Floating Controls - Top Left */}
      <div className="fixed top-16 right-4 z-10 flex flex-col gap-2">
        {/* Location Info Card */}
        <div className="bg-surface-container/80 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 min-w-[200px] shadow-xl">
          <p className="text-xs text-on-surface-variant mb-1">موقعیت شما</p>

          <p className="text-xs font-bold text-on-surface flex items-center gap-1">
            <MapPin /> {isFallback ? `پیش‌فرض (تهران)` : `موقعیت فعلی`}
          </p>
          <p className="text-xs text-on-surface-variant mt-1">
            {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
          </p>
          {isFallback && (
            <button
              onClick={handleRetry}
              className="mt-2 text-primary text-xs font-bold hover:underline"
            >
              دریافت موقعیت واقعی
            </button>
          )}
        </div>

        {/* Gym Count Badge */}
        <div className="bg-surface-container/80 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 shadow-xl">
          <p className="text-xs text-on-surface-variant">باشگاه‌های نزدیک</p>
          <p className="text-sm font-black text-primary">
            {gymsLoading ? "..." : gyms.length}
          </p>
          {gymsError && (
            <button
              onClick={handleRetry}
              className="mt-1 text-error text-xs font-bold hover:underline flex items-center gap-1"
            >
              <TriangleAlert /> خطا - تلاش مجدد
            </button>
          )}
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRetry}
          className="bg-surface-container/80 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 shadow-xl hover:bg-surface-container transition-all active:scale-95 w-10 h-10 flex items-center justify-center"
          aria-label="بروزرسانی"
        >
          <span className="text-xl">
            <RefreshCcw />
          </span>
        </button>
      </div>

      {/* Gym List - Bottom Sheet */}
      <div className="fixed bottom-20 left-0 right-0 z-10 px-4 pointer-events-none">
        <div className="pointer-events-auto max-h-[40vh] overflow-y-auto">
          <GymListView
            gyms={gyms}
            loading={gymsLoading}
            error={gymsError}
            onRetry={handleRetry}
          />
        </div>
      </div>
    </>
  );
};

export default GymMap;
