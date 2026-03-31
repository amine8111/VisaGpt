'use client'

import { motion } from 'framer-motion'
import { useVisaStore } from '@/store/visaStore'
import { useLanguage } from './LanguageProvider'
import { useEffect } from 'react'

export function AIProcessing() {
  const { runAssessment, setIsAnalyzing } = useVisaStore()
  const { t } = useLanguage()

  const steps = [
    t('analyzingPersonalData'),
    t('analyzingFinancialStatus'),
    t('analyzingTravelHistory'),
    t('calculatingVisaScore'),
  ]

  useEffect(() => {
    const timer = setTimeout(async () => {
      await runAssessment()
      setIsAnalyzing(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [runAssessment, setIsAnalyzing])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative mb-12">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-neon-cyan/30 to-neon-magenta/30 blur-2xl"
          />
          
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-40 h-40 rounded-full border-4 border-transparent border-t-neon-cyan border-r-neon-magenta" />
          </motion.div>
          
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-4 flex items-center justify-center"
          >
            <div className="w-32 h-32 rounded-full border-4 border-transparent border-b-neon-purple border-l-neon-cyan" />
          </motion.div>
          
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center">
              <span className="text-3xl font-bold">AI</span>
            </div>
          </motion.div>
        </div>

        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl font-bold gradient-text mb-4"
        >
          {t('analyzingProfile')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/60"
        >
          {t('pleaseWait')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 space-y-3"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.3 }}
              className="flex items-center gap-3 text-sm text-white/70"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
                className="w-2 h-2 rounded-full bg-neon-cyan"
              />
              {step}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
