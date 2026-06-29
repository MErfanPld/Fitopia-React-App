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