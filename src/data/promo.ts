export type Promo = {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
};

export const promoSlides: Promo[] = [
  {
    id: "1",
    title: "شروع تمرین امروز",
    subtitle: "برنامه‌های هوشمند شخصی‌سازی‌شده برای هر سطح",
    image:
      "https://images.unsplash.com/photo-1558611848-73f7eb4001d7?auto=format&fit=crop&w=1200&q=80",
    ctaText: "شروع کن",
    ctaLink: "/subscriptions",
  },
  {
    id: "2",
    title: "باشگاه‌های نزدیک به شما",
    subtitle: "نقشه تعاملی و پیشنهادات محلی",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    ctaText: "مشاهده نقشه",
    ctaLink: "/gym-map",
  },
  {
    id: "3",
    title: "عضویت ویژه ماهیانه",
    subtitle: "دسترسی نامحدود به همه تمرین‌ها و تخفیف‌های اختصاصی",
    image:
      "https://images.unsplash.com/photo-1546484959-f9a1a38646f5?auto=format&fit=crop&w=1200&q=80",
    ctaText: "اکنون بخرید",
    ctaLink: "/subscriptions/payment",
  },
];
