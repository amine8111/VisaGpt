'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Monitor, Check } from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { cn } from '@/lib/utils'

type Theme = 'dark' | 'light' | 'system'

export function ThemeToggle() {
  const { t, language } = useLanguage()
  const [theme, setTheme] = useState<Theme>('dark')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('visagpt_theme') as Theme
    if (saved) {
      setTheme(saved)
      applyTheme(saved)
    } else {
      setTheme('dark')
      applyTheme('dark')
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('light', !prefersDark)
      root.classList.toggle('dark', prefersDark)
    } else {
      root.classList.toggle('light', newTheme === 'light')
      root.classList.toggle('dark', newTheme === 'dark')
    }
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('visagpt_theme', newTheme)
    applyTheme(newTheme)
    setIsOpen(false)
  }

  const themes: { id: Theme; label: string; labelAr: string; labelFr: string; icon: any }[] = [
    { id: 'dark', label: 'Dark', labelAr: 'داكن', labelFr: 'Sombre', icon: Moon },
    { id: 'light', label: 'Light', labelAr: 'فاتح', labelFr: 'Clair', icon: Sun },
    { id: 'system', label: 'System', labelAr: 'النظام', labelFr: 'Système', icon: Monitor },
  ]

  const getLabel = (t: typeof themes[0]) => {
    if (language === 'ar') return t.labelAr
    if (language === 'fr') return t.labelFr
    return t.label
  }

  const currentTheme = themes.find(t => t.id === theme)
  const CurrentIcon = currentTheme?.icon || Moon

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 glass-card rounded-full hover:bg-white/10 transition-colors"
        whileTap={{ scale: 0.95 }}
      >
        <CurrentIcon size={20} className="text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 w-48 glass-card-elevated rounded-xl overflow-hidden z-50 shadow-xl"
            >
              <div className="p-2">
                <p className="text-xs text-white/50 px-3 py-2">
                  {language === 'ar' ? 'السمة' : language === 'fr' ? 'Thème' : 'Theme'}
                </p>
                {themes.map((t) => {
                  const Icon = t.icon
                  const isActive = theme === t.id
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleThemeChange(t.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                        isActive ? 'bg-neon-cyan/20 text-neon-cyan' : 'hover:bg-white/10'
                      )}
                    >
                      <Icon size={18} />
                      <span className="flex-1 text-left text-sm">{getLabel(t)}</span>
                      {isActive && <Check size={16} />}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ThemeToggle
