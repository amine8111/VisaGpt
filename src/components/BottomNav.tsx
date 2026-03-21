'use client'

import { motion } from 'framer-motion'
import { Home, Calculator, Wrench, Users, User, Brain, Globe, Scan } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

export function BottomNav() {
  const { activeNav, setActiveNav, setCurrentStep, resetForm } = useVisaStore()
  const { t } = useLanguage()

  const navItems = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'results', label: t('approvalChance'), icon: Calculator },
    { id: 'services', label: t('services'), icon: Wrench },
    { id: 'community', label: t('community'), icon: Users },
    { id: 'profile', label: t('profile'), icon: User },
  ]

  const handleNavClick = (id: string) => {
    if (id === 'calculator' || id === 'landing') {
      resetForm()
      setCurrentStep(0)
    }
    setActiveNav(id)
  }

  return (
    <motion.nav 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-glass-border/30"
    >
      <div className="flex items-center justify-around py-3 px-4 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeNav === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                'nav-item relative flex-col',
                isActive && 'text-neon-cyan'
              )}
            >
              <Icon size={22} className={cn(isActive && 'drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]')} />
              <span className="text-xs mt-1">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute -top-1 w-1 h-1 bg-neon-cyan rounded-full shadow-[0_0_10px_rgba(0,229,255,0.8)]"
                />
              )}
            </button>
          )
        })}
      </div>
    </motion.nav>
  )
}

export function FloatingAIButton() {
  const { setActiveNav } = useVisaStore()
  
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: 'spring' }}
      onClick={() => setActiveNav('chatbot')}
      className="fixed top-20 left-4 z-50 p-3 glass-card-hover rounded-full group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Brain size={24} className="text-neon-magenta group-hover:drop-shadow-[0_0_12px_rgba(255,0,122,0.8)]" />
    </motion.button>
  )
}

export function BrainNav() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      className="fixed top-4 left-4 z-50 opacity-20"
    >
      <Brain size={48} className="text-neon-cyan" />
    </motion.div>
  )
}
