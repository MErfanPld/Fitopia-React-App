/**
 * @file Header.tsx
 * @description Pinned navigation top bar containing the app title 'FITOPIA',
 * localized athlete profile avatar pictures, and an interactive notifications bell.
 */

import { useState } from "react";
import { Bell } from "lucide-react";

export function Header() {
  // Simple state tracker for unviewed profile warning/success alerts
  const [unreadNotifications, setUnreadNotifications] = useState(1);

  // Triggers alert dialog on press to mock receiving fresh workout tokens
  const handleNotificationClick = () => {
    if (unreadNotifications > 0) {
      alert("اعلان جدید:\nشما ۲۴ توکن فیتوپیا با موفقیت دریافت کردید!");
      setUnreadNotifications(0);
    } else {
      alert("اعلان جدیدی وجود ندارد.");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-4 h-16 select-none">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-primary/20">
          <img
            alt="User Profile"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKEwiGCrqAbdQWGW67UNCzrUoHvCSD53WoXymywAH4QDrhPX9GDeLCoCQgZYWgcT3AqfQ1_0MsGp0-fk355uN_LUTumQCTbx44QeSoj3xgc6nGH9q7hYbhngJXssxwAYU4HK9KxfF4IsFQfG5Z6rR7hIhN8Yy98K6vQ_PPVKU78QhaQQaRXbCpEvV25igN2DURVZX-RpUVRhv-vk8ghZXMlWs0vh_Ekba_eOGbkIi2EFrO2LjdzSGSO_KuDUyRTdKjdTlj88Cz9YPD"
          />
        </div>
      </div>

      <h1 className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary">
        FITOPIA
      </h1>

      <div
        onClick={handleNotificationClick}
        className="relative active:scale-95 transition-transform duration-200 cursor-pointer w-8 h-8 flex items-center justify-center"
      >
        <Bell className="text-primary w-6 h-6 hover:brightness-110 active:brightness-90 transition-all" />
        {unreadNotifications > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full shadow-[0_0_8px_rgba(255,180,171,0.8)]" />
        )}
      </div>
    </header>
  );
}
