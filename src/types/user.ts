
export interface UserProfile {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface UserCredit {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  total_credits: number;
  used_credits: number;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  plan_type: string;
  is_active: boolean;
  start_date: string;
  end_date: string | null;
}

export interface HumanizedText {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  title: string;
  original_text: string;
  humanized_text: string;
  credits_used: number;
}
