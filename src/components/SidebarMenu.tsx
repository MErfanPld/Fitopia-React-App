import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
      icon: 'workspace_premium',
      path: '/subscriptions/history',
    },
    {
      id: 'profile',
      label: 'پروفایل',
      icon: 'person',
      path: '/profile',
    },
    {
      id: 'bookings',
      label: 'رزروهای من',
      icon: 'event_available',
      path: '#',
      soon: true,
    },
    {
      id: 'favorites',
      label: 'باشگاه‌های مورد علاقه',
      icon: 'favorite',
      path: '#',
      soon: true,
    },
    {
      id: 'stats',
      label: 'آمار و تحلیل',
      icon: 'analytics',
      path: '#',
      soon: true,
    },
    {
      id: 'settings',
      label: 'تنظیمات',
      icon: 'settings',
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
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar with slide-in animation */}
      <div
        className={`fixed top-0 right-0 w-80 h-screen bg-surface z-50 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">
                account_circle
              </span>
            </div>
            <div>
              <p className="text-sm text-on-surface-variant">خوش‌آمدید</p>
              <p className="font-bold text-on-surface text-sm">{displayName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface">close</span>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
          {menuItems.map((item, index) => (
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
              <span className={`material-symbols-outlined ${item.soon ? '' : 'group-hover:text-primary'}`}>
                {item.icon}
              </span>
              <span className="flex-1 text-sm font-medium">{item.label}</span>
              {item.soon && (
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  به زودی
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Footer Actions */}
        <div className="p-4 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-red-500/10 text-red-400 transition-all group"
          >
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
              logout
            </span>
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
