import apiClient from './apiClient';
import { SubscriptionPlan } from '../types/subscription';

export const fetchSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const response = await apiClient.get<SubscriptionPlan[]>('/subscriptions/plans/');
  return response.data;
};