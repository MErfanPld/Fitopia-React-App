/**
 * @file usePWA.ts
 * @description Advanced React Custom Hook for tracking Progressive Web App (PWA) lifecycle.
 * Manages:
 * - Real-time online/offline connectivity status
 * - Intercepting and deferring the browser's native installation prompt
 * - Automatic background service worker updates and notification state
 */

import { useState, useEffect } from "react";

/**
 * Custom interface for the standard of browser beforeinstallprompt support.
 */
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWA() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // 1. Connectivity Status Handlers
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 2. Installation Prompt Events
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent browser default installer menu banner
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If app is already running in standalone display mode (installed)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstallable(false);
    }

    // 3. Service Worker Update Detection
    // We register a callback on navigator.serviceWorker to see if there is an update waiting
    let isInsideIframe = false;
    try {
      isInsideIframe = window.self !== window.top;
    } catch {
      isInsideIframe = true;
    }

    if ("serviceWorker" in navigator && !isInsideIframe) {
      navigator.serviceWorker.ready
        .then((reg) => {
          setSwRegistration(reg);
          
          // Check if an update is already waiting (installed status)
          if (reg.waiting) {
            setUpdateAvailable(true);
          }

          // Listen for new service worker being installed
          reg.addEventListener("updatefound", () => {
            const newSW = reg.installing;
            if (newSW) {
              newSW.addEventListener("statechange", () => {
                if (newSW.state === "installed" && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn("FITOPIA PWA: Service worker ready probe bypassed inside iframe container:", err);
        });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Trigger Native Install Prompt
  const installApp = async () => {
    if (!deferredPrompt) return false;
    
    // Show prompt overlay
    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the FITOPIA installer prompt");
      setIsInstallable(false);
      setDeferredPrompt(null);
      return true;
    } else {
      console.log("User dismissed the FITOPIA installer prompt");
      return false;
    }
  };

  // Perform Service Worker Update
  const updateApp = () => {
    if (swRegistration && swRegistration.waiting) {
      // Send postmessage to active service worker to prompt SKIP_WAITING
      swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
      
      // Reload page to activate the update
      window.location.reload();
    }
  };

  return {
    isOffline,
    isInstallable,
    updateAvailable,
    installApp,
    updateApp,
  };
}
