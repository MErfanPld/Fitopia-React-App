import { useState, useEffect, useRef } from "react";
import { Bell, Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";

export function Header() {
  const { logout, userData } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Close sidebar on small screens when navigating
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  const handleProfileClick = () => {
    setOpen(false);
    navigate("/profile");
  };

  const handleLogoutClick = async () => {
    setLoading(true);

    try {
      await logout();
      setOpen(false);
      navigate("/welcome", { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-20 md:h-16 flex items-center justify-between px-3 md:px-6 bg-gradient-to-b from-surface/95 via-surface/90 to-surface/80 backdrop-blur-xl border-b border-white/5 z-40 transition-all">
        
        {/* LEFT: Hamburger Menu */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2.5 hover:bg-white/10 rounded-lg transition-all hover:scale-105 active:scale-95 md:hidden"
          title="منو"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5 text-primary" />
          ) : (
            <Menu className="w-5 h-5 text-on-surface" />
          )}
        </button>

        {/* CENTER: Logo */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-lg md:text-2xl font-black text-primary tracking-wider bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">
            FITOPIA
          </h1>
        </div>

        {/* RIGHT: Notification + Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notification Bell */}
          <button 
            className="p-2.5 hover:bg-white/10 rounded-lg transition-all hover:scale-105 active:scale-95 relative group"
            title="اعلان‌ها"
          >
            <Bell size={20} className="text-on-surface group-hover:text-primary transition" strokeWidth={1.5} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={ref}>
            {/* Avatar Button - Simple Icon */}
            <button
              onClick={() => setOpen(!open)}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-surface-container border border-on-surface-variant/20 cursor-pointer overflow-hidden flex items-center justify-center hover:border-primary/50 hover:bg-on-surface-variant/10 transition-all"
              title="منو کاربر"
            >
              <User className="w-5 h-5 md:w-6 md:h-6 text-on-surface-variant" strokeWidth={1.5} />
            </button>

            {/* Dropdown Menu */}
            {open && (
              <div className="absolute left-0 md:left-auto md:right-0 top-12 w-56 bg-surface-container-high border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm z-50 animate-in fade-in slide-in-from-top-2">
                
                {/* Header */}
                <div className="px-4 py-4 border-b border-white/10 text-right bg-surface-container/50">
                  <p className="text-xs text-on-surface-variant font-medium">حساب کاربری</p>
                  <p className="text-sm text-white font-bold mt-1">{userData?.full_name || "کاربر فیتوپیا"}</p>
                </div>

                {/* Profile Button */}
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center justify-end gap-3 px-4 py-3 text-on-surface hover:bg-primary/10 hover:text-primary transition-all text-right border-b border-white/10 group"
                >
                  <span className="text-sm font-medium">پنل کاربر</span>
                  <User className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition" strokeWidth={1.5} />
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogoutClick}
                  disabled={loading}
                  className="w-full flex items-center justify-end gap-3 px-4 py-3 text-on-surface hover:bg-white/5 hover:text-on-surface transition-all text-right disabled:opacity-50 group"
                >
                  <span className="text-sm font-medium">
                    {loading ? "در حال خروج..." : "خروج"}
                  </span>
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Menu */}
      <SidebarMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
