interface FilterTab {
  id: string;
  label: string;
}

interface FilterBarProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function FilterBar({ tabs, activeTab, onTabChange }: FilterBarProps) {
  return (
    <nav
      className="flex gap-2 overflow-x-auto hide-scrollbar pb-0.5"
      aria-label="فیلتر وضعیت اشتراک"
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`shrink-0 whitespace-nowrap rounded-full px-3.5 min-h-9 text-xs font-semibold border transition-colors ${
              active
                ? "bg-primary text-black border-primary"
                : "bg-white/[0.04] border-white/10 text-white/75"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
