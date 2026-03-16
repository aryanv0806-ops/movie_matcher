/**
 * Custom Hook for TMDB Movies API
 * Handles fetching and managing movie data
 */

import { useState, useEffect } from 'react';
import { TMDB_CONFIG } from '../config/tmdbConfig';

/**
 * useMovies - Custom hook to fetch movies from TMDB API
 * @param {string} endpoint - The TMDB API endpoint to fetch from
 * @returns {object} { movies, isLoading, error, refetch }
 */
export const useMovies = (endpoint = TMDB_CONFIG.endpoints.popular) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.results && Array.isArray(data.results)) {
        // Filter out movies without posters or overviews for better UX
        const filteredMovies = data.results.filter(
          (movie) => movie.poster_path && movie.overview
        );
        setMovies(filteredMovies);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError(err.message || 'Failed to load movies');
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [endpoint]);

  return { movies, isLoading, error, refetch: fetchMovies };
};
