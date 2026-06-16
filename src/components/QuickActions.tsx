/**
 * @file QuickActions.tsx
 * @description Quick action trigger buttons centered around core fitness behaviors
 * (e.g. workout sensors, smart nutrition logs, progress metrics, body compound scanning).
 */

import { Dumbbell, Calendar, LineChart, Cpu } from "lucide-react";

export function QuickActions() {
  // Configured hot shortcuts for active user routines
  const actions = [
    {
      id: "action-workout",
      label: "شروع تمرین",
      desc: "تمرین در لحظه",
      icon: Dumbbell,
      color: "bg-orange-500/10 text-[#FF6A00] border-orange-500/25",
      handler: () => alert("ویژگی راه‌اندازی شتاب‌سنج تمرین در نسخه آزمایشی در دسترس است!"),
    },
    {
      id: "action-nutrition",
      label: "تغذیه هوشمند",
      desc: "برنامه کالری روز",
      icon: Calendar,
      color: "bg-amber-500/10 text-[#FFB000] border-amber-500/25",
      handler: () => alert("منوی تغذیه‌ای شما بر اساس ۴,۲۰۰ کالری تنظیم شده است. ۵ واحد کربوهیدرات اضافه کنید."),
    },
    {
      id: "action-progress",
      label: "پیشرفت من",
      desc: "نمودار هفتگی عضلانی",
      icon: LineChart,
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
      handler: () => alert("شما ۸۵٪ از هدف روتین تناسب اندام خرداد ماه را به‌خوبی پیش برده‌اید!"),
    },
    {
      id: "action-body",
      label: "آنالیز ترکیب بدنی",
      desc: "درصد چربی و توده",
      icon: Cpu,
      color: "bg-purple-500/10 text-purple-400 border-purple-500/25",
      handler: () => alert("اسکن چربی بدن از طریق دوربین به زودی با تکیه بر سنسورهای نسل بعد فعال می‌شود."),
    },
  ];

  return (
    <section className="space-y-4" id="quick-actions-section">
      <h4 className="text-base font-black text-on-surface">دسترسی سریع فیتوپیا</h4>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="quick-actions-grid">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              id={act.id}
              onClick={act.handler}
              className={`glass-card rounded-2xl p-4 flex flex-col text-right justify-between items-start gap-4 hover:border-primary-container/40 transition-all cursor-pointer active:scale-95 text-xs select-none border border-white/5`}
            >
              {/* Top icon and label state */}
              <div className="flex justify-between w-full items-start">
                <div className={`p-2.5 rounded-xl border ${act.color}`}>
                  <Icon size={18} />
                </div>
              </div>

              {/* Bottom labels */}
              <div>
                <span className="font-extrabold text-sm text-on-surface block">{act.label}</span>
                <span className="text-[11px] text-on-surface-variant/60 block mt-1 leading-tight font-medium">
                  {act.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
