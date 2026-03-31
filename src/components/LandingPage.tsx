'use client'

import { motion } from 'framer-motion'
import { Sparkles, Shield, Zap, Globe, ArrowRight, ArrowLeft } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { useLanguage } from './LanguageProvider'

export function LandingPage() {
  const { setActiveNav, setCurrentStep, resetForm } = useVisaStore()
  const { t, dir } = useLanguage()

  const handleStart = () => {
    resetForm()
    setCurrentStep(0)
    setActiveNav('calculator')
  }

  const handleLogin = () => {
    setActiveNav('auth')
  }

  const features = [
    { icon: Zap, label: t('instantAnalysis'), desc: t('instantAnalysisDesc') },
    { icon: Shield, label: t('smartRecommendations'), desc: t('smartRecommendationsDesc') },
    { icon: Globe, label: t('multipleVisas'), desc: t('multipleVisasDesc') },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pb-24 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-card">
            <Sparkles className="text-neon-cyan" size={20} />
            <span className="text-sm text-white/80">Powered by AI</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          <span className="gradient-text">VisaGPT</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed"
        >
          {t('landingTagline')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-8"
        >
          <button onClick={handleStart} className="neon-button text-lg px-10 py-4 group">
            <span className="flex items-center gap-3">
              {t('calculateChance')}
              {dir === 'rtl' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </span>
          </button>
          
          <button 
            onClick={handleLogin} 
            className="mt-4 text-white/60 hover:text-neon-cyan transition-colors text-sm"
          >
            {t('login')} / {t('register')}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="grid grid-cols-3 gap-4 max-w-md mx-auto"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="glass-card p-4 text-center"
              >
                <Icon className="mx-auto mb-2 text-neon-cyan" size={24} />
                <p className="text-sm font-medium text-white">{feature.label}</p>
                <p className="text-xs text-white/50 mt-1">{feature.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>

      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-32"
      >
        <div className="text-white/30 text-sm">scroll</div>
      </motion.div>
    </div>
  )
}
