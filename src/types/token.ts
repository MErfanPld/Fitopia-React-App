// src/types/token.ts
export interface Token {
  id: number;
  token_code: string;
  user: string;
  gym: number | null;
  gym_name: string | null;
  gym_address: string | null;
  status: 'active' | 'used' | 'expired' | 'cancelled';
  is_valid: boolean;
  issued_at: string;
  valid_until: string;
  used_at: string | null;
  qr_code: string | null;
}