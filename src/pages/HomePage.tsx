/**
 * Fitopia Home — premium fitness shell v2
 */

import { useEffect } from "react";
import { Header } from "../components/Header";
import PromoSlider from "../components/PromoSlider";
import { PWAInstallButton } from "../components/PWAInstallButton";
import { QuickActions } from "../components/QuickActions";
import { CategorySlider } from "../components/CategorySlider";
import { PopularGyms } from "../components/PopularGyms";
import { NearbyGymsMap } from "../components/NearbyGymsMap";
import { BottomNavigation } from "../components/BottomNavigation";

export function HomePage() {
  useEffect(() => {
    document.title = "FITOPIA | خانه";
  }, []);

  return (
    <div className="min-h-dvh bg-[#07070A] text-right home-with-rail">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_at_top,_rgba(255,106,0,0.12),_transparent_60%)]"
      />

      <Header />

      <main className="relative z-10 home-shell home-pad pb-[calc(5.25rem+env(safe-area-inset-bottom))] lg:pb-10">
        <div className="flex flex-col gap-6 sm:gap-7 md:gap-8 max-w-3xl lg:max-w-4xl mx-auto">
          <PromoSlider />
          <PWAInstallButton />
          <QuickActions />
          <CategorySlider />
          <PopularGyms />
          <NearbyGymsMap />
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
