/**
 * @file GreetingSection.tsx
 * @description Greeting section that reads the registered user's name or username from
 * localStorage, validates it against phone-number-like layouts, and displays a personalized salutation.
 */

import { useEffect, useState } from "react";

/**
 * Helper to check if a string consists entirely of physical phone-number-like characters
 * (numbers, spaces, dashes, parentheses, or a leading plus).
 */
function isPhoneNumber(str: string): boolean {
  if (!str) return false;
  const clean = str.trim().replace(/[\s\-()]/g, "");
  return /^\+?\d+$/.test(clean);
}

export function GreetingSection() {
  // Local reactive state default to Persian User fallback
  const [userName, setUserName] = useState("کاربر عزیز");

  useEffect(() => {
    let displayName = "";

    // 1. Try parsing full user information stored as responseData during login
    const storedDataStr = localStorage.getItem("fitopia_user_data");
    if (storedDataStr) {
      try {
        const userData = JSON.parse(storedDataStr);
        if (userData && typeof userData === "object") {
          // Check nested/parent attributes for full_name
          const fullNameCandidate = 
            userData.full_name || 
            userData.user?.full_name || 
            userData.profile?.full_name;

          // Check nested/parent attributes for username
          const usernameCandidate = 
            userData.username || 
            userData.user?.username || 
            userData.user_name || 
            userData.user?.user_name;

          if (fullNameCandidate && !isPhoneNumber(fullNameCandidate)) {
            displayName = fullNameCandidate;
          } else if (usernameCandidate && !isPhoneNumber(usernameCandidate)) {
            displayName = usernameCandidate;
          }
        }
      } catch (e) {
        console.error("Error parsing stored user data", e);
      }
    }

    // 2. Fallback to basic user name stored directly in localStorage
    if (!displayName) {
      const rawStoredName = localStorage.getItem("fitopia_user_name");
      if (rawStoredName && !isPhoneNumber(rawStoredName)) {
        displayName = rawStoredName;
      }
    }

    // 3. Fallback to default if nothing valid was extracted
    if (!displayName) {
      displayName = "کاربر عزیز";
    }

    setUserName(displayName);
  }, []);

  return (
    <section className="fade-in-up select-none" style={{ animationDelay: "0.1s" }} id="greeting-section">
      <h2 className="font-headline-md text-headline-md text-on-surface">سلام، {userName} 👋</h2>
      <p className="font-body-md text-on-surface-variant/70 mt-1">امروز آماده تمرین هستی؟</p>
    </section>
  );
}
