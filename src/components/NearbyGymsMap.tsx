/**
 * Home mini-map — real OpenStreetMap tiles + user + nearby gym pins.
 */

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import L from "leaflet";
import { ChevronLeft, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserLocation } from "../hooks/useUserLocation";
import { useNearbyGyms } from "../hooks/useNearbyGyms";
import MapResizeFix from "./GymMap/MapResizeFix";
import "leaflet/dist/leaflet.css";

const userIcon = L.divIcon({
  className: "home-user-marker",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#FF6A00;border:2px solid #fff;box-shadow:0 0 0 4px rgba(255,106,0,0.35)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const gymIcon = L.divIcon({
  className: "home-gym-marker",
  html: `<div style="width:10px;height:10px;border-radius:50%;background:#22d3ee;border:2px solid #0f172a;box-shadow:0 0 8px rgba(34,211,238,0.5)"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

export function NearbyGymsMap() {
  const navigate = useNavigate();
  const { location, loading: locLoading } = useUserLocation();
  const { gyms, loading: gymsLoading } = useNearbyGyms(location.lat, location.lon);
  const loading = locLoading || gymsLoading;
  const count = gyms?.length ?? 0;

  const center = useMemo(
    (): [number, number] => [location.lat, location.lon],
    [location.lat, location.lon],
  );

  const pins = useMemo(
    () =>
      (gyms || [])
        .filter((g) => typeof g.latitude === "number" && typeof g.longitude === "number")
        .slice(0, 12),
    [gyms],
  );

  return (
    <section className="space-y-3" id="nearby-gyms-map" aria-label="باشگاه‌های نزدیک">
      <h2 className="section-title">باشگاه‌های نزدیک شما</h2>

      <button
        type="button"
        onClick={() => navigate("/gym-map")}
        className="relative w-full overflow-hidden rounded-2xl border border-white/10 text-right min-h-[11rem] sm:min-h-[12.5rem] active:scale-[0.99] transition-transform"
      >
        {/* Live map layer (pointer-events none so whole card is tappable) */}
        <div className="absolute inset-0 z-0 pointer-events-none [&_.leaflet-control-attribution]:!hidden [&_.leaflet-control-container]:!hidden">
          <MapContainer
            center={center}
            zoom={13}
            zoomControl={false}
            dragging={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            keyboard={false}
            attributionControl={false}
            className="h-full w-full"
            style={{ background: "#e5e7eb" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution=""
            />
            <MapResizeFix />
            <Circle
              center={center}
              radius={600}
              pathOptions={{
                color: "#FF6A00",
                fillColor: "#FF6A00",
                fillOpacity: 0.08,
                weight: 1,
              }}
            />
            <Marker position={center} icon={userIcon} />
            {pins.map((g) => (
              <Marker
                key={g.id}
                position={[g.latitude, g.longitude]}
                icon={gymIcon}
              />
            ))}
          </MapContainer>
        </div>

        {/* Bottom gradient + CTA */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#07070A] via-[#07070A]/40 to-transparent pointer-events-none" />

        <div className="relative z-20 flex h-full min-h-[11rem] sm:min-h-[12.5rem] flex-col justify-end p-4">
          {loading ? (
            <p className="text-xs text-white/70">در حال یافتن موقعیت...</p>
          ) : (
            <>
              <div className="flex items-center justify-end gap-1.5 text-primary">
                <span className="text-xs font-semibold drop-shadow">
                  {count > 0 ? `${count} باشگاه نزدیک` : "مشاهده روی نقشه"}
                </span>
                <MapPin size={14} aria-hidden />
              </div>
              <p className="mt-1 text-sm font-bold text-white flex items-center justify-end gap-1 drop-shadow">
                باز کردن نقشه کامل
                <ChevronLeft size={16} aria-hidden />
              </p>
            </>
          )}
        </div>
      </button>
    </section>
  );
}
