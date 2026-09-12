import { useMap } from "react-leaflet";
import { useEffect } from "react";

/** Invalidate size after mount (flex/fullscreen layout). */
function MapResizeFix() {
  const map = useMap();

  useEffect(() => {
    const t = window.setTimeout(() => {
      map.invalidateSize();
    }, 120);
    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [map]);

  return null;
}

export default MapResizeFix;
