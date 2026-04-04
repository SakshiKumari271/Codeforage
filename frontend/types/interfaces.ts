import { LucideIcon } from "lucide-react";

export interface Provider {
  id: string;
  name: string;
  icon: LucideIcon;
  models: string[];
}

export interface VerificationResult {
  email: string;
  status: "Valid" | "Invalid" | "Unknown" | string;
  reason?: string;
  mx_record?: string;
  has_spf?: boolean;
  has_dmarc?: boolean;
  is_free_provider?: boolean;
  is_role_account?: boolean;
  smtp_banner?: string;
}

export interface Permutation {
  email: string;
  status: "Valid" | "Invalid" | "Unknown" | string;
}

export interface PermutatorResult {
  first_name: string;
  last_name: string;
  verifications: Permutation[];
}