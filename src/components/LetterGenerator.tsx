'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { 
  FileText, Download, Eye, CheckCircle, Loader2,
  PenTool, Mail, Building, Users, ArrowRight, Copy
} from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

type LetterType = 'cover' | 'employer' | 'invitation'

interface LetterFormData {
  // Cover Letter
  recipientName: string
  recipientTitle: string
  embassyName: string
  purpose: string
  duration: string
  accommodationAddress: string
  
  // Employer Letter
  employeeName: string
  employeePosition: string
  companyName: string
  companyAddress: string
  salary: string
  
  // Invitation Letter
  inviterName: string
  inviterAddress: string
  inviteeName: string
  inviteePassport: string
  relationship: string
  invitationDuration: string
}

export function LetterGenerator() {
  const { user, setActiveNav } = useVisaStore()
  const { t, dir } = useLanguage()
  
  const [letterType, setLetterType] = useState<LetterType>('cover')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null)
  const [formData, setFormData] = useState<LetterFormData>({
    recipientName: '',
    recipientTitle: '',
    embassyName: '',
    purpose: '',
    duration: '',
    accommodationAddress: '',
    employeeName: user?.fullName || '',
    employeePosition: '',
    companyName: '',
    companyAddress: '',
    salary: '',
    inviterName: '',
    inviterAddress: '',
    inviteeName: '',
    inviteePassport: '',
    relationship: '',
    invitationDuration: '',
  })

  const letterTypes = [
    { id: 'cover', name: 'خطاب الغلاف', icon: Mail },
    { id: 'employer', name: 'شهادة العمل', icon: Building },
    { id: 'invitation', name: 'خطاب الدعوة', icon: Users },
  ]

  const handleInputChange = (field: keyof LetterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateLetter = async () => {
    setIsGenerating(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const name = user?.fullName || 'الاسم'
    const email = user?.email || 'البريد'
    const phone = user?.phone || 'الهاتف'
    const recipientTitle = formData.recipientTitle || 'السيد/ة'
    const recipientName = formData.recipientName || 'المستلم'
    const purpose = formData.purpose || 'السياحة'
    const duration = formData.duration || 'المدة'
    const accommodation = formData.accommodationAddress || 'عنوان السكن'
    const embassy = formData.embassyName || 'فرنسا'
    const employeeName = formData.employeeName || name
    const position = formData.employeePosition || 'المسمى الوظيفي'
    const company = formData.companyName || 'اسم الشركة'
    const companyAddress = formData.companyAddress || 'عنوان الشركة'
    const salary = formData.salary || 'الراتب'
    const travelDestination = formData.accommodationAddress || 'وجهة السفر'
    const inviterName = formData.inviterName || 'اسم الداعي'
    const inviterAddress = formData.inviterAddress || 'عنوان الداعي'
    const inviteeName = formData.inviteeName || 'اسم المدعو'
    const inviteePassport = formData.inviteePassport || 'رقم الجواز'
    const relationship = formData.relationship || 'العلاقة'
    const invDuration = formData.invitationDuration || 'المدة'
    
    let letter = ''
    
    if (letterType === 'cover') {
      letter = `
خطاب الغلاف - تأشيرة شنغن

إلى سفارة ${embassy} في الجزائر

الاسم الكامل: ${name}
البريد الإلكتروني: ${email}
رقم الهاتف: ${phone}

حضرة ${recipientTitle} ${recipientName}

أنا، ${name}، أكتب هذا الخطاب لطلب تأشيرة شنغن لغرض ${purpose}.

خلال فترة إقامتي من [تاريخ الوصول] إلى [تاريخ المغادرة] (${duration})، أخطط للبقاء في العنوان التالي:
${accommodation}

أتعهد بالامتثال لشروط التأشيرة والعودة إلى بلدي الجزائر في الموعد المحدد. لدي أقارب ومرافق في الجزائر تضمن عودتي.

المرفقات:
- جواز السفر
- صور شخصية
- كشف حساب بنكي
- تأمين سفر
- حجز فندق

وتفضلوا بقبول فائق الاحترام والتقدير

${name}
التاريخ: [التاريخ]
      `.trim()
    } else if (letterType === 'employer') {
      letter = `
شهادة employment - تأشيرة شنغن

أنا، الموقع أدناه، أؤكد أن:

الاسم: ${employeeName}
المنصب: ${position}
اسم الشركة: ${company}
عنوان الشركة: ${companyAddress}
الراتب الشهري: ${salary} دج

${employeeName} يعمل في شركتنا منذ [تاريخ البدء] وحتى الآن، براتب شهري قدره ${salary} دج.

${name} قدم طلب إجازة من [تاريخ] إلى [تاريخ] للسفر إلى ${travelDestination} لأغراض شخصية.

نؤكد أنه سيعود إلى منصبه بعد انتهاء الإجازة.

وتفضلوا بقبول فائق الاحترام

[اسم المدير]
[منصب المدير]
[اسم الشركة]
[الختم والتوقيع]
      `.trim()
    } else {
      letter = `
خطاب الدعوة - تأشيرة شنغن

إلى سفارة ${embassy} في الجزائر

أنا، الموقع أدناه:

الاسم: ${inviterName}
العنوان: ${inviterAddress}

أدعو بموجب هذا:
الاسم: ${inviteeName}
رقم جواز السفر: ${inviteePassport}
صلة القرابة: ${relationship}

للزيارة في الفترة من [تاريخ] إلى [تاريخ] (${invDuration}).

أتحمل المسؤولية الكاملة عن إقامتهم وأتعهد بضمان عودتهم إلى بلدهم.

المرفقات:
- نسخة من إثبات الهوية
- إثبات السكن
- كشف حساب بنكي

وتفضلوا بقبول فائق الاحترام

${inviterName}
التوقيع:
التاريخ:
      `.trim()
    }
    
    setGeneratedLetter(letter)
    setIsGenerating(false)
  }

  const copyToClipboard = () => {
    if (generatedLetter) {
      navigator.clipboard.writeText(generatedLetter)
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">مولد الخطابات</h2>
          <p className="text-white/60 text-sm">
            أنشئ خطابات احترافية بسهولة
          </p>
        </motion.div>

        {/* Letter Type Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2"
        >
          {letterTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setLetterType(type.id as LetterType)
                setGeneratedLetter(null)
              }}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                letterType === type.id && 'neon-button',
                letterType !== type.id && 'glass-card-hover'
              )}
            >
              <type.icon className="inline-block ml-2" size={16} />
              {type.name}
            </button>
          ))}
        </motion.div>

        {/* Form or Generated Letter */}
        {!generatedLetter ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {letterType === 'cover' && (
              <>
                <div className="glass-card p-4">
                  <label className="block text-sm text-white/60 mb-2">اسم المستلم</label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => handleInputChange('recipientName', e.target.value)}
                    className="input-field w-full"
                    placeholder="اسم المستلم"
                  />
                </div>
                <div className="glass-card p-4">
                  <label className="block text-sm text-white/60 mb-2">المنصب</label>
                  <input
                    type="text"
                    value={formData.recipientTitle}
                    onChange={(e) => handleInputChange('recipientTitle', e.target.value)}
                    className="input-field w-full"
                    placeholder="السيد/ة"
                  />
                </div>
                <div className="glass-card p-4">
                  <label className="block text-sm text-white/60 mb-2">اسم السفارة</label>
                  <input
                    type="text"
                    value={formData.embassyName}
                    onChange={(e) => handleInputChange('embassyName', e.target.value)}
                    className="input-field w-full"
                    placeholder="فرنسا"
                  />
                </div>
                <div className="glass-card p-4">
                  <label className="block text-sm text-white/60 mb-2">الغرض من الرحلة</label>
                  <input
                    type="text"
                    value={formData.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    className="input-field w-full"
                    placeholder="السياحة"
                  />
                </div>
                <div className="glass-card p-4">
                  <label className="block text-sm text-white/60 mb-2">مدة الإقامة</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="input-field w-full"
                    placeholder="15 يوم"
                  />
                </div>
                <div className="glass-card p-4">
                  <label className="block text-sm text-white/60 mb-2">عنوان السكن</label>
                  <textarea
                    value={formData.accommodationAddress}
                    onChange={(e) => handleInputChange('accommodationAddress', e.target.value)}
                    className="input-field w-full h-24"
                    placeholder="عنوان الفندق أو السكن"
                  />
                </div>
              </>
            )}

            {letterType === 'employer' && (
              <>
                <div className="glass-card p-4">
                  <label className="block text-sm text-white/60 mb-2">اسم الموظف</label>
                  <input
                    type="text"
                    value={formData.employeeName}
                    onChange={(e) => handleInputChange('employeeName', e.target.value)}
                    className="input-field w-full"
                    placeholder={user?.fullName || 'اسم الموظف'}
                  />
                </div>
                <div className="glass-card p-4">
                  <label className="block text-sm text-white/60 mb-2">المنصب</label>
                  <input
                    type="text"
                    value={formData.employeePosition}
                    onChange={(e) => handleInputChange('employeePosition', e.target.value)}
                    className="input-field w-full"
                    placeholder="مهندس"
                  />
                </div>
                <div className="glass-card p-4">
                  <label className="block text-sm text-white/60 mb-2">اسم الشركة</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="input-field w-full"
                    placeholder="اسم الشركة"
                  />
                </div>
                <div className="glass-card p-4">
                  <label className="block text-sm text-white/60 mb-2">عنوان الشركة</label>
                  <input
                    type="text"
                    value={formData.companyAddress}
                    onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                    className="input-field w-full"
                    placeholder="عنوان الشركة"
                  />
                </div>
                <div className="glass-card p-4">
                  <label className="block text-sm text-white/60 mb-2">الراتب الشهري (دج)</label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    className="input-field w-full"
                    placeholder="100000"
                  />
                </div>
              </>
            )}

            {letterType === 'invitation' && (
              <>
                <div className="glass-card p-4">
                  <label className="block text-sm text-white/60 mb-2">اسم الداعي</label>
                  <input
                    type="text"
                    value={formData.inviterName}
                    onChange={(e) => handleInputChange('inviterName', e.target.value)}
                    className="input-field w-full"
                    placeholder="اسم الداعي"
                  />
                </div>
                <div className="glass-card p-4">
                  <label className="block text-sm text-white/60 mb-2">عنوان الداعي</label>
                  <input
                    type="text"
                    value={formData.inviterAddress}
                    onChange={(e) => handleInputChange('inviterAddress', e.target.value)}
                    className="input-field w-full"
                    placeholder="عنوان الداعي في الخارج"
                  />
                </div>
                <div className="glass-card p-4">
                  <label className="block text-sm text-white/60 mb-2">اسم المدعو</label>
                  <input
                    type="text"
                    value={formData.inviteeName}
                    onChange={(e) => handleInputChange('inviteeName', e.target.value)}
                    className="input-field w-full"
                    placeholder="اسم المدعو"
                  />
                </div>
                <div className="glass-card p-4">
                  <label className="block text-sm text-white/60 mb-2">رقم جواز المدعو</label>
                  <input
                    type="text"
                    value={formData.inviteePassport}
                    onChange={(e) => handleInputChange('inviteePassport', e.target.value)}
                    className="input-field w-full"
                    placeholder="رقم الجواز"
                  />
                </div>
                <div className="glass-card p-4">
                  <label className="block text-sm text-white/60 mb-2">العلاقة</label>
                  <input
                    type="text"
                    value={formData.relationship}
                    onChange={(e) => handleInputChange('relationship', e.target.value)}
                    className="input-field w-full"
                    placeholder="ابن، أخ، صديق"
                  />
                </div>
              </>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={generateLetter}
              disabled={isGenerating}
              className="neon-button w-full py-4 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <PenTool size={20} />
                  إنشاء الخطاب
                </>
              )}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="glass-card p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="text-green-400" size={20} />
                <span className="font-medium text-green-400">تم إنشاء الخطاب</span>
              </div>
              <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono bg-white/5 p-4 rounded-lg overflow-x-auto">
                {generatedLetter}
              </pre>
            </div>

            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={copyToClipboard}
                className="flex-1 glass-card-hover py-3 flex items-center justify-center gap-2"
              >
                <Copy size={18} />
                نسخ
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="flex-1 neon-button py-3 flex items-center justify-center gap-2"
              >
                <Download size={18} />
                تحميل PDF
              </motion.button>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setGeneratedLetter(null)}
              className="w-full mt-3 py-3 text-neon-cyan text-center"
            >
              إنشاء خطاب جديد
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default LetterGenerator
