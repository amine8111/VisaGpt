'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  CheckCircle, Circle, FileText, 
  Upload, Info, Plane
} from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

const COUNTRY_DATA: Record<string, { flag: string; nameAr: string; nameFr: string; minDailyEUR: number; processingDays: number }> = {
  France: { flag: '🇫🇷', nameAr: 'فرنسا', nameFr: 'France', minDailyEUR: 65, processingDays: 15 },
  Germany: { flag: '🇩🇪', nameAr: 'ألمانيا', nameFr: 'Allemagne', minDailyEUR: 65, processingDays: 20 },
  Spain: { flag: '🇪🇸', nameAr: 'إسبانيا', nameFr: 'Espagne', minDailyEUR: 65, processingDays: 10 },
  Italy: { flag: '🇮🇹', nameAr: 'إيطاليا', nameFr: 'Italie', minDailyEUR: 65, processingDays: 15 },
  Portugal: { flag: '🇵🇹', nameAr: 'البرتغال', nameFr: 'Portugal', minDailyEUR: 65, processingDays: 10 },
  Belgium: { flag: '🇧🇪', nameAr: 'بلجيكا', nameFr: 'Belgique', minDailyEUR: 65, processingDays: 15 },
  Netherlands: { flag: '🇳🇱', nameAr: 'هولندا', nameFr: 'Pays-Bas', minDailyEUR: 65, processingDays: 20 },
  UK: { flag: '🇬🇧', nameAr: 'المملكة المتحدة', nameFr: 'Royaume-Uni', minDailyEUR: 100, processingDays: 21 },
  USA: { flag: '🇺🇸', nameAr: 'الولايات المتحدة', nameFr: 'États-Unis', minDailyEUR: 150, processingDays: 30 },
  Canada: { flag: '🇨🇦', nameAr: 'كندا', nameFr: 'Canada', minDailyEUR: 100, processingDays: 28 },
}

const VISA_TYPES_DATA: Record<string, { nameAr: string; nameFr: string }> = {
  tourist: { nameAr: 'سياحة', nameFr: 'Touriste' },
  business: { nameAr: 'عمل', nameFr: 'Affaires' },
  student: { nameAr: 'دراسة', nameFr: 'Étudiant' },
  work: { nameAr: 'عمل', nameFr: 'Travail' },
  family: { nameAr: 'عائلة', nameFr: 'Famille' },
}

interface DocumentDef {
  id: string
  name: string
  nameAr: string
  nameFr: string
  description: string
  descriptionAr: string
  descriptionFr: string
}

