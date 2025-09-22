'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Users, Heart, Star } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold gradient-text mb-6"
        >
          Watchr
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl"
        >
          Find the perfect movie to watch together with friends using our Tinder-style swipe interface
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/create" className="button-primary text-lg px-8 py-4">
            <Play className="inline-block mr-2" size={20} />
            Create Session
          </Link>
          <Link href="/join" className="button-secondary text-lg px-8 py-4">
            <Users className="inline-block mr-2" size={20} />
            Join Session
          </Link>
        </motion.div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="grid md:grid-cols-3 gap-8 max-w-4xl w-full"
      >
        <FeatureCard
          icon={<Users className="w-8 h-8" />}
          title="Easy Sessions"
          description="Create a 6-digit code or join an existing session with friends"
        />
        <FeatureCard
          icon={<Heart className="w-8 h-8" />}
          title="Swipe & Match"
          description="Swipe right on movies you like, find matches when you both agree"
        />
        <FeatureCard
          icon={<Star className="w-8 h-8" />}
          title="Discover Movies"
          description="Explore thousands of movies from TMDb with detailed information"
        />
      </motion.div>

      {/* Floating elements for visual appeal */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-10 w-4 h-4 bg-purple-400/30 rounded-full"
        />
        <motion.div
          animate={{ 
            x: [0, -150, 0],
            y: [0, 100, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-10 w-6 h-6 bg-pink-400/30 rounded-full"
        />
        <motion.div
          animate={{ 
            x: [0, 200, 0],
            y: [0, -50, 0],
            rotate: [0, 360, 0]
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 right-20 w-3 h-3 bg-blue-400/30 rounded-full"
        />
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="glass-effect rounded-2xl p-6 text-center"
    >
      <div className="text-purple-400 mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/70">{description}</p>
    </motion.div>
  )
}
