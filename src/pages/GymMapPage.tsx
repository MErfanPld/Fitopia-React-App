/**
 * Full-screen nearby gym map
 * Route: /gym-map
 * Layout: fixed viewport — map + overlay panel always together
 */

import { useEffect } from "react";
import { Header } from "../components/Header";
import { BottomNavigation } from "../components/BottomNavigation";
import { GymMap } from "../components/GymMap";

export function GymMapPage() {
  useEffect(() => {
    document.title = "FITOPIA | نقشه باشگاه‌ها";
  }, []);

  return (
    <div className="home-with-rail relative bg-[#07070A]">
      <Header />
      {/* Explicit viewport height so map never collapses to 0 */}
      <main
        className="fixed inset-0 z-0 pt-14 pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] md:pt-16 md:pb-3"
        style={{ boxSizing: "border-box" }}
      >
        <div className="relative h-full w-full overflow-hidden">
          <GymMap />
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
