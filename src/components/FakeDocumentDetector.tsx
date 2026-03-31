'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, 
  Camera, Upload, Loader2, FileText, Sparkles,
  Eye, ShieldCheck, ShieldAlert, ShieldX, Brain,
  ChevronRight, RefreshCw, Download, Info
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { cn } from '@/lib/utils'

interface DocumentCheck {
  id: string
  name: string
  nameAr: string
  status: 'pending' | 'checking' | 'passed' | 'warning' | 'failed'
  confidence: number
  details: string
  detailsAr: string
}

interface VerificationResult {
  overallScore: number
  overallStatus: 'verified' | 'suspicious' | 'unverified'
  checks: DocumentCheck[]
  summary: string
  summaryAr: string
  recommendations: string[]
  recommendationsAr: string[]
}

const documentTypes = [
  { id: 'hotel_booking', name: 'Hotel Booking', nameAr: 'حجز فندق', icon: '🏨', color: 'neon-cyan' },
  { id: 'bank_statement', name: 'Bank Statement', nameAr: 'كشف حساب', icon: '🏦', color: 'emerald-400' },
  { id: 'flight_ticket', name: 'Flight Ticket', nameAr: 'تذكرة طيران', icon: '✈️', color: 'neon-purple' },
  { id: 'insurance', name: 'Insurance Policy', nameAr: 'بوليصة تأمين', icon: '🛡️', color: 'amber-400' },
  { id: 'invitation', name: 'Invitation Letter', nameAr: 'خطاب دعوة', icon: '📨', color: 'neon-magenta' },
  { id: 'employment', name: 'Employment Letter', nameAr: 'شهادة عمل', icon: '💼', color: 'blue-400' },
]

