/**
 * Subscription History Service
 * Handles all subscription history and current subscription API requests
 */

import apiClient from './apiClient';
import { SubscriptionPlan } from '../types/subscription';

export interface SubscriptionHistoryItem {
  id: number;
  plan: number;
  plan_name: string;
  status: 'active' | 'expired' | 'cancelled';
  start_date: string;
  end_date: string;
  tokens_total: number;
  tokens_used: number;
  tokens_remaining: number;
  is_active: boolean;
  days_remaining: string;
  paid_amount: number;
  discount_applied: number;
  created_at: string;
}

export interface MySubscription extends SubscriptionHistoryItem {
  discount_remaining?: number;
}

class SubscriptionHistoryService {
  /**
   * Get subscription history
   */
  async getHistory(): Promise<SubscriptionHistoryItem[]> {
    try {
      const response = await apiClient.get<SubscriptionHistoryItem[]>(
        '/subscriptions/history/'
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription history:', error);
      throw error;
    }
  }

  /**
   * Get current active subscription
   */
  async getMySubscription(): Promise<MySubscription | null> {
    try {
      const response = await apiClient.get<MySubscription[]>(
        '/subscriptions/my/'
      );
      
      // API returns array, get the first active one
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching current subscription:', error);
      throw error;
    }
  }

  /**
   * Get discount information
   */
  async getMyDiscount(): Promise<{ discount_amount: number }> {
    try {
      const response = await apiClient.get<{ discount_amount: number }>(
        '/subscriptions/my-discount/'
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching discount:', error);
      throw error;
    }
  }

  /**
   * Purchase a subscription plan
   */
  async purchasePlan(planId: number, useDiscount: boolean = false): Promise<any> {
    try {
      const response = await apiClient.post('/subscriptions/purchase/', {
        plan: planId,
        use_discount: useDiscount,
      });
      return response.data;
    } catch (error) {
      console.error('Error purchasing plan:', error);
      throw error;
    }
  }

  /**
   * Expire/cancel a subscription
   */
  async expireSubscription(subscriptionId: number): Promise<any> {
    try {
      const response = await apiClient.post(
        `/subscriptions/expire/${subscriptionId}/`,
        {}
      );
      return response.data;
    } catch (error) {
      console.error('Error expiring subscription:', error);
      throw error;
    }
  }
}

export default new SubscriptionHistoryService();
