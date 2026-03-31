'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, Bot, Sparkles, Download, Copy, CheckCircle,
  ChevronRight, Loader2, Mail, Building2, Plane, User,
  Heart, Briefcase, GraduationCap, PlaneTakeoff
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { cn } from '@/lib/utils'

type DocumentType = 'invitation' | 'itinerary' | 'employment' | 'sponsorship' | 'guarantee' | 'travel-plan'

interface DocumentConfig {
  id: DocumentType
  name: string
  nameAr: string
  nameFr: string
  icon: any
  color: string
  description: string
  descriptionAr: string
  descriptionFr: string
}

const documentTypes: DocumentConfig[] = [
  {
    id: 'invitation',
    name: 'Invitation Letter',
    nameAr: 'خطاب الدعوة',
    nameFr: "Lettre d'invitation",
    icon: Mail,
    color: 'neon-cyan',
    description: 'Formal invitation for family/friend visits',
    descriptionAr: 'دعوة رسمية لزيارة العائلة والأصدقاء',
    descriptionFr: 'Invitation formelle pour visites familiales/amicales',
  },
  {
    id: 'itinerary',
    name: 'Travel Itinerary',
    nameAr: 'خط سير الرحلة',
    nameFr: "Itinéraire de voyage",
    icon: Plane,
    color: 'neon-purple',
    description: 'Day-by-day travel plan with accommodations',
    descriptionAr: 'خطة سفر يومية مع أماكن الإقامة',
    descriptionFr: 'Plan de voyage jour par jour avec hébergement',
  },
  {
    id: 'employment',
    name: 'Employment Letter',
    nameAr: 'شهادة العمل',
    nameFr: "Attestation d'emploi",
    icon: Briefcase,
    color: 'neon-magenta',
    description: 'Professional employment verification',
    descriptionAr: 'تأكيد وظيفي احترافي',
    descriptionFr: 'Vérification professionnelle d\'emploi',
  },
  {
    id: 'sponsorship',
    name: 'Sponsorship Letter',
    nameAr: 'خطاب الكفالة',
    nameFr: 'Lettre de sponsor',
    icon: Heart,
    color: 'emerald-400',
    description: 'Financial sponsorship declaration',
    descriptionAr: 'إعلان الكفالة المالية',
    descriptionFr: 'Déclaration de parrainage financier',
  },
  {
    id: 'guarantee',
    name: 'Bank Guarantee',
    nameAr: 'ضمان بنكي',
    nameFr: 'Garantie bancaire',
    icon: Building2,
    color: 'amber-400',
    description: 'Financial guarantee for visa application',
    descriptionAr: 'ضمان مالي لطلب التأشيرة',
    descriptionFr: 'Garantie financière pour demande de visa',
  },
  {
    id: 'travel-plan',
    name: 'Travel Plan',
    nameAr: 'برنامج السفر',
    nameFr: 'Plan de voyage',
    icon: PlaneTakeoff,
    color: 'sky-400',
    description: 'Detailed travel plan with activities',
    descriptionAr: 'برنامج سفر مفصل مع الأنشطة',
    descriptionFr: 'Plan de voyage détaillé avec activités',
  },
]

