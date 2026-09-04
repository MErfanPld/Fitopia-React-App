/**
 * @file HomePage.tsx
 * Primary member dashboard — Fitopia Design System
 */

import { useEffect } from "react";
import { Header } from "../components/Header";
import { GreetingSection } from "../components/GreetingSection";
import PromoSlider from "../components/PromoSlider";
import { PWAInstallButton } from "../components/PWAInstallButton";
import { CategorySlider } from "../components/CategorySlider";
import { PopularGyms } from "../components/PopularGyms";
import { NearbyGymsMap } from "../components/NearbyGymsMap";
import { BottomNavigation } from "../components/BottomNavigation";
import { ShaderBackground } from "../components/ShaderBackground";
import { ParticleOverlay } from "../components/ParticleOverlay";

export function HomePage() {
  useEffect(() => {
    document.title = "FITOPIA | خانه";
  }, []);

  return (
    <>
      <ShaderBackground />
      <ParticleOverlay />
      <Header />

      <main className="page-shell section-gap select-none text-right">
        <div id="home-greeting-wrapper">
          <GreetingSection />
        </div>

        <PWAInstallButton />

        <PromoSlider />

        <CategorySlider />

        <PopularGyms />

        <NearbyGymsMap />
      </main>

      <BottomNavigation />
    </>
  );
}
