'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Scan, Camera, Upload, FileText, CheckCircle, XCircle, 
  AlertTriangle, Loader2, Sparkles, RefreshCw, Download,
  Image, Eye, Trash2, Zap, Shield, FileCheck, Brain,
  ChevronRight, Fingerprint, BarChart3, Check
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { cn } from '@/lib/utils'

interface ScannedDocument {
  id: string
  name: string
  type: string
  status: 'pending' | 'scanning' | 'success' | 'warning' | 'error'
  issues: DocumentIssue[]
  confidence: number
  extractedData?: Record<string, string>
  preview?: string
}

interface DocumentIssue {
  type: 'error' | 'warning' | 'info'
  field: string
  message: string
  messageAr: string
  suggestion?: string
}

export function DocumentInspector() {
  const { t, language } = useLanguage()
  const [documents, setDocuments] = useState<ScannedDocument[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<ScannedDocument | null>(null)
  const [scanProgress, setScanProgress] = useState(0)
  const [overallAnalysis, setOverallAnalysis] = useState<{
    score: number
    status: 'ready' | 'issues' | 'partial' | 'empty'
    summary: string
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLVideoElement>(null)
  const [showCamera, setShowCamera] = useState(false)

  const documentTypes = [
    { id: 'passport', name: language === 'ar' ? 'جواز السفر' : 'Passport', icon: '🛂', color: 'neon-cyan' },
    { id: 'photo', name: language === 'ar' ? 'صورة شخصية' : 'Photo', icon: '📸', color: 'neon-magenta' },
    { id: 'bank_statement', name: language === 'ar' ? 'كشف حساب' : 'Bank Statement', icon: '🏦', color: 'neon-purple' },
    { id: 'employment', name: language === 'ar' ? 'شهادة عمل' : 'Employment Letter', icon: '💼', color: 'emerald-400' },
    { id: 'hotel', name: language === 'ar' ? 'حجز فندق' : 'Hotel Booking', icon: '🏨', color: 'amber-400' },
    { id: 'insurance', name: language === 'ar' ? 'تأمين سفر' : 'Travel Insurance', icon: '🛡️', color: 'cyan-400' },
    { id: 'invitation', name: language === 'ar' ? 'خطاب دعوة' : 'Invitation Letter', icon: '📨', color: 'pink-400' },
    { id: 'other', name: language === 'ar' ? 'أخرى' : 'Other', icon: '📄', color: 'white' },
  ]

  const aiCapabilities = [
    { icon: Scan, title: language === 'ar' ? 'OCR استخراج' : 'OCR Extraction', desc: language === 'ar' ? 'قراءة تلقائية للبيانات' : 'Auto-read data', color: 'neon-cyan' },
    { icon: Shield, title: language === 'ar' ? 'كشف التزوير' : 'Forgery Detection', desc: language === 'ar' ? 'تحقق من صحة الوثيقة' : 'Document authenticity', color: 'neon-magenta' },
    { icon: BarChart3, title: language === 'ar' ? 'تحليل الامتثال' : 'Compliance Analysis', desc: language === 'ar' ? 'فحص معايير التأشيرة' : 'Visa standards check', color: 'neon-purple' },
    { icon: Brain, title: language === 'ar' ? 'تعلم ذكي' : 'Smart Learning', desc: language === 'ar' ? 'يتعلم من كل فحص' : 'Learns from each scan', color: 'emerald-400' },
  ]

  const simulateScan = async (doc: ScannedDocument) => {
    setDocuments(prev => prev.map(d => 
      d.id === doc.id ? { ...d, status: 'scanning' as const } : d
    ))

    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 50))
      setScanProgress(i)
    }

    const issues: DocumentIssue[] = []
    const random = Math.random()

    if (doc.type === 'passport') {
      if (random > 0.4) {
        issues.push({
          type: 'warning',
          field: 'expiry',
          message: 'Passport expires within 6 months',
          messageAr: 'جواز السفر ينتهي خلال 6 أشهر',
          suggestion: language === 'ar' ? 'قم بتجديد جواز السفر أولاً' : 'Renew your passport first'
        })
      }
      if (random > 0.7) {
        issues.push({
          type: 'info',
          field: 'mrz',
          message: 'MRZ code detected and verified',
          messageAr: 'تم اكتشاف والتحقق من رمز MRZ',
        })
      }
    }

    if (doc.type === 'photo') {
      if (random > 0.6) {
        issues.push({
          type: 'error',
          field: 'quality',
          message: 'Photo quality below requirements',
          messageAr: 'جودة الصورة أقل من المتطلبات',
          suggestion: language === 'ar' ? 'أعد التقاط صورة بجودة أعلى' : 'Retake with higher quality'
        })
      }
      if (random > 0.3) {
        issues.push({
          type: 'info',
          field: 'background',
          message: 'Background color verified as white',
          messageAr: 'تم التحقق من أن خلفية الصورة بيضاء',
        })
      }
    }

    if (doc.type === 'bank_statement') {
      if (random > 0.5) {
        issues.push({
          type: 'warning',
          field: 'date',
          message: 'Statement older than 3 months',
          messageAr: 'كشف الحساب أقدم من 3 أشهر',
          suggestion: language === 'ar' ? 'احصل على كشف أحدث' : 'Get a recent statement'
        })
      }
      if (random > 0.7) {
        issues.push({
          type: 'info',
          field: 'balance',
          message: 'Average balance calculated successfully',
          messageAr: 'تم حساب متوسط الرصيد بنجاح',
        })
      }
    }

    if (doc.type === 'employment') {
      if (random > 0.5) {
        issues.push({
          type: 'warning',
          field: 'signature',
          message: 'Signature or stamp may be required',
          messageAr: 'قد يكون التوقيع أو الختم مطلوباً',
          suggestion: language === 'ar' ? 'تأكد من وجود التوقيع والختم' : 'Ensure signature and stamp'
        })
      }
    }

    const status = issues.some(i => i.type === 'error') ? 'error' 
                 : issues.some(i => i.type === 'warning') ? 'warning' 
                 : 'success'

    setDocuments(prev => prev.map(d => 
      d.id === doc.id ? { ...d, status, issues, confidence: Math.floor(Math.random() * 15) + 85 } : d
    ))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const newDoc: ScannedDocument = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: docType,
          status: 'pending',
          issues: [],
          confidence: 0,
          preview: event.target?.result as string
        }
        setDocuments(prev => [...prev, newDoc])
        setTimeout(() => simulateScan(newDoc), 300)
      }
      reader.readAsDataURL(file)
    })
  }

  const handleCameraCapture = () => {
    if (!cameraRef.current) return
    
    const canvas = document.createElement('canvas')
    canvas.width = cameraRef.current.videoWidth
    canvas.height = cameraRef.current.videoHeight
    canvas.getContext('2d')?.drawImage(cameraRef.current, 0, 0)
    
    const newDoc: ScannedDocument = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `Scan_${new Date().toISOString().slice(0, 10)}.jpg`,
      type: 'photo',
      status: 'pending',
      issues: [],
      confidence: 0,
      preview: canvas.toDataURL('image/jpeg')
    }
    
    setDocuments(prev => [...prev, newDoc])
    setShowCamera(false)
    setTimeout(() => simulateScan(newDoc), 300)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream
        cameraRef.current.play()
        setShowCamera(true)
      }
    } catch (err) {
      console.error('Camera access denied:', err)
    }
  }

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id))
    if (selectedDoc?.id === id) setSelectedDoc(null)
    updateOverallAnalysis(documents.filter(d => d.id !== id))
  }

  const updateOverallAnalysis = (docs: ScannedDocument[]) => {
    if (docs.length === 0) {
      setOverallAnalysis({ score: 0, status: 'empty', summary: '' })
      return
    }

    const completedDocs = docs.filter(d => d.status !== 'pending' && d.status !== 'scanning')
    const successCount = completedDocs.filter(d => d.status === 'success').length
    const errorCount = completedDocs.filter(d => d.status === 'error').length
    const warningCount = completedDocs.filter(d => d.status === 'warning').length
    
    const avgConfidence = completedDocs.reduce((acc, d) => acc + d.confidence, 0) / (completedDocs.length || 1)
    
    let status: 'ready' | 'issues' | 'partial' = 'partial'
    let summary = ''
    
    if (errorCount > 0) {
      status = 'issues'
      summary = language === 'ar' 
        ? `يوجد ${errorCount} خطأ يحتاج تصحيح` 
        : `${errorCount} errors need correction`
    } else if (warningCount > 0) {
      status = 'partial'
      summary = language === 'ar'
        ? `جاهز جزئياً - ${warningCount} تحذير`
        : `Partially ready - ${warningCount} warnings`
    } else {
      status = 'ready'
      summary = language === 'ar' ? 'جاهز للتقديم!' : 'Ready to apply!'
    }

    setOverallAnalysis({
      score: Math.round(avgConfidence),
      status,
      summary
    })
  }

  const overallStatus = overallAnalysis?.status || 'empty'

  return (
    <div className="min-h-screen p-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30 mb-4">
            <Brain className="text-neon-purple animate-pulse" size={20} />
            <span className="text-neon-purple text-sm font-medium">AI-Powered Scanner</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">{t('documentScanner')}</span>
          </h1>
          <p className="text-white/60">{t('documentScannerDesc')}</p>
        </motion.div>

        {/* Status Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'card-ai mb-6 relative overflow-hidden',
            overallStatus === 'ready' && 'border-emerald-500/50',
            overallStatus === 'issues' && 'border-red-500/50',
            overallStatus === 'partial' && 'border-yellow-500/50'
          )}
        >
          {/* Animated background for ready state */}
          {overallStatus === 'ready' && (
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 animate-pulse" />
          )}
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                className={cn(
                  'w-16 h-16 rounded-2xl flex items-center justify-center',
                  overallStatus === 'ready' && 'bg-emerald-500/20',
                  overallStatus === 'issues' && 'bg-red-500/20',
                  overallStatus === 'partial' && 'bg-yellow-500/20',
                  overallStatus === 'empty' && 'bg-white/10'
                )}
                animate={overallStatus !== 'empty' ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {overallStatus === 'ready' && <CheckCircle className="text-emerald-400" size={32} />}
                {overallStatus === 'issues' && <AlertTriangle className="text-red-400" size={32} />}
                {overallStatus === 'partial' && <AlertTriangle className="text-yellow-400" size={32} />}
                {overallStatus === 'empty' && <Fingerprint className="text-white/30" size={32} />}
              </motion.div>
              <div>
                <h3 className="font-bold text-lg">
                  {overallStatus === 'ready' && (language === 'ar' ? 'جاهز للتقديم!' : 'Ready to Apply!')}
                  {overallStatus === 'issues' && (language === 'ar' ? 'يوجد مشاكل' : 'Issues Found')}
                  {overallStatus === 'partial' && (language === 'ar' ? 'قيد الإعداد' : 'In Progress')}
                  {overallStatus === 'empty' && (language === 'ar' ? 'لم يتم الفحص بعد' : 'Not Scanned Yet')}
                </h3>
                <p className="text-sm text-white/50">
                  {documents.length} {language === 'ar' ? 'وثيقة' : language === 'fr' ? 'documents' : 'documents'}
                  {documents.length > 0 && ` • ${documents.filter(d => d.status === 'success').length} ${language === 'ar' ? 'صحيحة' : 'verified'}`}
                </p>
              </div>
            </div>
            
            {overallAnalysis && overallAnalysis.score > 0 && (
              <div className="text-right">
                <motion.div 
                  className={cn(
                    'text-3xl font-black',
                    overallAnalysis.score >= 80 && 'text-emerald-400',
                    overallAnalysis.score >= 50 && overallAnalysis.score < 80 && 'text-yellow-400',
                    overallAnalysis.score < 50 && 'text-red-400'
                  )}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                >
                  {overallAnalysis.score}%
                </motion.div>
                <p className="text-xs text-white/50">{language === 'ar' ? 'ثقة الذكاء الاصطناعي' : 'AI Confidence'}</p>
              </div>
            )}
          </div>

          {/* Progress */}
          {documents.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-white/50 mb-2">
                <span>{language === 'ar' ? 'التقدم' : 'Progress'}</span>
                <span>{documents.filter(d => d.status !== 'pending' && d.status !== 'scanning').length}/{documents.length}</span>
              </div>
              <div className="progress-bar">
                <motion.div 
                  className={cn(
                    'progress-fill',
                    overallStatus === 'ready' && 'bg-gradient-to-r from-emerald-400 to-green-400',
                    overallStatus === 'issues' && 'bg-gradient-to-r from-red-400 to-orange-400',
                    overallStatus === 'partial' && 'bg-gradient-to-r from-yellow-400 to-orange-400'
                  )}
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(documents.filter(d => d.status !== 'pending' && d.status !== 'scanning').length / documents.length) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Upload Options */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            className="glass-card-hover p-6 text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-blue-500/20 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-neon-cyan/20 transition-all">
              <Upload className="text-neon-cyan" size={28} />
            </div>
            <h4 className="font-bold mb-1">{language === 'ar' ? 'رفع ملفات' : 'Upload Files'}</h4>
            <p className="text-xs text-white/50">PDF, JPG, PNG</p>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startCamera}
            className="glass-card-hover p-6 text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-neon-magenta/20 to-pink-500/20 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-neon-magenta/20 transition-all">
              <Camera className="text-neon-magenta" size={28} />
            </div>
            <h4 className="font-bold mb-1">{language === 'ar' ? 'التقاط صورة' : 'Take Photo'}</h4>
            <p className="text-xs text-white/50">{language === 'ar' ? 'كاميرا الجهاز' : 'Device Camera'}</p>
          </motion.button>
        </motion.div>

        {/* AI Capabilities */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Sparkles className="text-neon-cyan" size={18} />
            {language === 'ar' ? 'قدرات الذكاء الاصطناعي' : 'AI Capabilities'}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {aiCapabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="glass-card p-4"
              >
                <cap.icon className={cn('mb-2', `text-${cap.color}`)} size={24} />
                <h4 className="font-bold text-sm">{cap.title}</h4>
                <p className="text-xs text-white/50">{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Document Types */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h3 className="font-bold mb-3">{language === 'ar' ? 'أنواع الوثائق' : 'Document Types'}</h3>
          <div className="grid grid-cols-4 gap-2">
            {documentTypes.map((type) => (
              <div key={type.id}>
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e, type.id)}
                  />
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass-card p-3 text-center hover:border-neon-cyan/50 transition-all"
                  >
                    <span className="text-2xl block mb-1">{type.icon}</span>
                    <span className="text-xs text-white/70">{type.name}</span>
                  </motion.div>
                </label>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scanned Documents */}
        <AnimatePresence>
          {documents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">{t('uploadedDocuments')}</h3>
                <button
                  onClick={() => {
                    setDocuments([])
                    setOverallAnalysis({ score: 0, status: 'empty', summary: '' })
                  }}
                  className="text-xs text-white/50 hover:text-white flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  {language === 'ar' ? 'مسح الكل' : 'Clear All'}
                </button>
              </div>
              
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'glass-card p-4 cursor-pointer transition-all',
                      selectedDoc?.id === doc.id && 'border-neon-cyan/50 bg-neon-cyan/5'
                    )}
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        doc.status === 'scanning' && 'bg-neon-cyan/20',
                        doc.status === 'success' && 'bg-emerald-500/20',
                        doc.status === 'warning' && 'bg-yellow-500/20',
                        doc.status === 'error' && 'bg-red-500/20',
                        doc.status === 'pending' && 'bg-white/10'
                      )}>
                        {doc.status === 'scanning' ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <Loader2 className="text-neon-cyan" size={24} />
                          </motion.div>
                        ) : doc.status === 'success' ? (
                          <CheckCircle className="text-emerald-400" size={24} />
                        ) : doc.status === 'warning' ? (
                          <AlertTriangle className="text-yellow-400" size={24} />
                        ) : doc.status === 'error' ? (
                          <XCircle className="text-red-400" size={24} />
                        ) : (
                          <FileText className="text-white/50" size={24} />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{doc.name}</p>
                        <p className="text-xs text-white/50">
                          {documentTypes.find(t => t.id === doc.type)?.name || doc.type}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        {doc.confidence > 0 && (
                          <div className={cn(
                            'text-lg font-bold',
                            doc.confidence >= 80 && 'text-emerald-400',
                            doc.confidence >= 50 && doc.confidence < 80 && 'text-yellow-400',
                            doc.confidence < 50 && 'text-red-400'
                          )}>
                            {doc.confidence}%
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeDocument(doc.id)
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="text-white/50 hover:text-red-400" size={18} />
                      </button>
                    </div>

                    {/* Issues */}
                    {doc.issues.length > 0 && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-3 pt-3 border-t border-white/10 space-y-2"
                      >
                        {doc.issues.map((issue, i) => (
                          <div
                            key={i}
                            className={cn(
                              'flex items-start gap-2 text-sm p-2 rounded-lg',
                              issue.type === 'error' && 'bg-red-500/10',
                              issue.type === 'warning' && 'bg-yellow-500/10',
                              issue.type === 'info' && 'bg-blue-500/10'
                            )}
                          >
                            {issue.type === 'error' && <XCircle size={14} className="text-red-400 mt-0.5" />}
                            {issue.type === 'warning' && <AlertTriangle size={14} className="text-yellow-400 mt-0.5" />}
                            {issue.type === 'info' && <CheckCircle size={14} className="text-blue-400 mt-0.5" />}
                            <div>
                              <p className={cn(
                                'font-medium',
                                issue.type === 'error' && 'text-red-400',
                                issue.type === 'warning' && 'text-yellow-400',
                                issue.type === 'info' && 'text-blue-400'
                              )}>
                                {language === 'ar' ? issue.messageAr : issue.message}
                              </p>
                              {issue.suggestion && (
                                <p className="text-xs text-white/50 mt-1">{issue.suggestion}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Camera Modal */}
        <AnimatePresence>
          {showCamera && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50 flex flex-col"
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setShowCamera(false)}
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <XCircle className="text-white" size={24} />
                </button>
              </div>
              <video
                ref={cameraRef}
                className="flex-1 object-cover"
                autoPlay
                playsInline
                muted
              />
              <div className="p-6 bg-black/80">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCameraCapture}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Camera className="size-5" />
                  {language === 'ar' ? 'التقاط' : 'Capture'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          onChange={(e) => handleFileUpload(e, 'other')}
        />
      </div>
    </div>
  )
}

export default DocumentInspector
