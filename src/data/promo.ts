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
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=60",
    ctaText: "شروع کن",
    ctaLink: "/subscriptions",
  },
  {
    id: "2",
    title: "باشگاه‌های نزدیک به شما",
    subtitle: "نقشه تعاملی و پیشنهادات محلی",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=60",
    ctaText: "مشاهده نقشه",
    ctaLink: "/gym-map",
  },
  {
    id: "3",
    title: "عضویت ویژه ماهیانه",
    subtitle: "دسترسی نامحدود به همه تمرین‌ها و تخفیف‌های اختصاصی",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=60",
    ctaText: "اکنون بخرید",
    ctaLink: "/subscriptions/payment",
  },
];
