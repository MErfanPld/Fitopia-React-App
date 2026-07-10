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
  CreditCard,
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
    },
    {
      id: 'payment',
      label: 'درخواست پرداخت',
      icon: CreditCard,
      path: '/subscriptions/payment',
    },
    {
      id: 'profile',
      label: 'پروفایل',
      icon: User,
      path: '/profile',
    },
    {
      id: 'bookings',
      label: 'رزروهای من',
      icon: Calendar,
      path: '#',
      soon: true,
    },
    {
      id: 'favorites',
      label: 'باشگاه‌های مورد علاقه',
      icon: Heart,
      path: '#',
      soon: true,
    },
    {
      id: 'stats',
      label: 'آمار و تحلیل',
      icon: BarChart3,
      path: '#',
      soon: true,
    },
    {
      id: 'settings',
      label: 'تنظیمات',
      icon: Settings,
      path: '#',
      soon: true,
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
            <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center flex-shrink-0 border border-white/10">
              <User className="text-on-surface-variant w-7 h-7" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-on-surface-variant font-medium tracking-wide">خوش‌آمدید به</p>
              <p className="font-black text-on-surface text-sm mt-0.5 truncate">
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
                    : 'hover:bg-white/5 text-on-surface hover:text-primary hover:pl-5'
                } ${isOpen ? 'animate-in fade-in slide-in-from-right-4' : ''}`}
              >
                {/* Icon - Simple and clean */}
                <div className="flex-shrink-0">
                  <Icon className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" strokeWidth={1.5} />
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
                  <ChevronLeft className="w-5 h-5 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0" strokeWidth={1.5} />
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
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-on-surface-variant hover:text-on-surface transition-all"
          >
            <div className="flex-shrink-0">
              <LogOut className="w-5 h-5 text-on-surface-variant hover:text-on-surface transition-colors" strokeWidth={1.5} />
            </div>
            <span className="text-sm font-semibold flex-1 text-right">خروج از حساب</span>
            <ChevronLeft className="w-5 h-5 transition-transform flex-shrink-0" strokeWidth={1.5} />
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
