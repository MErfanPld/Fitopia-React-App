import { Marker } from "react-leaflet";
import L from "leaflet";
import type { Gym } from "../../types/gym";

interface GymMarkerProps {
  gym: Gym;
  children: React.ReactNode;
}

const GymMarker = ({ gym, children }: GymMarkerProps) => {
  // Custom icon with gradient background and SVG pin
  const icon = L.divIcon({
    className: `gym-marker ${gym.is_popular ? "popular" : ""}`,
    html: `
      <div class="marker-icon">
        <svg 
          width="40" 
          height="40" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
  });

  return (
    <Marker position={[gym.latitude, gym.longitude]} icon={icon}>
      {children}
    </Marker>
  );
};

export default GymMarker;
