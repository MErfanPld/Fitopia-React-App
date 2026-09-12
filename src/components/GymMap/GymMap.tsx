/**
 * Nearby gyms on OpenStreetMap (Leaflet).
 * Flow: GPS → /api/gym/nearby/?lat&lon → markers on OSM tiles.
 * Iran OSM data includes Persian street/place names on standard tiles.
 */

import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  RefreshCcw,
  Navigation,
  List,
  Crosshair,
  AlertCircle,
} from "lucide-react";
import { useUserLocation } from "../../hooks/useUserLocation";
import { useNearbyGyms } from "../../hooks/useNearbyGyms";
import GymMarker from "./GymMarker";
import GymInfoPopup from "./GymInfoPopup";
import GymListView from "./GymListView";
import MapResizeFix from "./MapResizeFix";
import RecenterMap from "./RecenterMap";
import "./styles.css";

const userIcon = L.divIcon({
  className: "user-location-marker",
  html: `
    <div class="user-dot-wrap">
      <div class="user-dot-pulse"></div>
      <div class="user-dot"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export default function GymMap() {
  const navigate = useNavigate();
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

  const [showList, setShowList] = useState(false);
  const [recenterNonce, setRecenterNonce] = useState(0);

  const center = useMemo(
    (): [number, number] => [location.lat, location.lon],
    [location.lat, location.lon],
  );

  const handleRetry = () => {
    retryLocation();
    refetch();
  };

  const handleLocate = () => {
    retryLocation();
    setRecenterNonce((n) => n + 1);
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#07070A]">
      {locLoading ? (
        <div className="absolute inset-0 z-[600] flex flex-col items-center justify-center gap-3 bg-[#07070A]/88 backdrop-blur-sm">
          <div className="fitopia-loader-ring" aria-label="در حال دریافت موقعیت" />
          <p className="text-sm font-bold text-white">در حال دریافت موقعیت شما…</p>
          <p className="text-xs text-white/45 px-6 text-center max-w-xs">
            نقشه روی موقعیت واقعی شما در OpenStreetMap تنظیم می‌شود.
          </p>
        </div>
      ) : null}

      <MapContainer
        center={center}
        zoom={14}
        className="gym-map"
        zoomControl={false}
        style={{ height: "100%", width: "100%", background: "#0a0a0e" }}
      >
        <MapResizeFix />
        <RecenterMap
          lat={location.lat}
          lon={location.lon}
          zoom={14}
          nonce={recenterNonce}
        />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          className="gym-map-tiles"
        />

        <Circle
          center={center}
          radius={isFallback ? 0 : 120}
          pathOptions={{
            color: "#FF6A00",
            fillColor: "#FF6A00",
            fillOpacity: 0.08,
            weight: 1,
            opacity: 0.35,
          }}
        />

        <Marker position={center} icon={userIcon}>
          <Popup className="user-popup">
            <div className="popup-content text-center" dir="rtl">
              <p className="font-bold text-sm mb-1">
                {isFallback ? "موقعیت تقریبی (تهران)" : "موقعیت فعلی شما"}
              </p>
              <p className="text-xs opacity-70" dir="ltr">
                {location.lat.toFixed(5)}, {location.lon.toFixed(5)}
              </p>
              {isFallback ? (
                <button type="button" onClick={handleLocate} className="retry-small-btn mt-2">
                  دریافت موقعیت دقیق
                </button>
              ) : null}
            </div>
          </Popup>
        </Marker>

        {gyms
          .filter(
            (g) =>
              Number.isFinite(g.latitude) &&
              Number.isFinite(g.longitude) &&
              !(g.latitude === 0 && g.longitude === 0),
          )
          .map((gym) => (
            <GymMarker key={gym.id} gym={gym}>
              <GymInfoPopup gym={gym} />
            </GymMarker>
          ))}
      </MapContainer>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] pt-[max(0.5rem,env(safe-area-inset-top))] px-3">
        <div className="pointer-events-auto mx-auto flex max-w-md items-start gap-2">
          <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#0c0c10]/92 backdrop-blur-md px-3 py-2.5 shadow-lg">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] text-white/45">نقشه OpenStreetMap</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                <MapPin size={12} aria-hidden />
                {isFallback ? "تقریبی" : "موقعیت شما"}
              </span>
            </div>
            <p className="mt-0.5 text-xs font-bold text-white">
              {gymsLoading
                ? "در حال یافتن باشگاه‌های نزدیک…"
                : `${gyms.length.toLocaleString("fa-IR")} باشگاه نزدیک`}
            </p>
            {locError || gymsError ? (
              <p className="mt-1 flex items-start gap-1 text-[11px] text-amber-200/90">
                <AlertCircle size={12} className="shrink-0 mt-0.5" aria-hidden />
                <span>{locError || gymsError}</span>
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="absolute bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-3 z-[500] flex flex-col gap-2">
        <button
          type="button"
          onClick={handleLocate}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-[#121216]/95 text-primary shadow-lg backdrop-blur-md"
          aria-label="مرکز روی موقعیت من"
          title="موقعیت من"
        >
          <Crosshair size={18} aria-hidden />
        </button>
        <button
          type="button"
          onClick={handleRetry}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-[#121216]/95 text-white/80 shadow-lg backdrop-blur-md"
          aria-label="بروزرسانی"
          title="بروزرسانی"
        >
          <RefreshCcw size={17} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => setShowList((v) => !v)}
          className={`flex h-11 w-11 items-center justify-center rounded-full border shadow-lg backdrop-blur-md ${
            showList
              ? "border-primary/40 bg-primary text-black"
              : "border-white/12 bg-[#121216]/95 text-white/80"
          }`}
          aria-label="لیست باشگاه‌ها"
          aria-pressed={showList}
        >
          <List size={18} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => navigate("/gym/all")}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-[#121216]/95 text-white/80 shadow-lg backdrop-blur-md"
          aria-label="همه باشگاه‌ها"
          title="لیست کامل"
        >
          <Navigation size={17} aria-hidden />
        </button>
      </div>

      {showList ? (
        <div className="absolute inset-x-0 bottom-0 z-[510] max-h-[45dvh] overflow-hidden rounded-t-2xl border-t border-white/10 bg-[#0c0c10]/98 pb-[env(safe-area-inset-bottom)] shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8">
            <button
              type="button"
              onClick={() => setShowList(false)}
              className="text-xs font-semibold text-white/50"
            >
              بستن
            </button>
            <p className="text-sm font-bold text-white">باشگاه‌های نزدیک</p>
          </div>
          <div className="max-h-[38dvh] overflow-y-auto">
            <GymListView
              gyms={gyms}
              loading={gymsLoading}
              error={gymsError}
              onRetry={refetch}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
