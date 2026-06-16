/**
 * @file GreetingSection.tsx
 * @description Greeting section that reads the registered user's name from
 * localStorage and displays a personalized salutation or welcome.
 */

import { useEffect, useState } from "react";

export function GreetingSection() {
  // Local reactive state default to standard placeholder name
  const [userName, setUserName] = useState("محمد");

  useEffect(() => {
    // Attempt lookup of the registered athlete names in client cache
    const storedName = localStorage.getItem("fitopia_user_name");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <section className="fade-in-up select-none" style={{ animationDelay: "0.1s" }} id="greeting-section">
      <h2 className="font-headline-md text-headline-md text-on-surface">سلام، {userName} 👋</h2>
      <p className="font-body-md text-on-surface-variant/70 mt-1">امروز آماده تمرین هستی؟</p>
    </section>
  );
}
