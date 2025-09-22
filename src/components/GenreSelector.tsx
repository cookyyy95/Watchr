'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { tmdbClient } from '@/lib/tmdb'
import { Genre } from '@/types'
import { Loader2 } from 'lucide-react'

interface GenreSelectorProps {
  onGenreSelect: (genreId: number) => void
  isLoading?: boolean
}

export default function GenreSelector({ onGenreSelect, isLoading = false }: GenreSelectorProps) {
  const [genres, setGenres] = useState<Genre[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await tmdbClient.getGenres()
        setGenres(genreList)
      } catch (err) {
        console.error('Failed to fetch genres:', err)
        setError('Failed to load genres. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchGenres()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        <span className="ml-2 text-white">Loading genres...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="button-secondary"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose a Genre</h2>
        <p className="text-white/70">Select a movie genre to start swiping</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {genres.map((genre) => (
          <motion.button
            key={genre.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onGenreSelect(genre.id)}
            disabled={isLoading}
            className="p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              <span className="font-medium">{genre.name}</span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
