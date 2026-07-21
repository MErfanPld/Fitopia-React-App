/**
 * @file slider.ts
 * @description Type definitions for home sliders from API
 */

export interface HomeSlider {
  id: number;
  title: string;
  description: string;
  image: string;
  url: string;
  button_text: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export type HomeSliderResponse = HomeSlider[];
