import { Marker } from "react-leaflet";
import L from "leaflet";
import type { Gym } from "../../types/gym";

interface GymMarkerProps {
  gym: Gym;
  children: React.ReactNode;
  highlighted?: boolean;
}

/** Orange pin marker — tip points to exact coordinates */
const GymMarker = ({ gym, children, highlighted = false }: GymMarkerProps) => {
  const popular = gym.is_popular;
  const icon = L.divIcon({
    className: "gym-pin-marker",
    html: `
      <div class="gym-pin ${popular ? "is-popular" : ""} ${highlighted ? "is-active" : ""}">
        <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M18 0C8.6 0 1 7.6 1 17c0 12.2 17 27 17 27s17-14.8 17-27C35 7.6 27.4 0 18 0z"
            fill="${highlighted ? "#FF8A4C" : "#FF6A00"}"/>
          <path d="M18 0C8.6 0 1 7.6 1 17c0 12.2 17 27 17 27s17-14.8 17-27C35 7.6 27.4 0 18 0z"
            stroke="#fff" stroke-width="2" fill="none" opacity="0.35"/>
          <circle cx="18" cy="16" r="6.5" fill="#fff"/>
          <circle cx="18" cy="16" r="3.2" fill="${popular ? "#FF6A00" : "#121216"}"/>
        </svg>
        ${popular ? '<span class="gym-pin-badge">★</span>' : ""}
      </div>
    `,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -40],
  });

  if (
    !Number.isFinite(gym.latitude) ||
    !Number.isFinite(gym.longitude) ||
    (gym.latitude === 0 && gym.longitude === 0)
  ) {
    return null;
  }

  return (
    <Marker position={[gym.latitude, gym.longitude]} icon={icon}>
      {children}
    </Marker>
  );
};

export default GymMarker;
