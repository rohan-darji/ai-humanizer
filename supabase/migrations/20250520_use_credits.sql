
-- Create a function to update user credits when they use the service
CREATE OR REPLACE FUNCTION public.use_credits(credits_amount INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.credits
  SET 
    used_credits = used_credits + credits_amount,
    updated_at = now()
  WHERE user_id = auth.uid();
END;
$$;
