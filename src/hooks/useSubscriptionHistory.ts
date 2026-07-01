import { useState, useEffect, useRef } from 'react';
import { SubscriptionHistoryItem, MySubscription } from '../types/subscription';
import subscriptionHistoryService from '../services/subscriptionHistoryService';

interface UseSubscriptionHistoryReturn {
  mySubscription: MySubscription | null;
  history: SubscriptionHistoryItem[];
  discountRemaining: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useSubscriptionHistory = (): UseSubscriptionHistoryReturn => {
  const [mySubscription, setMySubscription] = useState<MySubscription | null>(null);
  const [history, setHistory] = useState<SubscriptionHistoryItem[]>([]);
  const [discountRemaining, setDiscountRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [mySubData, historyData, discountData] = await Promise.all([
        subscriptionHistoryService.getMySubscription(),
        subscriptionHistoryService.getHistory(),
        subscriptionHistoryService.getMyDiscount(),
      ]);

      setMySubscription(mySubData);
      setHistory(historyData);
      setDiscountRemaining(discountData.discount_amount || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای نامشخص');
      console.error('Error loading subscription history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { mySubscription, history, discountRemaining, loading, error, refetch: loadData };
};