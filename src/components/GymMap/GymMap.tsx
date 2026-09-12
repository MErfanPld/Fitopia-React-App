/**
 * Nearby gyms map — OpenStreetMap tiles + pin markers + nearby panel overlay
 * Map fills viewport; panel sits ON TOP of map (both always visible)
 */

import { useCallback, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import {
  MapPin,
  RefreshCcw,
  Crosshair,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";
import { useUserLocation } from "../../hooks/useUserLocation";
import { useNearbyGyms } from "../../hooks/useNearbyGyms";
import type { Gym } from "../../types/gym";
import GymMarker from "./GymMarker";
import GymInfoPopup from "./GymInfoPopup";
import GymListView from "./GymListView";
import MapResizeFix from "./MapResizeFix";
import RecenterMap from "./RecenterMap";
import FocusGym from "./FocusGym";
import "./styles.css";

const userIcon = L.divIcon({
  className: "user-location-marker",
  html: `<div class="user-dot-wrap"><div class="user-dot-pulse"></div><div class="user-dot"></div></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export default function GymMap() {
  const {
    location,
    loading: locLoading,
    error: locError,
    retry: retryLocation,
    isFallback,
  } = useUserLocation();

  const { gyms, loading: gymsLoading, error: gymsError, refetch } = useNearbyGyms(
    location.lat,
    location.lon,
  );

  const [panel, setPanel] = useState<"collapsed" | "half" | "full">("half");
  const [recenterNonce, setRecenterNonce] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [focusNonce, setFocusNonce] = useState(0);

  const center = useMemo(
    (): [number, number] => [location.lat, location.lon],
    [location.lat, location.lon],
  );

  const selectedGym = useMemo(
    () => gyms.find((g) => g.id === selectedId) || null,
    [gyms, selectedId],
  );

  const handleRetry = () => {
    retryLocation();
    refetch();
  };

  const handleLocate = () => {
    retryLocation();
    setRecenterNonce((n) => n + 1);
  };

  const onSelectGym = useCallback(
    (gym: Gym) => {
      setSelectedId(gym.id);
      setFocusNonce((n) => n + 1);
      if (panel === "collapsed") setPanel("half");
    },
    [panel],
  );

  const cyclePanel = () => {
    setPanel((p) =>
      p === "collapsed" ? "half" : p === "half" ? "full" : "collapsed",
    );
  };

  return (
    <div className={`gym-map-shell panel-${panel}`}>
      {locLoading ? (
        <div className="gym-map-loading">
          <div className="fitopia-loader-ring" aria-label="در حال دریافت موقعیت" />
          <p className="text-sm font-bold text-white">در حال دریافت موقعیت…</p>
        </div>
      ) : null}

      <div className="gym-map-canvas">
        <MapContainer
          center={center}
          zoom={14}
          className="gym-map"
          zoomControl={false}
          style={{ height: "100%", width: "100%", background: "#e5e7eb" }}
        >
          <MapResizeFix panelKey={panel} />
          <RecenterMap
            lat={location.lat}
            lon={location.lon}
            zoom={14}
            nonce={recenterNonce}
          />
          <FocusGym gym={selectedGym} nonce={focusNonce} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          <Circle
            center={center}
            radius={isFallback ? 0 : 140}
            pathOptions={{
              color: "#FF6A00",
              fillColor: "#FF6A00",
              fillOpacity: 0.07,
              weight: 1,
              opacity: 0.4,
            }}
          />

          <Marker position={center} icon={userIcon}>
            <Popup>
              <div dir="rtl" style={{ textAlign: "center", fontSize: 13 }}>
                <strong>{isFallback ? "موقعیت تقریبی (تهران)" : "موقعیت شما"}</strong>
                <div dir="ltr" style={{ opacity: 0.7, fontSize: 11, marginTop: 4 }}>
                  {location.lat.toFixed(5)}, {location.lon.toFixed(5)}
                </div>
              </div>
            </Popup>
          </Marker>

          {gyms.map((gym) => (
            <GymMarker key={gym.id} gym={gym} highlighted={selectedId === gym.id}>
              <GymInfoPopup gym={gym} />
            </GymMarker>
          ))}
        </MapContainer>

        <div className="gym-map-top">
          <div className="gym-map-status">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] text-white/45">OpenStreetMap</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                <MapPin size={12} aria-hidden />
                {isFallback ? "تقریبی" : "موقعیت شما"}
              </span>
            </div>
            <p className="mt-0.5 text-xs font-bold text-white">
              {gymsLoading
                ? "جستجوی باشگاه‌های نزدیک…"
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

        <div className="gym-map-fabs">
          <button
            type="button"
            onClick={handleLocate}
            className="gym-map-fab gym-map-fab--primary"
            aria-label="موقعیت من"
          >
            <Crosshair size={18} aria-hidden />
          </button>
          <button
            type="button"
            onClick={handleRetry}
            className="gym-map-fab"
            aria-label="بروزرسانی"
          >
            <RefreshCcw size={17} aria-hidden />
          </button>
        </div>
      </div>

      <section
        className={`nearby-panel nearby-panel--${panel}`}
        aria-label="باشگاه‌های نزدیک"
      >
        <div className="nearby-panel__handle-row">
          <button
            type="button"
            className="nearby-panel__handle"
            onClick={cyclePanel}
            aria-label="تغییر اندازه پنل"
          >
            <span className="nearby-panel__grip" />
          </button>
          <div className="nearby-panel__head">
            <button
              type="button"
              onClick={cyclePanel}
              className="nearby-panel__chev"
              aria-label={panel === "full" ? "کوچک کردن" : "بزرگ کردن"}
            >
              {panel === "full" ? (
                <ChevronDown size={18} aria-hidden />
              ) : (
                <ChevronUp size={18} aria-hidden />
              )}
            </button>
            <div className="min-w-0 flex-1 text-right">
              <h2 className="text-sm font-extrabold text-white">باشگاه‌های نزدیک</h2>
              <p className="text-[11px] text-white/40">
                {gymsLoading
                  ? "در حال بارگذاری…"
                  : `${gyms.length.toLocaleString("fa-IR")} مورد`}
              </p>
            </div>
            {panel !== "collapsed" ? (
              <button
                type="button"
                className="nearby-panel__close"
                onClick={() => setPanel("collapsed")}
                aria-label="جمع کردن"
              >
                <X size={16} aria-hidden />
              </button>
            ) : null}
          </div>
        </div>

        {panel !== "collapsed" ? (
          <div className="nearby-panel__body">
            <GymListView
              gyms={gyms}
              loading={gymsLoading}
              error={gymsError}
              onRetry={handleRetry}
              onSelectGym={onSelectGym}
              selectedId={selectedId}
            />
          </div>
        ) : null}
      </section>
    </div>
  );
}
