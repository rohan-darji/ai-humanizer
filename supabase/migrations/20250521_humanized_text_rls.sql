
-- Add Row Level Security (RLS) to ensure users can only see their own humanized texts
ALTER TABLE public.humanized_texts ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own humanized texts
CREATE POLICY "Users can view their own humanized texts" 
  ON public.humanized_texts 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own humanized texts
CREATE POLICY "Users can create their own humanized texts" 
  ON public.humanized_texts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own humanized texts
CREATE POLICY "Users can update their own humanized texts" 
  ON public.humanized_texts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own humanized texts
CREATE POLICY "Users can delete their own humanized texts" 
  ON public.humanized_texts 
  FOR DELETE 
  USING (auth.uid() = user_id);
