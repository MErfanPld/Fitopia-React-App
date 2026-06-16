import { Sparkles, Calendar, Zap, Play } from "lucide-react";

interface Program {
  id: string;
  title: string;
  desc: string;
  duration: string;
  progress: number;
  type: string;
  image: string;
}

export function ProgramCard() {
  const programs: Program[] = [
    {
      id: "prog-1",
      title: "کراس‌فیت پیشرفته و المپیکی",
      desc: "افزایش غلظت میتوکندری عضلات و توان عضلانی با تمرینات سنگین.",
      duration: "۶ هفته • فشرده بلندمدت",
      progress: 65,
      type: "کراس‌فیت",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "prog-2",
      title: "فیتنس و فرم‌دهی هوشمند",
      desc: "متمرکز بر فرم‌دهی بالا تنه و میان تنه همراه با پایش متابولیسم.",
      duration: "۴ هفته • متوسط",
      progress: 20,
      type: "فیتنس",
      image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "prog-3",
      title: "یوگا و انعطاف‌پذیری پلاتینیوم",
      desc: "افزایش دامنه حرکتی مفاصل و تقویت آرامش ذهن و سیستم تنفس عمیق.",
      duration: "۸ هفته • سبک مهارتی",
      progress: 0,
      type: "یوگا",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=300&q=80",
    },
  ];

  return (
    <section className="space-y-4" id="programs-section">
      <div className="flex justify-between items-center select-none">
        <h4 className="text-base font-black text-on-surface">برنامه‌های تمرینی شما</h4>
        <span className="text-xs text-primary-container font-black hover:underline cursor-pointer">
          مشاهده همه روتین‌ها
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="programs-list-row">
        {programs.map((prog) => (
          <div
            key={prog.id}
            id={prog.id}
            className="rounded-3xl glass-card flex flex-col justify-between overflow-hidden group hover:border-primary-container/20 transition-all cursor-pointer border border-white/5 shadow-lg select-none"
          >
            {/* Visual Header image */}
            <div className="h-44 relative overflow-hidden" id={`img-container-${prog.id}`}>
              <img
                src={prog.image}
                referrerPolicy="no-referrer"
                alt={prog.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <span className="absolute top-3 left-3 bg-primary-container/90 text-on-primary-container text-[10px] px-2.5 py-1 rounded-lg font-bold">
                {prog.type}
              </span>
            </div>

            {/* Contents details */}
            <div className="p-5 flex-grow flex flex-col justify-between">
              <div>
                <h5 className="font-extrabold text-base text-on-surface line-clamp-1">{prog.title}</h5>
                <p className="text-xs text-on-surface-variant/70 mt-1 line-clamp-2 leading-relaxed">
                  {prog.desc}
                </p>
                <div className="flex items-center gap-1.5 text-on-surface-variant/50 text-[10px] mt-2 font-bold">
                  <Calendar size={12} />
                  <span>{prog.duration}</span>
                </div>
              </div>

              {/* Progress and indicators */}
              <div className="mt-5 pt-3 border-t border-white/5 space-y-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-on-surface-variant">پیشرفت برنامه:</span>
                  <span className="text-primary-container">{prog.progress}٪</span>
                </div>
                
                <div className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 right-0 h-full bg-gradient-to-l from-[#FF6A00] to-[#FFB000]"
                    style={{ width: `${prog.progress}%` }}
                  />
                </div>

                <button
                  onClick={() => alert(`راه‌اندازی جلسه بهینه‌سازی شده در برنامه "${prog.title}"`)}
                  className="w-full mt-2 py-2 flex items-center justify-center gap-1.5 text-xs text-primary font-bold bg-primary-container/5 hover:bg-primary-container/10 border border-primary-container/15 rounded-xl cursor-pointer transition-all active:scale-95"
                >
                  <Play size={10} className="fill-current" />
                  <span>ادامه دوره تمرین</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
