'use client'

import { motion } from 'framer-motion'
import { Upload, FileText, CreditCard, Building2, Check, X } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { useState } from 'react'

export function DocumentUpload() {
  const { userProfile, updateProfile, setActiveNav, setCurrentStep, setIsAnalyzing } = useVisaStore()

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
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">رفع الوثائق</h2>
          <p className="text-white/60 text-sm">قم برفع الوثائق المطلوبة لتحسين دقة التحليل</p>
        </motion.div>

        <div className="space-y-4">
          <UploadCard
            icon={FileText}
            title="جواز السفر"
            description="صورة واضحة من صفحة البيانات"
            hasFile={!!userProfile.passport}
            onFileChange={(file) => updateProfile({ passport: file })}
          />
          <UploadCard
            icon={Building2}
            title="كشف الحساب البنكي"
            description="كشف حساب آخر 3 أشهر"
            hasFile={!!userProfile.bankStatement}
            onFileChange={(file) => updateProfile({ bankStatement: file })}
          />
          <UploadCard
            icon={CreditCard}
            title="إثبات العمل"
            description="شهادة عمل أو كشف راتب"
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
            تحليل الملف
          </button>
          <button 
            onClick={handleSkip}
            className="w-full py-3 text-white/50 text-sm hover:text-white transition-colors"
          >
            تخطي这一步
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
  onFileChange,
}: {
  icon: any
  title: string
  description: string
  hasFile: boolean
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
          {hasFile ? (
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
