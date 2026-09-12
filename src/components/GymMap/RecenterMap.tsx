import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface RecenterMapProps {
  lat: number;
  lon: number;
  zoom?: number;
  /** Bump this to force flyTo again (e.g. locate button). */
  nonce?: number;
}

/**
 * Keep map centered on user GPS when location updates.
 * MapContainer only applies `center` on first mount.
 */
export default function RecenterMap({
  lat,
  lon,
  zoom = 14,
  nonce = 0,
}: RecenterMapProps) {
  const map = useMap();

  useEffect(() => {
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
    map.flyTo([lat, lon], zoom, { duration: 0.85 });
  }, [map, lat, lon, zoom, nonce]);

  return null;
}
