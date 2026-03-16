/**
 * LoadingSpinner Component
 * Displays a spinning loader while data is being fetched
 */

import { motion } from 'framer-motion';

export const LoadingSpinner = ({ message = 'Loading movies...' }) => {
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  const containerVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <motion.div
        className="text-center relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Large animated spinner */}
        <motion.div
          className="flex justify-center mb-10"
          variants={containerVariants}
          animate="animate"
        >
          <motion.div
            className="w-24 h-24 border-4 border-transparent border-t-red-500 border-r-purple-500 rounded-full"
            variants={spinnerVariants}
            animate="animate"
          />
        </motion.div>
        
        {/* Loading text */}
        <motion.p
          className="text-white text-2xl font-bold mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
        
        {/* Animated dots */}
        <motion.p
          className="text-gray-400 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          >
            .
          </motion.span>
        </motion.p>
        
        {/* Subtitle */}
        <motion.p
          className="text-gray-400 text-sm mt-6 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Curating the perfect movies for you
        </motion.p>
      </motion.div>
    </div>
  );
};
