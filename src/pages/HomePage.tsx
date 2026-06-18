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
      <main className="relative z-10 pt-24 pb-36 px-4 md:px-8 max-w-7xl mx-auto w-full select-none text-right">
        {/* Top greeting dashboard entry */}
        <div className="mb-8" id="home-greeting-wrapper">
          <GreetingSection />
        </div>

        {/* Responsive grid: Stack on mobile, side-by-side bento blocks on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="home-dashboard-layout">
          
          {/* Main workout-related selectors & logs (Span 8 on desktop, ordered 2nd for semantic RTL alignment) */}
          <div className="lg:col-span-8 lg:order-2 space-y-10 w-full overflow-hidden">
            <PWAInstallButton />
            <CategorySlider />
            <PopularGyms />
            <ActivityList />
          </div>

          {/* Quick Balance, Actions, & Location widgets (Span 4 on desktop, ordered 1st for LHS placement) */}
          <div className="lg:col-span-4 lg:order-1 space-y-10 w-full lg:sticky lg:top-24">
            <TokenCard />
            <QuickActions />
            <NearbyGymsMap />
          </div>

        </div>
      </main>

      {/* 5. Bottom floating sticky action menu */}
      <BottomNavigation />
    </>
  );
}
