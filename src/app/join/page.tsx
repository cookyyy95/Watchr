'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { sessionManager } from '@/lib/session'
import { useRouter } from 'next/navigation'

export default function JoinSessionPage() {
  const [userName, setUserName] = useState('')
  const [sessionCode, setSessionCode] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName.trim() || !sessionCode.trim()) return

    setIsJoining(true)
    setError('')
    
    try {
      const { session } = await sessionManager.joinSession(sessionCode.trim(), userName.trim())
      router.push(`/session/${session.code}`)
    } catch (error) {
      console.error('Failed to join session:', error)
      setError('Invalid session code or session not available. Please check the code and try again.')
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="glass-effect rounded-2xl p-8">
          <Link
            href="/"
            className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Join Session</h1>
            <p className="text-white/70">Enter the session code to join your friend</p>
          </div>
          
          <form onSubmit={handleJoinSession} className="space-y-6">
            <div>
              <label htmlFor="sessionCode" className="block text-sm font-medium text-white mb-2">
                Session Code
              </label>
              <input
                id="sessionCode"
                type="text"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                maxLength={6}
                required
              />
            </div>
            
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-white mb-2">
                Your Name
              </label>
              <input
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300"
              >
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}
            
            <button
              type="submit"
              disabled={isJoining || !userName.trim() || !sessionCode.trim()}
              className="button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isJoining ? 'Joining...' : 'Join Session'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
