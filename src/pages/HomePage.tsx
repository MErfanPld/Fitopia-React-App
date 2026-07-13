/**
 * @file HomePage.tsx
 * @description The primary dashboard page of FITOPIA. Handles layout rendering of:
 * - Fluid WebGL Shader background simulations
 * - Greeting headings
 * - PWA native app install campaigns
 * - Category filters for gyms
 * - Popular gyms showcase
 * - Nearby gyms map
 * - Token balance card
 * - Dynamic bottom sticky hot navigation
 */

import { useEffect } from "react";
import { Header } from "../components/Header";
import { GreetingSection } from "../components/GreetingSection";
import { PWAInstallButton } from "../components/PWAInstallButton";
import { TokenCard } from "../components/TokenCard";
import { CategorySlider } from "../components/CategorySlider";
import { PopularGyms } from "../components/PopularGyms";
import { NearbyGymsMap } from "../components/NearbyGymsMap";
import { BottomNavigation } from "../components/BottomNavigation";
import { ShaderBackground } from "../components/ShaderBackground";
import { ParticleOverlay } from "../components/ParticleOverlay";

export function HomePage() {
  // Sync page document title on load for custom SEO and tab branding
  useEffect(() => {
    document.title = "FITOPIA | داشبورد سلامت";
  }, []);

  return (
    <>
      {/* 1. Dynamic background fluid simulation */}
      <ShaderBackground />

      {/* 2. Floating floating embers particles */}
      <ParticleOverlay />

      {/* 3. Top Header navigation bar */}
      <Header />

      {/* 4. Main wellness workspace feed */}
      <main className="relative z-10 pt-24 pb-36 px-4 md:px-8 max-w-7xl mx-auto w-full select-none text-right">
        {/* Top greeting dashboard entry */}
        <div id="home-greeting-wrapper">
          <GreetingSection />
        </div>

        {/* PWA Install Button */}
        <div className="mb-6">
          <PWAInstallButton />
        </div>

        {/* Category Slider */}
        <CategorySlider />

        {/* Popular Gyms */}
        <PopularGyms />

        {/* Nearby Gyms Map */}
        <NearbyGymsMap />

        {/* Token Card - at the bottom */}
        {/* <div className="mt-8">
          <TokenCard />
        </div> */}
      </main>

      {/* 5. Bottom floating sticky action menu */}
      <BottomNavigation />
    </>
  );
}
