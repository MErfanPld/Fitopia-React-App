/**
 * Premium discovery search — navigates to /gym/all with optional query.
 * Does not invent search backend; reuses AllGymsPage client filter.
 */

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HomeSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (term) {
      navigate(`/gym/all?q=${encodeURIComponent(term)}`);
    } else {
      navigate("/gym/all");
    }
  };

  return (
    <form onSubmit={submit} role="search" aria-label="جستجوی باشگاه و فعالیت" className="w-full">
      <label className="sr-only" htmlFor="home-search">
        جستجو
      </label>
      <div className="relative flex items-center">
        <Search
          size={20}
          strokeWidth={1.85}
          className="pointer-events-none absolute end-4 z-10 text-white/40"
          aria-hidden
        />
        <input
          id="home-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="باشگاه، ورزش یا فعالیت..."
          enterKeyHint="search"
          autoComplete="off"
          className="w-full min-h-[3.25rem] rounded-2xl border border-white/[0.09] bg-[#121216] pe-12 ps-4 text-[0.9375rem] text-white placeholder:text-white/35 outline-none transition-[border-color,box-shadow] focus:border-[#FF6A00]/55 focus:shadow-[0_0_0_3px_rgba(255,106,0,0.12)]"
        />
      </div>
    </form>
  );
}
