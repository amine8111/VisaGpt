'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { FileText, Download, AlertCircle, Check, ArrowRight, ArrowLeft, Send, Calendar, Building, User, FileWarning } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

interface RefusalReason {
  id: string
  code: string
  label: string
  labelAr: string
  description: string
  descriptionAr: string
  template: string
  requiredDocs: string[]
}

const refusalReasons: RefusalReason[] = [
  {
    id: '1',
    code: 'A',
    label: 'Visa Application Incomplete',
    labelAr: 'طلب التأشيرة غير مكتمل',
    description: 'The application form was not filled in completely or correctly, or required documents were missing.',
    descriptionAr: 'لم يتم ملء نموذج الطلب بشكل كامل أو صحيح، أو كانت الوثائق المطلوبة مفقودة.',
    template: `To: The Consul General
      Embassy of [Country]
      
      Subject: Request for Reconsideration - Visa Application
      
      Dear Sir/Madam,
      
      I, [FULL NAME], holder of passport number [PASSPORT NUMBER], hereby respectfully submit this request for reconsideration of my visa application dated [DATE].
      
      I have been informed that my application was refused pursuant to Article [X](a) of the Schengen Visa Code due to an incomplete application.
      
      I wish to submit the following additional documents:
      [LIST OF ADDITIONAL DOCUMENTS]
      
      I respectfully request that my application be reconsidered with these additional documents. I am fully committed to complying with all requirements of the Schengen visa regulations and will adhere to the conditions of my stay.
      
      Sincerely,
      [FULL NAME]
      Date: [DATE]`,
    requiredDocs: ['نموذج طلب مكتمل', 'جواز السفر', 'صور حديثة', 'كشف حساب محدث', 'خطاب تغطية']
  },
  {
    id: '2',
    code: 'B',
    label: 'Justification for Purpose of Journey',
    labelAr: 'مبرر الغرض من الرحلة',
    description: 'The provided justification for the purpose and conditions of the intended stay was not reliable.',
    descriptionAr: 'لم يكن المبرر المقدم للغرض والشروط مدة الإقامة المقصودة موثوقاً.',
    template: `To: The Consul General
      Embassy of [Country]
      
      Subject: Request for Reconsideration - Purpose of Journey Documentation
      
      Dear Sir/Madam,
      
      I, [FULL NAME], holder of passport number [PASSPORT NUMBER], respectfully request reconsideration of my visa application.
      
      I wish to clarify the purpose of my journey as follows:
      
      1. Purpose of Visit: [DETAILED PURPOSE]
      2. Duration of Stay: [NUMBER] days
      3. Travel Itinerary: [DETAILED ITINERARY]
      4. Accommodation: [ACCOMMODATION DETAILS]
      
      I have attached the following supporting documents:
      - [DOCUMENT 1]
      - [DOCUMENT 2]
      - [DOCUMENT 3]
      
      I assure the consular office that I will return to Algeria before the expiration of my authorized stay and will comply with all visa conditions.
      
      Sincerely,
      [FULL NAME]`,
    requiredDocs: ['خطاب الغرض من الرحلة', 'كشف حساب مفصل', 'حجز فندق مؤكد', 'تذكرة الطيران', 'خطاب صاحب العمل']
  },
  {
    id: '3',
    code: 'C',
    label: 'Insufficient Means of Subsistence',
    labelAr: 'وسائل العيش غير كافية',
    description: 'The applicant has not provided proof of having sufficient means of subsistence for the duration of the stay.',
    descriptionAr: 'لم يقدم مقدم الطلب دليلاً على امتلاكه وسائل عيش كافية لمدة الإقامة.',
    template: `To: The Consul General
      Embassy of [Country]
      
      Subject: Request for Reconsideration - Financial Means Documentation
      
      Dear Sir/Madam,
      
      I, [FULL NAME], respectfully submit this additional documentation regarding financial means for my visa application.
      
      CURRENT FINANCIAL SITUATION:
      - Bank Balance: [AMOUNT] DZD (average last 3 months)
      - Monthly Income: [AMOUNT] DZD
      - Employment Status: [EMPLOYMENT TYPE]
      - Years of Employment: [YEARS]
      
      ADDITIONAL FINANCIAL GUARANTEES:
      [LIST ANY ADDITIONAL FINANCIAL SUPPORT]
      
      I wish to clarify that I have sufficient means to cover my stay, calculated as follows:
      - Duration: [DAYS] days
      - Daily Requirement: €65/day (EU standard)
      - Total Required: €[AMOUNT]
      - My Available Funds: €[AMOUNT EQUIVALENT]
      
      I have attached updated bank statements and additional financial documents.
      
      Sincerely,
      [FULL NAME]`,
    requiredDocs: ['كشف حساب 3 أشهر محدث', 'شهادة الراتب', 'شهادة من صاحب العمل', 'إثبات ملكية العقارات', 'كشف حساب توفير']
  },
  {
    id: '4',
    code: 'D',
    label: 'Travel History',
    labelAr: 'السجل السفر',
    description: 'The applicant has not provided proof of fitness to travel based on previous travel history.',
    descriptionAr: 'لم يقدم مقدم الطلب دليلاً على صلاحيته للسفر بناءً على سجله السفر السابق.',
    template: `To: The Consul General
      Embassy of [Country]
      
      Subject: Request for Reconsideration - Travel History
      
      Dear Sir/Madam,
      
      I respectfully address my visa application refusal concerning travel history.
      
      MY TRAVEL HISTORY:
      - [PREVIOUS TRAVEL 1]
      - [PREVIOUS TRAVEL 2]
      - [ANY OTHER RELEVANT TRAVEL]
      
      I wish to emphasize that I have always complied with visa conditions and returned to Algeria within authorized timeframes. I have no history of overstaying or violating visa conditions.
      
      BINDING TIES TO ALGERIA:
      [LIST FAMILY, EMPLOYMENT, PROPERTY, ETC.]
      
      I kindly request reconsideration of my application with these assurances.
      
      Sincerely,
      [FULL NAME]`,
    requiredDocs: ['صفحات الجواز مع الختم', 'خطاب من صاحب العمل', 'إثبات ملكية', 'شهادة عائلية']
  },
  {
    id: '5',
    code: 'E',
    label: 'Risk of Overstay',
    labelAr: 'خطر تجاوز الإقامة',
    description: 'The consular officer has reasons to believe the applicant may overstay their authorized stay.',
    descriptionAr: 'لدى الضابط القنصلي أسباب للاعتقاد بأن مقدم الطلب قد يتجاوز مدة إقامته المصرح بها.',
    template: `To: The Consul General
      Embassy of [Country]
      
      Subject: Request for Reconsideration - Assurance of Return
      
      Dear Sir/Madam,
      
      I respectfully address the concern regarding potential overstay risk for my visa application.
      
      STRONG TIES TO ALGERIA:
      
      1. FAMILY TIES:
      - [FAMILY DETAILS]
      
      2. EMPLOYMENT TIES:
      - [EMPLOYER DETAILS]
      - [POSITION AND SENIORITY]
      - [ANNUAL LEAVE DATES]
      
      3. PROPERTY OWNERSHIP:
      - [PROPERTY DETAILS]
      
      4. FINANCIAL OBLIGATIONS:
      - [BANK LOANS, MORTGAGES, ETC.]
      
      I solemnly commit to:
      - Returning to Algeria before my visa expires
      - Not engaging in any unauthorized employment
      - Complying with all Schengen visa conditions
      
      I respectfully request reconsideration of my application.
      
      Sincerely,
      [FULL NAME]`,
    requiredDocs: ['شهادة العمل', 'كشف حساب الضمان', 'وثائق الملكية', 'شهادة عائلية', 'كشف بالالتزامات المالية']
  },
]

