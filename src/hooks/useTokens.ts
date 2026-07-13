// src/hooks/useTokens.ts
import { useState, useEffect, useCallback } from 'react';
import { tokenService } from '../services/tokenService';
import { Token } from '../types/token';

interface UseTokensResult {
  tokens: Token[];
  activeCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  purchaseToken: (gymId?: number) => Promise<Token | null>;
}

export function useTokens(): UseTokensResult {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [activeCount, setActiveCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await tokenService.getMyTokens();
      setTokens(data);
      
      // محاسبه توکن‌های فعال
      const active = data.filter(t => t.status === 'active' && t.is_valid === true);
      setActiveCount(active.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت توکن‌ها');
      setTokens([]);
      setActiveCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const purchaseToken = useCallback(async (gymId?: number): Promise<Token | null> => {
    try {
      const newToken = await tokenService.purchaseToken(gymId);
      // پس از خرید، لیست رو به‌روز کن
      await fetchTokens();
      return newToken;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در خرید توکن');
      return null;
    }
  }, [fetchTokens]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return { tokens, activeCount, loading, error, refetch: fetchTokens, purchaseToken };
}