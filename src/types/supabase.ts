
// Define types for Supabase tables
import { UserRating } from '@/types';
import { Json } from '@/integrations/supabase/types';

export interface UserCollectionsTable {
  id: string;
  username: string;
  liked: number[];
  watched: number[];
  watchlist: number[];
  ratings: UserRating[];
}

// Type for RLS compatibility
export type Tables = {
  user_collections: UserCollectionsTable;
}

// Helper function to convert UserRating[] to Json and back
export const userRatingsToJson = (ratings: UserRating[]): Json => {
  return ratings as unknown as Json;
};

export const jsonToUserRatings = (json: Json): UserRating[] => {
  return json as unknown as UserRating[];
};