const ALL_DOCUMENTS: DocumentDef[] = [
  {
    id: 'passport',
    name: 'Passport',
    nameAr: 'جواز السفر',
    nameFr: 'Passeport',
    description: 'Valid passport (at least 6 months validity from return date)',
    descriptionAr: 'جواز سفر ساري المفعول (6 أشهر على الأقل من تاريخ العودة)',
    descriptionFr: 'Passeport valide (6 mois minimum après le retour)',
  },
  {
    id: 'photo',
    name: 'Passport Photos',
    nameAr: 'صور شخصية',
    nameFr: 'Photos d\'identité',
    description: 'Two recent passport photos (white background, 35x45mm)',
    descriptionAr: 'صورتين شخصيتين حديثتين (خلفية بيضاء، 35×45 ملم)',
    descriptionFr: 'Deux photos récentes (fond blanc, 35x45mm)',
  },
  {
    id: 'travel_itinerary',
    name: 'Travel Itinerary',
    nameAr: 'برنامج السفر',
    nameFr: 'Itinéraire de voyage',
    description: 'Round-trip flight booking or detailed travel plan',
    descriptionAr: 'حجز طيران ذهاب وعودة أو خطة سفر مفصلة',
    descriptionFr: 'Réservation vol aller-retour ou plan détaillé',
  },
  {
    id: 'accommodation',
    name: 'Accommodation Proof',
    nameAr: 'إثبات السكن',
    nameFr: 'Preuve d\'hébergement',
    description: 'Hotel booking or invitation letter with host details',
    descriptionAr: 'حجز فندق أو خطاب دعوة مع تفاصيل المضيف',
    descriptionFr: 'Réservation hôtel ou lettre d\'invitation',
  },
  {
    id: 'financial_proof',
    name: 'Bank Statement',
    nameAr: 'كشف حساب بنكي',
    nameFr: 'Relevé bancaire',
    description: 'Last 3 months bank statements (original + translation)',
    descriptionAr: 'كشوف حسابات بنكية لآخر 3 أشهر (أصلي + ترجمة)',
    descriptionFr: 'Relevés bancaires 3 derniers mois (original + traduction)',
  },
  {
    id: 'insurance',
    name: 'Travel Insurance',
    nameAr: 'تأمين سفر',
    nameFr: 'Assurance voyage',
    description: 'Schengen-compliant insurance (min €30,000 coverage)',
    descriptionAr: 'تأمين متوافق مع شنغن (تغطية minimum 30,000 يورو)',
    descriptionFr: 'Assurance conforme Schengen (couverture min 30,000€)',
  },
  {
    id: 'employment_letter',
    name: 'Employment Letter',
    nameAr: 'شهادة العمل',
    nameFr: 'Attestation d\'emploi',
    description: 'Letter from employer on company letterhead with salary',
    descriptionAr: 'خطاب من صاحب العمل على ورق الشركة مع الراتب',
    descriptionFr: 'Attestation employeur sur papier à en-tête avec salaire',
  },
  {
    id: 'invitation',
    name: 'Invitation Letter',
    nameAr: 'خطاب الدعوة',
    nameFr: 'Lettre d\'invitation',
    description: 'Official invitation from host (notarized for family visas)',
    descriptionAr: 'دعوة رسمية من المضيف (موثقة لتأشيرات العائلة)',
    descriptionFr: 'Invitation officielle de l\'hôte (notariée pour visa famille)',
  },
  {
    id: 'business_docs',
    name: 'Business Documents',
    nameAr: 'وثائق العمل',
    nameFr: 'Documents professionnels',
    description: 'Business registration, trade license, or company documents',
    descriptionAr: 'سجل تجاري، رخصة تجارة، أو وثائق الشركة',
    descriptionFr: 'Registre commerce, licence, ou documents entreprise',
  },
  {
    id: 'enrollment',
    name: 'Enrollment Letter',
    nameAr: 'خطاب القبول',
    nameFr: 'Lettre d\'inscription',
    description: 'University admission or enrollment confirmation',
    descriptionAr: 'قبول جامعي أو تأكيد التسجيل',
    descriptionFr: "Confirmation d'admission ou inscription universitaire",
  },
  {
    id: 'proof_funds',
    name: 'Proof of Funds',
    nameAr: 'إثبات التمويل',
    nameFr: 'Justificatif de fonds',
    description: 'Scholarship letter, sponsor affidavit, or fund documentation',
    descriptionAr: 'خطاب منحة، إ affidavit الراعي، أو وثائق التمويل',
    descriptionFr: 'Lettre bourse, affidavit sponsor, ou documentation fonds',
  },
  {
    id: 'accommodation_host',
    name: 'Host Accommodation',
    nameAr: 'سكن المضيف',
    nameFr: "Hébergement de l'hôte",
    description: 'Proof of host\'s residence (utility bill, rental contract)',
    descriptionAr: 'إثبات إقامة المضيف (فاتورة خدمات، عقد إيجار)',
    descriptionFr: "Preuve résidence hôte (facture, contrat location)",
  },
  {
    id: 'travel_history',
    name: 'Travel History',
    nameAr: 'سجل السفر',
    nameFr: 'Historique de voyage',
    description: 'Previous passports or entry/exit stamps',
    descriptionAr: 'جوازات سابقة أو بصمات دخول/خروج',
    descriptionFr: 'Passeports précédents ou tampons entrée/sortie',
  },
  {
    id: 'biometrics',
    name: 'Biometrics',
    nameAr: 'البصمات البيومترية',
    nameFr: 'Biométrie',
    description: 'Biometric data collection appointment confirmation',
    descriptionAr: 'تأكيد موعد جمع البيانات البيومترية',
    descriptionFr: "Confirmation rendez-vous biométrie",
  },
  {
    id: 'ds160',
    name: 'DS-160 Form',
    nameAr: 'نموذج DS-160',
    nameFr: 'Formulaire DS-160',
    description: 'Completed and printed DS-160 confirmation page',
    descriptionAr: 'صفحة تأكيد DS-160 المكتمل والمطبوع',
    descriptionFr: 'Page confirmation DS-160 complétée et imprimée',
  },
  {
    id: 'interview',
    name: 'Interview Appointment',
    nameAr: 'موعد المقابلة',
    nameFr: 'Rendez-vous d\'entretien',
    description: 'Confirmed appointment letter for visa interview',
    descriptionAr: 'خطاب تأكيد موعد مقابلة التأشيرة',
    descriptionFr: 'Lettre confirmation entretien visa',
  },
  {
    id: 'purpose_letter',
    name: 'Purpose of Travel',
    nameAr: 'خطاب الغرض',
    nameFr: 'Lettre de motivation',
    description: 'Detailed letter explaining purpose of visit',
    descriptionAr: 'خطاب مفصل يشرح غرض الزيارة',
    descriptionFr: 'Lettre détaillée expliquant le but de la visite',
  },
]