export function AIDocumentGenerator() {
  const { t, language } = useLanguage()
  const [selectedDoc, setSelectedDoc] = useState<DocumentConfig | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDoc, setGeneratedDoc] = useState('')
  const [formData, setFormData] = useState({
    hostName: '',
    hostAddress: '',
    guestName: '',
    guestPassport: '',
    relationship: '',
    purpose: '',
    duration: '',
    arrivalDate: '',
    departureDate: '',
    accommodation: '',
    financialGuarantee: '',
    employerName: '',
    position: '',
    salary: '',
    startDate: '',
    sponsorName: '',
    sponsorIncome: '',
    sponsorAddress: '',
  })

  const getLabel = (doc: DocumentConfig) => {
    if (language === 'ar') return { name: doc.nameAr, desc: doc.descriptionAr }
    if (language === 'fr') return { name: doc.nameFr, desc: doc.descriptionFr }
    return { name: doc.name, desc: doc.description }
  }

  const handleGenerate = () => {
    if (!selectedDoc) return
    
    setIsGenerating(true)
    setGeneratedDoc('')

    setTimeout(() => {
      let content = ''

      if (selectedDoc.id === 'invitation') {
        content = generateInvitationLetter()
      } else if (selectedDoc.id === 'itinerary') {
        content = generateItinerary()
      } else if (selectedDoc.id === 'employment') {
        content = generateEmploymentLetter()
      } else if (selectedDoc.id === 'sponsorship') {
        content = generateSponsorshipLetter()
      } else if (selectedDoc.id === 'guarantee') {
        content = generateBankGuarantee()
      } else if (selectedDoc.id === 'travel-plan') {
        content = generateTravelPlan()
      }

      setGeneratedDoc(content)
      setIsGenerating(false)
    }, 3000)
  }

  const generateInvitationLetter = () => {
    return `${language === 'ar' ? 'خطاب الدعوة' : language === 'fr' ? 'Lettre d\'Invitation' : 'INVITATION LETTER'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${language === 'ar' ? 'التاريخ:' : language === 'fr' ? 'Date:' : 'Date:'}: ${new Date().toLocaleDateString()}

${language === 'ar' ? 'إلى من يهمه الأمر,' : language === 'fr' ? 'À qui de droit,' : 'To Whom It May Concern,'}

${language === 'ar' 
  ? `أنا، ${formData.hostName || '[اسم المضيف]'}، المقيم في ${formData.hostAddress || '[العنوان]'}، أدعو بفخر ${formData.guestName || '[اسم الضيف]'}، حامل جواز السفر رقم ${formData.guestPassport || '[رقم الجواز]'}، ${formData.relationship || '[العلاقة]'} لي، لزيارة ${formData.purpose || 'لأغراض سياحية'} في بلدي.`
  : language === 'fr'
  ? `Je, ${formData.hostName || '[Nom de l\'hôte]'}, résidant à ${formData.hostAddress || '[Adresse]'}, ai l'honneur d'inviter ${formData.guestName || '[Nom de l\'invité]'}, titulaire du passeport n° ${formData.guestPassport || '[N° de passeport]'}, mon/mon ${formData.relationship || '[Relation]'}, à me rendre visite pour ${formData.purpose || 'raisons touristiques'} dans mon pays.`
  : `I, ${formData.hostName || '[Host Name]'}, residing at ${formData.hostAddress || '[Address]'}, hereby cordially invite ${formData.guestName || '[Guest Name]'}, holder of passport number ${formData.guestPassport || '[Passport Number]'}, my ${formData.relationship || '[Relationship]'}, to visit me for ${formData.purpose || 'tourism purposes'} in my country.`
}

${language === 'ar' 
  ? `ستكون مدة الإقامة من ${formData.arrivalDate || '[تاريخ الوصول]'} إلى ${formData.departureDate || '[تاريخ المغادرة]'}، وسأتحمل المسؤولية الكاملة عن نفقات الضيف خلال فترة إقامته.`
  : language === 'fr'
  ? `La durée du séjour sera du ${formData.arrivalDate || '[Date d\'arrivée]'} au ${formData.departureDate || '[Date de départ]'}. Je prendrai en charge l'ensemble des frais du visiteur pendant son séjour.`
  : `The duration of stay will be from ${formData.arrivalDate || '[Arrival Date]'} to ${formData.departureDate || '[Departure Date]'}. I will bear full responsibility for the guest's expenses during their stay.`
}

${language === 'ar' 
  ? 'أرجو التكرم بمنح الضيف التأشيرة اللازمة لزيارته.'
  : language === 'fr'
  ? 'Je vous prie de bien vouloir lui accorder le visa nécessaire pour sa visite.'
  : 'I kindly request that you grant the necessary visa for their visit.'
}