export function RecoursGenerator() {
  const { membership, user } = useVisaStore()
  const { t, dir } = useLanguage()
  const [step, setStep] = useState(1)
  const [selectedReason, setSelectedReason] = useState<RefusalReason | null>(null)
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [passportNumber, setPassportNumber] = useState('')
  const [applicationDate, setApplicationDate] = useState('')
  const [embassy, setEmbassy] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDocument, setGeneratedDocument] = useState('')

  const isPremium = membership?.tier === 'premium'

  const generateDocument = () => {
    if (!selectedReason) return
    
    setIsGenerating(true)
    
    setTimeout(() => {
      let doc = selectedReason.template
        .replace(/\[FULL NAME\]/g, fullName || '[اسمك الكامل]')
        .replace(/\[PASSPORT NUMBER\]/g, passportNumber || '[رقم الجواز]')
        .replace(/\[DATE\]/g, applicationDate || new Date().toLocaleDateString('ar-DZ'))
        .replace(/\[Country\]/g, embassy || '[اسم الدولة]')
        .replace(/\[DETAILED PURPOSE\]/g, additionalInfo || '[التفاصيل]')
        .replace(/\[NUMBER\]/g, '15')
        .replace(/\[DETAILED ITINERARY\]/g, additionalInfo || '[برنامج الرحلة]')
        .replace(/\[ACCOMMODATION DETAILS\]/g, '[تفاصيل السكن]')
        .replace(/\[DOCUMENT \d\]/g, '[اسم الوثيقة]')
        .replace(/\[AMOUNT\]/g, '[المبلغ]')
        .replace(/\[DAYS\]/g, '15')
        .replace(/\[EMPLOYMENT TYPE\]/g, '[نوع العمل]')
        .replace(/\[YEARS\]/g, '[عدد السنوات]')
        .replace(/\[PREVIOUS TRAVEL \d\]/g, '[سفر سابق]')
        .replace(/\[FAMILY DETAILS\]/g, additionalInfo || '[تفاصيل العائلة]')
        .replace(/\[EMPLOYER DETAILS\]/g, '[تفاصيل صاحب العمل]')
        .replace(/\[POSITION AND SENIORITY\]/g, '[المنصب والقدم]')
        .replace(/\[ANNUAL LEAVE DATES\]/g, '[تواريخ الإجازة]')
        .replace(/\[PROPERTY DETAILS\]/g, '[تفاصيل الملكية]')
        .replace(/\[BANK LOANS, MORTGAGES, ETC\.\]/g, '[القروض البنكية، الرهن العقاري، إلخ]')
      
      setGeneratedDocument(doc)
      setIsGenerating(false)
      setStep(3)
    }, 2000)
  }

  const downloadDocument = () => {
    if (!generatedDocument) return
    
    const blob = new Blob([generatedDocument], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `recours-${selectedReason?.code}-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const resetGenerator = () => {
    setStep(1)
    setSelectedReason(null)
    setFullName(user?.fullName || '')
    setPassportNumber('')
    setApplicationDate('')
    setEmbassy('')
    setAdditionalInfo('')
    setGeneratedDocument('')
  }

  if (!isPremium) {
    return (
      <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold mb-2 gradient-text">مولد الطعون</h2>
            <p className="text-white/60 text-sm">أنشئ وثائق الطعن عند الرفض</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-4 mb-6 border-neon-purple/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neon-purple/20 rounded-lg">
                <AlertCircle className="text-neon-purple" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">هذه الخدمة متاحة فقط للمشتركين بريميوم</p>
                <p className="text-xs text-white/60">اشترك الآن للحصول على جميع الخدمات المتقدمة</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 text-center"
          >
            <FileWarning className="mx-auto mb-4 text-white/30" size={48} />
            <h3 className="font-bold mb-2">تم رفض طلبك؟</h3>
            <p className="text-sm text-white/60 mb-4">
              اشترك في باقة بريميوم للوصول إلى مولد الطعون المتقدم
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">مولد الطعون</h2>
          <p className="text-white/60 text-sm">أنشئ وثيقة الطعن على رفض التأشيرة</p>
        </motion.div>

        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1">
              <div className={cn(
                'h-2 rounded-full transition-colors',
                s <= step ? 'bg-neon-cyan' : 'bg-white/20'
              )} />
            </div>
          ))}
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="font-bold">ما هو سبب الرفض؟</h3>
            <p className="text-sm text-white/60">اختر رمز الرفض الذي تلقيته</p>
            
            {refusalReasons.map((reason, index) => (
              <motion.button
                key={reason.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                onClick={() => setSelectedReason(reason)}
                className={cn(
                  'glass-card-hover p-4 w-full text-right',
                  selectedReason?.id === reason.id && 'border-2 border-neon-cyan bg-neon-cyan/10'
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 bg-neon-magenta/20 text-neon-magenta rounded-full flex items-center justify-center font-bold text-sm">
                    {reason.code}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-bold mb-1">{reason.labelAr}</h4>
                    <p className="text-xs text-white/60">{reason.descriptionAr}</p>
                  </div>
                </div>
              </motion.button>
            ))}

            {selectedReason && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(2)}
                className="neon-button w-full flex items-center justify-center gap-2"
              >
                التالي
                <ArrowRight size={18} />
              </motion.button>
            )}
          </motion.div>
        )}

        {step === 2 && selectedReason && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="glass-card p-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
                <span className="w-6 h-6 bg-neon-magenta/20 text-neon-magenta rounded-full flex items-center justify-center text-xs font-bold">
                  {selectedReason.code}
                </span>
                <span>{selectedReason.labelAr}</span>
              </div>
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">الاسم الكامل</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="كما هو مكتوب في الجواز"
                className="input-field"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">رقم الجواز</label>
              <input
                type="text"
                value={passportNumber}
                onChange={(e) => setPassportNumber(e.target.value)}
                placeholder="رقم الجواز"
                className="input-field"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">تاريخ تقديم الطلب</label>
              <input
                type="date"
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">السفارة/القنصلية</label>
              <input
                type="text"
                value={embassy}
                onChange={(e) => setEmbassy(e.target.value)}
                placeholder="مثال: فرنسا"
                className="input-field"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">معلومات إضافية (اختياري)</label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="أي معلومات إضافية تود إضافتها..."
                className="input-field min-h-[100px] resize-none"
              />
            </div>

            <div className="glass-card p-4">
              <h4 className="font-bold mb-2">الوثائق المطلوبة:</h4>
              <ul className="space-y-1">
                {selectedReason.requiredDocs.map((doc) => (
                  <li key={doc} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="w-2 h-2 bg-neon-cyan rounded-full" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl glass-card-hover"
              >
                <ArrowLeft size={18} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={generateDocument}
                disabled={isGenerating}
                className="flex-1 neon-button flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    جارٍ الإنشاء...
                  </>
                ) : (
                  <>
                    <FileText size={18} />
                    إنشاء الوثيقة
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 3 && generatedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-4 mb-4 text-center"
            >
              <Check className="mx-auto mb-2 text-neon-cyan" size={32} />
              <h3 className="font-bold">تم إنشاء الوثيقة!</h3>
              <p className="text-xs text-white/60 mt-1">
                راجع الوثيقة وأضف أي تعديلات ضرورية
              </p>
            </motion.div>

            <div className="glass-card p-4">
              <textarea
                value={generatedDocument}
                onChange={(e) => setGeneratedDocument(e.target.value)}
                className="input-field min-h-[400px] resize-none font-mono text-sm"
                dir="ltr"
              />
            </div>

            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={resetGenerator}
                className="px-6 py-3 rounded-xl glass-card-hover"
              >
                جديد
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={downloadDocument}
                className="flex-1 neon-button flex items-center justify-center gap-2"
              >
                <Download size={18} />
                تحميل الوثيقة
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-4"
            >
              <h4 className="font-bold mb-2">ملاحظات مهمة:</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-1.5" />
                  قم بمراجعة الوثيقة وإضافة أي معلومات مفقودة
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-1.5" />
                  قدم الطعن خلال 30 يوم من تاريخ الرفض
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-1.5" />
                  أحضر جميع الوثائق المطلوبة معك
                </li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default RecoursGenerator
