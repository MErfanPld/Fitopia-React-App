import { useState } from "react";
import { Star, MessageCircle, Heart, HeartOff } from "lucide-react";

interface Trainer {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  rating: number;
  experience: string;
}

export function TrainersSection() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const trainers: Trainer[] = [
    {
      id: "train-1",
      name: "استاد سهیل راد",
      specialty: "متخصص رژیم‌های کاهش وزن شدید و بدنسازی المپیکی",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=150&q=80",
      rating: 4.9,
      experience: "۱۲ سال سابقه مربیگری",
    },
    {
      id: "train-2",
      name: "کاپیتان الناز کریمی",
      specialty: "مربی ارشد کراس‌فیت و آماده‌سازی کلینیکال هوازی",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
      rating: 4.8,
      experience: "۹ سال سابقه مربیگری",
    },
    {
      id: "train-3",
      name: "دکتر نیما کمالی",
      specialty: "متخصص پاتولوژی ورزشی و اصلاح ناهنجاری حرکتی",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      rating: 5.0,
      experience: "۱۵ سال سابقه حرکتی",
    },
  ];

  const handleToggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(fId => fId !== id));
    } else {
      setFavorites(prev => [...prev, id]);
    }
  };

  const handleContactTrainer = (name: string) => {
    alert(`چت خصوصی با مربی شما "${name}" متصل شد! پیام آغازین خود را درباره چربی‌سوزی بنویسید.`);
  };

  return (
    <section className="space-y-4 select-none" id="trainers-section">
      <div className="flex justify-between items-center">
        <h4 className="text-base font-black text-on-surface">مربیان تراز اول FITOPIA</h4>
        <span className="text-xs text-primary-container font-black hover:underline cursor-pointer">
          فهرست مشاوران سلامت
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="trainers-row">
        {trainers.map((train) => {
          const isFav = favorites.includes(train.id);
          return (
            <div
              key={train.id}
              className="glass-card rounded-[2rem] p-5 flex flex-col justify-between border border-white/5 shadow-md relative"
            >
              {/* Heart Badge */}
              <button
                onClick={() => handleToggleFavorite(train.id)}
                className="absolute top-5 left-5 text-on-surface-variant/40 hover:text-primary-container transition-colors focus:outline-none cursor-pointer"
                title="افزودن به علاقه‌مندی‌ها"
              >
                {isFav ? (
                  <Heart size={20} className="text-primary-container fill-primary-container" />
                ) : (
                  <Heart size={20} />
                )}
              </button>

              <div className="flex gap-4 items-center">
                <img
                  src={train.avatar}
                  referrerPolicy="no-referrer"
                  alt={train.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-primary/20"
                />
                <div className="text-right">
                  <h5 className="font-extrabold text-sm text-[#e5e1e6] flex items-center gap-1.5">
                    {train.name}
                    <span className="flex items-center gap-0.5 text-[#FFB000] text-xs font-bold">
                      <Star size={11} className="fill-current" />
                      {train.rating}
                    </span>
                  </h5>
                  <span className="text-[11px] text-primary/80 font-semibold block mt-1">
                    {train.experience}
                  </span>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant/70 line-clamp-2 leading-relaxed mt-4">
                {train.specialty}
              </p>

              <div className="mt-5 pt-3 border-t border-white/5 flex gap-2">
                <button
                  onClick={() => handleContactTrainer(train.name)}
                  className="flex-grow py-2 bg-primary-container/10 border border-primary-container/20 hover:bg-primary-container/25 text-primary text-xs font-black rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={14} />
                  <span>مشاوره و طراحی برنامه</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
