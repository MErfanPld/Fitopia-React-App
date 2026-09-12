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
    <div className="relative min-h-dvh bg-[#07070A] home-with-rail">
      <Header />
      <main className="relative z-0 h-[100dvh] w-full pt-14 md:pt-16">
        <GymMap />
      </main>
      <BottomNavigation />
    </div>
  );
}
