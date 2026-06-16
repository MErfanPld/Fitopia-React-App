import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';

export default defineConfig(() => {
  // Automated PWA asset generation: Copy glowing design brand logo to PWA icon targets
  try {
    const logoSrc = path.resolve(__dirname, 'src/assets/images/fitopia_logo_1781635521671.jpg');
    const publicIconsDir = path.resolve(__dirname, 'public/icons');
    
    if (!fs.existsSync(publicIconsDir)) {
      fs.mkdirSync(publicIconsDir, { recursive: true });
    }
    
    if (fs.existsSync(logoSrc)) {
      fs.copyFileSync(logoSrc, path.join(publicIconsDir, 'icon-512.png'));
      fs.copyFileSync(logoSrc, path.join(publicIconsDir, 'icon-192.png'));
    }
  } catch (err) {
    console.warn("PWA asset pre-sync warning:", err);
  }

  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: false,
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'font-face-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/lh3\.googleusercontent\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'image-api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        },
        manifest: {
          name: "FITOPIA",
          short_name: "FITOPIA",
          description: "FITOPIA - پلتفرم ورزشی هوشمند و جامع تناسب اندام ایرانیان",
          start_url: "/home",
          display: "standalone",
          orientation: "portrait",
          background_color: "#07070A",
          theme_color: "#FF6A00",
          lang: "fa-IR",
          dir: "rtl",
          categories: ["sports", "health", "fitness"],
          icons: [
            {
              src: "icons/icon.svg",
              sizes: "192x192 512x512",
              type: "image/svg+xml",
              purpose: "any"
            },
            {
              src: "icons/maskable-icon.svg",
              sizes: "192x192 512x512",
              type: "image/svg+xml",
              purpose: "maskable"
            },
            {
              src: "icons/icon-192.png",
              sizes: "192x192",
              type: "image/png"
            },
            {
              src: "icons/icon-512.png",
              sizes: "512x512",
              type: "image/png"
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
