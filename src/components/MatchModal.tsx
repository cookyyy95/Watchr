'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Star, Calendar, Users, Play } from 'lucide-react'
import { Movie } from '@/types'
import Image from 'next/image'

interface MatchModalProps {
  movie: Movie | null
  isOpen: boolean
  onClose: () => void
}

export default function MatchModal({ movie, isOpen, onClose }: MatchModalProps) {
  if (!movie) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getPosterUrl = (posterPath: string | null) => {
    if (!posterPath) return '/placeholder-movie.svg'
    return `https://image.tmdb.org/t/p/w500${posterPath}`
  }

  const getBackdropUrl = (backdropPath: string | null) => {
    if (!backdropPath) return '/placeholder-movie.svg'
    return `https://image.tmdb.org/t/p/w1280${backdropPath}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Backdrop image */}
            <div className="relative h-64 bg-slate-800">
              <Image
                src={getBackdropUrl(movie.backdrop_path)}
                alt={movie.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Match celebration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 0.6,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                    className="text-6xl mb-2"
                  >
                    🎉
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-2">It's a Match!</h2>
                  <p className="text-white/80">You both want to watch this movie!</p>
                </motion.div>
              </div>
            </div>

            {/* Movie details */}
            <div className="p-6">
              <div className="flex gap-4 mb-6">
                <div className="w-24 h-36 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={getPosterUrl(movie.poster_path)}
                    alt={movie.title}
                    width={96}
                    height={144}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {movie.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {movie.overview}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(movie.release_date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{movie.vote_count.toLocaleString()} votes</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <a
                  href={`https://www.themoviedb.org/movie/${movie.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 button-primary flex items-center justify-center"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  View on TMDb
                </a>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition-colors"
                >
                  Continue Swiping
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
