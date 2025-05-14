
import { Movie } from '@/types';

// Updated with both movies and TV series samples
export const SAMPLE_MOVIES: Movie[] = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    year: 1994,
    director: "Frank Darabont",
    genre: ["Drama"],
    rating: 9.3,
    synopsis: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
    media_type: "movie"
  },
  {
    id: 2,
    title: "The Godfather",
    year: 1972,
    director: "Francis Ford Coppola",
    genre: ["Crime", "Drama"],
    rating: 9.2,
    synopsis: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    media_type: "movie"
  },
  {
    id: 3,
    title: "The Dark Knight",
    year: 2008,
    director: "Christopher Nolan",
    genre: ["Action", "Crime", "Drama"],
    rating: 9.0,
    synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    media_type: "movie"
  },
  {
    id: 4,
    title: "Pulp Fiction",
    year: 1994,
    director: "Quentin Tarantino",
    genre: ["Crime", "Drama"],
    rating: 8.9,
    synopsis: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    media_type: "movie"
  },
  {
    id: 5,
    title: "Inception",
    year: 2010,
    director: "Christopher Nolan",
    genre: ["Action", "Adventure", "Sci-Fi"],
    rating: 8.8,
    synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    media_type: "movie"
  },
  {
    id: 6,
    title: "Fight Club",
    year: 1999,
    director: "David Fincher",
    genre: ["Drama"],
    rating: 8.8,
    synopsis: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.",
    poster: "https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    media_type: "movie"
  },
  // TV Series samples
  {
    id: 101,
    title: "Breaking Bad",
    year: 2008,
    director: "Vince Gilligan",
    genre: ["Crime", "Drama", "Thriller"],
    rating: 9.5,
    synopsis: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    poster: "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg",
    media_type: "tv"
  },
  {
    id: 102,
    title: "Game of Thrones",
    year: 2011,
    director: "David Benioff, D.B. Weiss",
    genre: ["Action", "Adventure", "Drama"],
    rating: 9.2,
    synopsis: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
    poster: "https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_.jpg",
    media_type: "tv"
  },
  {
    id: 103,
    title: "Stranger Things",
    year: 2016,
    director: "The Duffer Brothers",
    genre: ["Drama", "Fantasy", "Horror"],
    rating: 8.7,
    synopsis: "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.",
    poster: "https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    media_type: "tv"
  },
  {
    id: 104,
    title: "The Office",
    year: 2005,
    director: "Greg Daniels, Ricky Gervais, Stephen Merchant",
    genre: ["Comedy"],
    rating: 9.0,
    synopsis: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
    poster: "https://m.media-amazon.com/images/M/MV5BMDNkOTE4NDQtMTNmYi00MWE0LWE4ZTktYTc0NzhhNWIzNzJiXkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_.jpg",
    media_type: "tv"
  },
  {
    id: 105,
    title: "The Mandalorian",
    year: 2019,
    director: "Jon Favreau",
    genre: ["Action", "Adventure", "Fantasy"],
    rating: 8.7,
    synopsis: "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
    poster: "https://m.media-amazon.com/images/M/MV5BZDhlMzY0ZGItZTcyNS00ZTAxLWIyMmYtZGQ2ODg5OWZiYmJkXkEyXkFqcGdeQXVyODkzNTgxMDg@._V1_.jpg",
    media_type: "tv"
  }
];
