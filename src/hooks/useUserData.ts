
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserCredits {
  id: string;
  user_id: string;
  total_credits: number;
  used_credits: number;
  created_at: string;
  updated_at: string;
}

interface UserSubscription {
  id: string;
  user_id: string;
  plan_type: "free" | "standard" | "premium";
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useUserCredits = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) {
        setCredits(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("credits")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;
        setCredits(data);
      } catch (error: any) {
        toast.error(`Error fetching credits: ${error.message}`);
        console.error("Error fetching credits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, [user]);

  return { credits, loading };
};

export const useUserSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setSubscription(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        setSubscription(data);
      } catch (error: any) {
        toast.error(`Error fetching subscription: ${error.message}`);
        console.error("Error fetching subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  return { subscription, loading };
};
