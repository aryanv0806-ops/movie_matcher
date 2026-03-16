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
      // Check if API key exists
      if (!import.meta.env.VITE_TMDB_API_KEY) {
        throw new Error(
          'TMDB API Key is missing! Please set VITE_TMDB_API_KEY in your environment variables.'
        );
      }

      const response = await fetch(endpoint);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid or expired TMDB API key. Please check your credentials.');
        }
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
        throw new Error('Invalid API response format. Check your API key.');
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError(err.message || 'Failed to load movies. Please try again.');
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
