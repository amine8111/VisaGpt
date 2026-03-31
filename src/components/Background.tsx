'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'

interface Star {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

export function NeonBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 3,
    }))
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-cosmic" />
      
      {/* Grid Lines */}
      <div className="absolute inset-0 grid-lines" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-cyan/15 rounded-full blur-[150px] animate-pulse-glow" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-neon-magenta/15 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 left-1/2 w-[350px] h-[350px] bg-neon-purple/15 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
      
      {/* Star Field */}
      <div className="starfield">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Particles */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-20 w-2 h-2 bg-neon-cyan rounded-full shadow-[0_0_30px_rgba(0,229,255,1)]"
      />
      
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-40 left-40 w-1.5 h-1.5 bg-neon-magenta rounded-full shadow-[0_0_20px_rgba(255,0,122,1)]"
      />
      
      <motion.div
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute bottom-40 right-40 w-2 h-2 bg-neon-purple rounded-full shadow-[0_0_30px_rgba(139,92,246,1)]"
      />

      {/* Animated Waves */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#FF007A" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF007A" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0,300 Q250,200 500,300 T1000,300 T1500,300 T2000,300"
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="2"
          animate={{
            d: [
              "M0,300 Q250,200 500,300 T1000,300 T1500,300 T2000,300",
              "M0,320 Q250,220 500,280 T1000,320 T1500,280 T2000,320",
              "M0,300 Q250,200 500,300 T1000,300 T1500,300 T2000,300",
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.path
          d="M0,400 Q250,300 500,400 T1000,400 T1500,400 T2000,400"
          fill="none"
          stroke="url(#waveGradient2)"
          strokeWidth="1.5"
          opacity="0.6"
          animate={{
            d: [
              "M0,400 Q250,300 500,400 T1000,400 T1500,400 T2000,400",
              "M0,380 Q250,280 500,420 T1000,380 T1500,420 T2000,380",
              "M0,400 Q250,300 500,400 T1000,400 T1500,400 T2000,400",
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.path
          d="M0,500 Q250,450 500,500 T1000,500 T1500,500 T2000,500"
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="1"
          opacity="0.3"
          animate={{
            d: [
              "M0,500 Q250,450 500,500 T1000,500 T1500,500 T2000,500",
              "M0,520 Q250,470 500,480 T1000,520 T1500,480 T2000,520",
              "M0,500 Q250,450 500,500 T1000,500 T1500,500 T2000,500",
            ]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </svg>

      {/* Vignette Effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(3, 0, 20, 0.4) 100%)',
        }}
      />
    </div>
  )
}

export function GradientOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-neon-cyan/20 to-transparent rounded-full blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.25, 0.5, 0.25],
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-tr from-neon-magenta/15 to-transparent rounded-full blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-gradient-to-t from-neon-purple/10 to-transparent rounded-full blur-[120px]"
      />
    </div>
  )
}

export function HolographicBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 holographic" />
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <circle cx="200" cy="200" r="180" fill="none" stroke="url(#holoGradient)" strokeWidth="1" strokeDasharray="10 20" />
          <circle cx="200" cy="200" r="150" fill="none" stroke="url(#holoGradient)" strokeWidth="0.5" strokeDasharray="5 15" />
          <circle cx="200" cy="200" r="120" fill="none" stroke="url(#holoGradient)" strokeWidth="0.5" />
          <defs>
            <linearGradient id="holoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#FF007A" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  )
}

export default NeonBackground
