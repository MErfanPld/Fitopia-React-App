/**
 * Fitopia Home — premium member experience
 * Hierarchy: Header → Membership → Stats → Actions → Discovery
 */

import { useEffect } from "react";
import { Header } from "../components/Header";
import PromoSlider from "../components/PromoSlider";
import { PWAInstallButton } from "../components/PWAInstallButton";
import { MembershipHero } from "../components/home/MembershipHero";
import { QuickStats } from "../components/home/QuickStats";
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
    <div className="min-h-dvh bg-[#07070A] text-right home-with-rail overflow-x-hidden overflow-y-visible">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_at_top,_rgba(255,106,0,0.1),_transparent_65%)]"
      />

      <Header />

      <main className="relative z-10 home-shell home-pad pb-[calc(6.75rem+env(safe-area-inset-bottom))] lg:pb-12">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 sm:gap-7 lg:max-w-4xl">
          <MembershipHero />
          <QuickStats />
          <QuickActions />
          <PromoSlider />
          <PWAInstallButton />
          <CategorySlider />
          <PopularGyms />
          <NearbyGymsMap />
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
