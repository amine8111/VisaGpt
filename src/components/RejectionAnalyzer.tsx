'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  FileText, Upload, AlertTriangle, CheckCircle, XCircle, 
  Lightbulb, Download, Copy, ArrowRight, Loader2, Shield,
  AlertCircle, RefreshCw, Check
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

interface RefusalCode {
  code: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  reasons: string[]
  reasonsAr: string[]
  solutions: string[]
  solutionsAr: string[]
  severity: 'critical' | 'high' | 'medium'
}

const refusalCodes: RefusalCode[] = [
  {
    code: 'A',
    title: 'Application Incomplete',
    titleAr: 'الطلب غير مكتمل',
    description: 'The application form was not filled correctly or required documents were missing.',
    descriptionAr: 'لم يتم ملء نموذج الطلب بشكل صحيح أو كانت الوثائق المطلوبة مفقودة.',
    reasons: ['Missing required fields', 'Incomplete information', 'Unsigned forms'],
    reasonsAr: ['حقول مطلوبة مفقودة', 'معلومات غير مكتملة', 'نماذج بدون توقيع'],
    solutions: ['Complete all fields', 'Sign all documents', 'Attach all required docs', 'Double-check application'],
    solutionsAr: ['أكمل جميع الحقول', 'وقع على جميع الوثائق', 'أرفق جميع الوثائق المطلوبة', 'راجع الطلب مرتين'],
    severity: 'high'
  },
  {
    code: 'B',
    title: 'Justification for Purpose Inadequate',
    titleAr: 'مبرر الغرض غير كافٍ',
    description: 'The provided justification for the trip purpose was not convincing or reliable.',
    descriptionAr: 'لم يكن المبرر المقدم لغرض الرحلة مقنعاً أو موثوقاً.',
    reasons: ['Vague purpose statement', 'No proof of accommodation', 'No travel itinerary', 'Unclear relationship with host'],
    reasonsAr: ['بيان الغرض غامض', 'لا يوجد إثبات للسكن', 'لا يوجد برنامج سفر', 'علاقة غير واضحة مع المضيف'],
    solutions: ['Write detailed cover letter', 'Provide hotel bookings', 'Add flight reservations', 'Include invitation letter with details'],
    solutionsAr: ['اكتب خطاب غلاف مفصل', 'قدم حجوزات الفندق', 'أضف حجوزات الطيران', 'تضمن خطاب دعوة بالتفاصيل'],
    severity: 'critical'
  },
  {
    code: 'C',
    title: 'Insufficient Financial Means',
    titleAr: 'وسائل العيش غير كافية',
    description: 'You did not prove you have enough money for your stay.',
    descriptionAr: 'لم تثبت أنك تملك ما يكفي من المال لإقامتك.',
    reasons: ['Low bank balance', 'Unstable income', 'Large unexplained deposits', 'Insufficient for trip duration'],
    reasonsAr: ['رصيد بنكي منخفض', 'دخل غير مستقر', 'ودائع كبيرة غير مفسرة', 'غير كافٍ لمدة الرحلة'],
    solutions: ['Maintain higher balance (3+ months)', 'Show regular salary deposits', 'Add sponsor letter with financial proof', 'Reduce trip duration or costs'],
    solutionsAr: ['حافظ على رصيد أعلى (3+ أشهر)', 'أظهر إيداعات راتب منتظمة', 'أضف خطاب ضمان مع إثبات مالي', 'قلل مدة أو تكلفة الرحلة'],
    severity: 'critical'
  },
  {
    code: 'D',
    title: 'Travel History Issues',
    titleAr: 'مشاكل في سجل السفر',
    description: 'Your previous travel history raised concerns about your reliability.',
    descriptionAr: 'تاريخ سفرك السابق أثار مخاوف حول موثوقيتك.',
    reasons: ['No previous travel', 'Previous visa refusals', 'Overstayed before', 'Invalid previous visas'],
    reasonsAr: ['لا يوجد سفر سابق', 'رفض تأشيرة سابق', 'تجاوز إقامة سابق', 'تأشيرات سابقة غير صالحة'],
    solutions: ['Start with easier destinations', 'Build travel history gradually', 'Show return from previous trips', 'Wait required period after refusal'],
    solutionsAr: ['ابدأ بالوجهات الأسهل', 'ابنِ سجل السفر تدريجياً', 'أظهر العودة من الرحلات السابقة', 'انتظر الفترة المطلوبة بعد الرفض'],
    severity: 'high'
  },
  {
    code: 'E',
    title: 'Risk of Overstay',
    titleAr: 'خطر تجاوز الإقامة',
    description: 'Consular officer believes you may not return to your home country.',
    descriptionAr: 'يعتقد الضابط القنصلي أنك قد لا تعود إلى بلدك.',
    reasons: ['Weak ties to home country', 'No property/employment', 'Single/unmarried', 'Family abroad'],
    reasonsAr: ['روابط ضعيفة مع البلد', 'لا ملكية/عمل', 'أعزب/عزباء', 'عائلة بالخارج'],
    solutions: ['Show property ownership', 'Strong employment letter', 'Family ties in Algeria', 'Proof of obligations (loans, etc)'],
    solutionsAr: ['أظهر الملكية العقارية', 'خطاب عمل قوي', 'روابط عائلية بالجزائر', 'إثبات الالتزامات (قروض، إلخ)'],
    severity: 'critical'
  },
  {
    code: 'F',
    title: 'Invalid Travel Insurance',
    titleAr: 'تأمين سفر غير صالح',
    description: 'Your travel insurance does not meet the required standards.',
    descriptionAr: 'تأمين سفرك لا يستوفي المعايير المطلوبة.',
    reasons: ['Insurance not covering Schengen', 'Coverage less than €30,000', 'Invalid dates', 'Not recognized insurer'],
    reasonsAr: ['التأمين لا يغطي شنغن', 'التغطية أقل من 30,000 يورو', 'تواريخ غير صالحة', 'شركة غير معترف بها'],
    solutions: ['Buy Schengen-compliant insurance', 'Ensure €30,000+ coverage', 'Verify dates match trip', 'Use recommended providers'],
    solutionsAr: ['اشترِ تأمين متوافق مع شنغن', 'تأكد من تغطية 30,000+ يورو', 'تحقق من تواريخ الرحلة', 'استخدم مقدمي الخدمة الموصى بهم'],
    severity: 'medium'
  },
  {
    code: 'G',
    title: 'Accommodation Issues',
    titleAr: 'مشاكل في السكن',
    description: 'Your accommodation proof was insufficient or unreliable.',
    descriptionAr: 'كان إثبات السكن غير كافٍ أو غير موثوق.',
    reasons: ['No accommodation proof', 'Booking not confirmed', 'Host not verified', 'Address incomplete'],
    reasonsAr: ['لا يوجد إثبات سكن', 'الحجز غير مؤكد', 'المضيف غير موثق', 'العنوان غير مكتمل'],
    solutions: ['Provide hotel booking', 'Get formal invitation letter', 'Include host ID copy', 'Verify all details'],
    solutionsAr: ['قدم حجز فندق', 'احصل على خطاب دعوة رسمي', 'تضمن نسخة هوية المضيف', 'تحقق من جميع التفاصيل'],
    severity: 'medium'
  },
]

