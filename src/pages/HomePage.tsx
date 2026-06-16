/**
 * @file HomePage.tsx
 * @description The primary dashboard page of FITOPIA. Handles layout rendering of:
 * - Fluid WebGL Shader background simulations
 * - Greeting headings
 * - PWA native app install campaigns
 * - Virtual token balances
 * - Partner fitness sports complex maps and filters
 * - Recent fitness/activity logs
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
import { QuickActions } from "../components/QuickActions";
import { ActivityList } from "../components/ActivityList";
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
      <main className="relative z-10 pt-24 pb-32 px-4 max-w-7xl mx-auto w-full select-none text-right">
        <div className="space-y-12" id="home-dashboard-layout">
          
          {/* Greeting Hero Section */}
          <GreetingSection />

          {/* Direct PWA Install Campaign Prompt */}
          <PWAInstallButton />

          {/* Token Card section */}
          <TokenCard />

          {/* Categories Selector */}
          <CategorySlider />

          {/* Popular partner gyms */}
          <PopularGyms />

          {/* Nearby partner gyms Map view */}
          <NearbyGymsMap />

          {/* Advanced Quick Trigger Action cards */}
          <QuickActions />

          {/* Fitness Logs activities registry */}
          <ActivityList />

        </div>
      </main>

      {/* 5. Bottom floating sticky action menu */}
      <BottomNavigation />
    </>
  );
}
