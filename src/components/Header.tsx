import { useState, useEffect, useRef } from "react";
import { LogOut, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  // close outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogoutClick = async () => {
    setLoading(true);

    try {
      await logout();

      setOpen(false); // ✅ درست
      navigate("/welcome", { replace: true });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 flex justify-between items-center px-4 bg-black/40 backdrop-blur z-[9999]">

      {/* PROFILE */}
      <div className="relative" ref={ref}>

        {/* AVATAR */}
        <div
          onClick={() => setOpen((p) => !p)}
          className="w-10 h-10 rounded-full bg-orange-500 cursor-pointer"
        />

        {/* DROPDOWN */}
        {open && (
          <div className="absolute right-0 mt-3 w-56 bg-black/90 border border-white/10 rounded-2xl shadow-xl overflow-hidden">

            {/* header */}
            <div className="px-4 py-3 border-b border-white/10 text-right">
              <p className="text-xs text-white/50">حساب کاربری</p>
              <p className="text-sm text-white font-bold">پنل کاربر</p>
            </div>

            {/* logout button */}
            <button
              onClick={handleLogoutClick}
              disabled={loading}
              className="w-full flex items-center justify-end gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 transition text-right"
              style={{ direction: "rtl" }}
            >
              <span className="text-sm font-medium">
                {loading ? "در حال خروج..." : "خروج از حساب"}
              </span>

              <LogOut size={16} />
            </button>

          </div>
        )}

      </div>

      {/* TITLE */}
      <h1 className="text-white font-bold">FITOPIA</h1>

      {/* NOTIFICATION */}
      <Bell className="text-white cursor-pointer" />

    </header>
  );
}