/**
 * @file useGymAPI.ts
 * @description Custom hook for fetching gym-related data from FitopiaAPI
 * Handles categories, sports, and gym listings with error handling and caching
 */

import { useState, useEffect } from "react";

const API_BASE_URL = "https://fitopiaapi.pythonanywhere.com/api/gym";

// Types
export interface Sport {
  id: number;
  name: string;
  category: number;
}

export interface Category {
  id: number;
  title: string;
  slug: string;
}

export interface Price {
  id: number;
  monthly_price: number;
  yearly_price: number;
  gym: number;
  sport: number;
}

export interface Gym {
  id: number;
  sports: Sport[];
  prices: Price[];
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  popularity_score: number;
  is_popular: boolean;
}

// Hook for categories
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/categories/`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

// Hook for sports
export function useSports() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/sports/`);
        if (!response.ok) throw new Error("Failed to fetch sports");
        const data = await response.json();
        setSports(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching sports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  return { sports, loading, error };
}

// Hook for gyms
export function useGyms() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/`);
        if (!response.ok) throw new Error("Failed to fetch gyms");
        const data = await response.json();
        setGyms(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching gyms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, []);

  return { gyms, loading, error };
}
