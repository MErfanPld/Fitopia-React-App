export default function PlanCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121216] p-5 space-y-4"
      aria-hidden
    >
      <div className="flex justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="skeleton h-4 w-24 rounded ms-auto" />
          <div className="skeleton h-7 w-32 rounded ms-auto" />
        </div>
        <div className="skeleton h-12 w-14 rounded-xl" />
      </div>
      <div className="space-y-2">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-4/5 rounded ms-auto" />
        <div className="skeleton h-3 w-3/5 rounded ms-auto" />
      </div>
      <div className="skeleton h-12 w-full rounded-xl" />
    </div>
  );
}
