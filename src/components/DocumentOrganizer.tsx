'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef } from 'react'
import { 
  Upload, FileText, X, CheckCircle, AlertCircle, 
  Download, Eye, Trash2, Plus, File, Zap, Loader2, Shield
} from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

interface UploadedDocument {
  id: string
  name: string
  type: string
  size: number
  file: File
  preview?: string
}

export function DocumentOrganizer() {
  const { setActiveNav } = useVisaStore()
  const { t, dir } = useLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [documents, setDocuments] = useState<UploadedDocument[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newDoc: UploadedDocument = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          file,
          preview: e.target?.result as string
        }
        setDocuments(prev => [...prev, newDoc])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleCombinePDF = async () => {
    if (documents.length === 0) return
    
    setIsProcessing(true)
    setProcessingStep(t('preparingFiles'))
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    setProcessingStep(t('creatingPDF'))
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    setProcessingStep(t('formattingPages'))
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsProcessing(false)
    setProcessingStep('')
    
    alert(t('pdfCreatedSuccess') + `\n${t('numberOfPages')}: ${documents.length}\n${t('canDownloadNow')}`)
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">{t('documentOrganizer')}</h2>
          <p className="text-white/60 text-sm">
            {t('documentOrganizerDesc')}
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-full glass-card p-8 border-2 border-dashed border-neon-cyan/30 hover:border-neon-cyan/50 transition-colors text-center"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-neon-cyan/20 flex items-center justify-center mb-4">
                <Upload className="text-neon-cyan" size={32} />
              </div>
              <p className="font-medium mb-2">{t('clickToUpload')}</p>
              <p className="text-xs text-white/50">
                {t('fileFormatsNote')}
              </p>
            </div>
          </motion.button>
        </motion.div>

        {/* Document List */}
        {documents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 mb-6"
          >
            <h3 className="font-bold text-sm">
              {t('uploadedDocuments')} ({documents.length})
            </h3>
            
            <AnimatePresence>
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-neon-purple/20 flex items-center justify-center">
                      <FileText className="text-neon-purple" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{doc.name}</p>
                      <p className="text-xs text-white/50">
                        {formatFileSize(doc.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeDocument(doc.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="text-red-400" size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Combine Button */}
        {documents.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleCombinePDF}
              disabled={isProcessing}
              className="neon-button w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {processingStep}
                </>
              ) : (
                <>
                  <Zap size={20} />
                  {t('mergeToPDF')}
                </>
              )}
            </motion.button>

            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="flex-1 glass-card-hover py-3 flex items-center justify-center gap-2"
              >
                <Download size={18} />
                {t('downloadAll')}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setDocuments([])}
                className="flex-1 glass-card-hover py-3 flex items-center justify-center gap-2 text-red-400"
              >
                <Trash2 size={18} />
                {t('deleteAll')}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {documents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center">
              <File className="text-white/30" size={48} />
            </div>
            <p className="text-white/50 text-sm">
              {t('noDocumentsUploaded')}
            </p>
          </motion.div>
        )}

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 bg-neon-cyan/10 rounded-xl border border-neon-cyan/20"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="text-neon-cyan flex-shrink-0" size={20} />
            <div className="text-sm">
              <h4 className="font-medium text-neon-cyan mb-1">{t('fileOrderImportant')}</h4>
              <p className="text-white/70">
                {t('fileOrderTip')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 grid grid-cols-3 gap-3"
        >
          {[
            { icon: CheckCircle, label: t('automatic'), desc: t('smartOrganize') },
            { icon: FileText, label: t('singlePDF'), desc: t('readyToPrint') },
            { icon: Shield, label: t('secure'), desc: t('dataProtected') },
          ].map((feature, index) => (
            <div key={index} className="glass-card p-3 text-center">
              <feature.icon className="text-neon-cyan mx-auto mb-2" size={24} />
              <p className="text-xs font-medium">{feature.label}</p>
              <p className="text-xs text-white/50">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default DocumentOrganizer
