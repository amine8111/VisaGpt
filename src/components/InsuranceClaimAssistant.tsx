'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  FileText, Shield, AlertTriangle, CheckCircle, Clock,
  Upload, Download, Plus, Trash2, ChevronRight, FileCheck,
  Pill, Plane, Briefcase, Heart, Home, Phone, Mail,
  Calendar, User, CreditCard
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

interface ClaimType {
  id: string
  nameAr: string
  nameEn: string
  nameFr: string
  icon: any
  descriptionAr: string
  descriptionEn: string
  descriptionFr: string
  documentsAr: string[]
  documentsEn: string[]
  documentsFr: string[]
  deadlineAr: string
  deadlineEn: string
  deadlineFr: string
  coverageAr: string[]
  coverageEn: string[]
  coverageFr: string[]
}

interface Claim {
  id: string
  type: string
  date: string
  description: string
  amount: number
  status: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected'
  documents: { name: string; uploaded: boolean }[]
}

const claimTypes: ClaimType[] = [
  {
    id: 'medical',
    nameAr: 'مصروفات طبية',
    nameEn: 'Medical Expenses',
    nameFr: 'Frais Médicaux',
    icon: Heart,
    descriptionAr: 'تكاليف المستشفى والطبيب والأدوية أثناء السفر',
    descriptionEn: 'Hospital, doctor, medication costs during travel',
    descriptionFr: 'Frais d\'hôpital, de médecin et de médicaments pendant le voyage',
    documentsAr: ['تقرير طبي', 'وصفات طبية', 'إيصالات', 'بوليصة التأمين'],
    documentsEn: ['Medical report', 'Prescriptions', 'Receipts', 'Insurance policy'],
    documentsFr: ['Rapport médical', 'Ordonnances', 'Reçus', 'Police d\'assurance'],
    deadlineAr: '30 يوماً بعد الحادث',
    deadlineEn: '30 days after incident',
    deadlineFr: '30 jours après l\'incident',
    coverageAr: ['الإقامة بالمستشفى', 'استشارات الطبيب', 'الأدوية', 'طب الأسنان الطارئ'],
    coverageEn: ['Hospital stays', 'Doctor consultations', 'Medications', 'Emergency dental'],
    coverageFr: ['Séjours à l\'hôpital', 'Consultations médicales', 'Médicaments', 'Dentisterie d\'urgence']
  },
  {
    id: 'cancellation',
    nameAr: 'إلغاء الرحلة',
    nameEn: 'Trip Cancellation',
    nameFr: 'Annulation de Voyage',
    icon: Plane,
    descriptionAr: 'عند إلغاء الرحلة لأسباب غير متوقعة',
    descriptionEn: 'When you need to cancel your trip due to unforeseen circumstances',
    descriptionFr: 'Quand vous devez annuler votre voyage pour des circonstances imprévues',
    documentsAr: ['خطاب الإلغاء', 'تأكيدات الحجز', 'إثبات السبب', 'رفضات الاسترداد'],
    documentsEn: ['Cancellation letter', 'Booking confirmations', 'Proof of reason', 'Refund denials'],
    documentsFr: ['Lettre d\'annulation', 'Confirmations de réservation', 'Preuve de la raison', 'Refus de remboursement'],
    deadlineAr: 'في أقرب وقت، قبل تاريخ الرحلة',
    deadlineEn: 'As soon as possible, before trip date',
    deadlineFr: 'Dès que possible, avant la date du voyage',
    coverageAr: ['الحجوزات غير القابلة للاسترداد', 'تغييرات الطيران', 'رفض التأشيرة', 'وفاة فرد من العائلة'],
    coverageEn: ['Non-refundable bookings', 'Flight changes', 'Visa denial', 'Death of family member'],
    coverageFr: ['Réservations non remboursables', 'Changements de vol', 'Refus de visa', 'Décès d\'un membre de la famille']
  },
  {
    id: 'delay',
    nameAr: 'تأخير الرحلة',
    nameEn: 'Flight Delay',
    nameFr: 'Retard de Vol',
    icon: Clock,
    descriptionAr: 'رحلات متأخرة تسبب نفقات إضافية',
    descriptionEn: 'Delayed flights causing additional expenses',
    descriptionFr: 'Vols retardés causant des dépenses supplémentaires',
    documentsAr: ['شهادة التأخير', 'بطاقات الصعود', 'إيصالات النفقات', 'كشف حساب'],
    documentsEn: ['Flight delay certificate', 'Boarding passes', 'Expense receipts', 'Bank statements'],
    documentsFr: ['Certificat de retard', 'Cartes d\'embarquement', 'Reçus des dépenses', 'Relevés bancaires'],
    deadlineAr: '21 يوماً بعد التأخير',
    deadlineEn: '21 days after delay',
    deadlineFr: '21 jours après le retard',
    coverageAr: ['الوجبات والإقامة', 'المواصلات', 'المكالمات الهاتفية', 'المشتريات الضرورية'],
    coverageEn: ['Meals and accommodation', 'Transportation', 'Phone calls', 'Essential purchases'],
    coverageFr: ['Repas et hébergement', 'Transport', 'Appels téléphoniques', 'Achats essentiels']
  },
  {
    id: 'luggage',
    nameAr: 'أمتعة مفقودة/تالفة',
    nameEn: 'Lost/Damaged Luggage',
    nameFr: 'Bagages Perdus/Endommagés',
    icon: Briefcase,
    descriptionAr: 'أمتعة مفقودة أو متأخرة أو تالفة',
    descriptionEn: 'Lost, delayed, or damaged baggage',
    descriptionFr: 'Bagages perdus, retardés ou endommagés',
    documentsAr: ['تقرير عدم انتظام الأمتعة', 'خطاب تعويض الشركة', 'صور التلف', 'إيصالات الشراء'],
    documentsEn: ['PIR (Property Irregularity Report)', 'Airline compensation letter', 'Photos of damage', 'Purchase receipts'],
    documentsFr: ['Rapport PIR', 'Lettre d\'indemnisation de la compagnie', 'Photos des dommages', 'Reçus d\'achat'],
    deadlineAr: '21 يوماً بعد تقرير الأمتعة',
    deadlineEn: '21 days after baggage report',
    deadlineFr: '21 jours après le rapport de bagages',
    coverageAr: ['قيمة الأمتعة المفقودة', 'المشتريات الضرورية', 'تأخير الأمتعة', 'إصلاح التلف'],
    coverageEn: ['Lost baggage value', 'Essential purchases', 'Delayed baggage', 'Damage repair'],
    coverageFr: ['Valeur des bagages perdus', 'Achats essentiels', 'Bagages retardés', 'Réparation des dommages']
  },
  {
    id: 'personal',
    nameAr: 'المسؤولية الشخصية',
    nameEn: 'Personal Liability',
    nameFr: 'Responsabilité Civile',
    icon: Home,
    descriptionAr: 'عند إلحاق الضرر بممتلكات أو إيذاء شخص عن طريق الخطأ',
    descriptionEn: 'When you accidentally damage property or injure someone',
    descriptionFr: 'Quand vous endommagez accidentellement des biens ou blessez quelqu\'un',
    documentsAr: ['تقرير الحادث', 'صور الأضرار', 'شهادات الشهود', 'تقرير الشرطة'],
    documentsEn: ['Incident report', 'Photos of damage', 'Witness statements', 'Police report'],
    documentsFr: ['Rapport d\'incident', 'Photos des dommages', 'Déclarations des témoins', 'Rapport de police'],
    deadlineAr: '30 يوماً بعد الحادث',
    deadlineEn: '30 days after incident',
    deadlineFr: '30 jours après l\'incident',
    coverageAr: ['الأضرار المادية', 'الإصابات الجسدية', 'تكاليف قانونية', 'المساعدة الطارئة'],
    coverageEn: ['Property damage', 'Bodily injury', 'Legal costs', 'Emergency assistance'],
    coverageFr: ['Dommages matériels', 'Blessures corporelles', 'Frais juridiques', 'Assistance d\'urgence']
  }
]

