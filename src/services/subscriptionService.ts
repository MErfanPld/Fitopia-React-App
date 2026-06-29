/**
 * Subscription Service
 * Handles all subscription-related API calls
 */

import api from './api';

export interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  token_count: number;
  gyms_count: string;
  is_active: boolean;
  order: number;
}

export interface SubscriptionPurchaseData {
  plan_id: number;
  discount_code?: string;
  use_wallet?: boolean;
}

export interface UserSubscription {
  id: number;
  plan: Plan;
  purchased_at: string;
  expires_at: string;
  tokens_remaining: number;
  is_active: boolean;
}

class SubscriptionService {
  /**
   * Get all available subscription plans
   */
  async getPlans(): Promise<Plan[]> {
    try {
      const response = await api.get<Plan[]>('/subscriptions/plans/');
      return response;
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
  }

  /**
   * Get user's current subscription
   */
  async getUserSubscription(): Promise<UserSubscription | null> {
    try {
      const response = await api.get<UserSubscription>('/subscriptions/current/');
      return response;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }
  }

  /**
   * Get user's subscription history
   */
  async getSubscriptionHistory(): Promise<UserSubscription[]> {
    try {
      const response = await api.get<UserSubscription[]>('/subscriptions/history/');
      return response;
    } catch (error) {
      console.error('Error fetching subscription history:', error);
      throw error;
    }
  }

  /**
   * Purchase a subscription plan
   */
  async purchasePlan(data: SubscriptionPurchaseData): Promise<UserSubscription> {
    try {
      const response = await api.post<UserSubscription>('/subscriptions/purchase/', data);
      return response;
    } catch (error) {
      console.error('Error purchasing plan:', error);
      throw error;
    }
  }

  /**
   * Apply discount code
   */
  async applyDiscount(code: string): Promise<{ discount_amount: number; final_price: number }> {
    try {
      const response = await api.post('/subscriptions/apply-discount/', { code });
      return response;
    } catch (error) {
      console.error('Error applying discount:', error);
      throw error;
    }
  }

  /**
   * Cancel current subscription
   */
  async cancelSubscription(): Promise<{ message: string }> {
    try {
      const response = await api.post('/subscriptions/cancel/');
      return response;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  /**
   * Renew current subscription
   */
  async renewSubscription(plan_id: number): Promise<UserSubscription> {
    try {
      const response = await api.post<UserSubscription>('/subscriptions/renew/', { plan_id });
      return response;
    } catch (error) {
      console.error('Error renewing subscription:', error);
      throw error;
    }
  }

  /**
   * Get available gyms based on subscription
   */
  async getAvailableGyms(planId: number): Promise<any[]> {
    try {
      const response = await api.get('/subscriptions/gyms/', {
        params: { plan_id: planId },
      });
      return response;
    } catch (error) {
      console.error('Error fetching available gyms:', error);
      throw error;
    }
  }
}

export default new SubscriptionService();
