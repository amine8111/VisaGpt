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
      className="fixed top-0 left-0 right-0 z-40 glass-card border-b border-white/10"
    >
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => setActiveNav('landing')}
          className="flex items-center gap-2"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="text-neon-magenta" size={24} />
          </motion.div>
          <span className="text-xl font-bold gradient-text">VisaAI</span>
        </button>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={menuRef}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-2 glass-card-hover rounded-full"
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
                  className="absolute top-full right-0 mt-2 w-48 glass-card rounded-xl p-2 border border-white/10"
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
              className="px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded-full text-sm font-medium"
            >
              {t('login')}
            </motion.button>
          )}
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 glass-card-hover rounded-full"
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
      <span className="text-2xl font-bold gradient-text">VisaAI</span>
    </div>
  )
}
