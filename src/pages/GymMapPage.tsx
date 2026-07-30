/**
 * @file GymMapPage.tsx
 * @description Interactive gym map page with location-based gym finder
 */

import { useEffect } from "react";
import { BottomNavigation } from "../components/BottomNavigation";
import { GymMap } from "../components/GymMap";
import { ShaderBackground } from "../components/ShaderBackground";
import { ParticleOverlay } from "../components/ParticleOverlay";

export function GymMapPage() {
  useEffect(() => {
    document.title = "FITOPIA | نقشه باشگاه‌ها";
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Dynamic background */}
      <ShaderBackground />
      <ParticleOverlay />

      {/* Map - Full screen */}
      <div className="absolute inset-0 z-0">
        <GymMap />
      </div>

      {/* Fixed Header - Top */}
      {/* <div className="absolute top-0 left-0 right-0 z-20">
        <Header />
      </div> */}

      {/* Fixed Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <BottomNavigation />
      </div>

      {/* Optional: Fixed controls overlay */}
      <div className="absolute top-24 right-4 z-10 flex flex-col gap-2">
        {/* Add any floating controls here if needed */}
      </div>
    </div>
  );
}
