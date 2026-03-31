'use client'

import { motion } from 'framer-motion'
import { Upload, FileText, CreditCard, Building2, Check, X, Image } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { useState, useEffect } from 'react'
import { getPassportPhoto, PASSPORT_PHOTO_UPDATED_EVENT } from '@/lib/passportPhotoStore'
import { useLanguage } from './LanguageProvider'

export function DocumentUpload() {
  const { t } = useLanguage()
  const { userProfile, updateProfile, setActiveNav, setCurrentStep, setIsAnalyzing } = useVisaStore()
  const [passportPhoto, setPassportPhoto] = useState<string | null>(null)

  useEffect(() => {
    console.log('📸 DocumentUpload effect running')
    
    // Load initial photo from localStorage
    const storedPhoto = getPassportPhoto()
    console.log('📸 DocumentUpload effect - storedPhoto:', storedPhoto ? 'FOUND' : 'NOT FOUND')
    if (storedPhoto) {
      setPassportPhoto(storedPhoto)
      updateProfile({ passportPhoto: storedPhoto })
    }

    // Also check store
    if (userProfile.passportPhoto) {
      console.log('📸 DocumentUpload - store has photo')
      setPassportPhoto(userProfile.passportPhoto)
    }

    // Listen for updates
    const handleUpdate = () => {
      console.log('📸 DocumentUpload received update event')
      const photo = getPassportPhoto()
      console.log('📸 Photo from event:', photo ? 'FOUND' : 'NOT FOUND')
      setPassportPhoto(photo)
      updateProfile({ passportPhoto: photo })
    }
    window.addEventListener(PASSPORT_PHOTO_UPDATED_EVENT, handleUpdate)
    return () => window.removeEventListener(PASSPORT_PHOTO_UPDATED_EVENT, handleUpdate)
  }, [updateProfile, userProfile.passportPhoto])

  // Check for photo on every render
  useEffect(() => {
    const photo = getPassportPhoto()
    if (photo && !passportPhoto) {
      console.log('📸 Setting photo from background check:', photo.substring(0, 30))
      setPassportPhoto(photo)
    }
  }, [passportPhoto])

  const handleNext = () => {
    setCurrentStep(4)
    setIsAnalyzing(true)
    setTimeout(() => {
      setActiveNav('results')
    }, 3000)
  }

  const handleSkip = () => {
    handleNext()
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">{t('documentUpload')}</h2>
          <p className="text-white/60 text-sm">{t('documentUploadDesc')}</p>
        </motion.div>

        <div className="space-y-4">
          <UploadCard
            icon={Image}
            title={t('passportPhoto')}
            description={t('passportPhotoDesc')}
            hasFile={!!passportPhoto}
            photoPreview={passportPhoto}
            onFileChange={(file) => {
              if (file) {
                const reader = new FileReader()
                reader.onload = (e) => {
                  const dataUrl = e.target?.result as string
                  setPassportPhoto(dataUrl)
                  updateProfile({ passportPhoto: dataUrl })
                }
                reader.readAsDataURL(file)
              }
            }}
          />
          <UploadCard
            icon={FileText}
            title={t('passportCopy')}
            description={t('passportCopyDesc')}
            hasFile={!!userProfile.passport}
            onFileChange={(file) => updateProfile({ passport: file })}
          />
          <UploadCard
            icon={Building2}
            title={t('bankStatementLabel')}
            description={t('bankStatementDesc')}
            hasFile={!!userProfile.bankStatement}
            onFileChange={(file) => updateProfile({ bankStatement: file })}
          />
          <UploadCard
            icon={CreditCard}
            title={t('employmentProofLabel')}
            description={t('employmentProofDesc')}
            hasFile={!!userProfile.employmentProof}
            onFileChange={(file) => updateProfile({ employmentProof: file })}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 space-y-3"
        >
          <button onClick={handleNext} className="neon-button w-full">
            {t('analyzeProfile')}
          </button>
          <button 
            onClick={handleSkip}
            className="w-full py-3 text-white/50 text-sm hover:text-white transition-colors"
          >
            {t('skipStep')}
          </button>
        </motion.div>
      </div>
    </div>
  )
}

function UploadCard({
  icon: Icon,
  title,
  description,
  hasFile,
  photoPreview,
  onFileChange,
}: {
  icon: any
  title: string
  description: string
  hasFile: boolean
  photoPreview?: string | null
  onFileChange: (file: File | null) => void
}) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFileChange(file)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`upload-zone ${hasFile ? 'has-file' : ''} ${isDragging ? 'border-neon-cyan bg-neon-cyan/10' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <label className="cursor-pointer flex items-center gap-4">
        <div className={`p-4 rounded-xl ${hasFile ? 'bg-neon-cyan/20' : 'glass-card'}`}>
          {hasFile && photoPreview ? (
            <img src={photoPreview} alt="Preview" className="w-12 h-12 object-cover rounded-lg" />
          ) : hasFile ? (
            <Check className="text-neon-cyan" size={28} />
          ) : (
            <Icon className="text-neon-cyan" size={28} />
          )}
        </div>
        <div className="flex-1 text-right">
          <h3 className="font-medium text-white">{title}</h3>
          <p className="text-sm text-white/50">{description}</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*,.pdf"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />
        {!hasFile && <Upload className="text-white/30" size={24} />}
      </label>
    </motion.div>
  )
}
