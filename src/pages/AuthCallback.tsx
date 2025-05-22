// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase already parsed the URL hash; just redirect
    // If you wanted to double-check you could call:
    // supabase.auth.getSessionFromUrl()
    // but detectSessionInUrl: true already did it for you.
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-full">
      <p>Logging you in…</p>
    </div>
  );
}
