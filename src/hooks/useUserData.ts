
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile, UserCredit, UserSubscription } from "@/types/user";

export const useUserData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [credits, setCredits] = useState<UserCredit | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setProfile(null);
        setCredits(null);
        setSubscription(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch user credits
        const { data: creditsData, error: creditsError } = await supabase
          .from("credits")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (creditsError) throw creditsError;
        setCredits(creditsData);

        // Fetch user subscription
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (subscriptionError) throw subscriptionError;
        setSubscription(subscriptionData as UserSubscription);

      } catch (error: any) {
        toast.error(`Error fetching user data: ${error.message}`);
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Calculate available credits
  const availableCredits = credits ? credits.total_credits - credits.used_credits : 0;

  return {
    profile,
    credits,
    subscription,
    availableCredits,
    loading,
  };
};
