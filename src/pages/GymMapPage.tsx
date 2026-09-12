/**
 * Full-screen nearby gym map
 * Route: /gym-map
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
    <div className="relative flex min-h-dvh flex-col bg-[#07070A] home-with-rail">
      <Header />
      <main className="relative z-0 flex min-h-0 flex-1 flex-col pt-14 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pt-16 md:pb-4">
        <div className="min-h-0 flex-1">
          <GymMap />
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
