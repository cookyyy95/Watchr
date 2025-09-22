'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Users, Heart, X, Loader2, AlertCircle } from 'lucide-react'
import { sessionManager } from '@/lib/session'
import { tmdbClient } from '@/lib/tmdb'
import { Movie, Session, Match } from '@/types'
import GenreSelector from '@/components/GenreSelector'
import SwipeCard from '@/components/SwipeCard'
import MatchModal from '@/components/MatchModal'

export default function SessionPage() {
  const params = useParams()
  const sessionCode = params.code as string
  
  const [session, setSession] = useState<Session | null>(null)
  const [movies, setMovies] = useState<Movie[]>([])
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isGenreSelecting, setIsGenreSelecting] = useState(false)
  const [match, setMatch] = useState<Match | null>(null)
  const [showMatchModal, setShowMatchModal] = useState(false)

  // Load session data
  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionData = await sessionManager.getSession(sessionCode)
        if (!sessionData) {
          setError('Session not found')
          return
        }
        
        setSession(sessionData)
        
        if (sessionData.genre_id) {
          await loadMovies(sessionData.genre_id)
        } else {
          setIsGenreSelecting(true)
        }
      } catch (err) {
        console.error('Failed to load session:', err)
        setError('Failed to load session')
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()
  }, [sessionCode])

  const loadMovies = async (genreId: number) => {
    try {
      setIsLoading(true)
      const { movies: movieList } = await tmdbClient.getMoviesByGenre(genreId, 1)
      setMovies(movieList)
    } catch (err) {
      console.error('Failed to load movies:', err)
      setError('Failed to load movies')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenreSelect = async (genreId: number) => {
    try {
      setIsGenreSelecting(false)
      await sessionManager.updateSessionGenre(sessionCode, genreId)
      await loadMovies(genreId)
    } catch (err) {
      console.error('Failed to select genre:', err)
      setError('Failed to select genre')
    }
  }

  const handleSwipe = useCallback(async (direction: 'left' | 'right') => {
    if (!session || currentMovieIndex >= movies.length) return

    const movie = movies[currentMovieIndex]
    const action = direction === 'right' ? 'like' : 'pass'

    try {
      // Record the swipe
      await sessionManager.recordSwipe(session.id, 'user-id', movie.id, action)
      
      // Check for match if it's a like
      if (action === 'like') {
        const newMatch = await sessionManager.checkForMatch(session.id, movie.id)
        if (newMatch) {
          setMatch(newMatch)
          setShowMatchModal(true)
        }
      }

      // Move to next movie
      setCurrentMovieIndex(prev => prev + 1)
    } catch (err) {
      console.error('Failed to record swipe:', err)
    }
  }, [session, movies, currentMovieIndex])

  const currentMovie = movies[currentMovieIndex]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-white">Loading session...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error</h2>
          <p className="text-white/70 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="button-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (isGenreSelecting) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <GenreSelector onGenreSelect={handleGenreSelect} />
        </div>
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No Movies Found</h2>
          <p className="text-white/70">Try selecting a different genre</p>
        </div>
      </div>
    )
  }

  if (currentMovieIndex >= movies.length) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Heart className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">All Done!</h2>
          <p className="text-white/70 mb-6">You've swiped through all the movies in this genre</p>
          <button
            onClick={() => {
              setCurrentMovieIndex(0)
              setIsGenreSelecting(true)
            }}
            className="button-primary"
          >
            Choose Different Genre
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="glass-effect p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Session {sessionCode}</h1>
              <p className="text-sm text-white/70">Swipe to find movies you both like</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-white/70">Movies left</div>
            <div className="text-lg font-semibold text-white">
              {movies.length - currentMovieIndex}
            </div>
          </div>
        </div>
      </div>

      {/* Swipe Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-sm h-[600px]">
          {movies.slice(currentMovieIndex, currentMovieIndex + 3).map((movie, index) => (
            <SwipeCard
              key={movie.id}
              movie={movie}
              onSwipe={handleSwipe}
              isLast={index === 0}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="glass-effect p-6">
        <div className="flex justify-center gap-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg"
          >
            <X className="w-8 h-8 text-white" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg"
          >
            <Heart className="w-8 h-8 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Match Modal */}
      <MatchModal
        movie={match ? movies.find(m => m.id === match.movie_id) || null : null}
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
      />
    </div>
  )
}
