import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Plan {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  tokens: number;
  features: string[];
  isPopular?: boolean;
  isBestValue?: boolean;
  badge?: string;
}

const plans: Plan[] = [
  {
    id: 'bronze',
    name: 'پلن برنزی',
    nameEn: 'Bronze',
    price: 150000,
    tokens: 5,
    features: [
      'دسترسی به ۱۰ باشگاه اکونومی',
      'انقضای ۳۰ روزه',
    ],
  },
  {
    id: 'silver',
    name: 'پلن نقره‌ای',
    nameEn: 'Silver',
    price: 300000,
    tokens: 10,
    features: [
      'دسترسی به ۳۰ باشگاه استاندارد',
      'رزرو سریع کلاس‌های گروهی',
    ],
  },
  {
    id: 'gold',
    name: 'پلن طلایی',
    nameEn: 'Gold',
    price: 500000,
    tokens: 20,
    features: [
      'دسترسی به تمامی باشگاه‌های طلایی',
      'کمد اختصاصی رایگان',
      'مهمان رایگان (۱ بار در ماه)',
    ],
    isPopular: true,
  },
  {
    id: 'diamond',
    name: 'پلن الماس',
    nameEn: 'Diamond',
    price: 800000,
    tokens: 35,
    features: [
      'دسترسی به استخر و سونا',
      'آنالیز بدن رایگان (ماهانه)',
    ],
    isBestValue: true,
    badge: 'بهترین ارزش',
  },
  {
    id: 'vip',
    name: 'پلن VIP',
    nameEn: 'VIP',
    price: 1500000,
    tokens: 60,
    features: [
      'دسترسی به تمامی شعب FITOPIA',
      'پارکینگ اختصاصی',
    ],
  },
  {
    id: 'premium',
    name: 'پلن پریمیوم',
    nameEn: 'Premium',
    price: 2500000,
    tokens: 100,
    features: [
      'تمامی امکانات VIP',
      'مربی خصوصی (۴ جلسه در ماه)',
    ],
  },
];

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'توکن‌ها چگونه کار می‌کنند؟',
    answer:
      'هر ورود به باشگاه معادل تعداد مشخصی توکن است. باشگاه‌های اکونومی معمولاً ۱ توکن و باشگاه‌های لوکس تا ۳ توکن نیاز دارند.',
  },
  {
    id: 'faq-2',
    question: 'آیا توکن‌ها منقضی می‌شوند؟',
    answer:
      'بله، توکن‌های هر پلن ۳۰ روز پس از خرید اعتبار دارند. در صورت تمدید قبل از انقضا، توکن‌های قبلی به ماه بعد منتقل می‌شوند.',
  },
  {
    id: 'faq-3',
    question: 'چطور وارد باشگاه شویم؟',
    answer:
      'کافیست در اپلیکیشن QR کد موجود در پذیرش باشگاه را اسکن کنید. سیستم به طور خودکار توکن لازم را از حساب شما کسر می‌کند.',
  },
];

