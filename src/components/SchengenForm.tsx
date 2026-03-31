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
  labelFr: string
  type: 'text' | 'date' | 'select' | 'textarea'
  value: string
  options?: FormFieldOption[]
  required?: boolean
  section: string
}

interface FormFieldOption {
  value: string
  label: string
  labelAr: string
  labelFr: string
}

const getLocalizedLabel = (field: FormField, language: string) => {
  if (language === 'ar') return field.labelAr
  if (language === 'fr') return field.labelFr
  return field.label
}

const getLocalizedOption = (opt: FormFieldOption, language: string) => {
  if (language === 'ar') return opt.labelAr
  if (language === 'fr') return opt.labelFr
  return opt.label
}

export function SchengenForm() {
  const { membership, user } = useVisaStore()
  const { t, dir, language } = useLanguage()
  const [currentSection, setCurrentSection] = useState(0)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const isGold = membership?.tier === 'gold' || membership?.tier === 'premium'

  const getLocalizedSectionName = (section: { name: string; nameEn: string; nameAr: string; nameFr: string }) => {
    if (language === 'ar') return section.nameAr
    if (language === 'fr') return section.nameFr
    return section.nameEn
  }

  const sections = [
    { id: 'personal', name: 'Personal Information', nameEn: 'Personal Information', nameAr: 'المعلومات الشخصية', nameFr: 'Informations Personnelles' },
    { id: 'passport', name: 'Passport Information', nameEn: 'Passport Information', nameAr: 'معلومات الجواز', nameFr: 'Informations Passeport' },
    { id: 'travel', name: 'Travel Information', nameEn: 'Travel Information', nameAr: 'معلومات السفر', nameFr: 'Informations de Voyage' },
    { id: 'accommodation', name: 'Accommodation', nameEn: 'Accommodation', nameAr: 'السكن', nameFr: 'Hébergement' },
    { id: 'financial', name: 'Financial Information', nameEn: 'Financial Information', nameAr: 'المعلومات المالية', nameFr: 'Informations Financières' },
    { id: 'employment', name: 'Employment Information', nameEn: 'Employment Information', nameAr: 'معلومات العمل', nameFr: 'Informations Employment' },
  ]

  const sectionFields: Record<string, FormField[]> = {
    personal: [
      { id: 'surname', label: 'Surname (Family name)', labelAr: 'اسم العائلة', labelFr: 'Nom de famille', type: 'text', value: '', required: true, section: 'personal' },
      { id: 'givenNames', label: 'Given names', labelAr: 'الاسم الشخصي', labelFr: 'Prénoms', type: 'text', value: '', required: true, section: 'personal' },
      { id: 'surnameBorn', label: 'Surname at birth', labelAr: 'اسم العائلة عند الولادة', labelFr: 'Nom de naissance', type: 'text', value: '', section: 'personal' },
      { id: 'givenNamesBorn', label: 'Given names at birth', labelAr: 'الاسم الشخصي عند الولادة', labelFr: 'Prénoms de naissance', type: 'text', value: '', section: 'personal' },
      { id: 'dateOfBirth', label: 'Date of birth', labelAr: 'تاريخ الميلاد', labelFr: 'Date de naissance', type: 'date', value: '', required: true, section: 'personal' },
      { id: 'placeOfBirth', label: 'Place of birth', labelAr: 'مكان الميلاد', labelFr: 'Lieu de naissance', type: 'text', value: '', required: true, section: 'personal' },
      { id: 'countryOfBirth', label: 'Country of birth', labelAr: 'بلد الميلاد', labelFr: 'Pays de naissance', type: 'select', value: 'DZ', options: [{ value: 'DZ', label: 'Algeria', labelAr: 'الجزائر', labelFr: 'Algérie' }], required: true, section: 'personal' },
      { id: 'nationality', label: 'Current nationality', labelAr: 'الجنسية الحالية', labelFr: 'Nationalité actuelle', type: 'select', value: 'DZ', options: [{ value: 'DZ', label: 'Algeria', labelAr: 'الجزائر', labelFr: 'Algérie' }], required: true, section: 'personal' },
      { id: 'sex', label: 'Sex', labelAr: 'الجنس', labelFr: 'Sexe', type: 'select', value: '', options: [{ value: 'M', label: 'Male', labelAr: 'ذكر', labelFr: 'Masculin' }, { value: 'F', label: 'Female', labelAr: 'أنثى', labelFr: 'Féminin' }], required: true, section: 'personal' },
      { id: 'maritalStatus', label: 'Marital status', labelAr: 'الحالة الاجتماعية', labelFr: 'État civil', type: 'select', value: '', options: [{ value: 'single', label: 'Single', labelAr: 'أعزب/عزباء', labelFr: 'Célibataire' }, { value: 'married', label: 'Married', labelAr: 'متزوج/ة', labelFr: 'Marié(e)' }, { value: 'divorced', label: 'Divorced', labelAr: 'مطلق/ة', labelFr: 'Divorcé(e)' }, { value: 'widowed', label: 'Widowed', labelAr: 'أرمل/ة', labelFr: 'Veuf/Veuve' }], required: true, section: 'personal' },
      { id: 'nationalId', label: 'National ID number', labelAr: 'رقم بطاقة الهوية', labelFr: 'Numéro CNI', type: 'text', value: '', section: 'personal' },
    ],
    passport: [
      { id: 'passportType', label: 'Travel document type', labelAr: 'نوع وثيقة السفر', labelFr: 'Type de document', type: 'select', value: 'ordinary', options: [{ value: 'ordinary', label: 'Ordinary Passport', labelAr: 'جواز سفر عادي', labelFr: 'Passeport ordinaire' }], required: true, section: 'passport' },
      { id: 'passportNumber', label: 'Travel document number', labelAr: 'رقم الجواز', labelFr: 'Numéro du passeport', type: 'text', value: '', required: true, section: 'passport' },
      { id: 'passportIssueDate', label: 'Date of issue', labelAr: 'تاريخ الإصدار', labelFr: 'Date de délivrance', type: 'date', value: '', required: true, section: 'passport' },
      { id: 'passportExpiry', label: 'Date of expiry', labelAr: 'تاريخ الانتهاء', labelFr: 'Date d\'expiration', type: 'date', value: '', required: true, section: 'passport' },
      { id: 'issuingAuthority', label: 'Issuing authority', labelAr: 'الجهة المصدرة', labelFr: 'Autorité émettrice', type: 'text', value: '', required: true, section: 'passport' },
    ],
    travel: [
      { id: 'entryCountry', label: 'Member State of destination', labelAr: 'دولة الوجهة', labelFr: 'État membre de destination', type: 'select', value: '', options: [
        { value: 'FR', label: 'France', labelAr: 'فرنسا', labelFr: 'France' },
        { value: 'DE', label: 'Germany', labelAr: 'ألمانيا', labelFr: 'Allemagne' },
        { value: 'ES', label: 'Spain', labelAr: 'إسبانيا', labelFr: 'Espagne' },
        { value: 'IT', label: 'Italy', labelAr: 'إيطاليا', labelFr: 'Italie' },
        { value: 'PT', label: 'Portugal', labelAr: 'البرتغال', labelFr: 'Portugal' },
        { value: 'NL', label: 'Netherlands', labelAr: 'هولندا', labelFr: 'Pays-Bas' },
        { value: 'BE', label: 'Belgium', labelAr: 'بلجيكا', labelFr: 'Belgique' },
        { value: 'AT', label: 'Austria', labelAr: 'النمسا', labelFr: 'Autriche' },
        { value: 'CH', label: 'Switzerland', labelAr: 'سويسرا', labelFr: 'Suisse' },
        { value: 'GR', label: 'Greece', labelAr: 'اليونان', labelFr: 'Grèce' },
      ], required: true, section: 'travel' },
      { id: 'purpose', label: 'Purpose of journey', labelAr: 'غرض الرحلة', labelFr: 'Motif du voyage', type: 'select', value: '', options: [
        { value: 'tourism', label: 'Tourism', labelAr: 'سياحة', labelFr: 'Tourisme' },
        { value: 'business', label: 'Business', labelAr: 'عمل', labelFr: 'Affaires' },
        { value: 'family', label: 'Family visit', labelAr: 'زيارة عائلية', labelFr: 'Visite familiale' },
        { value: 'study', label: 'Study', labelAr: 'دراسة', labelFr: 'Études' },
        { value: 'cultural', label: 'Cultural', labelAr: 'ثقافي', labelFr: 'Culturel' },
        { value: 'sports', label: 'Sports', labelAr: 'رياضي', labelFr: 'Sports' },
        { value: 'medical', label: 'Medical reasons', labelAr: 'أسباب طبية', labelFr: 'Raisons médicales' },
        { value: 'transit', label: 'Transit', labelAr: 'ترانزيت', labelFr: 'Transit' },
        { value: 'official', label: 'Official visit', labelAr: 'زيارة رسمية', labelFr: 'Visite officielle' },
      ], required: true, section: 'travel' },
      { id: 'arrivalDate', label: 'Intended date of arrival', labelAr: 'تاريخ الوصول المتوقع', labelFr: 'Date d\'arrivée prévue', type: 'date', value: '', required: true, section: 'travel' },
      { id: 'departureDate', label: 'Intended date of departure', labelAr: 'تاريخ المغادرة المتوقع', labelFr: 'Date de départ prévue', type: 'date', value: '', required: true, section: 'travel' },
      { id: 'entryPlaces', label: 'Intended places of entry', labelAr: 'أماكن الدخول المتوقع', labelFr: 'Lieux d\'entrée prévus', type: 'text', value: '', section: 'travel' },
      { id: 'numEntries', label: 'Number of entries', labelAr: 'عدد الدخول', labelFr: 'Nombre d\'entrées', type: 'select', value: '', options: [
        { value: 'single', label: 'Single entry', labelAr: 'دخول مرة واحدة', labelFr: 'Une seule entrée' },
        { value: 'double', label: 'Double entry', labelAr: 'دخول مرتين', labelFr: 'Double entrée' },
        { value: 'multiple', label: 'Multiple entries', labelAr: 'دخول متعدد', labelFr: 'Entrées multiples' },
      ], required: true, section: 'travel' },
    ],
    accommodation: [
      { id: 'hostType', label: 'Type of accommodation', labelAr: 'نوع السكن', labelFr: 'Type d\'hébergement', type: 'select', value: '', options: [
        { value: 'hotel', label: 'Hotel', labelAr: 'فندق', labelFr: 'Hôtel' },
        { value: 'rental', label: 'Rented accommodation', labelAr: 'سكن مؤجر', labelFr: 'Logement loué' },
        { value: 'private', label: 'Private accommodation', labelAr: 'سكن خاص', labelFr: 'Logement privé' },
        { value: 'other', label: 'Other', labelAr: 'أخرى', labelFr: 'Autre' },
      ], required: true, section: 'accommodation' },
      { id: 'hostName', label: 'Name of host/company', labelAr: 'اسم المضيف/الشركة', labelFr: 'Nom de l\'hôte/entreprise', type: 'text', value: '', required: true, section: 'accommodation' },
      { id: 'hostAddress', label: 'Address', labelAr: 'العنوان', labelFr: 'Adresse', type: 'textarea', value: '', required: true, section: 'accommodation' },
      { id: 'hostPhone', label: 'Phone', labelAr: 'الهاتف', labelFr: 'Téléphone', type: 'text', value: '', required: true, section: 'accommodation' },
      { id: 'hostEmail', label: 'Email', labelAr: 'البريد الإلكتروني', labelFr: 'Courriel', type: 'text', value: '', section: 'accommodation' },
    ],
    financial: [
      { id: 'financialMeans', label: 'Means of subsistence', labelAr: 'وسائل العيش', labelFr: 'Moyens d\'existence', type: 'select', value: '', options: [
        { value: 'cash', label: 'Cash', labelAr: 'نقداً', labelFr: 'Espèces' },
        { value: 'credit', label: 'Credit cards', labelAr: 'بطاقات الائتمان', labelFr: 'Cartes de crédit' },
        { value: 'sponsor', label: 'Sponsorship', labelAr: 'ضمان', labelFr: 'Parrainage' },
        { value: 'accommodation', label: 'Accommodation provided', labelAr: 'السكن متوفر', labelFr: 'Hébergement fourni' },
      ], required: true, section: 'financial' },
      { id: 'monthlyIncome', label: 'Monthly income (EUR)', labelAr: 'الدخل الشهري (يورو)', labelFr: 'Revenu mensuel (EUR)', type: 'text', value: '', section: 'financial' },
      { id: 'bankBalance', label: 'Available funds (EUR)', labelAr: 'الأموال المتاحة (يورو)', labelFr: 'Fonds disponibles (EUR)', type: 'text', value: '', section: 'financial' },
      { id: 'hasInsurance', label: 'Travel medical insurance', labelAr: 'التأمين الصحي', labelFr: 'Assurance médicale', type: 'select', value: '', options: [
        { value: 'yes', label: 'Yes', labelAr: 'نعم', labelFr: 'Oui' },
        { value: 'no', label: 'No', labelAr: 'لا', labelFr: 'Non' },
      ], required: true, section: 'financial' },
      { id: 'insuranceProvider', label: 'Insurance provider', labelAr: 'شركة التأمين', labelFr: 'Assureur', type: 'text', value: '', section: 'financial' },
      { id: 'insuranceCoverage', label: 'Coverage amount (EUR)', labelAr: 'مبلغ التغطية (يورو)', labelFr: 'Montant de couverture (EUR)', type: 'text', value: '', section: 'financial' },
    ],
    employment: [
      { id: 'employmentStatus', label: 'Current occupation', labelAr: 'المهنة الحالية', labelFr: 'Profession actuelle', type: 'text', value: '', required: true, section: 'employment' },
      { id: 'employerName', label: 'Employer name', labelAr: 'اسم صاحب العمل', labelFr: 'Nom de l\'employeur', type: 'text', value: '', section: 'employment' },
      { id: 'employerAddress', label: 'Employer address', labelAr: 'عنوان العمل', labelFr: 'Adresse de l\'employeur', type: 'textarea', value: '', section: 'employment' },
      { id: 'employerPhone', label: 'Employer phone', labelAr: 'هاتف العمل', labelFr: 'Téléphone employeur', type: 'text', value: '', section: 'employment' },
      { id: 'employerEmail', label: 'Employer email', labelAr: 'بريد العمل', labelFr: 'Email employeur', type: 'text', value: '', section: 'employment' },
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
    content += `تم الإنشاء بواسطة VisaGPT - ${new Date().toLocaleDateString('ar-DZ')}\n`
    
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
      <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold mb-2 gradient-text">{t('schengenForm')}</h2>
            <p className="text-white/60 text-sm">{t('schengenFormDesc')}</p>
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
                <p className="font-medium text-sm">{t('premiumRequired')}</p>
                <p className="text-xs text-white/60">{t('premiumRequiredDesc')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">{t('schengenForm')}</h2>
          <p className="text-white/60 text-sm">{t('schengenFormFill')}</p>
        </motion.div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={autoFill}
            className="text-xs text-neon-cyan flex items-center gap-1"
          >
            <FileText size={14} />
            {t('autoFill')}
          </button>
          {saved && (
            <span className="text-xs text-green-400 flex items-center gap-1">
              <Check size={14} />
              {t('saved')}
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
              {getLocalizedSectionName(section)}
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
                {getLocalizedLabel(field, language)}
                {field.required && <span className="text-red-400">*</span>}
              </label>
              
              {field.type === 'select' ? (
                <select
                  value={formData[field.id] || ''}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  className="input-field"
                >
                  <option value="">{t('select')}</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {getLocalizedOption(opt, language)}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={formData[field.id] || ''}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  className="input-field min-h-[80px] resize-none"
                  placeholder={getLocalizedLabel(field, language)}
                />
              ) : (
                <input
                  type={field.type}
                  value={formData[field.id] || ''}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  className="input-field"
                  placeholder={getLocalizedLabel(field, language)}
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
              {t('next')}
              <ArrowRight size={18} />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={downloadForm}
              className="flex-1 neon-button flex items-center justify-center gap-2"
            >
              <Download size={18} />
              {t('downloadForm')}
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
              {t('saving')}
            </>
          ) : (
            <>
              <Save size={18} />
              {t('saveData')}
            </>
          )}
        </motion.button>

        <div className="mt-6 glass-card p-4">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <AlertCircle size={16} className="text-yellow-400" />
            {t('importantNote')}
          </h4>
          <p className="text-xs text-white/60">
            {t('schengenDisclaimer')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SchengenForm
