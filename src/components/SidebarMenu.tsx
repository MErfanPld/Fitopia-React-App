import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Smartphone, 
  User, 
  Calendar, 
  Heart, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronLeft 
} from 'lucide-react';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarMenu: FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
  const { displayName, logout } = useAuth();

  const menuItems = [
    {
      id: 'subscriptions',
      label: 'تاریخچه اشتراک‌ها',
      icon: Smartphone,
      path: '/subscriptions/history',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'profile',
      label: 'پروفایل',
      icon: User,
      path: '/profile',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'bookings',
      label: 'رزروهای من',
      icon: Calendar,
      path: '#',
      soon: true,
      color: 'from-pink-500 to-pink-600',
    },
    {
      id: 'favorites',
      label: 'باشگاه‌های مورد علاقه',
      icon: Heart,
      path: '#',
      soon: true,
      color: 'from-red-500 to-red-600',
    },
    {
      id: 'stats',
      label: 'آمار و تحلیل',
      icon: BarChart3,
      path: '#',
      soon: true,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'settings',
      label: 'تنظیمات',
      icon: Settings,
      path: '#',
      soon: true,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-40 z-30' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-72 md:w-80 max-w-[90vw] bg-gradient-to-b from-surface-container via-surface to-surface-container-low z-50 shadow-2xl transform transition-all duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header Section */}
        <div className="flex-shrink-0 pt-6 px-6 pb-4 border-b border-white/10 bg-gradient-to-b from-primary/10 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-yellow-500/10 flex items-center justify-center flex-shrink-0 border border-primary/20 shadow-lg shadow-primary/10">
              <User className="text-primary w-7 h-7" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-on-surface-variant font-medium tracking-wide">خوش‌آمدید به</p>
              <p className="font-black text-on-surface text-sm mt-0.5 truncate bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">
                {displayName}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items - Scrollable */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={item.soon ? (e) => e.preventDefault() : onClose}
                style={{
                  animationDelay: isOpen ? `${index * 40}ms` : '0ms',
                }}
                className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                  item.soon
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent text-on-surface hover:text-primary hover:pl-5'
                } ${isOpen ? 'animate-in fade-in slide-in-from-right-4' : ''}`}
              >
                {/* Icon Background */}
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-md transition-all group-hover:shadow-lg group-hover:scale-110 ${item.soon ? 'opacity-40' : ''}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {/* Label */}
                <span className="flex-1 text-sm font-semibold min-w-0 transition-all">
                  {item.label}
                </span>

                {/* Soon Badge or Arrow */}
                {item.soon ? (
                  <span className="text-xs px-2.5 py-1 bg-primary/20 text-primary rounded-full flex-shrink-0 font-bold tracking-wider">
                    به زودی
                  </span>
                ) : (
                  <ChevronLeft className="w-5 h-5 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Footer - Logout (Always Visible) */}
        <div className="p-4 space-y-2 bg-gradient-to-t from-surface-container/50 to-transparent">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/5 hover:from-red-500/20 hover:to-red-600/15 text-red-400 hover:text-red-300 transition-all group border border-red-500/20 hover:border-red-500/40"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
              <LogOut className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold flex-1 text-right">خروج از حساب</span>
            <ChevronLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 106, 0, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 106, 0, 0.5);
        }
      `}</style>
    </>
  );
};

export default SidebarMenu;
