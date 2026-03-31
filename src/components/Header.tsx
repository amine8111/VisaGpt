'use client'

import { motion } from 'framer-motion'
import { Bell, Settings, Sparkles, LogOut, User } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { authAPI } from '@/services'
import { useState, useRef, useEffect } from 'react'
import { useLanguage } from './LanguageProvider'

export function Header() {
  const { t } = useLanguage()
  const { setActiveNav, user, logout } = useVisaStore()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    authAPI.logout()
    setActiveNav('landing')
    setShowMenu(false)
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
    >
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <motion.button 
          onClick={() => setActiveNav('landing')}
          className="pointer-events-auto flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
        >
          {/* Style: Modern gradient with icon */}
          <div className="relative flex items-center">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300" />
            
            {/* Background */}
            <div className="relative px-3 py-1.5 bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-cyan-600/20 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="flex items-center gap-1.5">
                {/* Stylized V icon */}
                <div className="relative">
                  <svg width="20" height="20" viewBox="0 0 24 24" className="drop-shadow-lg">
                    <defs>
                      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF007A" />
                        <stop offset="50%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#00E5FF" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M4 6 L12 18 L20 6" 
                      stroke="url(#logoGradient)" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <circle cx="12" cy="6" r="2" fill="url(#logoGradient)" />
                  </svg>
                </div>
                {/* Text */}
                <span className="text-base font-bold tracking-tight">
                  <span className="text-white">Visa</span>
                  <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">GPT</span>
                </span>
              </div>
            </div>
          </div>
        </motion.button>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={menuRef}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-2 glass-card-hover rounded-full pointer-events-auto"
              >
                <div className="w-8 h-8 bg-neon-cyan/20 rounded-full flex items-center justify-center">
                  <User size={16} className="text-neon-cyan" />
                </div>
                <span className="text-sm font-medium hidden sm:block max-w-[100px] truncate">
                  {user.fullName?.split(' ')[0] || t('user')}
                </span>
              </motion.button>
              
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full right-0 mt-2 w-48 glass-card rounded-xl p-2 border border-white/10 pointer-events-auto"
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-2">
                    <p className="text-sm font-medium truncate">{user.fullName}</p>
                    <p className="text-xs text-white/50 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-neon-cyan/20 text-neon-cyan rounded-full capitalize">
                      {user.membership?.tier || t('free')}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    {t('logout')}
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => window.location.href = '/auth'}
              className="px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded-full text-sm font-medium pointer-events-auto"
            >
              {t('login')}
            </motion.button>
          )}
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 glass-card-hover rounded-full pointer-events-auto"
          >
            <Settings size={20} className="text-white/70" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        <Sparkles className="text-neon-magenta" size={28} />
      </motion.div>
      <span className="text-2xl font-bold gradient-text">VisaGPT</span>
    </div>
  )
}
