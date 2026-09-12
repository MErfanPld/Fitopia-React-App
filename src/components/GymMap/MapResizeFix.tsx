import { useMap } from "react-leaflet";
import { useEffect } from "react";

/** Keep Leaflet sized when parent/panel layout changes */
function MapResizeFix({ panelKey }: { panelKey?: string }) {
  const map = useMap();

  useEffect(() => {
    const invalidate = () => {
      map.invalidateSize({ animate: false });
    };

    invalidate();
    const t1 = window.setTimeout(invalidate, 50);
    const t2 = window.setTimeout(invalidate, 250);
    const t3 = window.setTimeout(invalidate, 500);

    window.addEventListener("resize", invalidate);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.removeEventListener("resize", invalidate);
    };
  }, [map, panelKey]);

  return null;
}

export default MapResizeFix;
