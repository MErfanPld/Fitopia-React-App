import { useState } from "react";
import { Sparkles, BrainCircuit, Lightbulb, TrendingUp } from "lucide-react";

export function HealthInsights() {
  const [currentAdvice, setCurrentAdvice] = useState(
    "بر اساس داده‌های خواب دیشب شما، دوره ریکاوری عضله همسترینگ به حداکثر پتانسیل نرسیده است. توصیه می‌شود امروز تمرین سنگین اسکوات را با الیپتیکال ملایم جایگزین کنید."
  );
  const [isLoading, setIsLoading] = useState(false);

  const advices = [
    "شدت تمرین هیت امروز را روی سطح متوسط تنظیم کنید تا از آسیب‌های احتمالی رباط صلیبی جلوگیری شود. نوشیدن یک فنجان قهوه اسپرسو قبل از شروع تمرین متابولیسم را تا ۴٪ افزایش می‌دهد.",
    "تراز کربوهیدرات مصرفی شما دیروز پایین‌تر از حد بهینه بوده است. پس از تمرین امروز، مصرف ۵۰ گرم برنج کته همراه با سینه مرغ گریل‌شده برای سنتز گلیکوژن ضروری است.",
    "مجموع ساعات خواب عمیق شما دیشب ۷۵ دقیقه بوده است. برای بازسازی سیستم عصبی مرکزی قبل از ساعت ۲۳:۰۰ شب گوشی همراه خود را در حالت هواپیما قرار دهید.",
    "سطح هیدراتاسیون فعلی شما ایده‌آل است. اگر تمرین هوازی اینتروال انجام می‌دهید، برای جلوگیری از گرفتگی عضلات، مقدار بسیار کمی نمک صورتی به بطری آب خود اضافه کنید.",
  ];

  const handleAskNewAdvice = async () => {
    setIsLoading(true);
    // Simulate smart AI calculations
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const randomIdx = Math.floor(Math.random() * advices.length);
    setCurrentAdvice(advices[randomIdx]);
    setIsLoading(false);
  };

  return (
    <section className="glass-panel rounded-[2rem] p-6 relative overflow-hidden border border-white/5 shadow-lg select-none" id="health-insights-section">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary-container/5 blur-3xl rounded-full" />
      
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-primary-container/10 border border-primary-container/25 text-primary-container rounded-xl">
            <BrainCircuit size={18} className="animate-pulse" />
          </div>
          <h4 className="text-base font-black text-on-surface">آزمایشگاه هوش مصنوعی FITOPIA</h4>
        </div>
        <span className="text-[10px] text-[#FFB000] font-black uppercase tracking-wider bg-[#FFB000]/10 border border-[#FFB000]/20 px-2 py-0.5 rounded-md">
          توصیه شخصی‌سازی شده
        </span>
      </div>

      <div className="space-y-4">
        <div className="bg-surface-container-lowest/50 backdrop-blur-md p-5 rounded-2xl border border-white/5 relative">
          <div className="absolute top-4 left-4 text-primary-container/30">
            <Lightbulb size={24} />
          </div>
          <p className="text-xs md:text-sm text-on-surface leading-loose text-justify font-medium">
            {isLoading ? "در حال پایش سنسورهای بدنی شما و فراخوانی مدل فیزیولوژی فیتوپیا..." : currentAdvice}
          </p>
        </div>

        <div className="flex gap-3 justify-end items-center">
          <button
            onClick={handleAskNewAdvice}
            disabled={isLoading}
            className="py-2.5 px-5 bg-primary-container/10 border border-primary-container/20 hover:bg-primary-container/25 text-primary text-xs font-black rounded-xl cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Sparkles size={13} className="text-primary-container" />
            <span>محاسبه مجدد توصیه سلامت</span>
          </button>
        </div>
      </div>
    </section>
  );
}
