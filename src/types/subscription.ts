/**
 * @file subscription.ts
 * @description Type definitions for user subscriptions
 */

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  token_count: number;
  gyms_count: number;
  is_active: boolean;
  order: number;
}

export interface UserSubscription {
  id: number;
  plan: number;
  plan_name: string;
  status: "active" | "expired" | "cancelled";
  start_date: string;
  end_date: string;
  tokens_total: number;
  tokens_used: number;
  tokens_remaining: number;
  is_active: boolean;
  days_remaining: number;
  paid_amount: number;
  discount_applied: number;
  created_at: string;
}

export type UserSubscriptionResponse = UserSubscription;
