/**
 * @file sliderService.ts
 * @description Service for fetching home sliders from API
 */

import api from './api';
import type { HomeSliderResponse } from '../types/slider';

export const sliderService = {
  /**
   * Fetch all active home sliders from the API
   * @returns Promise with array of HomeSlider objects
   */
  getHomeSliders: async (): Promise<HomeSliderResponse> => {
    return api.get<HomeSliderResponse>('/core/home-sliders/');
  },
};
