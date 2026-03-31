'use client'

import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import { Languages, ArrowRight, FileText, Check, Upload, Download, Trash2, Lock, Star } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { useVisaStore } from '@/store/visaStore'
import { useLanguage } from './LanguageProvider'

const languages = [
  { code: 'ar', name: 'العربية', flag: '🇩🇿', dir: 'rtl' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
]

const TRANSLATION_COST = 50

export function TranslationHub() {
  const { membership, setActiveNav } = useVisaStore()
  const { t, language } = useLanguage()
  const [selectedSource, setSelectedSource] = useState('ar')
  const [selectedTarget, setSelectedTarget] = useState('fr')
  const [text, setText] = useState('')
  const [translated, setTranslated] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [hasTranslation, setHasTranslation] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  const isPremium = membership?.tier === 'gold' || membership?.tier === 'premium'

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError(t('pdfOnly'))
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(t('fileTooLarge'))
      return
    }

    if (!isPremium) {
      setShowUpgradePrompt(true)
      return
    }

    setError(t('extractingText'))
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('targetLang', selectedTarget)

      const res = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to extract text')
      }

      const data = await res.json()
      if (data.text) {
        setText(data.text)
        setFileName(file.name)
        setError('')
      } else {
        setError(t('noTextFound'))
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || t('extractionFailed'))
    }
  }

  const handleTranslate = async () => {
    if (!text.trim()) return

    if (!isPremium) {
      setShowUpgradePrompt(true)
      return
    }

    setIsTranslating(true)
    setError('')
    setProgress(10)

    try {
      setProgress(30)
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLang: selectedSource,
          targetLang: selectedTarget,
        }),
      })

      setProgress(70)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Translation failed')

      setTranslated(data.translated)
      setHasTranslation(true)
      setProgress(100)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Something went wrong during translation')
    } finally {
      setIsTranslating(false)
    }
  }

  const swapLanguages = () => {
    const temp = selectedSource
    setSelectedSource(selectedTarget)
    setSelectedTarget(temp)
    if (translated) {
      setText(translated)
      setTranslated('')
    }
  }

  const copyTranslation = () => {
    navigator.clipboard.writeText(translated)
  }

  const downloadAsPDF = () => {
    const doc = new jsPDF()
    const targetLang = languages.find(l => l.code === selectedTarget)
    
    doc.setFontSize(16)
    doc.text(`Translation (${selectedSource} → ${selectedTarget})`, 20, 20)
    
    doc.setFontSize(10)
    doc.text(`Source: ${languages.find(l => l.code === selectedSource)?.name}`, 20, 30)
    doc.text(`Target: ${targetLang?.name}`, 20, 36)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 42)
    
    doc.setLineWidth(0.5)
    doc.line(20, 48, 190, 48)
    
    doc.setFontSize(11)
    const splitText = doc.splitTextToSize(translated, 170)
    doc.text(splitText, 20, 55)
    
    doc.save(`translation-${selectedTarget}-${Date.now()}.pdf`)
  }

  const downloadAsText = () => {
    const content = `Translation Document
======================
Source Language: ${languages.find(l => l.code === selectedSource)?.name}
Target Language: ${languages.find(l => l.code === selectedTarget)?.name}
Date: ${new Date().toLocaleDateString()}

${translated}
`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `translation-${selectedTarget}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    setText('')
    setTranslated('')
    setHasTranslation(false)
    setFileName(null)
    setError('')
    setProgress(0)
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h2 className="text-2xl font-bold mb-2 gradient-text">{t('translationHub')}</h2>
          <p className="text-white/60 text-sm">{t('translationHubDesc')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-white/50 mb-1 block">{t('from')}</label>
              <select value={selectedSource} onChange={(e) => setSelectedSource(e.target.value)} className="input-field text-sm w-full">
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                ))}
              </select>
            </div>

            <motion.button whileTap={{ scale: 0.9, rotate: 180 }} onClick={swapLanguages} className="mt-6 p-2 glass-card-hover rounded-full">
              <ArrowRight size={20} className="text-neon-cyan" />
            </motion.button>

            <div className="flex-1">
              <label className="text-xs text-white/50 mb-1 block">{t('to')}</label>
              <select value={selectedTarget} onChange={(e) => setSelectedTarget(e.target.value)} className="input-field text-sm w-full">
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-4">
          <div className="glass-card p-4 border border-dashed border-white/30 rounded-2xl">
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file)
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-6 flex flex-col items-center justify-center gap-2 hover:bg-white/5 rounded-xl transition-colors"
            >
              <Upload size={28} className="text-neon-cyan" />
              <span className="text-sm text-white/70">{t('uploadPdfMax10mb')}</span>
              {fileName && <p className="text-xs text-emerald-400">{fileName}</p>}
            </button>
          </div>

          <div>
            <label className="text-sm text-white/70 mb-2 block">{t('originalText')}</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('pasteTextOrUpload')}
              className="input-field min-h-[140px] resize-none"
              dir={languages.find(l => l.code === selectedSource)?.dir}
            />
          </div>

          {isTranslating && progress > 0 && (
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div 
                className="h-full bg-neon-cyan"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}

          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleTranslate}
              disabled={isTranslating || !text.trim()}
              className="flex-1 neon-button flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isTranslating ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  {t('translating')}
                </>
              ) : isPremium ? (
                <>
                  <Languages size={20} />
                  {t('translateNow')}
                </>
              ) : (
                <>
                  <Lock size={20} />
                  {t('upgradeRequired')}
                </>
              )}
            </motion.button>

            <button
              onClick={clearAll}
              className="p-3 glass-card rounded-xl hover:bg-white/10"
              title={t('clearAll')}
            >
              <Trash2 size={20} className="text-red-400" />
            </button>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          {showUpgradePrompt && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 border border-amber-500/50"
            >
              <div className="text-center">
                <Star size={40} className="text-amber-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">{t('vipTranslation')}</h3>
                <p className="text-white/70 text-sm mb-4">
                  {t('vipTranslationDesc')}
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowUpgradePrompt(false)}
                    className="flex-1 py-3 rounded-xl glass-card-hover text-sm"
                  >
                    {t('cancel')}
                  </button>
                  <button 
                    onClick={() => {
                      setShowUpgradePrompt(false)
                      setActiveNav('upgrade')
                    }}
                    className="flex-1 py-3 rounded-xl neon-button text-sm"
                  >
                    {t('upgradeNow')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {hasTranslation && translated && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
              <label className="text-sm text-white/70 mb-2 block">{t('translation')}</label>
              <p className="text-white leading-relaxed whitespace-pre-wrap" dir={languages.find(l => l.code === selectedTarget)?.dir}>
                {translated}
              </p>

              <div className="flex gap-2 mt-6">
                <button onClick={copyTranslation} className="flex-1 py-3 rounded-xl glass-card-hover flex items-center justify-center gap-2 text-sm">
                  <Check size={16} /> {t('copy')}
                </button>
                <button onClick={downloadAsPDF} className="flex-1 py-3 rounded-xl neon-button flex items-center justify-center gap-2 text-sm">
                  <FileText size={16} /> PDF
                </button>
                <button onClick={downloadAsText} className="flex-1 py-3 rounded-xl glass-card-hover flex items-center justify-center gap-2 text-sm">
                  <Download size={16} /> TXT
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h3 className="font-bold mb-4">{t('certifiedTranslationServices')}</h3>
          <div className="space-y-3">
            {[
              { title: t('passportTranslation'), desc: '24-48 ' + t('hours'), price: '3,000 DZD' },
              { title: t('contractTranslation'), desc: '48-72 ' + t('hours'), price: '5,000 DZD' },
              { title: t('officialDocsTranslation'), desc: '72 ' + t('hours'), price: '4,000 DZD' },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="glass-card p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neon-cyan/20 rounded-lg">
                    <Check className="text-neon-cyan" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{service.title}</h4>
                    <p className="text-xs text-white/50">{service.desc}</p>
                  </div>
                </div>
                <span className="text-neon-magenta font-bold">{service.price}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
