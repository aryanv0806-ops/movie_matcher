/**
 * TMDB API Configuration
 * Centralized configuration for The Movie Database API
 */

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Validate API key is set
if (!API_KEY) {
  console.error(
    '❌ TMDB_API_KEY is not set! Please add VITE_TMDB_API_KEY to your environment variables.'
  );
}

export const TMDB_CONFIG = {
  baseURL: TMDB_BASE_URL,
  imageBaseURL: TMDB_IMAGE_BASE_URL,
  apiKey: API_KEY || '',
  endpoints: {
    popular: `${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY || ''}&page=1`,
    topRated: `${TMDB_BASE_URL}/movie/top_rated?api_key=${API_KEY || ''}&page=1`,
    upcoming: `${TMDB_BASE_URL}/movie/upcoming?api_key=${API_KEY || ''}&page=1`,
  },
};

/**
 * Formats poster path to full image URL
 * @param {string} posterPath - The poster_path from TMDB API
 * @returns {string} Full image URL
 */
export const getPosterUrl = (posterPath) => {
  if (!posterPath) return '';
  return `${TMDB_IMAGE_BASE_URL}${posterPath}`;
};
