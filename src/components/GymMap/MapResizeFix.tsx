import { useMap } from "react-leaflet";
import { useEffect } from "react";

function MapResizeFix() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
}

export default MapResizeFix;