${language === 'ar' ? 'مع فائق الاحترام،' : language === 'fr' ? 'Avec mes salutations distinguées,' : 'Respectfully yours,'}

${formData.hostName || '[Host Name]'}
${formData.hostAddress || '[Host Address]'}
`
  }

  const generateItinerary = () => {
    return `${language === 'ar' ? 'خط سير الرحلة' : language === 'fr' ? 'Itinéraire de Voyage' : 'TRAVEL ITINERARY'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${language === 'ar' ? 'رحلة' : language === 'fr' ? 'Voyage' : 'Trip'}: ${formData.guestName || '[Name]'} 
${language === 'ar' ? 'من' : language === 'fr' ? 'Du' : 'From'}: ${formData.arrivalDate || '[Arrival]'} 
${language === 'ar' ? 'إلى' : language === 'fr' ? 'Au' : 'To'}: ${formData.departureDate || '[Departure]'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${language === 'ar' ? 'اليوم 1:' : language === 'fr' ? 'Jour 1:' : 'Day 1:'}
${language === 'ar' ? 'الوصول والمبيت في' : language === 'fr' ? 'Arrivée et hébergement à' : 'Arrival & Check-in at'} ${formData.accommodation || '[Hotel]'}
${language === 'ar' ? 'الاستقبال في المطار والتوصيل للفندق' : language === 'fr' ? 'Accueil à l\'aéroport et transfert à l\'hôtel' : 'Airport pickup and hotel transfer'}

${language === 'ar' ? 'اليوم 2:' : language === 'fr' ? 'Jour 2:' : 'Day 2:'}
${language === 'ar' ? 'جولة في المدينة' : language === 'fr' ? 'Visite de la ville' : 'City tour'}
${language === 'ar' ? 'زيارة المواقع الرئيسية' : language === 'fr' ? 'Visite des principaux sites' : 'Visit main attractions'}

${language === 'ar' ? 'اليوم 3:' : language === 'fr' ? 'Jour 3:' : 'Day 3:'}
${language === 'ar' ? 'رحلة يومية' : language === 'fr' ? 'Excursion d\'une journée' : 'Day trip'}
${language === 'ar' ? 'استكشاف المناطق المحيطة' : language === 'fr' ? 'Explorer les environs' : 'Explore surrounding areas'}

${language === 'ar' ? 'المغادرة:' : language === 'fr' ? 'Départ:' : 'Departure:'}
${language === 'ar' ? 'تسليم الفندق والمغادرة من المطار' : language === 'fr' ? 'Check-out et départ pour l\'aéroport' : 'Hotel check-out and airport departure'}

${language === 'ar' ? 'الإقامة:' : language === 'fr' ? 'Hébergement:' : 'Accommodation:'}
${formData.accommodation || '[Hotel Name & Address]'}
`
  }

  const generateEmploymentLetter = () => {
    return `${language === 'ar' ? 'شهادة توظيف' : language === 'fr' ? "Attestation d'Emploi" : 'EMPLOYMENT VERIFICATION LETTER'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${language === 'ar' ? 'التاريخ:' : language === 'fr' ? 'Date:' : 'Date:'}: ${new Date().toLocaleDateString()}

${language === 'ar' ? 'إلى من يهمه الأمر,' : language === 'fr' ? 'À qui de droit,' : 'To Whom It May Concern,'}

${language === 'ar' 
  ? `نشهد بأن ${formData.guestName || '[Employee Name]'} يعمل/تعمل لدينا منذ ${formData.startDate || '[Start Date]'} في وظيفة ${formData.position || '[Position]'}، ويحصل/تحصل على راتب شهري قدره ${formData.salary || '[Salary]'} دج.`
  : language === 'fr'
  ? `Nous attestons que ${formData.guestName || '[Nom de l\'employé]'} travaille dans notre entreprise depuis le ${formData.startDate || '[Date de début]'} en tant que ${formData.position || '[Poste]'} avec un salaire mensuel de ${formData.salary || '[Salaire]'} DZD.`
  : `This is to certify that ${formData.guestName || '[Employee Name]'} has been employed with us since ${formData.startDate || '[Start Date]'} as ${formData.position || '[Position]'} earning a monthly salary of ${formData.salary || '[Salary]'} DZD.`
}

${language === 'ar' 
  ? 'نؤكد أن الموظف في وضع عمل نشط لدينا، ونحن لا نمانع في منحه/й إجازة для поездки.'
  : language === 'fr'
  ? 'Nous confirmons que l\'employé est en poste actif et que nous n\'objectons pas à lui accorder un congé pour son voyage.'
  : 'We confirm that the employee is in active employment and we have no objection to granting them leave for their trip.'
}

${language === 'ar' ? 'مع التقدير،' : language === 'fr' ? 'Cordialement,' : 'Sincerely,'}

${formData.employerName || '[Company Name]'}
${language === 'ar' ? 'قسم الموارد البشرية' : language === 'fr' ? 'Département RH' : 'HR Department'}
`
  }

  const generateSponsorshipLetter = () => {
    return `${language === 'ar' ? 'خطاب الكفالة المالية' : language === 'fr' ? 'Lettre de Parrainage Financier' : 'FINANCIAL SPONSORSHIP LETTER'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${language === 'ar' ? 'التاريخ:' : language === 'fr' ? 'Date:' : 'Date:'}: ${new Date().toLocaleDateString()}

${language === 'ar' ? 'أنا الموقع أدناه:' : language === 'fr' ? 'Je soussigné(e):' : 'I, the undersigned:'}

${language === 'ar' ? 'الاسم:' : language === 'fr' ? 'Nom:' : 'Name:'}: ${formData.sponsorName || '[Sponsor Name]'}
${language === 'ar' ? 'العنوان:' : language === 'fr' ? 'Adresse:' : 'Address:'}: ${formData.sponsorAddress || '[Address]'}
${language === 'ar' ? 'الدخل الشهري:' : language === 'fr' ? 'Revenu mensuel:' : 'Monthly Income:'}: ${formData.sponsorIncome || '[Income]'} DZD

${language === 'ar' 
  ? `أتعهد بكفالة ${formData.guestName || '[Guest Name]'} طيلة فترة إقامته في [Country] من ${formData.arrivalDate || '[Arrival]'} إلى ${formData.departureDate || '[Departure]'}. أتحمل مسؤولية جميع المصاريف 包括食宿、交通和医疗费用。`
  : language === 'fr'
  ? `Je m'engage à parrainer ${formData.guestName || '[Nom de l\'invité]'} pendant toute la durée de son séjour en [Pays] du ${formData.arrivalDate || '[Arrivée]'} au ${formData.departureDate || '[Départ]'}. Je prends en charge tous les frais 包括食宿、交通和医疗费用。`
  : `I hereby commit to sponsoring ${formData.guestName || '[Guest Name]'} for the entire duration of their stay in [Country] from ${formData.arrivalDate || '[Arrival]'} to ${formData.departureDate || '[Departure]'}. I take full financial responsibility for all expenses including accommodation, food, transportation, and medical care.`
}

${language === 'ar' ? 'أتعهد بأن الضيف سيغادر البلد في الموعد المحدد.' : language === 'fr' ? 'Je m\'engage à ce que l\'invité quitte le pays à la date prévue.' : 'I commit that the guest will depart the country on the specified date.'}

${language === 'ar' ? 'التوقيع:' : language === 'fr' ? 'Signature:' : 'Signature:'}: _______________________
${formData.sponsorName || '[Sponsor Name]'}
`
  }

  const generateBankGuarantee = () => {
    return `${language === 'ar' ? 'خطاب الضمان البنكي' : language === 'fr' ? 'Lettre de Garantie Bancaire' : 'BANK GUARANTEE LETTER'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${language === 'ar' ? 'التاريخ:' : language === 'fr' ? 'Date:' : 'Date:'}: ${new Date().toLocaleDateString()}

${language === 'ar' ? 'إلى السفارة/القنصلية...' : language === 'fr' ? 'À l\'Ambassade/Consulat...' : 'To the Embassy/Consulate...'}

${language === 'ar' 
  ? `نكتب إليكم للتأكيد على أن ${formData.guestName || '[Applicant Name]'} لديه حساب مصرفي نشط لدينا برصيد لا يقل عن ${formData.financialGuarantee || '[Amount]'} دج.`
  : language === 'fr'
  ? `Nous vous écrivons pour confirmer que ${formData.guestName || '[Nom du demandeur]'} possède un compte bancaire actif auprès de nous avec un solde d'au moins ${formData.financialGuarantee || '[Montant]'} DZD.`
  : `This letter is to confirm that ${formData.guestName || '[Applicant Name]'} maintains an active bank account with us with a balance of no less than ${formData.financialGuarantee || '[Amount]'} DZD.`
}

${language === 'ar' 
  ? 'نؤكد أن هذا الحساب مفتوح وحركته طبيعية، ولا توجد أي قيود أو ملاحظات سلبية عليه.'
  : language === 'fr'
  ? 'Nous confirmons que ce compte est ouvert, actif et ne fait l\'objet d\'aucune restriction.'
  : 'We confirm that this account is open, active, and has no restrictions or negative remarks.'
}

${language === 'ar' ? 'بيانات الحساب:' : language === 'fr' ? 'Informations du compte:' : 'Account Information:'}
${language === 'ar' ? 'الاسم:' : language === 'fr' ? 'Titulaire:' : 'Account Holder:'}: ${formData.guestName || '[Name]'}
${language === 'ar' ? 'الرقم:' : language === 'fr' ? 'Numéro:' : 'Account Number:'}: [Account Number]
${language === 'ar' ? 'الرصيد:' : language === 'fr' ? 'Solde:' : 'Balance:'}: ${formData.financialGuarantee || '[Amount]'} DZD

${language === 'ar' ? 'مع التقدير،' : language === 'fr' ? 'Cordialement,' : 'Sincerely,'}

[Bank Name]
[Bank Address]
[Bank Stamp & Signature]
`
  }

  const generateTravelPlan = () => {
    return `${language === 'ar' ? 'برنامج السفر التفصيلي' : language === 'fr' ? 'Plan de Voyage Détaillé' : 'DETAILED TRAVEL PLAN'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${language === 'ar' ? 'المسافر:' : language === 'fr' ? 'Voyageur:' : 'Traveler:'}: ${formData.guestName || '[Name]'}
${language === 'ar' ? 'من' : language === 'fr' ? 'Du' : 'From'}: ${formData.arrivalDate || '[Arrival]'}
${language === 'ar' ? 'إلى' : language === 'fr' ? 'Au' : 'To'}: ${formData.departureDate || '[Departure]'}
${language === 'ar' ? 'المدة:' : language === 'fr' ? 'Durée:' : 'Duration:'}: ${formData.duration || '[Duration]'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${language === 'ar' ? 'التفاصيل:' : language === 'fr' ? 'Détails:' : 'Details:'}

${language === 'ar' ? 'اليوم 1 - الوصول' : language === 'fr' ? 'Jour 1 - Arrivée' : 'Day 1 - Arrival'}
• ${language === 'ar' ? 'الوصول إلى المطار' : language === 'fr' ? 'Arrivée à l\'aéroport' : 'Airport arrival'}
• ${language === 'ar' ? 'التوصيل للفندق' : language === 'fr' ? 'Transfert à l\'hôtel' : 'Transfer to hotel'}
• ${language === 'ar' ? 'راحة بعد السفر' : language === 'fr' ? 'Repos après le voyage' : 'Rest after travel'}

${language === 'ar' ? 'اليوم 2 - الاستكشاف' : language === 'fr' ? 'Jour 2 - Exploration' : 'Day 2 - Exploration'}
• ${language === 'ar' ? 'الفطور في الفندق' : language === 'fr' ? 'Petit-déjeuner à l\'hôtel' : 'Breakfast at hotel'}
• ${language === 'ar' ? 'جولة في المدينة' : language === 'fr' ? 'Visite de la ville' : 'City tour'}
• ${language === 'ar' ? 'الغداء في مطعم محلي' : language === 'fr' ? 'Déjeuner dans un restaurant local' : 'Lunch at local restaurant'}

${language === 'ar' ? 'اليوم 3 - السياحة' : language === 'fr' ? 'Jour 3 - Tourisme' : 'Day 3 - Tourism'}
• ${language === 'ar' ? 'زيارة المواقع الأثرية' : language === 'fr' ? 'Visite des sites historiques' : 'Visit historical sites'}
• ${language === 'ar' ? 'التسوق في الأسواق المحلية' : language === 'fr' ? 'Shopping dans les marchés locaux' : 'Local market shopping'}

${language === 'ar' ? 'المغادرة' : language === 'fr' ? 'Départ' : 'Departure'}
• ${language === 'ar' ? 'تسليم الفندق' : language === 'fr' ? 'Check-out de l\'hôtel' : 'Hotel check-out'}
• ${language === 'ar' ? 'التوصيل للمطار' : language === 'fr' ? 'Transfert à l\'aéroport' : 'Airport transfer'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${language === 'ar' ? 'الإقامة:' : language === 'fr' ? 'Hébergement:' : 'Accommodation:'}
${formData.accommodation || '[Hotel Name, Address & Contact]'}

${language === 'ar' ? 'ملاحظة: هذا البرنامج قابل للتعديل حسب الظروف.' : language === 'fr' ? 'Note: Ce programme peut être modifié selon les circonstances.' : 'Note: This itinerary is subject to modification based on circumstances.'}
`
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDoc)
  }

  const handleDownload = () => {
    const blob = new Blob([generatedDoc], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedDoc?.id}_document.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 mb-4">
            <Bot className="text-neon-cyan animate-pulse" size={20} />
            <span className="text-neon-cyan text-sm font-medium">
              {language === 'ar' ? 'ذكاء اصطناعي' : language === 'fr' ? 'Intelligence Artificielle' : 'AI Powered'}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">
              {language === 'ar' ? 'مولّد الوثائق' : language === 'fr' ? 'Générateur de Documents' : 'Document Generator'}
            </span>
          </h1>
          <p className="text-white/60">
            {language === 'ar' ? 'أنشئ وثائق احترافية بنقرة واحدة' : language === 'fr' ? 'Créez des documents professionnels en un clic' : 'Create professional documents with one click'}
          </p>
        </motion.div>

        {/* Document Types */}
        {!selectedDoc ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-3"
          >
            {documentTypes.map((doc, index) => {
              const Icon = doc.icon
              const labels = getLabel(doc)
              return (
                <motion.button
                  key={doc.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedDoc(doc)}
                  className="glass-card-hover p-4 text-left"
                >
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center mb-3',
                    doc.color === 'neon-cyan' && 'bg-neon-cyan/20',
                    doc.color === 'neon-purple' && 'bg-neon-purple/20',
                    doc.color === 'neon-magenta' && 'bg-neon-magenta/20',
                    doc.color === 'emerald-400' && 'bg-emerald-400/20',
                    doc.color === 'amber-400' && 'bg-amber-400/20',
                    doc.color === 'sky-400' && 'bg-sky-400/20'
                  )}>
                    <Icon 
                      size={24} 
                      className={
                        doc.color === 'neon-cyan' ? 'text-neon-cyan' :
                        doc.color === 'neon-purple' ? 'text-neon-purple' :
                        doc.color === 'neon-magenta' ? 'text-neon-magenta' :
                        doc.color === 'emerald-400' ? 'text-emerald-400' :
                        doc.color === 'amber-400' ? 'text-amber-400' :
                        'text-sky-400'
                      } 
                    />
                  </div>
                  <h3 className="font-bold text-sm mb-1">{labels.name}</h3>
                  <p className="text-xs text-white/50 line-clamp-2">{labels.desc}</p>
                </motion.button>
              )
            })}
          </motion.div>
        ) : (
          <>
            {/* Back Button & Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4"
            >
              <button
                onClick={() => { setSelectedDoc(null); setGeneratedDoc(''); }}
                className="text-sm text-neon-cyan hover:text-neon-cyan/80 flex items-center gap-1 mb-3"
              >
                <ChevronRight className="rotate-180" size={16} />
                {language === 'ar' ? 'العودة' : language === 'fr' ? 'Retour' : 'Back'}
              </button>
              
              <div className="glass-card p-4 flex items-center gap-3">
                {(() => { const Icon = selectedDoc.icon; return (
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    selectedDoc.color === 'neon-cyan' && 'bg-neon-cyan/20',
                    selectedDoc.color === 'neon-purple' && 'bg-neon-purple/20',
                    selectedDoc.color === 'neon-magenta' && 'bg-neon-magenta/20',
                  )}>
                    <Icon size={24} className={selectedDoc.color === 'neon-cyan' ? 'text-neon-cyan' : selectedDoc.color === 'neon-purple' ? 'text-neon-purple' : 'text-neon-magenta'} />
                  </div>
                )})()}
                <div>
                  <h3 className="font-bold">{getLabel(selectedDoc).name}</h3>
                  <p className="text-xs text-white/50">{getLabel(selectedDoc).desc}</p>
                </div>
              </div>
            </motion.div>

            {/* Form Fields */}
            {!generatedDoc && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="glass-card p-4">
                  <label className="text-sm font-medium mb-2 block">
                    {language === 'ar' ? 'اسمك' : language === 'fr' ? 'Votre nom' : 'Your Name'} *
                  </label>
                  <input
                    type="text"
                    value={formData.hostName}
                    onChange={(e) => updateField('hostName', e.target.value)}
                    className="input-field"
                    placeholder={language === 'ar' ? 'أدخل اسمك' : language === 'fr' ? 'Entrez votre nom' : 'Enter your name'}
                  />
                </div>

                <div className="glass-card p-4">
                  <label className="text-sm font-medium mb-2 block">
                    {language === 'ar' ? 'اسم الضيف/المسافر' : language === 'fr' ? "Nom de l'invité" : 'Guest/Traveler Name'} *
                  </label>
                  <input
                    type="text"
                    value={formData.guestName}
                    onChange={(e) => updateField('guestName', e.target.value)}
                    className="input-field"
                    placeholder={language === 'ar' ? 'أدخل اسم الضيف' : language === 'fr' ? "Entrez le nom de l'invité" : 'Enter guest name'}
                  />
                </div>

                {selectedDoc.id !== 'employment' && (
                  <>
                    <div className="glass-card p-4">
                      <label className="text-sm font-medium mb-2 block">
                        {language === 'ar' ? 'رقم جواز السفر' : language === 'fr' ? 'Numéro de passeport' : 'Passport Number'}
                      </label>
                      <input
                        type="text"
                        value={formData.guestPassport}
                        onChange={(e) => updateField('guestPassport', e.target.value)}
                        className="input-field"
                        placeholder="AB1234567"
                      />
                    </div>

                    <div className="glass-card p-4">
                      <label className="text-sm font-medium mb-2 block">
                        {language === 'ar' ? 'تاريخ الوصول' : language === 'fr' ? "Date d'arrivée" : 'Arrival Date'}
                      </label>
                      <input
                        type="date"
                        value={formData.arrivalDate}
                        onChange={(e) => updateField('arrivalDate', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="glass-card p-4">
                      <label className="text-sm font-medium mb-2 block">
                        {language === 'ar' ? 'تاريخ المغادرة' : language === 'fr' ? 'Date de départ' : 'Departure Date'}
                      </label>
                      <input
                        type="date"
                        value={formData.departureDate}
                        onChange={(e) => updateField('departureDate', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="glass-card p-4">
                      <label className="text-sm font-medium mb-2 block">
                        {language === 'ar' ? 'العنوان/مكان الإقامة' : language === 'fr' ? 'Adresse/Hébergement' : 'Address/Accommodation'}
                      </label>
                      <input
                        type="text"
                        value={formData.accommodation}
                        onChange={(e) => updateField('accommodation', e.target.value)}
                        className="input-field"
                        placeholder={language === 'ar' ? 'اسم الفندق والعنوان' : language === 'fr' ? 'Nom hôtel et adresse' : 'Hotel name & address'}
                      />
                    </div>
                  </>
                )}

                {selectedDoc.id === 'employment' && (
                  <>
                    <div className="glass-card p-4">
                      <label className="text-sm font-medium mb-2 block">
                        {language === 'ar' ? 'اسم الشركة' : language === 'fr' ? 'Nom de l\'entreprise' : 'Company Name'}
                      </label>
                      <input
                        type="text"
                        value={formData.employerName}
                        onChange={(e) => updateField('employerName', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div className="glass-card p-4">
                      <label className="text-sm font-medium mb-2 block">
                        {language === 'ar' ? 'المنصب' : language === 'fr' ? 'Poste' : 'Position'}
                      </label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => updateField('position', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div className="glass-card p-4">
                      <label className="text-sm font-medium mb-2 block">
                        {language === 'ar' ? 'الراتب الشهري (دج)' : language === 'fr' ? 'Salaire mensuel (DZD)' : 'Monthly Salary (DZD)'}
                      </label>
                      <input
                        type="number"
                        value={formData.salary}
                        onChange={(e) => updateField('salary', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div className="glass-card p-4">
                      <label className="text-sm font-medium mb-2 block">
                        {language === 'ar' ? 'تاريخ البدء' : language === 'fr' ? 'Date de début' : 'Start Date'}
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => updateField('startDate', e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </>
                )}

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={cn(
                    'w-full neon-button flex items-center justify-center gap-2',
                    isGenerating && 'opacity-70'
                  )}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      {language === 'ar' ? 'جارٍ الإنشاء...' : language === 'fr' ? 'Génération...' : 'Generating...'}
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      {language === 'ar' ? 'إنشاء الوثيقة' : language === 'fr' ? 'Générer le document' : 'Generate Document'}
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}

            {/* Generated Document */}
            {generatedDoc && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="glass-card p-4 bg-neon-cyan/5 border border-neon-cyan/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="text-neon-cyan" size={20} />
                    <span className="font-bold text-neon-cyan">
                      {language === 'ar' ? 'تم إنشاء الوثيقة!' : language === 'fr' ? 'Document créé!' : 'Document Generated!'}
                    </span>
                  </div>
                  <p className="text-xs text-white/60">
                    {language === 'ar' ? 'يمكنك نسخ أو تحميل الوثيقة أدناه' : language === 'fr' ? 'Vous pouvez copier ou télécharger le document ci-dessous' : 'You can copy or download the document below'}
                  </p>
                </div>

                <div className="glass-card p-4 bg-black/30">
                  <pre className="text-xs text-white/80 whitespace-pre-wrap font-mono leading-relaxed">
                    {generatedDoc}
                  </pre>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleCopy}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    <Copy size={18} />
                    {language === 'ar' ? 'نسخ' : language === 'fr' ? 'Copier' : 'Copy'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="btn-primary flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    {language === 'ar' ? 'تحميل' : language === 'fr' ? 'Télécharger' : 'Download'}
                  </button>
                </div>

                <button
                  onClick={() => setGeneratedDoc('')}
                  className="w-full py-3 text-center text-white/50 hover:text-white transition-colors"
                >
                  {language === 'ar' ? 'إنشاء وثيقة جديدة' : language === 'fr' ? 'Créer un nouveau document' : 'Create New Document'}
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AIDocumentGenerator
