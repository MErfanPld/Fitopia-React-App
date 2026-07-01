/**
 * @file SubscriptionHistoryPage.tsx
 * @description Subscription history page showing:
 * - Current active subscription with token usage
 * - History of all subscriptions
 * - Accumulated discount from unused tokens
 * - Filter options (all, active, expired, cancelled)
 */

import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { ShaderBackground } from '../components/ShaderBackground';
import { ParticleOverlay } from '../components/ParticleOverlay';
import ActivePlanCard from '../components/subscription/ActivePlanCard';
import HistoryItem from '../components/subscription/HistoryItem';
import FilterBar from '../components/subscription/FilterBar';
import DiscountCard from '../components/subscription/DiscountCard';
import { useSubscriptionHistory } from '../hooks/useSubscriptionHistory';
import { SubscriptionHistoryItem, SubscriptionStatus } from '../types/subscription';
import { ArrowLeft } from 'lucide-react';

const FILTER_TABS = [
  { id: 'all', label: 'همه' },
  { id: 'active', label: 'فعال' },
  { id: 'expired', label: 'منقضی‌شده' },
  { id: 'cancelled', label: 'لغوشده' },
];

export function SubscriptionHistoryPage() {
  const { mySubscription, history, discountRemaining, loading, error, refetch } =
    useSubscriptionHistory();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [filteredHistory, setFilteredHistory] = useState<SubscriptionHistoryItem[]>([]);

  // Update page title
  useEffect(() => {
    document.title = 'FITOPIA | تاریخچه اشتراک‌ها';
  }, []);

  // Filter history based on active filter
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredHistory(history);
    } else {
      setFilteredHistory(
        history.filter((item) => item.status === activeFilter)
      );
    }
  }, [history, activeFilter]);

  const handleBackClick = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <>
        <ShaderBackground />
        <ParticleOverlay />
        <Header />
        <main className="px-margin-mobile md:px-margin-desktop mt-6 space-y-8 max-w-5xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/25 rounded-full blur-2xl animate-pulse" />
              <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-primary animate-spin" />
            </div>
          </div>
        </main>
        <BottomNavigation />
      </>
    );
  }

  return (
    <>
      {/* 1. Dynamic background fluid simulation */}
      <ShaderBackground />

      {/* 2. Floating particles */}
      <ParticleOverlay />

      {/* 3. Top Header navigation bar */}
      <Header />

      <main className="px-margin-mobile md:px-margin-desktop mt-6 space-y-8 max-w-5xl mx-auto pb-32">
        {/* Back Button & Title */}
        <header className="w-full sticky top-20 z-40 bg-transparent flex items-center justify-between pt-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackClick}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors active:scale-95"
              title="برگشت"
            >
              <ArrowLeft className="w-6 h-6 text-on-surface" />
            </button>
            <h1 className="font-headline-md text-headline-md text-primary">
              تاریخچه اشتراک‌ها
            </h1>
          </div>
          <div className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary">
            FITOPIA
          </div>
        </header>

        {/* Error State */}
        {error && (
          <div className="glass-panel rounded-2xl p-8 text-center flex flex-col items-center gap-4">
            <svg className="w-12 h-12 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-on-surface-variant">{error}</p>
            <button
              onClick={refetch}
              className="px-6 py-2 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              تلاش مجدد
            </button>
          </div>
        )}

        {/* Active Plan Card */}
        {mySubscription && !error && <ActivePlanCard subscription={mySubscription} />}

        {/* Filter Bar */}
        {!error && (
          <FilterBar tabs={FILTER_TABS} activeTab={activeFilter} onTabChange={setActiveFilter} />
        )}

        {/* Subscription List */}
        {!error && (
          <section className="space-y-4">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <HistoryItem key={item.id} item={item} isActive={item.is_active} />
              ))
            ) : (
              <div className="glass-panel rounded-2xl p-12 text-center">
                <svg className="w-12 h-12 text-on-surface-variant block mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-on-surface-variant">
                  هیچ اشتراکی برای این فیلتر پیدا نشد
                </p>
              </div>
            )}
          </section>
        )}

        {/* Discount Section */}
        {!error && discountRemaining > 0 && (
          <DiscountCard discountAmount={discountRemaining} />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </>
  );
}
