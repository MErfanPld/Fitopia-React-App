/**
 * @file ActivityList.tsx
 * @description Manages and renders the list of physical exercise logs completed by the user.
 * Supports manual additions of customized logs through standard callbacks.
 */

import { useState } from "react";
import { Flame, CheckCircle, Clock, CalendarHeart, History, Plus } from "lucide-react";

interface Activity {
  id: string; // Unique log entry identifier
  title: string; // Dynamic sport activity name
  calories: number; // Approximate active calories burned
  duration: number; // Exercise duration in minutes
  datetime: string; // Friendly absolute or relative Persian date string
}

export function ActivityList() {
  // Local reactive state storage to hold historical workout logs
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "act-1",
      title: "تمرین قدرتی چهارسر ران",
      calories: 320,
      duration: 35,
      datetime: "دیروز ساعت ۱۸:۳۰",
    },
    {
      id: "act-2",
      title: "دویدن اینتروال استقامتی",
      calories: 450,
      duration: 40,
      datetime: "۲ روز پیش ساعت ۰۷:۱۵",
    },
    {
      id: "act-3",
      title: "یوگا و بازسازی عضلانی",
      calories: 120,
      duration: 25,
      datetime: "۳ روز پیش ساعت ۲۱:۰۰",
    },
  ]);

  const handleAddManualLog = () => {
    const title = window.prompt("عنوان فعالیت جدید خود را وارد کنید (مثال: شنا ۱۰۰۰ متر):");
    if (!title) return;

    const caloriesStr = window.prompt("کالری تخمینی سوخته شده را به عدد بنویسید:");
    const durationStr = window.prompt("مدت زمان فعالیت به دقیقه:");

    const calories = Number(caloriesStr) || 200;
    const duration = Number(durationStr) || 30;

    const newAct: Activity = {
      id: `act-${Date.now()}`,
      title,
      calories,
      duration,
      datetime: "هم‌اکنون",
    };

    setActivities(prev => [newAct, ...prev]);
    alert("گزارش تندرستی شما اضافه گردید و در نمودار متابولیک اعمال شد! 🍏");
  };

  return (
    <section className="space-y-4 select-none" id="recent-activities-section">
      <div className="flex justify-between items-center">
        <h4 className="text-base font-black text-on-surface flex items-center gap-2">
          <History size={18} className="text-primary-container" />
          پیشینه فعالیت‌های شما
        </h4>
        <button
          onClick={handleAddManualLog}
          className="text-xs text-primary-container font-black hover:underline cursor-pointer flex items-center gap-1 bg-primary-container/10 border border-primary-container/20 px-3 py-1.5 rounded-xl transition-all active:scale-95"
        >
          <Plus size={14} />
          <span>ثبت فعالیت جدید</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="activities-grid">
        {activities.map((act) => (
          <div
            key={act.id}
            className="glass-card rounded-[1.5rem] p-5 border border-white/5 flex flex-col justify-between hover:border-primary-container/20 transition-all cursor-pointer"
          >
            {/* Header activity block */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                  <CheckCircle size={16} />
                </div>
                <h5 className="font-extrabold text-sm text-[e5e1e6] line-clamp-1">{act.title}</h5>
              </div>
              <span className="text-[10px] text-on-surface-variant/40 font-bold">{act.datetime}</span>
            </div>

            {/* Calories and Duration values */}
            <div className="mt-5 flex gap-4 items-center" id={`details-${act.id}`}>
              <div className="flex items-center gap-1 text-xs text-on-surface-variant font-medium">
                <Flame size={14} className="text-orange-500" />
                <span>سوخت حرارتی: {act.calories} کالری</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-on-surface-variant font-medium">
                <Clock size={14} className="text-primary" />
                <span>مدت زمان: {act.duration} دقیقه</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