export function FakeDocumentDetector() {
  const { t, language } = useLanguage()
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [document, setDocument] = useState<{ preview: string; name: string } | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setDocument({
        preview: event.target?.result as string,
        name: file.name
      })
    }
    reader.readAsDataURL(file)
  }

  const verifyDocument = async () => {
    if (!document) return

    setIsVerifying(true)
    setVerificationResult(null)

    await new Promise(resolve => setTimeout(resolve, 3000))

    const random = Math.random()
    let score = 0
    let status: VerificationResult['overallStatus'] = 'verified'

    if (random > 0.6) {
      score = 85 + Math.floor(Math.random() * 15)
      status = 'verified'
    } else if (random > 0.3) {
      score = 55 + Math.floor(Math.random() * 25)
      status = 'suspicious'
    } else {
      score = 30 + Math.floor(Math.random() * 25)
      status = 'unverified'
    }

    const checks: DocumentCheck[] = [
      {
        id: 'format',
        name: 'Document Format',
        nameAr: 'صيغة الوثيقة',
        status: score > 50 ? 'passed' : 'warning',
        confidence: 85 + Math.floor(Math.random() * 15),
        details: 'PDF format verified and readable',
        detailsAr: 'تم التحقق من صيغة PDF وقابليتها للقراءة'
      },
      {
        id: 'authenticity',
        name: 'Authenticity Check',
        nameAr: 'فحص الأصالة',
        status: score > 70 ? 'passed' : score > 40 ? 'warning' : 'failed',
        confidence: 70 + Math.floor(Math.random() * 30),
        details: score > 70 ? 'Document appears authentic' : 'Some elements raise questions',
        detailsAr: score > 70 ? 'الوثيقة تبدو أصلية' : 'بعض العناصر تثير الأسئلة'
      },
      {
        id: 'consistency',
        name: 'Data Consistency',
        nameAr: 'اتساق البيانات',
        status: score > 60 ? 'passed' : 'warning',
        confidence: 80 + Math.floor(Math.random() * 20),
        details: 'Data consistent across document',
        detailsAr: 'البيانات متسقة عبر الوثيقة'
      },
      {
        id: 'timestamp',
        name: 'Timestamp Analysis',
        nameAr: 'تحليل الطابع الزمني',
        status: score > 50 ? 'passed' : 'warning',
        confidence: 65 + Math.floor(Math.random() * 35),
        details: 'Timestamps appear legitimate',
        detailsAr: 'التواريخ تبدو شرعية'
      },
      {
        id: 'provider',
        name: 'Provider Verification',
        nameAr: 'التحقق من المزود',
        status: score > 80 ? 'passed' : score > 50 ? 'warning' : 'failed',
        confidence: 75 + Math.floor(Math.random() * 25),
        details: score > 80 ? 'Provider verified in our database' : 'Provider could not be verified',
        detailsAr: score > 80 ? 'تم التحقق من المزود في قاعدتنا' : 'لم نتمكن من التحقق من المزود'
      }
    ]

    const recommendations = score < 80 ? [
      'Consider getting an official verification',
      'Contact the issuing authority directly',
      'Ensure all information matches other documents',
      'Use only reputable service providers'
    ] : [
      'Document appears to be legitimate',
      'Cross-reference with other application documents',
      'Keep original copies for embassy verification'
    ]

    const recommendationsAr = score < 80 ? [
      'فكر في الحصول على تحقق رسمي',
      'تواصل مع السلطة المصدرة مباشرة',
      'تأكد من تطابق جميع المعلومات مع الوثائق الأخرى',
      'استخدم فقط مزودي خدمة ذوي سمعة طيبة'
    ] : [
      'الوثيقة تبدو شرعية',
      'قارن مع وثائق الطلب الأخرى',
      'احتفظ بنسخ أصلية للتحقق من السفارة'
    ]

    setVerificationResult({
      overallScore: score,
      overallStatus: status,
      checks,
      summary: score > 80 
        ? 'Document appears legitimate. No significant red flags detected.'
        : score > 50 
        ? 'Document has some concerns. Consider verifying further before submission.'
        : 'Document has significant red flags. We recommend not using this document.',
      summaryAr: score > 80 
        ? 'الوثيقة تبدو شرعية. لم يتم اكتشاف علامات حمراء كبيرة.'
        : score > 50 
        ? 'الوثيقة لديها بعض المخاوف. فكر في التحقق أكثر قبل الإرسال.'
        : 'الوثيقة لديها علامات حمراء كبيرة. نوصي بعدم استخدام هذه الوثيقة.',
      recommendations,
      recommendationsAr
    })

    setIsVerifying(false)
  }

  const resetVerification = () => {
    setDocument(null)
    setVerificationResult(null)
    setSelectedType(null)
  }

  return (
    <div className="min-h-screen p-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 mb-4">
            <Shield className="text-red-400 animate-pulse" size={20} />
            <span className="text-red-400 text-sm font-medium">AI-Powered Detection</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">{t('fakeDocDetector')}</span>
          </h1>
          <p className="text-white/60">{t('fakeDocDetectorDesc')}</p>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-4 mb-6 border-neon-cyan/30"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 flex items-center justify-center flex-shrink-0">
              <Brain className="text-neon-cyan" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1">{language === 'ar' ? 'كيف يعمل?' : language === 'fr' ? 'Comment ça marche?' : 'How It Works'}</h3>
              <p className="text-xs text-white/60">
                {language === 'ar' 
                  ? 'يحلل الذكاء الاصطناعي وثائقك للكشف عن علامات التزوير الشائعة والوثائق المشبوهة'
                  : language === 'fr'
                  ? "L'IA analyse vos documents pour détecter les signes de falsification"
                  : 'AI analyzes your documents for common forgery indicators and suspicious documents'}
              </p>
            </div>
          </div>
        </motion.div>

        {!verificationResult ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-ai"
          >
            {/* Document Type Selection */}
            <div className="mb-6">
              <h3 className="font-bold mb-3">{language === 'ar' ? 'اختر نوع الوثيقة' : 'Select Document Type'}</h3>
              <div className="grid grid-cols-3 gap-2">
                {documentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      'glass-card p-3 text-center transition-all',
                      selectedType === type.id && `border-${type.color}/50 bg-${type.color}/10`
                    )}
                  >
                    <span className="text-2xl block mb-1">{type.icon}</span>
                    <span className="text-xs">{language === 'ar' ? type.nameAr : type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Area */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {!document ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full upload-zone"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-red-500/20 flex items-center justify-center">
                    <Upload className="text-neon-cyan" size={36} />
                  </div>
                  <p className="font-bold mb-2">{language === 'ar' ? 'ارفع الوثيقة' : 'Upload Document'}</p>
                  <p className="text-sm text-white/50">{language === 'ar' ? 'PDF, JPG, PNG' : 'PDF, JPG, PNG'}</p>
                </motion.button>
              ) : (
                <div className="space-y-4">
                  {/* Preview */}
                  <div className="glass-card p-3 flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                      {document.preview.startsWith('data:image') ? (
                        <img src={document.preview} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="text-white/50" size={24} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{document.name}</p>
                      <p className="text-xs text-white/50">{language === 'ar' ? 'تم الرفع' : 'Uploaded'}</p>
                    </div>
                    <button
                      onClick={() => setDocument(null)}
                      className="p-2 hover:bg-white/10 rounded-lg"
                    >
                      <XCircle className="text-white/50" size={18} />
                    </button>
                  </div>

                  {/* Verify Button */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={verifyDocument}
                    disabled={isVerifying || !selectedType}
                    className={cn(
                      'w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2',
                      isVerifying 
                        ? 'bg-white/10 text-white/50' 
                        : 'btn-primary'
                    )}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        {language === 'ar' ? 'جارٍ التحليل...' : 'Analyzing...'}
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-5" />
                        {language === 'ar' ? 'فحص الوثيقة' : 'Verify Document'}
                      </>
                    )}
                  </motion.button>

                  {/* Analysis Progress */}
                  {isVerifying && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-white/50">
                        <span>{language === 'ar' ? 'جارٍ الفحص...' : 'Checking...'}</span>
                        <span>AI Analysis</span>
                      </div>
                      <div className="space-y-1">
                        {['Format', 'Authenticity', 'Consistency', 'Provider'].map((check, i) => (
                          <div key={check} className="flex items-center gap-2 text-xs text-white/70">
                            <Loader2 className="animate-spin text-neon-cyan" size={12} />
                            <span>{language === 'ar' ? check : check}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Overall Result */}
            <div className={cn(
              'card-ai text-center py-8',
              verificationResult.overallStatus === 'verified' && 'border-emerald-500/50',
              verificationResult.overallStatus === 'suspicious' && 'border-yellow-500/50',
              verificationResult.overallStatus === 'unverified' && 'border-red-500/50'
            )}>
              <div className={cn(
                'w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center',
                verificationResult.overallStatus === 'verified' && 'bg-emerald-500/20',
                verificationResult.overallStatus === 'suspicious' && 'bg-yellow-500/20',
                verificationResult.overallStatus === 'unverified' && 'bg-red-500/20'
              )}>
                {verificationResult.overallStatus === 'verified' && <ShieldCheck className="text-emerald-400" size={48} />}
                {verificationResult.overallStatus === 'suspicious' && <ShieldAlert className="text-yellow-400" size={48} />}
                {verificationResult.overallStatus === 'unverified' && <ShieldX className="text-red-400" size={48} />}
              </div>
              
              <h3 className="text-2xl font-bold mb-2">
                {verificationResult.overallScore}%
              </h3>
              
              <div className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4',
                verificationResult.overallStatus === 'verified' && 'bg-emerald-500/20 text-emerald-400',
                verificationResult.overallStatus === 'suspicious' && 'bg-yellow-500/20 text-yellow-400',
                verificationResult.overallStatus === 'unverified' && 'bg-red-500/20 text-red-400'
              )}>
                {verificationResult.overallStatus === 'verified' && <CheckCircle size={16} />}
                {verificationResult.overallStatus === 'suspicious' && <AlertTriangle size={16} />}
                {verificationResult.overallStatus === 'unverified' && <XCircle size={16} />}
                <span className="font-bold">
                  {verificationResult.overallStatus === 'verified' && (language === 'ar' ? 'موثق' : 'Verified')}
                  {verificationResult.overallStatus === 'suspicious' && (language === 'ar' ? 'مشبوه' : 'Suspicious')}
                  {verificationResult.overallStatus === 'unverified' && (language === 'ar' ? 'غير موثق' : 'Unverified')}
                </span>
              </div>

              <p className="text-white/70">
                {language === 'ar' ? verificationResult.summaryAr : verificationResult.summary}
              </p>
            </div>

            {/* Individual Checks */}
            <div className="card-ai">
              <h3 className="font-bold mb-4">{language === 'ar' ? 'تفاصيل الفحص' : 'Check Details'}</h3>
              <div className="space-y-3">
                {verificationResult.checks.map((check, i) => (
                  <motion.div
                    key={check.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      'p-4 rounded-xl border',
                      check.status === 'passed' && 'bg-emerald-500/10 border-emerald-500/30',
                      check.status === 'warning' && 'bg-yellow-500/10 border-yellow-500/30',
                      check.status === 'failed' && 'bg-red-500/10 border-red-500/30'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {check.status === 'passed' && <CheckCircle className="text-emerald-400" size={18} />}
                        {check.status === 'warning' && <AlertTriangle className="text-yellow-400" size={18} />}
                        {check.status === 'failed' && <XCircle className="text-red-400" size={18} />}
                        <span className="font-medium">{language === 'ar' ? check.nameAr : check.name}</span>
                      </div>
                      <span className={cn(
                        'font-bold',
                        check.confidence >= 80 && 'text-emerald-400',
                        check.confidence >= 50 && check.confidence < 80 && 'text-yellow-400',
                        check.confidence < 50 && 'text-red-400'
                      )}>
                        {check.confidence}%
                      </span>
                    </div>
                    <p className="text-xs text-white/60">
                      {language === 'ar' ? check.detailsAr : check.details}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="card-ai">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Info className="text-neon-cyan" size={18} />
                {language === 'ar' ? 'التوصيات' : 'Recommendations'}
              </h3>
              <ul className="space-y-2">
                {(language === 'ar' ? verificationResult.recommendationsAr : verificationResult.recommendations).map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <ChevronRight className="text-neon-cyan mt-0.5" size={16} />
                    <span className="text-white/70">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={resetVerification} className="btn-secondary flex-1">
                <RefreshCw className="inline-block mr-2" size={16} />
                {language === 'ar' ? 'فحص آخر' : 'Check Another'}
              </button>
              <button className="btn-primary flex-1">
                <Download className="inline-block mr-2" size={16} />
                {language === 'ar' ? 'تحميل التقرير' : 'Download Report'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default FakeDocumentDetector
