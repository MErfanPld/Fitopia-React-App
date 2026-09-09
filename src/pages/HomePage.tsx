/**
 * Fitopia Home — fitness discovery marketplace
 * Hierarchy: Header → Search → Hero → Actions → Categories → Nearby → Popular → Membership
 * Real API data only; no fake metrics or recommendations.
 */

import { useEffect } from "react";
import { Header } from "../components/Header";
import { HomeSearch } from "../components/HomeSearch";
import PromoSlider from "../components/PromoSlider";
import { QuickActions } from "../components/QuickActions";
import { CategorySlider } from "../components/CategorySlider";
import { NearbyGymsMap } from "../components/NearbyGymsMap";
import { PopularGyms } from "../components/PopularGyms";
import { MembershipHero } from "../components/home/MembershipHero";
import { QuickStats } from "../components/home/QuickStats";
import { PWAInstallButton } from "../components/PWAInstallButton";
import { BottomNavigation } from "../components/BottomNavigation";

export function HomePage() {
  useEffect(() => {
    document.title = "FITOPIA | خانه";
  }, []);

  return (
    <div className="min-h-dvh bg-[#07070A] text-right home-with-rail">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,_rgba(255,106,0,0.08),_transparent_60%)]"
      />

      <Header showGreeting />

      <main className="relative z-10 home-shell home-pad pb-[calc(6.75rem+env(safe-area-inset-bottom))] md:pb-12">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 sm:gap-6 lg:max-w-4xl xl:max-w-5xl">
          <HomeSearch />
          <PromoSlider />
          <QuickActions />
          <CategorySlider />
          <NearbyGymsMap />
          <PopularGyms />
          <MembershipHero />
          <QuickStats />
          <PWAInstallButton />
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
