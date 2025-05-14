
import { supabase } from '@/integrations/supabase/client';
import { UserRating } from '@/types';
import { userRatingsToJson } from '@/types/supabase';

export const loadUserDataFromSupabase = async (username: string) => {
  const { data, error } = await supabase
    .from('user_collections')
    .select('*')
    .eq('username', username)
    .single();
    
  return { data, error };
};

export const createUserCollection = async (
  username: string,
  liked: number[],
  watched: number[],
  watchlist: number[],
  ratings: UserRating[]
) => {
  return await supabase.from('user_collections').insert({
    username,
    liked,
    watched,
    watchlist,
    ratings: userRatingsToJson(ratings)
  });
};

export const updateUserCollection = async (
  username: string,
  liked: number[],
  watched: number[],
  watchlist: number[],
  ratings: UserRating[]
) => {
  return await supabase
    .from('user_collections')
    .upsert({
      username,
      liked,
      watched,
      watchlist,
      ratings: userRatingsToJson(ratings)
    }, {
      onConflict: 'username'
    });
};
