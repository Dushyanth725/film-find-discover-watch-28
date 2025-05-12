
-- Create user_collections table to store user data
CREATE TABLE IF NOT EXISTS public.user_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  liked INTEGER[] DEFAULT '{}',
  watched INTEGER[] DEFAULT '{}',
  watchlist INTEGER[] DEFAULT '{}',
  ratings JSONB DEFAULT '[]', -- Array of {movieId, rating, media_type}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security
ALTER TABLE public.user_collections ENABLE ROW LEVEL SECURITY;

-- Policy that allows users to only access their own data
CREATE POLICY user_collections_policy ON public.user_collections
  FOR ALL
  USING (auth.uid()::text = username);

-- Update function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on update
CREATE TRIGGER update_user_collections_updated_at
  BEFORE UPDATE ON public.user_collections
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
