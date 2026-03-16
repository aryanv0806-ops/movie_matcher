/**
 * MovieCard Component
 * Displays a swipeable movie card with backdrop, title, release date, and overview
 */

import { motion } from 'framer-motion';
import { getPosterUrl } from '../config/tmdbConfig';

/**
 * @param {object} movie - Movie object from TMDB API
 * @param {function} onDragEnd - Callback when drag ends
 * @param {number} index - Index of the card in the stack
 */
export const MovieCard = ({ movie, onDragEnd, index }) => {
  const {
    id,
    title,
    poster_path,
    release_date,
    overview,
    vote_average,
  } = movie;

  // Truncate overview to fit elegantly on card
  const truncatedOverview = overview.length > 150 ? `${overview.substring(0, 150)}...` : overview;

  // Format release year
  const releaseYear = release_date ? new Date(release_date).getFullYear() : 'N/A';

  const posterUrl = getPosterUrl(poster_path);

  return (
    <motion.div
      key={id}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={onDragEnd}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute w-full h-full"
      style={{
        zIndex: index === 0 ? 10 : -index,
      }}
    >
      <div className="relative w-full h-full rounded-4xl overflow-hidden shadow-2xl border border-white/10">
        {/* Background Image with Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${posterUrl}')`,
            filter: 'brightness(0.5)',
            zIndex: 0,
          }}
        />

        {/* Dark Gradient Overlay (Bottom to Top) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 via-50% to-transparent z-10" />

        {/* Content Container - Positioned at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 space-y-4">
          {/* Rating Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white font-bold text-lg shadow-lg">
              {vote_average.toFixed(1)}
            </div>
            <span className="text-gray-300 text-sm font-medium">/ 10</span>
          </div>

          {/* Title */}
          <h2 className="text-5xl font-black text-white line-clamp-2 leading-tight">
            {title}
          </h2>

          {/* Release Year & Info */}
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide">
            {releaseYear} • Motion Picture
          </p>

          {/* Overview */}
          <p className="text-gray-200 text-sm leading-relaxed line-clamp-3 font-light">
            {truncatedOverview}
          </p>

          {/* Swipe Hint */}
          <div className="pt-4 border-t border-gray-600/50">
            <p className="text-gray-400 text-xs font-medium text-center tracking-wider">
              👈 swipe left or right 👉
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
