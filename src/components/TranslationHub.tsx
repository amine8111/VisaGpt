'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Languages, ArrowRight, ArrowLeft, FileText, Check, Upload, Download } from 'lucide-react'

const languages = [
  { code: 'ar', name: 'العربية', flag: '🇩🇿', dir: 'rtl' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
]

export function TranslationHub() {
  const [selectedSource, setSelectedSource] = useState('ar')
  const [selectedTarget, setSelectedTarget] = useState('fr')
  const [text, setText] = useState('')
  const [translated, setTranslated] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [hasTranslation, setHasTranslation] = useState(false)

  const handleTranslate = () => {
    if (!text.trim()) return
    setIsTranslating(true)
    
    setTimeout(() => {
      setTranslated(`[${selectedTarget.toUpperCase()}] ${text} (ترجمة محاكاة)`)
      setIsTranslating(false)
      setHasTranslation(true)
    }, 1500)
  }

  const swapLanguages = () => {
    const temp = selectedSource
    setSelectedSource(selectedTarget)
    setSelectedTarget(temp)
    setText(translated.replace(/^\[[A-Z]+\]\s/, ''))
    setTranslated('')
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">مركز الترجمة</h2>
          <p className="text-white/60 text-sm">احصل على ترجمة معتمدة لوثائقك</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-white/50 mb-1 block">من</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="input-field text-sm"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              whileTap={{ scale: 0.9, rotate: 180 }}
              onClick={swapLanguages}
              className="mt-6 p-2 glass-card-hover rounded-full"
            >
              <ArrowRight size={20} className="text-neon-cyan" />
            </motion.button>

            <div className="flex-1">
              <label className="text-xs text-white/50 mb-1 block">إلى</label>
              <select
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value)}
                className="input-field text-sm"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div>
            <label className="text-sm text-white/70 mb-2 block">النص الأصلي</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="الصق النص هنا للترجمة..."
              className="input-field min-h-[120px] resize-none"
              dir={languages.find(l => l.code === selectedSource)?.dir}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleTranslate}
            disabled={isTranslating || !text.trim()}
            className="neon-button w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isTranslating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                جارٍ الترجمة...
              </>
            ) : (
              <>
                <Languages size={20} />
                ترجمة
              </>
            )}
          </motion.button>

          {hasTranslation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4"
            >
              <label className="text-sm text-white/70 mb-2 block">الترجمة</label>
              <p className="text-white leading-relaxed" dir={languages.find(l => l.code === selectedTarget)?.dir}>
                {translated}
              </p>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 rounded-xl glass-card-hover flex items-center justify-center gap-2 text-sm">
                  <FileText size={16} />
                  نسخ
                </button>
                <button className="flex-1 py-2 rounded-xl neon-button flex items-center justify-center gap-2 text-sm">
                  <Download size={16} />
                  تحميل PDF
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
          <h3 className="font-bold mb-4">خدمات الترجمة المعتمدة</h3>
          <div className="space-y-3">
            {[
              { title: 'ترجمة جوازات السفر', desc: '24-48 ساعة', price: '3,000 DZD' },
              { title: 'ترجمة عقود العمل', desc: '48-72 ساعة', price: '5,000 DZD' },
              { title: 'ترجمة الوثائق الرسمية', desc: '72 ساعة', price: '4,000 DZD' },
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
