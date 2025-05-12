
// Define types for Supabase tables
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
