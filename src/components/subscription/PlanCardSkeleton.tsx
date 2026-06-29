const PlanCardSkeleton = () => (
  <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="h-5 w-28 bg-white/10 rounded" />
        <div className="h-4 w-20 bg-white/10 rounded" />
      </div>
      <div className="h-8 w-16 bg-white/10 rounded-lg" />
    </div>
    <div className="space-y-2 py-2">
      <div className="h-4 w-full bg-white/10 rounded" />
      <div className="h-4 w-3/4 bg-white/10 rounded" />
    </div>
    <div className="h-11 w-full bg-white/10 rounded-xl" />
  </div>
);

export default PlanCardSkeleton;