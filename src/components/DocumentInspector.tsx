'use client'

import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import { 
  FileText, Upload, AlertTriangle, CheckCircle, XCircle, 
  Clock, Calendar, User, Shield, Loader2, Download, RefreshCw,
  FileCheck, Eye, X, AlertCircle, Check
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

interface DocumentIssue {
  type: 'error' | 'warning' | 'info'
  category: string
  message: string
  messageAr: string
  field?: string
  severity: 'critical' | 'high' | 'medium' | 'low'
}

interface UploadedDoc {
  id: string
  name: string
  type: string
  issues: DocumentIssue[]
  checked: boolean
  status: 'pending' | 'scanning' | 'complete'
}

const documentChecks = [
  {
    id: 'signature',
    name: 'التوقيع',
    nameEn: 'Signature',
    checks: [
      { field: 'application_form', issue: 'Missing signature on application form', issueAr: 'نموذج الطلب بدون توقيع' },
      { field: 'cover_letter', issue: 'Cover letter not signed', issueAr: 'خطاب الغلاف بدون توقيع' },
    ]
  },
  {
    id: 'dates',
    name: 'التواريخ',
    nameEn: 'Dates',
    checks: [
      { field: 'passport_expiry', issue: 'Passport expires within 6 months', issueAr: 'جواز السفر ينتهي خلال 6 أشهر' },
      { field: 'bank_statement_date', issue: 'Bank statement older than 3 months', issueAr: 'كشف الحساب أقدم من 3 أشهر' },
      { field: 'employment_letter_date', issue: 'Employment letter older than 1 month', issueAr: 'شهادة العمل أقدم من شهر' },
    ]
  },
  {
    id: 'names',
    name: 'الأسماء',
    nameEn: 'Names',
    checks: [
      { field: 'name_match', issue: 'Name mismatch between documents', issueAr: 'عدم تطابق الاسم بين الوثائق' },
      { field: 'passport_name', issue: 'Passport name different from application', issueAr: 'اسم الجواز مختلف عن الطلب' },
    ]
  },
  {
    id: 'photos',
    name: 'الصور',
    nameEn: 'Photos',
    checks: [
      { field: 'photo_size', issue: 'Photo not standard size (35x45mm)', issueAr: 'الصورة ليست بالحجم القياسي' },
      { field: 'photo_background', issue: 'Photo background not white', issueAr: 'خلفية الصورة ليست بيضاء' },
      { field: 'photo_date', issue: 'Photo appears older than 6 months', issueAr: 'الصورة تبدو أقدم من 6 أشهر' },
    ]
  },
  {
    id: 'completeness',
    name: 'الاكتمال',
    nameEn: 'Completeness',
    checks: [
      { field: 'all_pages', issue: 'Missing pages in passport', issueAr: 'صفحات مفقودة في الجواز' },
      { field: 'insurance_valid', issue: 'Insurance does not cover full trip', issueAr: 'التأمين لا يغطي الرحلة كاملة' },
      { field: 'flight_dates', issue: 'Flight dates conflict with application', issueAr: 'تواريخ الطيران تتعارض مع الطلب' },
    ]
  },
]

export function DocumentInspector() {
  const { t, dir } = useLanguage()
  const [documents, setDocuments] = useState<UploadedDoc[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [overallScore, setOverallScore] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newDocs: UploadedDoc[] = Array.from(files).map((file, i) => ({
      id: `doc-${Date.now()}-${i}`,
      name: file.name,
      type: getDocType(file.name),
      issues: [],
      checked: false,
      status: 'pending' as const,
    }))

    setDocuments(prev => [...prev, ...newDocs])
  }

  const getDocType = (filename: string): string => {
    const lower = filename.toLowerCase()
    if (lower.includes('passport')) return 'جواز السفر'
    if (lower.includes('photo')) return 'صورة شخصية'
    if (lower.includes('bank') || lower.includes('statement')) return 'كشف حساب'
    if (lower.includes('employment') || lower.includes('travail')) return 'شهادة عمل'
    if (lower.includes('insurance') || lower.includes('assurance')) return 'تأمين'
    if (lower.includes('hotel') || lower.includes('booking')) return 'حجز فندق'
    if (lower.includes('flight') || lower.includes('billet')) return 'تذكرة طيران'
    if (lower.includes('cover') || lower.includes('lettre')) return 'خطاب غلاف'
    if (lower.includes('invitation')) return 'خطاب دعوة'
    return 'أخرى'
  }

  const scanDocument = async (doc: UploadedDoc): Promise<DocumentIssue[]> => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const issues: DocumentIssue[] = []
    const random = Math.random()

    if (doc.type === 'جواز السفر') {
      if (random > 0.5) {
        issues.push({
          type: 'warning',
          category: 'التواريخ',
          message: 'Passport expiry date should be at least 6 months from travel date',
          messageAr: 'تاريخ انتهاء جواز السفر يجب أن يكون 6 أشهر على الأقل من تاريخ السفر',
          field: 'passport_expiry',
          severity: 'high'
        })
      }
      if (random > 0.7) {
        issues.push({
          type: 'error',
          category: 'الأسماء',
          message: 'Name spelling verification needed',
          messageAr: 'يحتاج التحقق من كتابة الاسم',
          field: 'name_verify',
          severity: 'medium'
        })
      }
    }

    if (doc.type === 'كشف حساب') {
      if (random > 0.4) {
        issues.push({
          type: 'info',
          category: 'المعلومات المالية',
          message: 'Average balance calculated successfully',
          messageAr: 'تم حساب متوسط الرصيد بنجاح',
          severity: 'low'
        })
      }
      if (random > 0.6) {
        issues.push({
          type: 'warning',
          category: 'التواريخ',
          message: 'Statement should be within last 3 months',
          messageAr: 'كشف الحساب يجب أن يكون خلال آخر 3 أشهر',
          field: 'bank_statement_date',
          severity: 'high'
        })
      }
    }

    if (doc.type === 'صورة شخصية') {
      if (random > 0.5) {
        issues.push({
          type: 'error',
          category: 'الصور',
          message: 'Photo does not meet Schengen requirements',
          messageAr: 'الصورة لا تستوفي متطلبات شنغن',
          field: 'photo_requirements',
          severity: 'critical'
        })
      }
    }

    if (doc.type === 'شهادة عمل') {
      if (random > 0.6) {
        issues.push({
          type: 'warning',
          category: 'التوقيع',
          message: 'Signature and stamp required on employment letter',
          messageAr: 'التوقيع والختم مطلوب على شهادة العمل',
          field: 'employment_signature',
          severity: 'high'
        })
      }
    }

    return issues
  }

  const handleScanAll = async () => {
    setIsScanning(true)
    
    const updatedDocs = await Promise.all(
      documents.map(async (doc) => {
        setDocuments(prev => prev.map(d => 
          d.id === doc.id ? { ...d, status: 'scanning' as const } : d
        ))
        
        const issues = await scanDocument(doc)
        
        return {
          ...doc,
          issues,
          checked: true,
          status: 'complete' as const
        }
      })
    )

    setDocuments(updatedDocs)
    
    const totalIssues = updatedDocs.reduce((sum, doc) => sum + doc.issues.filter(i => i.type === 'error').length, 0)
    const totalWarnings = updatedDocs.reduce((sum, doc) => sum + doc.issues.filter(i => i.type === 'warning').length, 0)
    const score = Math.max(0, 100 - (totalIssues * 15) - (totalWarnings * 5))
    setOverallScore(score)
    
    setIsScanning(false)
    setShowResults(true)
  }

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id))
    setShowResults(false)
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="text-red-400" size={16} />
      case 'warning': return <AlertTriangle className="text-yellow-400" size={16} />
      default: return <AlertCircle className="text-blue-400" size={16} />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20'
      case 'high': return 'text-orange-400 bg-orange-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20'
      default: return 'text-blue-400 bg-blue-500/20'
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">مفتش الوثائق بالذكاء الاصطناعي</h2>
          <p className="text-white/60 text-sm">افحص وثائقك قبل التقديم واكتشف الأخطاء</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-6"
        >
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <FileCheck className="text-neon-cyan" size={18} />
            ماذا نفحص؟
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {documentChecks.map((check) => (
              <div key={check.id} className="flex items-center gap-2 text-sm">
                <CheckCircle className="text-green-400" size={14} />
                <span>{check.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
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
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full glass-card-hover p-6 flex flex-col items-center justify-center gap-3 rounded-xl"
          >
            <Upload className="text-neon-cyan" size={32} />
            <span className="font-medium">ارفع وثائقك</span>
            <span className="text-xs text-white/50">PDF, JPG, PNG, DOC - متعدد</span>
          </button>
        </motion.div>

        {documents.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <h3 className="font-bold mb-3">الوثائق ({documents.length})</h3>
            <div className="space-y-2">
              {documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card p-3 flex items-center gap-3"
                >
                  <FileText className="text-neon-cyan" size={20} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{doc.name}</p>
                    <p className="text-xs text-white/50">{doc.type}</p>
                  </div>
                  
                  {doc.status === 'scanning' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full"
                    />
                  )}
                  
                  {doc.status === 'complete' && (
                    <>
                      {doc.issues.filter(i => i.type === 'error').length > 0 ? (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                          {doc.issues.filter(i => i.type === 'error').length} خطأ
                        </span>
                      ) : (
                        <CheckCircle className="text-green-400" size={20} />
                      )}
                    </>
                  )}
                  
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <X size={16} className="text-white/50" />
                  </button>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleScanAll}
              disabled={isScanning || documents.length === 0}
              className="neon-button w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  جارٍ الفحص...
                </>
              ) : (
                <>
                  <Shield size={18} />
                  فحص جميع الوثائق
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className={cn(
              'glass-card p-6 text-center',
              overallScore >= 80 && 'border-green-500/50',
              overallScore >= 50 && overallScore < 80 && 'border-yellow-500/50',
              overallScore < 50 && 'border-red-500/50'
            )}>
              <div className={cn(
                'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4',
                overallScore >= 80 && 'bg-green-500/20',
                overallScore >= 50 && overallScore < 80 && 'bg-yellow-500/20',
                overallScore < 50 && 'bg-red-500/20'
              )}>
                <span className={cn(
                  'text-3xl font-bold',
                  overallScore >= 80 && 'text-green-400',
                  overallScore >= 50 && overallScore < 80 && 'text-yellow-400',
                  overallScore < 50 && 'text-red-400'
                )}>
                  {overallScore}%
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2">
                {overallScore >= 80 ? 'وثائق جاهزة! ✓' : overallScore >= 50 ? 'تحتاج بعض التصحيحات' : 'تحتاج تعديلات مهمة'}
              </h3>
              <p className="text-sm text-white/60">
                {overallScore >= 80 
                  ? 'وثائقك تبدو جيدة. تأكد من التفاصيل قبل التقديم.'
                  : overallScore >= 50 
                  ? 'راجع التحذيرات وأصلحها قبل التقديم.'
                  : 'راجع الأخطاء وصححها. تجنب الرفض.'}
              </p>
            </div>

            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="text-neon-cyan" size={20} />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{doc.name}</h4>
                    <p className="text-xs text-white/50">{doc.type}</p>
                  </div>
                  {doc.issues.length === 0 && (
                    <CheckCircle className="text-green-400" size={20} />
                  )}
                </div>

                {doc.issues.length > 0 && (
                  <div className="space-y-2">
                    {doc.issues.map((issue, i) => (
                      <div
                        key={i}
                        className={cn(
                          'p-3 rounded-lg',
                          issue.type === 'error' && 'bg-red-500/10',
                          issue.type === 'warning' && 'bg-yellow-500/10',
                          issue.type === 'info' && 'bg-blue-500/10'
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {getIssueIcon(issue.type)}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{issue.messageAr}</p>
                            <span className={cn(
                              'inline-block mt-1 px-2 py-0.5 rounded-full text-xs',
                              getSeverityColor(issue.severity)
                            )}>
                              {issue.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setDocuments([])
                setShowResults(false)
                setOverallScore(0)
              }}
              className="w-full py-3 rounded-xl glass-card-hover text-center"
            >
              <RefreshCw className="inline ml-2" size={18} />
              فحص جديد
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default DocumentInspector
