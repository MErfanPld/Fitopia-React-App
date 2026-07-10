import { Marker } from 'react-leaflet';
import L from 'leaflet';
import type { Gym } from '../../types/gym';

interface GymMarkerProps {
  gym: Gym;
  children: React.ReactNode;
}

const GymMarker = ({ gym, children }: GymMarkerProps) => {
  // Custom icon with gradient background
  const icon = L.divIcon({
    className: `gym-marker ${gym.is_popular ? 'popular' : ''}`,
    html: `
      <div class="marker-icon">
        <div class="marker-content">💪</div>
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
