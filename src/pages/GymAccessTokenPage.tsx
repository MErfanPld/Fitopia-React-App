/**
 * Entry tickets (بلیت ورود) — one universal ticket for all accessible gyms
 * Route: /gym-access/tokens
 */

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Copy,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Loader2,
  X,
  Building2,
  Ticket,
  RefreshCw,
  ChevronLeft,
} from "lucide-react";
import { Header } from "../components/Header";
import { BottomNavigation } from "../components/BottomNavigation";
import apiService from "../services/api";
import { formatPersianNumber } from "../utils/formatting";

interface Token {
  id: number;
  token_code: string;
  user: string;
  /** null when universal (سراسری) */
  gym: number | null;
  gym_name?: string;
  gym_address?: string;
  status: "active" | "used" | "expired";
  is_valid: boolean;
  issued_at: string;
  valid_until: string;
  used_at: string | null;
  qr_code: string;
  is_universal?: boolean;
}

interface ExpandedToken extends Token {
  timeRemaining: string;
}

interface Gym {
  id: number;
  name: string;
  address: string;
  phone: string;
}

interface Subscription {
  id: number;
  plan_name: string;
  status: string;
  tokens_total: number;
  tokens_used: number;
  tokens_remaining: number;
  is_active: boolean;
  days_remaining: number;
}

function calculateTimeRemaining(validUntil: string): string {
  try {
    const now = new Date();
    const expiryTime = new Date(validUntil);
    const diff = expiryTime.getTime() - now.getTime();
    if (diff <= 0) return "منقضی شده";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${formatPersianNumber(hours)}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  } catch {
    return "\u2014";
  }
}
