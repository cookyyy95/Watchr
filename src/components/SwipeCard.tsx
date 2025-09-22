'use client'

import { useState } from 'react'
import TinderCard from 'react-tinder-card'
import { motion } from 'framer-motion'
import { Heart, X, Star, Calendar, Users } from 'lucide-react'
import { Movie } from '@/types'
import Image from 'next/image'

interface SwipeCardProps {
  movie: Movie
  onSwipe: (direction: 'left' | 'right') => void
  isLast: boolean
}

export default function SwipeCard({ movie, onSwipe, isLast }: SwipeCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleSwipe = (direction: string) => {
    if (direction === 'left') {
      onSwipe('left')
    } else if (direction === 'right') {
      onSwipe('right')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear()
  }

  const getPosterUrl = (posterPath: string | null) => {
    if (!posterPath) return '/placeholder-movie.svg'
    return `https://image.tmdb.org/t/p/w500${posterPath}`
  }

  return (
    <TinderCard
      onSwipe={handleSwipe}
      preventSwipe={['up', 'down']}
      className="absolute w-full h-full"
    >
      <motion.div
        className="swipe-card card-shadow"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Movie Poster */}
        <div className="relative h-2/3 bg-slate-800">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <Image
            src={getPosterUrl(movie.poster_path)}
            alt={movie.title}
            fill
            className={`object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Action buttons overlay */}
          <div className="absolute top-4 right-4 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center backdrop-blur-sm"
              onClick={() => onSwipe('left')}
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 bg-green-500/80 hover:bg-green-500 rounded-full flex items-center justify-center backdrop-blur-sm"
              onClick={() => onSwipe('right')}
            >
              <Heart className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Movie Info */}
        <div className="p-6 h-1/3 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {movie.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {movie.overview}
            </p>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(movie.release_date)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{movie.vote_count.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </TinderCard>
  )
}
