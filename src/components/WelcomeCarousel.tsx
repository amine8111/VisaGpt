'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Shield, Sparkles, Award, ChevronRight, ChevronLeft, 
  CheckCircle, Star, Globe, Zap, Lock
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'

interface WelcomeCarouselProps {
  onComplete: () => void
}

export function WelcomeCarousel({ onComplete }: WelcomeCarouselProps) {
  const { language } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)

  const slides = [
    {
      icon: Shield,
      gradient: 'from-neon-magenta to-purple-600',
      titleAr: 'مرحباً بك في VisaGPT',
      titleEn: 'Welcome to VisaGPT',
      titleFr: 'Bienvenue sur VisaGPT',
      descAr: 'الرقم 1 في خدمات التأشيرات في شمال أفريقيا',
      descEn: '#1 Visa Service in North Africa',
      descFr: 'N°1 du service visa en Afrique du Nord',
      stats: [
        { value: '100K+', label: language === 'ar' ? 'طلب' : 'Applications' },
        { value: '95%', label: language === 'ar' ? 'نجاح' : 'Success' },
        { value: '15+', label: language === 'ar' ? 'سنة' : 'Years' },
      ]
    },
    {
      icon: Sparkles,
      gradient: 'from-neon-cyan to-blue-600',
      titleAr: 'ذكاء اصطناعي متقدم',
      titleEn: 'AI-Powered Technology',
      titleFr: 'Technologie IA',
      descAr: 'نستخدم أحدث تقنيات الذكاء الاصطناعي لتحليل ملفك',
      descEn: 'Cutting-edge AI analyzes your application',
      descFr: 'Technologie IA de pointe pour analyser votre dossier',
      stats: [
        { value: '95%', label: language === 'ar' ? 'دقة' : 'Accuracy' },
        { value: '24h', label: language === 'ar' ? 'نتيجة' : 'Results' },
        { value: '100%', label: language === 'ar' ? 'secure' : 'Secure' },
      ]
    },
    {
      icon: Award,
      gradient: 'from-yellow-500 to-orange-600',
      titleAr: 'خبرة حقيقية من VFS و BLS',
      titleEn: 'Real VFS & BLS Expertise',
      titleFr: 'Expertise VFS & BLS Réelle',
      descAr: 'فرقنا تعمل مباشرة في مراكز التأشيرة - نعرف ما يطلبه الموظفون',
      descEn: 'Our teams work directly at visa centers - we know what officers look for',
      descFr: 'Nos équipes travaillent directement dans les centres - nous savons ce qu\'ils veulent',
      stats: [
        { value: '10+', label: language === 'ar' ? 'دولة' : 'Countries' },
        { value: '50+', label: language === 'ar' ? 'خبير' : 'Experts' },
        { value: '24/7', label: language === 'ar' ? 'دعم' : 'Support' },
      ]
    },
    {
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
      titleAr: 'ابدأ مجاناً الآن',
      titleEn: 'Start Free Now',
      titleFr: 'Commencez Gratuitement',
      descAr: 'تقييم مجاني فوري - بدون بطاقة ائتمان',
      descEn: 'Free instant assessment - no credit card required',
      descFr: 'Évaluation gratuite instantanée - sans carte de crédit',
      cta: true,
    },
  ]

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1)
      setCurrentSlide(currentSlide + 1)
    } else {
      onComplete()
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1)
      setCurrentSlide(currentSlide - 1)
    }
  }

  const slide = slides[currentSlide]
  const Icon = slide.icon

  const getTitle = () => {
    switch (language) {
      case 'ar': return slide.titleAr
      case 'fr': return slide.titleFr
      default: return slide.titleEn
    }
  }

  const getDesc = () => {
    switch (language) {
      case 'ar': return slide.descAr
      case 'fr': return slide.descFr
      default: return slide.descEn
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col"
    >
      {/* Skip button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={onComplete}
          className="px-4 py-2 text-sm text-white/60 hover:text-white"
        >
          {language === 'ar' ? 'تخطي' : language === 'fr' ? 'Passer' : 'Skip'}
        </button>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -100 }}
            transition={{ duration: 0.3 }}
            className="text-center w-full max-w-sm"
          >
            {/* Icon */}
            <div className="relative mx-auto w-28 h-28 mb-8">
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} rounded-full blur-2xl opacity-30 animate-pulse`} />
              <div className={`relative w-full h-full rounded-full bg-gradient-to-br ${slide.gradient} p-1`}>
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  <Icon className="text-white" size={48} />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold mb-3">{getTitle()}</h1>
            
            {/* Description */}
            <p className="text-white/60 text-base mb-8 leading-relaxed">{getDesc()}</p>

            {/* Stats (for first 3 slides) */}
            {slide.stats && (
              <div className="flex justify-center gap-6 mb-8">
                {slide.stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">{stat.value}</div>
                    <div className="text-xs text-white/50">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* CTA for last slide */}
            {slide.cta && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-magenta to-neon-purple text-white font-bold text-lg shadow-lg"
              >
                {language === 'ar' ? 'ابدأ التقييم المجاني' : language === 'fr' ? 'Évaluation Gratuite' : 'Start Free Assessment'}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="px-6 pb-8">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > currentSlide ? 1 : -1); setCurrentSlide(i); }}
              className={`h-2 rounded-full transition-all ${
                i === currentSlide 
                  ? 'w-8 bg-gradient-to-r from-neon-magenta to-neon-cyan' 
                  : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevSlide}
            className={`p-3 rounded-full glass-card ${currentSlide === 0 ? 'opacity-0' : ''}`}
            disabled={currentSlide === 0}
          >
            <ChevronLeft size={24} className="text-white" />
          </button>

          <div className="flex items-center gap-2 text-xs text-white/40">
            <Lock size={12} />
            {language === 'ar' ? 'بياناتك محمية' : language === 'fr' ? 'Données protégées' : 'Your data is protected'}
          </div>

          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-gradient-to-r from-neon-magenta to-neon-cyan"
          >
            {currentSlide === slides.length - 1 ? (
              <CheckCircle size={24} className="text-white" />
            ) : (
              <ChevronRight size={24} className="text-white" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default WelcomeCarousel
