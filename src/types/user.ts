
export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserCredit {
  id: string;
  user_id: string;
  total_credits: number;
  used_credits: number;
  created_at: string;
  updated_at: string;
}

export type SubscriptionPlanType = 'free' | 'standard' | 'premium';

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_type: SubscriptionPlanType;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HumanizedText {
  id: string;
  user_id: string;
  original_text: string;
  humanized_text: string;
  credits_used: number;
  title: string;
  created_at: string;
  updated_at: string;
}
