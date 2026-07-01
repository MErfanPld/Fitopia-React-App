import { useState, useEffect, useRef } from "react";
import { LogOut, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";

export function Header() {
  const { logout, userData } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  // Load avatar from userData
  useEffect(() => {
    if (userData?.avatar) {
      setAvatarUrl(userData.avatar);
    }
  }, [userData?.avatar]);

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
      <header className="fixed top-0 left-0 w-full h-16 flex justify-between items-center px-4 bg-black/40 backdrop-blur z-[9999]">

        {/* HAMBURGER MENU */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          title="منو"
        >
          <span className="material-symbols-outlined text-white">menu</span>
        </button>

        {/* TITLE */}
        <h1 className="text-white font-bold">FITOPIA</h1>

        {/* RIGHT SIDE - PROFILE + NOTIFICATION */}
        <div className="flex items-center gap-4">
          {/* NOTIFICATION */}
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Bell size={20} className="text-white cursor-pointer hover:text-primary transition" />
          </button>

          {/* PROFILE */}
          <div className="relative" ref={ref}>

            {/* AVATAR */}
            <div
              onClick={() => setOpen((p) => !p)}
              className="w-10 h-10 rounded-full bg-primary cursor-pointer overflow-hidden flex items-center justify-center hover:ring-2 hover:ring-primary/50 transition"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="w-6 h-6 text-on-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </div>

            {/* DROPDOWN */}
            {open && (
              <div className="absolute left-0 mt-3 w-56 bg-surface-container-low border border-white/10 rounded-2xl shadow-xl overflow-hidden">

                {/* header */}
                <div className="px-4 py-3 border-b border-white/10 text-right">
                  <p className="text-xs text-on-surface-variant">حساب کاربری</p>
                  <p className="text-sm text-on-surface font-bold">{userData?.full_name || "کاربر فیتوپیا"}</p>
                </div>

                {/* Profile button */}
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center justify-end gap-2 px-4 py-3 text-on-surface hover:bg-white/5 transition text-right border-b border-white/10"
                  style={{ direction: "rtl" }}
                >
                  <span className="text-sm font-medium">پنل کاربر</span>
                  <svg className="w-5 h-5 text-on-surface-variant" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </button>

                {/* logout button */}
                <button
                  onClick={handleLogoutClick}
                  disabled={loading}
                  className="w-full flex items-center justify-end gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 transition text-right disabled:opacity-50"
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
        </div>

      </header>

      {/* Sidebar Menu */}
      <SidebarMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
