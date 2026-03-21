'use client'

import { motion } from 'framer-motion'
import { useLanguage } from './LanguageProvider'
import { Language } from '@/lib/translations'
import { Globe } from 'lucide-react'

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'ar', label: 'العربية', flag: '🇩🇿' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
]

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 glass-card-hover rounded-xl text-sm">
        <Globe size={16} className="text-neon-cyan" />
        <span>{languages.find(l => l.code === language)?.flag}</span>
        <span className="hidden sm:inline">{languages.find(l => l.code === language)?.label}</span>
      </button>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-full mt-2 right-0 sm:left-0 sm:right-auto min-w-[140px] glass-card rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`w-full px-4 py-3 flex items-center gap-3 text-sm hover:bg-white/10 transition-colors ${
              language === lang.code ? 'bg-neon-cyan/20 text-neon-cyan' : ''
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </motion.div>
    </div>
  )
}
