'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, translations, t as translate, getDir } from '@/lib/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, replacements?: Record<string, string>) => string
  dir: 'rtl' | 'ltr'
  isReady: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('visagpt-language') as Language
    if (saved && ['ar', 'en', 'fr'].includes(saved)) {
      setLanguageState(saved)
    }
    setIsReady(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('visagpt-language', lang)
  }

  const t = (key: string, replacements?: Record<string, string>) => {
    if (!isReady) {
      return translate(key, 'en', replacements)
    }
    return translate(key, language, replacements)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir: getDir(language), isReady }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
