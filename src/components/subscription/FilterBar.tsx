import { FC } from 'react';

interface FilterTab {
  id: string;
  label: string;
}

interface FilterBarProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const FilterBar: FC<FilterBarProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-2 rounded-full font-label-sm whitespace-nowrap spring-transition transition-colors ${
            activeTab === tab.id
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default FilterBar;