const Subscriptions: React.FC = () => {
  const navigate = useNavigate();
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const formatPrice = (price: number): string => {
    return price.toLocaleString('fa-IR');
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // Navigate to payment or show confirmation
    navigate(`/checkout/${planId}`, { state: { discount: discountEnabled } });
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface dark">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5 h-16 flex justify-between items-center px-4 md:px-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-primary/20 bg-surface-container overflow-hidden">
            <img
              className="w-full h-full object-cover"
              alt="FITOPIA Logo"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsBITmobSgiTjDYRC2pVNib9-Qrv_QUBPLqNmRddF9MXDGTwYE1c9MRWeiQdwa_ZBVCrDSrRzxt7rDHa-Lz_AyGrv_xtpS4cWw1EuaR3L0z8obKCdCZ3mgqXz0cC72QfodD5hA3DhgvUeaKCa-Z7jhxcZBbkUJHoix6QnC6l-asuijQ-jOW_RdhZyMXkLt9nHN4Xe-Ni6c4PFL0GWX3K_De8AHKrIGwp66V2JWqTKHVVlA-Yv3-6wyTUYxRcDeYC1-9DCJB-8eESFh"
            />
          </div>
          <span className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary">FITOPIA</span>
        </div>
        <button className="text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95 duration-200">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <main className="relative z-10 pt-24 pb-32 px-4 md:px-12 max-w-container-max mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface mb-2">پلن‌های اشتراک</h1>
          <p className="font-body-md text-on-surface-variant opacity-70">
            با هر پلن به باشگاه‌های منتخب دسترسی داشته باش
          </p>
        </section>

        {/* Discount Banner */}
        <div className="glass-panel rounded-xl p-4 mb-10 flex items-center justify-between border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">redeem</span>
            </div>
            <div>
              <p className="font-body-md text-on-surface font-semibold">شما ۱۲۰,۰۰۰ تومان تخفیف دارید</p>
              <p className="text-xs text-on-surface-variant opacity-60">قابل استفاده در تمامی پلن‌ها</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant">استفاده از تخفیف</span>
            <button
              onClick={() => setDiscountEnabled(!discountEnabled)}
              className={`w-11 h-6 rounded-full p-1 transition-all duration-300 ${
                discountEnabled ? 'bg-primary' : 'bg-surface-container-highest'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                  discountEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="space-y-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`glass-panel p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden transition-all duration-300 ${
                plan.isPopular ? 'plan-popular' : ''
              } ${plan.isBestValue ? 'border-secondary/30 bg-secondary/5' : ''}`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -left-10 top-6 -rotate-45 bg-primary px-12 py-1 text-[10px] font-bold text-on-primary shadow-lg uppercase tracking-widest">
                  پرطرفدار
                </div>
              )}

              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline-md text-on-surface">{plan.name}</h3>
                    {plan.isBestValue && (
                      <span className="bg-secondary/20 text-secondary text-[10px] px-2 py-0.5 rounded-full border border-secondary/30">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-primary font-bold mt-1">{formatPrice(plan.price)} تومان</p>
                </div>
                <div
                  className={`rounded-lg px-3 py-1 flex items-center gap-1 ${
                    plan.isPopular ? 'bg-primary/20 border border-primary/30' : 'bg-surface-container'
                  }`}
                >
                  <span className={`font-bold ${plan.isPopular ? 'text-primary' : ''}`}>{plan.tokens}</span>
                  <span className={`text-xs ${plan.isPopular ? 'text-primary' : 'text-on-surface-variant'}`}>توکن</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2 py-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-on-surface-variant/80">
                    <span
                      className={`material-symbols-outlined text-lg ${
                        plan.isPopular ? 'text-primary' : 'text-primary'
                      }`}
                      style={plan.isPopular && index === 0 ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {plan.isPopular && index === 0 ? 'stars' : 'check_circle'}
                    </span>
                    <span className={plan.isPopular && index === 0 ? 'text-on-surface font-medium' : ''}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`amber-gradient py-3 rounded-xl font-bold text-on-primary active:scale-95 transition-all duration-200 ${
                  plan.isPopular ? 'shadow-[0_0_20px_rgba(255,106,0,0.4)] font-extrabold' : ''
                }`}
              >
                انتخاب پلن
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <section className="mt-16 mb-24">
          <h2 className="font-headline-md text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">help_outline</span>
            سوالات متداول
          </h2>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="glass-panel rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full flex justify-between items-center p-5 text-right transition-colors hover:bg-white/5"
                >
                  <span className="font-body-md font-semibold text-on-surface">{faq.question}</span>
                  <span
                    className="material-symbols-outlined text-on-surface-variant transition-transform duration-300"
                    style={{
                      transform: activeAccordion === faq.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    expand_more
                  </span>
                </button>

                {activeAccordion === faq.id && (
                  <div className="px-5 pb-5 border-t border-white/5">
                    <p className="text-sm text-on-surface-variant leading-relaxed opacity-80">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-surface-container/90 backdrop-blur-xl border-t border-white/5 rounded-t-xl z-50 shadow-[0_-4px_20px_rgba(255,106,0,0.05)]">
        <NavItem icon="home" label="خانه" href="/" />
        <NavItem icon="search" label="جستجو" href="/search" />
        <NavItem
          icon="workspace_premium"
          label="اشتراک"
          href="/subscriptions"
          isActive={true}
          filled={true}
        />
        <NavItem icon="person" label="پروفایل" href="/profile" />
      </nav>
    </div>
  );
};

interface NavItemProps {
  icon: string;
  label: string;
  href: string;
  isActive?: boolean;
  filled?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, href, isActive = false, filled = false }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(href)}
      className={`flex flex-col items-center justify-center transition-all duration-300 ease-out ${
        isActive
          ? 'text-primary bg-primary/10 rounded-xl px-4 py-1 active:scale-90'
          : 'text-on-surface-variant/60 hover:text-primary/80 active:scale-90'
      }`}
    >
      <span
        className="material-symbols-outlined"
        style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}
      >
        {icon}
      </span>
      <span className="font-label-sm text-label-sm">{label}</span>
    </button>
  );
};

export default Subscriptions;
