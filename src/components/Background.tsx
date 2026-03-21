'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function NeonBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[128px]" />
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-neon-magenta/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-neon-purple/20 rounded-full blur-[128px]" />
      
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-20 w-2 h-2 bg-neon-cyan rounded-full shadow-[0_0_20px_rgba(0,229,255,0.8)]"
      />
      
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-40 left-40 w-1.5 h-1.5 bg-neon-magenta rounded-full shadow-[0_0_15px_rgba(255,0,122,0.8)]"
      />
      
      <motion.div
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute bottom-40 right-40 w-2 h-2 bg-neon-purple rounded-full shadow-[0_0_25px_rgba(139,92,246,0.8)]"
      />

      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#FF007A" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0,300 Q250,200 500,300 T1000,300"
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="2"
          animate={{
            d: [
              "M0,300 Q250,200 500,300 T1000,300",
              "M0,320 Q250,220 500,280 T1000,320",
              "M0,300 Q250,200 500,300 T1000,300",
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.path
          d="M0,400 Q250,300 500,400 T1000,400"
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="1.5"
          opacity="0.5"
          animate={{
            d: [
              "M0,400 Q250,300 500,400 T1000,400",
              "M0,380 Q250,280 500,420 T1000,380",
              "M0,400 Q250,300 500,400 T1000,400",
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </svg>
    </div>
  )
}

export function GradientOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-neon-cyan/10 to-transparent rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-tr from-neon-magenta/10 to-transparent rounded-full blur-3xl"
      />
    </div>
  )
}
