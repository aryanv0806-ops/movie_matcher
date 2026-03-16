/**
 * SwipeFeed Component
 * Main component for the movie swiping interface with card stack
 * Integrates with TMDB API to display real-time movie data
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMovies } from '../hooks/useMovies';
import { TMDB_CONFIG } from '../config/tmdbConfig';
import { MovieCard } from './MovieCard';
import { LoadingSpinner } from './LoadingSpinner';

export const SwipeFeed = ({ endpoint = TMDB_CONFIG.endpoints.popular }) => {
  // Fetch movies from TMDB API
  const { movies, isLoading, error } = useMovies(endpoint);

  // State Management for Swipe Logic
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeStats, setSwipeStats] = useState({
    liked: 0,
    disliked: 0,
  });

  /**
   * Handle swipe action - Updates currentIndex to show next movie
   *
   * STATE UPDATE FLOW:
   * 1. User drags card left/right past threshold
   * 2. onDragEnd fires with { offset: { x: number }, velocity: { x: number } }
   * 3. Swipe is detected based on X-axis offset/velocity threshold
   * 4. Direction is determined (left = dislike, right = like)
   * 5. currentIndex increments by 1
   * 6. Component re-renders, displaying movies[currentIndex] as the new top card
   * 7. Next movie slides into focus with exit animation on previous card
   */
  const handleSwipe = useCallback(
    (direction) => {
      // Update stats
      setSwipeStats((prev) => ({
        liked: direction === 'right' ? prev.liked + 1 : prev.liked,
        disliked: direction === 'left' ? prev.disliked + 1 : prev.disliked,
      }));

      // Move to next card
      setCurrentIndex((prevIndex) => prevIndex + 1);

      // Optional: Log swipe action
      console.log(
        `Swiped ${direction}: "${movies[currentIndex]?.title}" | Stats:`,
        swipeStats
      );
    },
    [currentIndex, movies, swipeStats]
  );

  /**
   * Handle drag end event from Framer Motion
   * Detects if swipe threshold was met
   */
  const handleDragEnd = useCallback(
    (event, info) => {
      const SWIPE_THRESHOLD = 50; // pixels
      const VELOCITY_THRESHOLD = 500; // pixels/second

      const swipeDistance = info.offset.x;
      const swipeVelocity = info.velocity.x;

      // Determine if swipe was significant enough
      if (Math.abs(swipeDistance) > SWIPE_THRESHOLD || Math.abs(swipeVelocity) > VELOCITY_THRESHOLD) {
        // Right swipe = like, Left swipe = dislike
        const direction = swipeDistance > 0 ? 'right' : 'left';
        handleSwipe(direction);
      }
    },
    [handleSwipe]
  );

  // Show loading spinner while fetching
  if (isLoading) {
    return <LoadingSpinner message="Discovering amazing movies..." />;
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <p className="text-red-400 text-xl font-semibold mb-4">
            ⚠️ Unable to load movies
          </p>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if out of movies
  const hasMovies = currentIndex < movies.length;
  const currentMovie = hasMovies ? movies[currentIndex] : null;

  return (
    <div className="relative w-screen h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      {/* Header */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-slate-950 to-transparent p-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-white drop-shadow-lg">
              🎬 MOVIE MATCHER
            </h1>
            <p className="text-gray-400 text-sm mt-1">Swipe. Rate. Discover.</p>
          </div>
          <div className="flex gap-3">
            <motion.div
              className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 px-5 py-3 rounded-2xl backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-green-400 font-bold text-lg">
                👍 {swipeStats.liked}
              </p>
            </motion.div>
            <motion.div
              className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 px-5 py-3 rounded-2xl backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-red-400 font-bold text-lg">
                👎 {swipeStats.disliked}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Card Container */}
      <div className="relative w-full h-full flex items-center justify-center px-4">
        {hasMovies ? (
          <motion.div
            className="relative w-full max-w-md h-4/5 filter drop-shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <AnimatePresence>
              {/* Render current card and one behind it for stacking effect */}
              {[0, 1].map((offset) => {
                const movieIndex = currentIndex + offset;
                if (movieIndex >= movies.length) return null;

                return (
                  <MovieCard
                    key={movies[movieIndex].id}
                    movie={movies[movieIndex]}
                    onDragEnd={offset === 0 ? handleDragEnd : undefined}
                    index={offset}
                  />
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* No More Movies Message */
          <motion.div
            className="text-center px-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="text-8xl mb-8"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎬
            </motion.div>
            <h2 className="text-5xl font-black text-white mb-4">
              That's a Wrap!
            </h2>
            <p className="text-gray-400 text-xl mb-10">
              You've swiped through {swipeStats.liked + swipeStats.disliked} amazing movies
            </p>
            <div className="grid grid-cols-2 gap-6 mb-10 max-w-sm mx-auto">
              <motion.div
                className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-3xl py-6 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-5xl mb-2">👍</p>
                <p className="text-green-400 text-3xl font-black">{swipeStats.liked}</p>
                <p className="text-gray-400 text-sm mt-2">Liked</p>
              </motion.div>
              <motion.div
                className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 rounded-3xl py-6 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-5xl mb-2">👎</p>
                <p className="text-red-400 text-3xl font-black">{swipeStats.disliked}</p>
                <p className="text-gray-400 text-sm mt-2">Passed</p>
              </motion.div>
            </div>
            <motion.button
              onClick={() => window.location.reload()}
              className="px-10 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg font-bold rounded-2xl transition transform shadow-xl border border-red-400/30"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 RESTART & DISCOVER MORE
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Bottom Info */}
      {hasMovies && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent p-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.p
            className="text-gray-400 text-sm font-medium tracking-wide"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Card {currentIndex + 1} of {movies.length}
          </motion.p>
          <div className="mt-3 h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full opacity-50" />
        </motion.div>
      )}
    </div>
  );
};
