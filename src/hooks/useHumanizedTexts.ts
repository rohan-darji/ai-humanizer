
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HumanizedText {
  id: string;
  user_id: string;
  original_text: string;
  humanized_text: string;
  credits_used: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export const useHumanizedTexts = () => {
  const { user } = useAuth();
  const [texts, setTexts] = useState<HumanizedText[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTexts = async () => {
      if (!user) {
        setTexts([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("humanized_texts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTexts(data || []);
      } catch (error: any) {
        toast.error(`Error fetching humanized texts: ${error.message}`);
        console.error("Error fetching humanized texts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTexts();
  }, [user]);

  const saveHumanizedText = async (
    originalText: string, 
    humanizedText: string, 
    creditsUsed: number, 
    title: string = "Untitled Project"
  ) => {
    if (!user) {
      toast.error("You must be logged in to save texts");
      return null;
    }

    try {
      // First update the user's credit balance
      const { error: creditError } = await supabase.rpc("use_credits", { 
        credits_amount: creditsUsed 
      });

      if (creditError) throw creditError;

      // Then save the humanized text
      const { data, error } = await supabase
        .from("humanized_texts")
        .insert([
          {
            user_id: user.id,
            original_text: originalText,
            humanized_text: humanizedText,
            credits_used: creditsUsed,
            title
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      setTexts(prevTexts => [data, ...prevTexts]);
      toast.success("Text humanized and saved successfully!");
      return data;
    } catch (error: any) {
      toast.error(`Error saving humanized text: ${error.message}`);
      console.error("Error saving humanized text:", error);
      return null;
    }
  };

  return { texts, loading, saveHumanizedText };
};
