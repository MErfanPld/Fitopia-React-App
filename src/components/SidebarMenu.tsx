import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Smartphone, 
  User, 
  Calendar, 
  Heart, 
  BarChart3, 
  Settings, 
  LogOut 
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
      {/* Overlay with fade animation */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar with slide-in animation */}
      <div
        className={`fixed top-0 right-0 w-80 max-w-[90vw] h-screen bg-surface z-50 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col overflow-hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <User className="text-primary w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-on-surface-variant">خوش‌آمدید</p>
              <p className="font-bold text-on-surface text-sm truncate">{displayName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors flex-shrink-0"
          >
            <svg className="w-6 h-6 text-on-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={item.soon ? (e) => e.preventDefault() : onClose}
                style={{
                  animation: isOpen ? `slideInMenuItem 0.3s ease-out ${index * 50}ms forwards` : 'none',
                  opacity: 0,
                }}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                  item.soon
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-primary/10 text-on-surface group'
                }`}
              >
                <Icon className={`w-6 h-6 flex-shrink-0 ${item.soon ? '' : 'group-hover:text-primary'}`} />
                <span className="flex-1 text-sm font-medium min-w-0">{item.label}</span>
                {item.soon && (
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full flex-shrink-0">
                    به زودی
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-white/10 flex-shrink-0" />

        {/* Footer Actions */}
        <div className="p-4 space-y-2 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-red-500/10 text-red-400 transition-all group"
          >
            <LogOut className="w-6 h-6 group-hover:scale-110 transition-transform flex-shrink-0" />
            <span className="text-sm font-medium">خروج از حساب</span>
          </button>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes slideInMenuItem {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default SidebarMenu;
