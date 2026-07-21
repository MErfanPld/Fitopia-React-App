/**
 * @file useUserSubscription.ts
 * @description Hook for fetching user's active subscription and checking gym access
 */

import { useState, useEffect } from 'react';
import api from '../services/api';
import type { UserSubscription } from '../types/subscription';

interface UseUserSubscriptionReturn {
  subscription: UserSubscription | null;
  loading: boolean;
  error: string | null;
  hasSubscription: boolean;
  hasGymAccess: (gymId: number) => boolean;
}

export function useUserSubscription(): UseUserSubscriptionReturn {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserSubscription();
  }, []);

  const fetchUserSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<UserSubscription>('/subscriptions/my/');
      setSubscription(data);
    } catch (err: any) {
      console.error('Failed to fetch user subscription:', err);
      setError(err.message || 'Failed to load subscription');
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const hasGymAccess = (gymId: number): boolean => {
    if (!subscription || !subscription.is_active) return false;
    // Check if subscription is still valid
    const endDate = new Date(subscription.end_date);
    return endDate > new Date();
  };

  return {
    subscription,
    loading,
    error,
    hasSubscription: subscription?.is_active ?? false,
    hasGymAccess,
  };
}
