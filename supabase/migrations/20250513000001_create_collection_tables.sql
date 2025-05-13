
-- Create liked_movies table
CREATE TABLE IF NOT EXISTS public.liked_movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  movie_id INTEGER NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Create watched_movies table
CREATE TABLE IF NOT EXISTS public.watched_movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  movie_id INTEGER NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Create watchlist_movies table
CREATE TABLE IF NOT EXISTS public.watchlist_movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  movie_id INTEGER NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  movie_id INTEGER NOT NULL,
  rating NUMERIC NOT NULL CHECK (rating >= 0 AND rating <= 5),
  review_text TEXT,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Set up Row Level Security
ALTER TABLE public.liked_movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watched_movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist_movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for liked_movies
CREATE POLICY "Users can view their own liked movies" 
  ON public.liked_movies FOR SELECT 
  USING (auth.uid()::text = user_id);
  
CREATE POLICY "Users can insert their own liked movies" 
  ON public.liked_movies FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);
  
CREATE POLICY "Users can delete their own liked movies" 
  ON public.liked_movies FOR DELETE 
  USING (auth.uid()::text = user_id);

-- Create policies for watched_movies
CREATE POLICY "Users can view their own watched movies" 
  ON public.watched_movies FOR SELECT 
  USING (auth.uid()::text = user_id);
  
CREATE POLICY "Users can insert their own watched movies" 
  ON public.watched_movies FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);
  
CREATE POLICY "Users can delete their own watched movies" 
  ON public.watched_movies FOR DELETE 
  USING (auth.uid()::text = user_id);

-- Create policies for watchlist_movies
CREATE POLICY "Users can view their own watchlist movies" 
  ON public.watchlist_movies FOR SELECT 
  USING (auth.uid()::text = user_id);
  
CREATE POLICY "Users can insert their own watchlist movies" 
  ON public.watchlist_movies FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);
  
CREATE POLICY "Users can delete their own watchlist movies" 
  ON public.watchlist_movies FOR DELETE 
  USING (auth.uid()::text = user_id);

-- Create policies for reviews
CREATE POLICY "Users can view their own reviews" 
  ON public.reviews FOR SELECT 
  USING (auth.uid()::text = user_id);
  
CREATE POLICY "Users can insert their own reviews" 
  ON public.reviews FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);
  
CREATE POLICY "Users can update their own reviews" 
  ON public.reviews FOR UPDATE 
  USING (auth.uid()::text = user_id);
  
CREATE POLICY "Users can delete their own reviews" 
  ON public.reviews FOR DELETE 
  USING (auth.uid()::text = user_id);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for the reviews table
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
