'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import { sessionManager } from '@/lib/session'
import { useRouter } from 'next/navigation'

export default function CreateSessionPage() {
  const [userName, setUserName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [sessionCode, setSessionCode] = useState('')
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName.trim()) return

    setIsCreating(true)
    try {
      const { session } = await sessionManager.createSession(userName.trim())
      setSessionCode(session.code)
    } catch (error) {
      console.error('Failed to create session:', error)
      alert('Failed to create session. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sessionCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  if (sessionCode) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="glass-effect rounded-2xl p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-2xl font-bold text-white mb-4">Session Created!</h1>
            <p className="text-white/70 mb-6">Share this code with your friend to start watching together</p>
            
            <div className="bg-slate-800 rounded-xl p-4 mb-6">
              <div className="text-3xl font-mono font-bold text-purple-400 tracking-wider">
                {sessionCode}
              </div>
            </div>
            
            <button
              onClick={copyToClipboard}
              className="button-secondary w-full mb-4 flex items-center justify-center"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-2" />
                  Copy Code
                </>
              )}
            </button>
            
            <p className="text-sm text-white/50 mb-6">
              Waiting for your friend to join...
            </p>
            
            <Link
              href={`/session/${sessionCode}`}
              className="button-primary w-full"
            >
              Go to Session
            </Link>
          </div>
        </motion.div>
      </div>
    )
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
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Create Session</h1>
            <p className="text-white/70">Start a new movie watching session</p>
          </div>
          
          <form onSubmit={handleCreateSession} className="space-y-6">
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
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isCreating || !userName.trim()}
              className="button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create Session'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
