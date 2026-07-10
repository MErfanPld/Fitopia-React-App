/**
 * @file GymMapPage.tsx
 * @description Interactive gym map page with location-based gym finder
 */

import { useEffect } from "react";
import { Header } from "../components/Header";
import { BottomNavigation } from "../components/BottomNavigation";
import { GymMap } from "../components/GymMap";
import { ShaderBackground } from "../components/ShaderBackground";
import { ParticleOverlay } from "../components/ParticleOverlay";

export function GymMapPage() {
  useEffect(() => {
    document.title = "FITOPIA | نقشه باشگاه‌ها";
  }, []);

  return (
    <>
      {/* Dynamic background */}
      <ShaderBackground />
      <ParticleOverlay />

      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="relative z-10 pt-24 pb-36 px-4 md:px-8 max-w-7xl mx-auto w-full text-right">
        <GymMap />
      </main>

      {/* Bottom navigation */}
      <BottomNavigation />
    </>
  );
}