const VISA_CHECKLISTS: Record<string, Record<string, string[]>> = {
  France: {
    tourist: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'travel_history'],
    business: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'business_docs', 'purpose_letter'],
    student: ['passport', 'photo', 'enrollment', 'proof_funds', 'insurance', 'accommodation'],
    work: ['passport', 'photo', 'employment_letter', 'financial_proof', 'insurance', 'travel_history'],
    family: ['passport', 'photo', 'invitation', 'accommodation_host', 'financial_proof', 'insurance', 'purpose_letter'],
  },
  Germany: {
    tourist: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'employment_letter', 'travel_history'],
    business: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'business_docs', 'employment_letter'],
    student: ['passport', 'photo', 'enrollment', 'proof_funds', 'insurance', 'accommodation', 'employment_letter'],
    work: ['passport', 'photo', 'employment_letter', 'financial_proof', 'insurance', 'travel_history'],
    family: ['passport', 'photo', 'invitation', 'accommodation_host', 'financial_proof', 'insurance', 'employment_letter'],
  },
  Spain: {
    tourist: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'travel_history'],
    business: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'business_docs'],
    student: ['passport', 'photo', 'enrollment', 'proof_funds', 'insurance', 'accommodation'],
    work: ['passport', 'photo', 'employment_letter', 'financial_proof', 'insurance', 'travel_history'],
    family: ['passport', 'photo', 'invitation', 'accommodation_host', 'financial_proof', 'insurance'],
  },
  Italy: {
    tourist: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'travel_history'],
    business: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'business_docs', 'purpose_letter'],
    student: ['passport', 'photo', 'enrollment', 'proof_funds', 'insurance', 'accommodation'],
    work: ['passport', 'photo', 'employment_letter', 'financial_proof', 'insurance'],
    family: ['passport', 'photo', 'invitation', 'accommodation_host', 'financial_proof', 'insurance', 'purpose_letter'],
  },
  Portugal: {
    tourist: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'travel_history'],
    business: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'business_docs'],
    student: ['passport', 'photo', 'enrollment', 'proof_funds', 'insurance', 'accommodation'],
    work: ['passport', 'photo', 'employment_letter', 'financial_proof', 'insurance', 'travel_history'],
    family: ['passport', 'photo', 'invitation', 'accommodation_host', 'financial_proof', 'insurance'],
  },
  Belgium: {
    tourist: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'travel_history'],
    business: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'business_docs', 'employment_letter'],
    student: ['passport', 'photo', 'enrollment', 'proof_funds', 'insurance', 'accommodation', 'employment_letter'],
    work: ['passport', 'photo', 'employment_letter', 'financial_proof', 'insurance', 'travel_history'],
    family: ['passport', 'photo', 'invitation', 'accommodation_host', 'financial_proof', 'insurance', 'employment_letter'],
  },
  Netherlands: {
    tourist: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'employment_letter', 'travel_history'],
    business: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'business_docs', 'employment_letter'],
    student: ['passport', 'photo', 'enrollment', 'proof_funds', 'insurance', 'accommodation', 'employment_letter'],
    work: ['passport', 'photo', 'employment_letter', 'financial_proof', 'insurance', 'travel_history'],
    family: ['passport', 'photo', 'invitation', 'accommodation_host', 'financial_proof', 'insurance', 'employment_letter'],
  },
  UK: {
    tourist: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'travel_history'],
    business: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'business_docs', 'purpose_letter'],
    student: ['passport', 'photo', 'enrollment', 'proof_funds', 'insurance', 'accommodation'],
    work: ['passport', 'photo', 'employment_letter', 'financial_proof', 'insurance'],
    family: ['passport', 'photo', 'invitation', 'accommodation_host', 'financial_proof', 'insurance'],
  },
  USA: {
    tourist: ['passport', 'photo', 'ds160', 'financial_proof', 'insurance', 'travel_history', 'interview'],
    business: ['passport', 'photo', 'ds160', 'financial_proof', 'insurance', 'business_docs', 'interview'],
    student: ['passport', 'photo', 'ds160', 'enrollment', 'proof_funds', 'insurance', 'interview'],
    work: ['passport', 'photo', 'ds160', 'employment_letter', 'financial_proof', 'insurance', 'interview'],
    family: ['passport', 'photo', 'ds160', 'financial_proof', 'insurance', 'invitation', 'interview'],
  },
  Canada: {
    tourist: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'biometrics'],
    business: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'business_docs', 'biometrics'],
    student: ['passport', 'photo', 'enrollment', 'proof_funds', 'insurance', 'biometrics'],
    work: ['passport', 'photo', 'employment_letter', 'financial_proof', 'insurance', 'biometrics'],
    family: ['passport', 'photo', 'invitation', 'accommodation_host', 'financial_proof', 'insurance', 'biometrics'],
  },
}

