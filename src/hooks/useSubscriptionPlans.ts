import { useState, useEffect } from 'react';
import { SubscriptionPlan } from '../types/subscription';
import { fetchSubscriptionPlans } from '../services/subscriptionService';

interface UseSubscriptionPlansReturn {
  plans: SubscriptionPlan[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useSubscriptionPlans = (): UseSubscriptionPlansReturn => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSubscriptionPlans();
      const activePlans = data
        .filter((p) => p.is_active)
        .sort((a, b) => a.order - b.order);
      setPlans(activePlans);
    } catch (err) {
      setError('دریافت پلن‌ها با خطا مواجه شد');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  return { plans, loading, error, refetch: loadPlans };
};