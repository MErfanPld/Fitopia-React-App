import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { Gym } from "../../types/gym";

interface FocusGymProps {
  gym: Gym | null;
  nonce: number;
}

/** Fly map to selected gym pin */
export default function FocusGym({ gym, nonce }: FocusGymProps) {
  const map = useMap();

  useEffect(() => {
    if (!gym) return;
    if (!Number.isFinite(gym.latitude) || !Number.isFinite(gym.longitude)) return;
    map.flyTo([gym.latitude, gym.longitude], 16, { duration: 0.7 });
  }, [map, gym, nonce]);

  return null;
}