export function RejectionAnalyzer() {
  const { t, dir, language } = useLanguage()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [refusalText, setRefusalText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<{
    codes: RefusalCode[]
    overallRisk: 'high' | 'medium' | 'low'
    advice: string[]
    nextSteps: string[]
  } | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploadedFile(file)
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setRefusalText(text)
    }
    reader.readAsText(file)
  }

  const analyzeText = (text: string) => {
    const foundCodes: RefusalCode[] = []
    
    const textLower = text.toLowerCase()
    
    for (const code of refusalCodes) {
      const codeLetter = code.code.toLowerCase()
      
      const indicators = [
        { pattern: `article ${codeLetter}`, weight: 3 },
        { pattern: `section ${codeLetter}`, weight: 3 },
        { pattern: `code ${codeLetter}`, weight: 2 },
        { pattern: code.title.toLowerCase(), weight: 2 },
        { pattern: code.titleAr, weight: 1 },
      ]
      
      let matchCount = 0
      for (const ind of indicators) {
        if (textLower.includes(ind.pattern)) {
          matchCount += ind.weight
        }
      }
      
      if (code.code === 'C' && (textLower.includes('financial') || textLower.includes('means') || textLower.includes('insufficient') || textLower.includes('مال') || textLower.includes('financial'))) matchCount += 2
      if (code.code === 'E' && (textLower.includes('overstay') || textLower.includes('return') || textLower.includes('تجاوز') || textLower.includes('عودة'))) matchCount += 2
      if (code.code === 'B' && (textLower.includes('purpose') || textLower.includes('justification') || textLower.includes('الغرض') || textLower.includes('مبرر'))) matchCount += 2
      
      if (matchCount >= 2) {
        foundCodes.push(code)
      }
    }
    
    return foundCodes
  }

  const handleAnalyze = async () => {
    if (!refusalText.trim()) return
    
    setIsAnalyzing(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const foundCodes = analyzeText(refusalText)
    
    let overallRisk: 'high' | 'medium' | 'low' = 'low'
    if (foundCodes.some(c => c.severity === 'critical')) overallRisk = 'high'
    else if (foundCodes.some(c => c.severity === 'high')) overallRisk = 'medium'
    
    const advice = [
      'Review each rejection code carefully',
      'Gather required documents for each issue',
      'Consider waiting 3-6 months before reapplying',
      'Strengthen weak areas before next application',
    ]
    
    const nextSteps = [
      'Address the specific issues identified',
      'Gather additional supporting documents',
      'Consider consulting with an expert',
      'Prepare stronger application package',
    ]
    
    setAnalysis({
      codes: foundCodes,
      overallRisk,
      advice,
      nextSteps,
    })
    
    setIsAnalyzing(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadReport = () => {
    if (!analysis) return
    
    const report = `
═══════════════════════════════════════════════════════
          VISA REJECTION ANALYSIS REPORT
═══════════════════════════════════════════════════════

Date: ${new Date().toLocaleDateString()}
Analysis: ${analysis.codes.length > 0 ? 'Codes Detected' : 'No Specific Codes Found'}

───────────────────────────────────────────────────────
DETECTED REJECTION CODES: ${analysis.codes.length}
───────────────────────────────────────────────────────

${analysis.codes.map((code, i) => `
CODE ${code.code}: ${code.title}
Severity: ${code.severity.toUpperCase()}
Description: ${code.description}

Why This Was Flagged:
${code.reasonsAr.map(r => `  • ${r}`).join('\n')}

How to Fix:
${code.solutionsAr.map(s => `  ✓ ${s}`).join('\n')}
`).join('\n')}

───────────────────────────────────────────────────────
OVERALL RISK LEVEL: ${analysis.overallRisk.toUpperCase()}
───────────────────────────────────────────────────────

${analysis.overallRisk === 'high' ? '⚠️ HIGH RISK: Major issues detected. Consider professional consultation before reapplying.' : ''}
${analysis.overallRisk === 'medium' ? '⚡ MEDIUM RISK: Some issues need addressing. Prepare thoroughly for next application.' : ''}
${analysis.overallRisk === 'low' ? '✅ LOW RISK: Issues appear minor. Focus on strengthening weak areas.' : ''}

───────────────────────────────────────────────────────
GENERAL ADVICE
───────────────────────────────────────────────────────

${analysis.advice.map((a, i) => `${i + 1}. ${a}`).join('\n')}

───────────────────────────────────────────────────────
RECOMMENDED NEXT STEPS
───────────────────────────────────────────────────────

${analysis.nextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

═══════════════════════════════════════════════════════
Generated by VisaGPT - Rejection Pattern Analyzer
═══════════════════════════════════════════════════════
    `.trim()
    
    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rejection-analysis-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">{t('rejectionAnalyzer')}</h2>
          <p className="text-white/60 text-sm">{t('rejectionAnalyzerDesc')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-neon-cyan/20 rounded-lg">
              <AlertTriangle className="text-neon-cyan" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm">{t('howItWorks')}</h3>
              <p className="text-xs text-white/60">{t('uploadOrPaste')}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {['🇩🇿 Algeria', '🇪🇺 Schengen', '🇬🇧 UK', '🇺🇸 USA'].map((flag) => (
              <span key={flag} className="px-2 py-1 bg-white/5 rounded-full text-xs text-white/60">
                {flag}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <label className="glass-card-hover p-4 flex items-center justify-center gap-3 cursor-pointer rounded-xl mb-4">
            <Upload className="text-neon-cyan" size={20} />
            <span className="font-medium">{t('uploadRejectionLetter')}</span>
            <input
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          
          {uploadedFile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-3 flex items-center gap-3 mb-4"
            >
              <FileText className="text-neon-cyan" size={20} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
                <p className="text-xs text-white/50">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
              </div>
              <Check className="text-green-400" size={16} />
            </motion.div>
          )}

          <div className="relative">
            <textarea
              value={refusalText}
              onChange={(e) => setRefusalText(e.target.value)}
              placeholder={t('pasteRejectionText')}
              className="input-field min-h-[150px] resize-none font-mono text-sm"
              dir="ltr"
            />
            {refusalText && (
              <button
                onClick={() => setRefusalText('')}
                className="absolute top-2 right-2 p-1 bg-white/10 rounded-full hover:bg-white/20"
              >
                <XCircle size={16} className="text-white/50" />
              </button>
            )}
          </div>
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleAnalyze}
          disabled={isAnalyzing || !refusalText.trim()}
          className="neon-button w-full flex items-center justify-center gap-2 mb-6 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              {t('analyzing')}
            </>
          ) : (
            <>
              <RefreshCw size={18} />
              {t('analyzeRejection')}
            </>
          )}
        </motion.button>

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className={cn(
              'glass-card p-4 text-center',
              analysis.overallRisk === 'high' && 'border-red-500/50 bg-red-500/10',
              analysis.overallRisk === 'medium' && 'border-yellow-500/50 bg-yellow-500/10',
              analysis.overallRisk === 'low' && 'border-green-500/50 bg-green-500/10',
            )}>
              <div className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3',
                analysis.overallRisk === 'high' && 'bg-red-500/20',
                analysis.overallRisk === 'medium' && 'bg-yellow-500/20',
                analysis.overallRisk === 'low' && 'bg-green-500/20',
              )}>
                {analysis.overallRisk === 'high' && <AlertTriangle className="text-red-400" size={32} />}
                {analysis.overallRisk === 'medium' && <AlertCircle className="text-yellow-400" size={32} />}
                {analysis.overallRisk === 'low' && <CheckCircle className="text-green-400" size={32} />}
              </div>
              <h3 className="font-bold mb-1">
                {analysis.overallRisk === 'high' && t('highRisk')}
                {analysis.overallRisk === 'medium' && t('mediumRisk')}
                {analysis.overallRisk === 'low' && t('lowRisk')}
              </h3>
              <p className="text-sm text-white/60">
                {t('codesDetected', { count: analysis.codes.length.toString() })}
              </p>
            </div>

            {analysis.codes.map((code, index) => (
              <motion.div
                key={code.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg',
                    code.severity === 'critical' && 'bg-red-500/20 text-red-400',
                    code.severity === 'high' && 'bg-orange-500/20 text-orange-400',
                    code.severity === 'medium' && 'bg-yellow-500/20 text-yellow-400',
                  )}>
                    {code.code}
                  </span>
                  <div>
                    <h4 className="font-bold">{language === 'ar' ? code.titleAr : code.title}</h4>
                    <p className="text-xs text-white/60">{language === 'ar' ? code.title : code.titleAr}</p>
                  </div>
                </div>
                
                <p className="text-sm text-white/70 mb-3">{language === 'ar' ? code.descriptionAr : code.description}</p>
                
                <div className="mb-3">
                  <h5 className="text-xs font-bold text-white/50 mb-2">{t('possibleReasons')}</h5>
                  <ul className="space-y-1">
                    {(language === 'ar' ? code.reasonsAr : code.reasons).map((reason, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                        <XCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="text-xs font-bold text-neon-cyan mb-2">{t('howToFix')}</h5>
                  <ul className="space-y-1">
                    {(language === 'ar' ? code.solutionsAr : code.solutions).map((solution, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                        <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                        {solution}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-4"
            >
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <Lightbulb className="text-yellow-400" size={18} />
                {t('importantTips')}
              </h4>
              <ul className="space-y-2">
                {analysis.nextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="w-5 h-5 bg-neon-cyan/20 rounded-full flex items-center justify-center text-xs text-neon-cyan flex-shrink-0">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </motion.div>

            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={downloadReport}
                className="flex-1 py-3 rounded-xl neon-button flex items-center justify-center gap-2"
              >
                <Download size={18} />
                {t('downloadReport')}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setAnalysis(null)
                  setRefusalText('')
                  setUploadedFile(null)
                }}
                className="px-6 py-3 rounded-xl glass-card-hover"
              >
                <RefreshCw size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <h3 className="font-bold mb-3 text-sm">{t('commonRejectionCodes')}</h3>
          <div className="grid grid-cols-2 gap-2">
            {refusalCodes.slice(0, 6).map((code) => (
              <button
                key={code.code}
                onClick={() => setRefusalText(prev => prev + ` [Code ${code.code}: ${code.title}]`)}
                className="glass-card-hover p-2 text-left rounded-lg"
              >
                <span className={cn(
                  'text-lg font-bold',
                  code.severity === 'critical' && 'text-red-400',
                  code.severity === 'high' && 'text-orange-400',
                  code.severity === 'medium' && 'text-yellow-400',
                )}>
                  {code.code}
                </span>
                <p className="text-xs text-white/60 truncate">{language === 'ar' ? code.titleAr : code.title}</p>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RejectionAnalyzer
