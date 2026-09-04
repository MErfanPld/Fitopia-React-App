/**
 * Home — premium member shell (Header, Hero, Quick Actions, discovery).
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
import { ShaderBackground } from "../components/ShaderBackground";

export function HomePage() {
  useEffect(() => {
    document.title = "FITOPIA | خانه";
  }, []);

  return (
    <>
      <ShaderBackground />
      <Header />

      <main className="relative z-10 mx-auto w-full max-w-3xl px-4 pt-[calc(3.75rem+env(safe-area-inset-top))] pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pt-20">
        <div className="flex flex-col gap-5 md:gap-6 text-right">
          <PromoSlider />

          <PWAInstallButton />

          <QuickActions />

          <CategorySlider />

          <PopularGyms />

          <NearbyGymsMap />
        </div>
      </main>

      <BottomNavigation />
    </>
  );
}