const getDocDef = (id: string): DocumentDef => {
  return ALL_DOCUMENTS.find(d => d.id === id) || {
    id,
    name: id,
    nameAr: id,
    nameFr: id,
    description: id,
    descriptionAr: id,
    descriptionFr: id,
  }
}

export function Checklist() {
  const { userProfile, updateProfile, setActiveNav } = useVisaStore()
  const { language } = useLanguage()
  
  const [selectedCountry, setSelectedCountry] = useState(userProfile.targetCountry || 'France')
  const [selectedVisaType, setSelectedVisaType] = useState(userProfile.purposeOfVisit || 'tourist')
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const countryData = COUNTRY_DATA[selectedCountry]
  const visaTypeData = VISA_TYPES_DATA[selectedVisaType]

  const requiredDocs = VISA_CHECKLISTS[selectedCountry]?.[selectedVisaType] || VISA_CHECKLISTS[selectedCountry]?.tourist || []

  const toggleItem = (docId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [docId]: !prev[docId]
    }))
  }

  const completionPercentage = requiredDocs.length > 0 
    ? Math.round((Object.values(checkedItems).filter(Boolean).length / requiredDocs.length) * 100)
    : 0

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    updateProfile({ targetCountry: country })
    setCheckedItems({})
  }

  const handleVisaTypeChange = (type: string) => {
    setSelectedVisaType(type)
    updateProfile({ purposeOfVisit: type })
    setCheckedItems({})
  }

  const getLabel = (ar: string, fr: string, en: string) => {
    if (language === 'ar') return ar
    if (language === 'fr') return fr
    return en
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
          <h2 className="text-2xl font-bold mb-2 gradient-text">
            {getLabel('قائمة الوثائق المطلوبة', 'Documents requis', 'Required Documents')}
          </h2>
          <p className="text-white/60 text-sm">
            {getLabel('تحقق من الوثائق المطلوبة لرحلتك', 'Vérifiez les documents pour votre voyage', 'Check required documents for your trip')}
          </p>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-white/60">
              {getLabel('إكمال القائمة', 'Progression', 'Progress')}
            </span>
            <span className="text-lg font-bold text-neon-cyan">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple"
            />
          </div>
          <p className="text-xs text-white/50">
            {Object.values(checkedItems).filter(Boolean).length} / {requiredDocs.length} {getLabel('وثيقة جاهزة', 'documents prêts', 'documents ready')}
          </p>
        </motion.div>

        {/* Country & Visa Type Selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="glass-card p-4">
            <label className="text-xs text-white/60 mb-2 block">
              {getLabel('الدولة', 'Pays', 'Country')}
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="input-field w-full"
            >
              {Object.entries(COUNTRY_DATA).map(([key, data]) => (
                <option key={key} value={key}>
                  {data.flag} {language === 'ar' ? data.nameAr : language === 'fr' ? data.nameFr : key}
                </option>
              ))}
            </select>
          </div>
          <div className="glass-card p-4">
            <label className="text-xs text-white/60 mb-2 block">
              {getLabel('نوع التأشيرة', 'Type de visa', 'Visa Type')}
            </label>
            <select
              value={selectedVisaType}
              onChange={(e) => handleVisaTypeChange(e.target.value)}
              className="input-field w-full"
            >
              {Object.entries(VISA_TYPES_DATA).map(([key, data]) => (
                <option key={key} value={key}>
                  {language === 'ar' ? data.nameAr : language === 'fr' ? data.nameFr : key}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Country Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{countryData?.flag}</span>
            <div className="flex-1">
              <h3 className="font-bold">
                {language === 'ar' ? countryData?.nameAr : language === 'fr' ? countryData?.nameFr : selectedCountry}
              </h3>
              <p className="text-xs text-white/60">
                {getLabel('مدة المعالجة', 'Délai de traitement', 'Processing time')}: {countryData?.processingDays} {getLabel('أيام', 'jours', 'days')}
              </p>
            </div>
            <div className="text-left">
              <p className="text-xs text-white/60">{getLabel('الحد الأدنى', 'Minimum', 'Minimum')}</p>
              <p className="font-bold text-neon-cyan">{countryData?.minDailyEUR}€/day</p>
            </div>
          </div>
        </motion.div>

        {/* Document Checklist */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h3 className="font-bold mb-3">
            {getLabel('الوثائق المطلوبة', 'Documents requis', 'Required Documents')}
          </h3>
          
          {requiredDocs.map((docId, index) => {
            const doc = getDocDef(docId)
            const isChecked = checkedItems[docId]
            
            return (
              <motion.div
                key={docId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className={cn(
                  'glass-card p-4 transition-all',
                  isChecked && 'border-green-500/30 bg-green-500/5'
                )}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleItem(docId)}
                    className="mt-1 flex-shrink-0"
                  >
                    {isChecked ? (
                      <CheckCircle className="text-green-400" size={24} />
                    ) : (
                      <Circle className="text-white/40" size={24} />
                    )}
                  </button>
                  <div className="flex-1">
                    <h4 className={cn(
                      'font-medium mb-1',
                      isChecked && 'text-green-400'
                    )}>
                      {getLabel(doc.nameAr, doc.nameFr, doc.name)}
                    </h4>
                    <p className="text-xs text-white/60">
                      {getLabel(doc.descriptionAr, doc.descriptionFr, doc.description)}
                    </p>
                    {isChecked && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block mt-2 text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded"
                      >
                        ✓ {getLabel('جاهز', 'Prêt', 'Ready')}
                      </motion.span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 space-y-3"
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveNav('calculator')}
            className="neon-button w-full flex items-center justify-center gap-2"
          >
            <FileText size={18} />
            {getLabel('احصل على تقييم التأشيرة', "Obtenez l'évaluation visa", 'Get Visa Assessment')}
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="glass-card-hover w-full py-3 flex items-center justify-center gap-2"
          >
            <Upload size={18} />
            {getLabel('رفع الوثائق', 'Télécharger docs', 'Upload Documents')}
          </motion.button>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 p-4 bg-neon-cyan/10 rounded-xl border border-neon-cyan/20"
        >
          <div className="flex items-start gap-3">
            <Info className="text-neon-cyan flex-shrink-0" size={20} />
            <div className="text-sm">
              <h4 className="font-medium text-neon-cyan mb-1">
                {getLabel('نصيحة', 'Conseil', 'Tip')}
              </h4>
              <p className="text-white/70">
                {getLabel(
                  'تأكد من أن جواز سفرك صالح لمدة 6 أشهر على الأقل من تاريخ المغادرة المخطط',
                  'Assurez-vous que votre passeport est valide 6 mois après la date de retour prévue',
                  'Ensure your passport is valid for at least 6 months beyond your planned return date'
                )}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Checklist