export function InsuranceClaimAssistant() {
  const { t, dir, language } = useLanguage()
  const [selectedClaimType, setSelectedClaimType] = useState<ClaimType | null>(null)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    incidentDate: '',
    incidentDescription: '',
    claimedAmount: '',
    bankAccount: '',
    iban: '',
    policyNumber: '',
    flightNumber: '',
    hospitalName: '',
    doctorName: ''
  })
  const [documents, setDocuments] = useState<{ name: string; uploaded: boolean }[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const getLocalizedText = (item: { ar: string; en: string; fr: string }) => {
    if (language === 'ar') return item.ar
    if (language === 'fr') return item.fr
    return item.en
  }

  const selectClaimType = (type: ClaimType) => {
    setSelectedClaimType(type)
    const docs = language === 'ar' ? type.documentsAr : language === 'fr' ? type.documentsFr : type.documentsEn
    setDocuments(docs.map(doc => ({ name: doc, uploaded: false })))
    setStep(2)
  }

  const uploadDocument = (index: number) => {
    const updated = [...documents]
    updated[index].uploaded = true
    setDocuments(updated)
  }

  const generateClaim = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
    setShowSuccess(true)
  }

  const downloadClaimForm = () => {
    if (!selectedClaimType) return

    const claimForm = `
═══════════════════════════════════════════════════════════════════
              INSURANCE CLAIM FORM - ${selectedClaimType.nameAr}
═══════════════════════════════════════════════════════════════════

Date: ${new Date().toLocaleDateString('ar-DZ')}
Claim Type: ${selectedClaimType.nameAr}

───────────────────────────────────────────────────────────────────
CLAIMANT INFORMATION
───────────────────────────────────────────────────────────────────
Policy Number: ${formData.policyNumber || '________________'}
Incident Date: ${formData.incidentDate || '________________'}
Description: ${formData.incidentDescription || '________________'}
Claimed Amount: ${formData.claimedAmount || '________________'} ${selectedClaimType.id === 'medical' ? 'EUR' : 'DZD'}

${selectedClaimType.id === 'medical' ? `
───────────────────────────────────────────────────────────────────
MEDICAL DETAILS
───────────────────────────────────────────────────────────────────
Hospital Name: ${formData.hospitalName || '________________'}
Doctor Name: ${formData.doctorName || '________________'}
` : ''}

${selectedClaimType.id === 'cancellation' ? `
───────────────────────────────────────────────────────────────────
TRIP DETAILS
───────────────────────────────────────────────────────────────────
Flight Number: ${formData.flightNumber || '________________'}
Cancellation Reason: ${formData.incidentDescription || '________________'}
` : ''}

───────────────────────────────────────────────────────────────────
BANK DETAILS FOR REIMBURSEMENT
───────────────────────────────────────────────────────────────────
Bank Account: ${formData.bankAccount || '________________'}
IBAN: ${formData.iban || '________________'}

───────────────────────────────────────────────────────────────────
REQUIRED DOCUMENTS CHECKLIST
───────────────────────────────────────────────────────────────────
${selectedClaimType.documentsAr.map((doc, i) => `[ ] ${i + 1}. ${doc}`).join('\n')}

───────────────────────────────────────────────────────────────────
DECLARATION
───────────────────────────────────────────────────────────────────
I hereby declare that:
1. All information provided is true and accurate
2. I have not made any other claims for this incident
3. I authorize the insurance company to verify all information
4. I understand that false information may result in claim denial

Signature: ___________________________
Date: ___________________________

═══════════════════════════════════════════════════════════════════
Generated by VisaGPT - Insurance Claim Assistant
═══════════════════════════════════════════════════════════════════
    `.trim()

    const blob = new Blob([claimForm], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `insurance-claim-${selectedClaimType.id}-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="text-green-400" size={48} />
          </motion.div>
          
          <h2 className="text-2xl font-bold mb-2">{t('claimCreated')}</h2>
          <p className="text-white/60 mb-6">{t('claimFormReady')}</p>
          
          <div className="space-y-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={downloadClaimForm}
              className="w-full neon-button py-4"
            >
              <Download className="inline ml-2" size={18} />
              {t('downloadClaimForm')}
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowSuccess(false)
                setSelectedClaimType(null)
                setStep(1)
                setFormData({
                  incidentDate: '',
                  incidentDescription: '',
                  claimedAmount: '',
                  bankAccount: '',
                  iban: '',
                  policyNumber: '',
                  flightNumber: '',
                  hospitalName: '',
                  doctorName: ''
                })
              }}
              className="w-full py-4 glass-card-hover rounded-xl"
            >
              {t('submitNewClaim')}
            </motion.button>
          </div>
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
          <h2 className="text-2xl font-bold mb-2 gradient-text">{t('insuranceClaimsAssistant')}</h2>
          <p className="text-white/60 text-sm">{t('insuranceClaimsAssistantDesc')}</p>
        </motion.div>

        {step === 1 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-4 mb-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <Shield className="text-neon-cyan" size={20} />
                <h3 className="font-bold">{t('howItWorks')}</h3>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-white/60">
                <div className="p-2 bg-white/5 rounded-lg">
                  <FileText className="mx-auto mb-1 text-neon-cyan" size={20} />
                  <p>{t('chooseType')}</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <Upload className="mx-auto mb-1 text-neon-cyan" size={20} />
                  <p>{t('uploadDocs')}</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <Download className="mx-auto mb-1 text-neon-cyan" size={20} />
                  <p>{t('getForm')}</p>
                </div>
              </div>
            </motion.div>

            <h3 className="font-bold mb-3">{t('claimTypeQuestion')}</h3>
            <div className="space-y-3">
              {claimTypes.map((type, index) => (
                <motion.button
                  key={type.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => selectClaimType(type)}
                  className="w-full glass-card-hover p-4 flex items-center gap-4 text-right"
                >
                  <div className="w-12 h-12 bg-neon-purple/20 rounded-full flex items-center justify-center">
                    <type.icon className="text-neon-purple" size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">{getLocalizedText({ ar: type.nameAr, en: type.nameEn, fr: type.nameFr })}</h4>
                    <p className="text-xs text-white/60">{getLocalizedText({ ar: type.descriptionAr, en: type.descriptionEn, fr: type.descriptionFr })}</p>
                  </div>
                  <ChevronRight size={18} className="text-white/30" />
                </motion.button>
              ))}
            </div>
          </>
        )}

        {step === 2 && selectedClaimType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              onClick={() => setStep(1)}
              className="text-sm text-neon-cyan mb-4 flex items-center gap-2"
            >
              <ChevronRight size={16} className="rotate-180" />
              {t('backToSelection')}
            </button>

            <div className="glass-card p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <selectedClaimType.icon className="text-neon-purple" size={24} />
                <div>
                  <h3 className="font-bold">{getLocalizedText({ ar: selectedClaimType.nameAr, en: selectedClaimType.nameEn, fr: selectedClaimType.nameFr })}</h3>
                  <p className="text-xs text-white/60">{getLocalizedText({ ar: selectedClaimType.descriptionAr, en: selectedClaimType.descriptionEn, fr: selectedClaimType.descriptionFr })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-yellow-400">
                <Clock size={14} />
                <span>{t('deadline')}: {getLocalizedText({ ar: selectedClaimType.deadlineAr, en: selectedClaimType.deadlineEn, fr: selectedClaimType.deadlineFr })}</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-white/70 mb-2 block">{t('policyNumber')}</label>
                <input
                  type="text"
                  value={formData.policyNumber}
                  onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                  className="input-field"
                  placeholder="POL-XXXXXXXX"
                />
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">{t('incidentDate')}</label>
                <input
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">{t('incidentDescription')}</label>
                <textarea
                  value={formData.incidentDescription}
                  onChange={(e) => setFormData({ ...formData, incidentDescription: e.target.value })}
                  className="input-field min-h-[100px] resize-none"
                  placeholder={t('explainIncident')}
                />
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">{t('claimedAmount')}</label>
                <input
                  type="number"
                  value={formData.claimedAmount}
                  onChange={(e) => setFormData({ ...formData, claimedAmount: e.target.value })}
                  className="input-field"
                  placeholder="0"
                />
              </div>

              {selectedClaimType.id === 'medical' && (
                <>
                  <div>
                    <label className="text-sm text-white/70 mb-2 block">{t('hospitalName')}</label>
                    <input
                      type="text"
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/70 mb-2 block">{t('doctorName')}</label>
                    <input
                      type="text"
                      value={formData.doctorName}
                      onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </>
              )}

              {selectedClaimType.id === 'cancellation' && (
                <div>
                  <label className="text-sm text-white/70 mb-2 block">{t('flightNumber')}</label>
                  <input
                    type="text"
                    value={formData.flightNumber}
                    onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                    className="input-field"
                    placeholder="XX1234"
                  />
                </div>
              )}

              <div>
                <label className="text-sm text-white/70 mb-2 block">{t('bankAccount')}</label>
                <input
                  type="text"
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  className="input-field"
                  placeholder={t('accountNumber')}
                />
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">IBAN</label>
                <input
                  type="text"
                  value={formData.iban}
                  onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                  className="input-field"
                  placeholder="DZ00 XXXX XXXX XXXX XXXX XXXX"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-bold mb-3">{t('requiredDocuments')}</h4>
              <div className="space-y-2">
                {documents.map((doc, index) => (
                  <div key={index} className="glass-card p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileCheck className={cn(
                        'size-5',
                        doc.uploaded ? 'text-green-400' : 'text-white/30'
                      )} />
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    {!doc.uploaded && (
                      <label className="px-3 py-1 bg-white/10 rounded-lg text-xs cursor-pointer hover:bg-white/20">
                        {t('upload')}
                        <input
                          type="file"
                          className="hidden"
                          onChange={() => uploadDocument(index)}
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={generateClaim}
              disabled={isGenerating || !formData.incidentDate || !formData.incidentDescription}
              className="neon-button w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  {t('generating')}
                </>
              ) : (
                <>
                  <Download size={18} />
                  {t('generateClaimForm')}
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 glass-card p-4"
        >
          <h4 className="font-bold mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-yellow-400" />
            {t('importantTips')}
          </h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-neon-cyan rounded-full mt-1.5 flex-shrink-0" />
              {t('keepDocumentCopies')}
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-neon-cyan rounded-full mt-1.5 flex-shrink-0" />
              {t('submitClaimAsap')}
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-neon-cyan rounded-full mt-1.5 flex-shrink-0" />
              {t('keepClaimNumber')}
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

export default InsuranceClaimAssistant
