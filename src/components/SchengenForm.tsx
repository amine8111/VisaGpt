'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { FileText, Download, Check, AlertCircle, ArrowRight, ArrowLeft, Save, Eye } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

interface FormField {
  id: string
  label: string
  labelAr: string
  type: 'text' | 'date' | 'select' | 'textarea'
  value: string
  options?: { value: string; label: string }[]
  required?: boolean
  section: string
}

export function SchengenForm() {
  const { membership, user } = useVisaStore()
  const { t, dir } = useLanguage()
  const [currentSection, setCurrentSection] = useState(0)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const isGold = membership?.tier === 'gold' || membership?.tier === 'premium'

  const sections = [
    { id: 'personal', name: 'المعلومات الشخصية', nameEn: 'Personal Information' },
    { id: 'passport', name: 'معلومات الجواز', nameEn: 'Passport Information' },
    { id: 'travel', name: 'معلومات السفر', nameEn: 'Travel Information' },
    { id: 'accommodation', name: 'السكن', nameEn: 'Accommodation' },
    { id: 'financial', name: 'المعلومات المالية', nameEn: 'Financial Information' },
    { id: 'employment', name: 'معلومات العمل', nameEn: 'Employment Information' },
  ]

  const sectionFields: Record<string, FormField[]> = {
    personal: [
      { id: 'surname', label: 'Surname (Family name)', labelAr: 'اسم العائلة', type: 'text', value: '', required: true, section: 'personal' },
      { id: 'givenNames', label: 'Given names', labelAr: 'الاسم الشخصي', type: 'text', value: '', required: true, section: 'personal' },
      { id: 'surnameBorn', label: 'Surname at birth', labelAr: 'اسم العائلة عند الولادة', type: 'text', value: '', section: 'personal' },
      { id: 'givenNamesBorn', label: 'Given names at birth', labelAr: 'الاسم الشخصي عند الولادة', type: 'text', value: '', section: 'personal' },
      { id: 'dateOfBirth', label: 'Date of birth', labelAr: 'تاريخ الميلاد', type: 'date', value: '', required: true, section: 'personal' },
      { id: 'placeOfBirth', label: 'Place of birth', labelAr: 'مكان الميلاد', type: 'text', value: '', required: true, section: 'personal' },
      { id: 'countryOfBirth', label: 'Country of birth', labelAr: 'بلد الميلاد', type: 'select', value: 'DZ', options: [{ value: 'DZ', label: 'Algeria' }], required: true, section: 'personal' },
      { id: 'nationality', label: 'Current nationality', labelAr: 'الجنسية الحالية', type: 'select', value: 'DZ', options: [{ value: 'DZ', label: 'Algeria' }], required: true, section: 'personal' },
      { id: 'sex', label: 'Sex', labelAr: 'الجنس', type: 'select', value: '', options: [{ value: 'M', label: 'Male' }, { value: 'F', label: 'Female' }], required: true, section: 'personal' },
      { id: 'maritalStatus', label: 'Marital status', labelAr: 'الحالة الاجتماعية', type: 'select', value: '', options: [{ value: 'single', label: 'Single' }, { value: 'married', label: 'Married' }, { value: 'divorced', label: 'Divorced' }, { value: 'widowed', label: 'Widowed' }], required: true, section: 'personal' },
      { id: 'nationalId', label: 'National ID number', labelAr: 'رقم بطاقة الهوية', type: 'text', value: '', section: 'personal' },
    ],
    passport: [
      { id: 'passportType', label: 'Travel document type', labelAr: 'نوع وثيقة السفر', type: 'select', value: 'ordinary', options: [{ value: 'ordinary', label: 'Ordinary Passport' }], required: true, section: 'passport' },
      { id: 'passportNumber', label: 'Travel document number', labelAr: 'رقم الجواز', type: 'text', value: '', required: true, section: 'passport' },
      { id: 'passportIssueDate', label: 'Date of issue', labelAr: 'تاريخ الإصدار', type: 'date', value: '', required: true, section: 'passport' },
      { id: 'passportExpiry', label: 'Date of expiry', labelAr: 'تاريخ الانتهاء', type: 'date', value: '', required: true, section: 'passport' },
      { id: 'issuingAuthority', label: 'Issuing authority', labelAr: 'الجهة المصدرة', type: 'text', value: '', required: true, section: 'passport' },
    ],
    travel: [
      { id: 'entryCountry', label: 'Member State of destination', labelAr: 'دولة الوجهة', type: 'select', value: '', options: [
        { value: 'FR', label: 'France' },
        { value: 'DE', label: 'Germany' },
        { value: 'ES', label: 'Spain' },
        { value: 'IT', label: 'Italy' },
        { value: 'PT', label: 'Portugal' },
        { value: 'NL', label: 'Netherlands' },
        { value: 'BE', label: 'Belgium' },
        { value: 'AT', label: 'Austria' },
        { value: 'CH', label: 'Switzerland' },
        { value: 'GR', label: 'Greece' },
      ], required: true, section: 'travel' },
      { id: 'purpose', label: 'Purpose of journey', labelAr: 'غرض الرحلة', type: 'select', value: '', options: [
        { value: 'tourism', label: 'Tourism' },
        { value: 'business', label: 'Business' },
        { value: 'family', label: 'Family visit' },
        { value: 'study', label: 'Study' },
        { value: 'cultural', label: 'Cultural' },
        { value: 'sports', label: 'Sports' },
        { value: 'medical', label: 'Medical reasons' },
        { value: 'transit', label: 'Transit' },
        { value: 'official', label: 'Official visit' },
      ], required: true, section: 'travel' },
      { id: 'arrivalDate', label: 'Intended date of arrival', labelAr: 'تاريخ الوصول المتوقع', type: 'date', value: '', required: true, section: 'travel' },
      { id: 'departureDate', label: 'Intended date of departure', labelAr: 'تاريخ المغادرة المتوقع', type: 'date', value: '', required: true, section: 'travel' },
      { id: 'entryPlaces', label: 'Intended places of entry', labelAr: 'أماكن الدخول المتوقع', type: 'text', value: '', section: 'travel' },
      { id: 'numEntries', label: 'Number of entries', labelAr: 'عدد الدخول', type: 'select', value: '', options: [
        { value: 'single', label: 'Single entry' },
        { value: 'double', label: 'Double entry' },
        { value: 'multiple', label: 'Multiple entries' },
      ], required: true, section: 'travel' },
    ],
    accommodation: [
      { id: 'hostType', label: 'Type of accommodation', labelAr: 'نوع السكن', type: 'select', value: '', options: [
        { value: 'hotel', label: 'Hotel' },
        { value: 'rental', label: 'Rented accommodation' },
        { value: 'private', label: 'Private accommodation' },
        { value: 'other', label: 'Other' },
      ], required: true, section: 'accommodation' },
      { id: 'hostName', label: 'Name of host/company', labelAr: 'اسم المضيف/الشركة', type: 'text', value: '', required: true, section: 'accommodation' },
      { id: 'hostAddress', label: 'Address', labelAr: 'العنوان', type: 'textarea', value: '', required: true, section: 'accommodation' },
      { id: 'hostPhone', label: 'Phone', labelAr: 'الهاتف', type: 'text', value: '', required: true, section: 'accommodation' },
      { id: 'hostEmail', label: 'Email', labelAr: 'البريد الإلكتروني', type: 'text', value: '', section: 'accommodation' },
    ],
    financial: [
      { id: 'financialMeans', label: 'Means of subsistence', labelAr: 'وسائل العيش', type: 'select', value: '', options: [
        { value: 'cash', label: 'Cash' },
        { value: 'credit', label: 'Credit cards' },
        { value: 'sponsor', label: 'Sponsorship' },
        { value: 'accommodation', label: 'Accommodation provided' },
      ], required: true, section: 'financial' },
      { id: 'monthlyIncome', label: 'Monthly income (EUR)', labelAr: 'الدخل الشهري (يورو)', type: 'text', value: '', section: 'financial' },
      { id: 'bankBalance', label: 'Available funds (EUR)', labelAr: 'الأموال المتاحة (يورو)', type: 'text', value: '', section: 'financial' },
      { id: 'hasInsurance', label: 'Travel medical insurance', labelAr: 'التأمين الصحي', type: 'select', value: '', options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ], required: true, section: 'financial' },
      { id: 'insuranceProvider', label: 'Insurance provider', labelAr: 'شركة التأمين', type: 'text', value: '', section: 'financial' },
      { id: 'insuranceCoverage', label: 'Coverage amount (EUR)', labelAr: 'مبلغ التغطية (يورو)', type: 'text', value: '', section: 'financial' },
    ],
    employment: [
      { id: 'employmentStatus', label: 'Current occupation', labelAr: 'المهنة الحالية', type: 'text', value: '', required: true, section: 'employment' },
      { id: 'employerName', label: 'Employer name', labelAr: 'اسم صاحب العمل', type: 'text', value: '', section: 'employment' },
      { id: 'employerAddress', label: 'Employer address', labelAr: 'عنوان العمل', type: 'textarea', value: '', section: 'employment' },
      { id: 'employerPhone', label: 'Employer phone', labelAr: 'هاتف العمل', type: 'text', value: '', section: 'employment' },
      { id: 'employerEmail', label: 'Employer email', labelAr: 'بريد العمل', type: 'text', value: '', section: 'employment' },
    ],
  }

  const updateField = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    setSaved(false)
  }

  const autoFill = () => {
    const autoFillData: Record<string, string> = {
      surname: user?.fullName?.split(' ').pop() || '',
      givenNames: user?.fullName?.split(' ').slice(0, -1).join(' ') || '',
      nationality: 'DZ',
      countryOfBirth: 'DZ',
      hostPhone: user?.phone || '',
    }
    setFormData(prev => ({ ...prev, ...autoFillData }))
    setSaved(false)
  }

  const saveForm = () => {
    setIsSaving(true)
    setTimeout(() => {
      localStorage.setItem('schengenForm', JSON.stringify(formData))
      setIsSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1000)
  }

  const downloadForm = () => {
    let content = 'نموذج طلب شنغن - SCHENGEN VISA APPLICATION\n'
    content += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n'
    
    for (const section of sections) {
      content += `\n[${section.name}]\n`
      content += `${'─'.repeat(40)}\n`
      
      for (const field of sectionFields[section.id]) {
        const value = formData[field.id] || ''
        content += `${field.labelAr}: ${value}\n`
      }
    }
    
    content += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
    content += `تم الإنشاء بواسطة VisaAI DZ - ${new Date().toLocaleDateString('ar-DZ')}\n`
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `schengen-form-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const currentFields = sectionFields[sections[currentSection].id]

  if (!isGold) {
    return (
      <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold mb-2 gradient-text">استمارة شنغن</h2>
            <p className="text-white/60 text-sm">تعبئة تلقائية لاستمارة شنغن</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-4 mb-6 border-yellow-500/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <AlertCircle className="text-yellow-400" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">هذه الخدمة متاحة فقط للمشتركين ذهبي أو بريميوم</p>
                <p className="text-xs text-white/60">اشترك للحصول على تعبئة تلقائية</p>
              </div>
            </div>
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
          className="mb-4"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">استمارة شنغن</h2>
          <p className="text-white/60 text-sm">أكمل البيانات التالية</p>
        </motion.div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={autoFill}
            className="text-xs text-neon-cyan flex items-center gap-1"
          >
            <FileText size={14} />
            تعبئة تلقائية من الملف
          </button>
          {saved && (
            <span className="text-xs text-green-400 flex items-center gap-1">
              <Check size={14} />
              تم الحفظ
            </span>
          )}
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(index)}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                currentSection === index && 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50',
                currentSection !== index && 'bg-white/5 text-white/60'
              )}
            >
              {section.name}
            </button>
          ))}
        </div>

        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4 mb-6"
        >
          {currentFields.map((field) => (
            <div key={field.id}>
              <label className="text-sm text-white/70 mb-2 flex items-center gap-2">
                {field.labelAr}
                {field.required && <span className="text-red-400">*</span>}
              </label>
              
              {field.type === 'select' ? (
                <select
                  value={formData[field.id] || ''}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  className="input-field"
                >
                  <option value="">اختر...</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={formData[field.id] || ''}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  className="input-field min-h-[80px] resize-none"
                  placeholder={field.labelAr}
                />
              ) : (
                <input
                  type={field.type}
                  value={formData[field.id] || ''}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  className="input-field"
                  placeholder={field.labelAr}
                />
              )}
            </div>
          ))}
        </motion.div>

        <div className="flex gap-3 mb-6">
          {currentSection > 0 && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentSection(prev => prev - 1)}
              className="px-6 py-3 rounded-xl glass-card-hover"
            >
              <ArrowLeft size={18} />
            </motion.button>
          )}
          
          {currentSection < sections.length - 1 ? (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentSection(prev => prev + 1)}
              className="flex-1 neon-button flex items-center justify-center gap-2"
            >
              التالي
              <ArrowRight size={18} />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={downloadForm}
              className="flex-1 neon-button flex items-center justify-center gap-2"
            >
              <Download size={18} />
              تحميل الاستمارة
            </motion.button>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={saveForm}
          disabled={isSaving}
          className="w-full py-3 rounded-xl bg-green-500/20 text-green-400 border border-green-500/50 flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full"
              />
              جارٍ الحفظ...
            </>
          ) : (
            <>
              <Save size={18} />
              حفظ البيانات
            </>
          )}
        </motion.button>

        <div className="mt-6 glass-card p-4">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <AlertCircle size={16} className="text-yellow-400" />
            ملاحظة مهمة
          </h4>
          <p className="text-xs text-white/60">
            هذه الاستمارة للمساعدة فقط. يجب تقديم الطلب رسمياً عبر موقع السفارات أو مراكز TLS/VFS.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SchengenForm
