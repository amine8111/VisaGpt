'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Bot, CheckCircle, AlertCircle, Loader2,
  Download, Copy, Sparkles, ChevronRight, ArrowRight,
  User, MapPin, Calendar, FileKey, Building2, Phone, Mail,
  Globe, CreditCard, Shield
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { cn } from '@/lib/utils'

interface FormField {
  id: string
  label: string
  labelAr: string
  labelFr: string
  type: 'text' | 'select' | 'date' | 'number'
  required: boolean
  autoFilled: boolean
  value: string
  suggestions?: string[]
}

interface VisaApplication {
  id: string
  name: string
  nameAr: string
  nameFr: string
  country: string
  countryAr: string
  countryFr: string
  flag: string
  fields: FormField[]
}

const visaApplications: VisaApplication[] = [
  {
    id: 'schengen',
    name: 'Schengen Visa Application',
    nameAr: 'استمارة شنغن',
    nameFr: 'Formulaire Schengen',
    country: 'Schengen Area',
    countryAr: 'منطقة شنغن',
    countryFr: 'Espace Schengen',
    flag: '🇪🇺',
    fields: [
      { id: 'surname', label: 'Surname (Family name)', labelAr: 'اسم العائلة', labelFr: 'Nom de famille', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'firstName', label: 'First Name (Given names)', labelAr: 'الاسم الأول', labelFr: 'Prénom', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'birthDate', label: 'Date of Birth', labelAr: 'تاريخ الميلاد', labelFr: 'Date de naissance', type: 'date', required: true, autoFilled: false, value: '' },
      { id: 'birthPlace', label: 'Place of Birth', labelAr: 'مكان الميلاد', labelFr: 'Lieu de naissance', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'countryBirth', label: 'Country of Birth', labelAr: 'بلد الميلاد', labelFr: 'Pays de naissance', type: 'select', required: true, autoFilled: false, value: '' },
      { id: 'nationality', label: 'Current Nationality', labelAr: 'الجنسية الحالية', labelFr: 'Nationalité actuelle', type: 'text', required: true, autoFilled: false, value: 'Algerian' },
      { id: 'passportNo', label: 'Passport Number', labelAr: 'رقم جواز السفر', labelFr: 'Numéro de passeport', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'passportIssue', label: 'Date of Issue', labelAr: 'تاريخ الإصدار', labelFr: "Date d'émission", type: 'date', required: true, autoFilled: false, value: '' },
      { id: 'passportExpiry', label: 'Date of Expiry', labelAr: 'تاريخ الانتهاء', labelFr: "Date d'expiration", type: 'date', required: true, autoFilled: false, value: '' },
      { id: 'issuingAuth', label: 'Issuing Authority', labelAr: 'جهة الإصدار', labelFr: 'Autorité émettrice', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'address', label: 'Home Address', labelAr: 'العنوان', labelFr: 'Adresse', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'phone', label: 'Phone Number', labelAr: 'رقم الهاتف', labelFr: 'Téléphone', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'email', label: 'Email Address', labelAr: 'البريد الإلكتروني', labelFr: 'Email', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'occupation', label: 'Current Occupation', labelAr: 'المهنة الحالية', labelFr: 'Profession actuelle', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'employer', label: 'Employer Name & Address', labelAr: 'اسم وعنوان صاحب العمل', labelFr: 'Employeur (nom et adresse)', type: 'text', required: false, autoFilled: false, value: '' },
      { id: 'tripPurpose', label: 'Purpose of Trip', labelAr: 'الغرض من الرحلة', labelFr: 'Objet du voyage', type: 'select', required: true, autoFilled: false, value: '' },
      { id: 'entryCountry', label: 'Country of First Entry', labelAr: 'بلد الدخول الأول', labelFr: 'Pays de première entrée', type: 'select', required: true, autoFilled: false, value: '' },
      { id: 'duration', label: 'Intended Duration of Stay', labelAr: 'مدة الإقامة المقصودة', labelFr: 'Durée du séjour prévue', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'travelInsurance', label: 'Travel Insurance Number', labelAr: 'رقم تأمين السفر', labelFr: "Numéro d'assurance voyage", type: 'text', required: false, autoFilled: false, value: '' },
    ]
  },
  {
    id: 'uk',
    name: 'UK Visa Application',
    nameAr: 'استمارة التأشيرة البريطانية',
    nameFr: 'Demande de visa britannique',
    country: 'United Kingdom',
    countryAr: 'المملكة المتحدة',
    countryFr: 'Royaume-Uni',
    flag: '🇬🇧',
    fields: [
      { id: 'fullName', label: 'Full Name', labelAr: 'الاسم الكامل', labelFr: 'Nom complet', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'dob', label: 'Date of Birth', labelAr: 'تاريخ الميلاد', labelFr: 'Date de naissance', type: 'date', required: true, autoFilled: false, value: '' },
      { id: 'nationality', label: 'Nationality', labelAr: 'الجنسية', labelFr: 'Nationalité', type: 'text', required: true, autoFilled: false, value: 'Algerian' },
      { id: 'passportNo', label: 'Passport Number', labelAr: 'رقم جواز السفر', labelFr: 'Numéro de passeport', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'passportExpiry', label: 'Passport Expiry', labelAr: 'انتهاء جواز السفر', labelFr: 'Expiration du passeport', type: 'date', required: true, autoFilled: false, value: '' },
      { id: 'email', label: 'Email Address', labelAr: 'البريد الإلكتروني', labelFr: 'Adresse email', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'phone', label: 'Phone Number', labelAr: 'رقم الهاتف', labelFr: 'Numéro de téléphone', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'address', label: 'UK Address', labelAr: 'العنوان في بريطانيا', labelFr: 'Adresse au UK', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'occupation', label: 'Occupation', labelAr: 'المهنة', labelFr: 'Profession', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'travelDate', label: 'Intended Travel Date', labelAr: 'تاريخ السفر المقصود', labelFr: 'Date de voyage prévue', type: 'date', required: true, autoFilled: false, value: '' },
    ]
  },
  {
    id: 'usa',
    name: 'US Visa Application (DS-160)',
    nameAr: 'استمارة التأشيرة الأمريكية',
    nameFr: "Formulaire de visa américain",
    country: 'United States',
    countryAr: 'الولايات المتحدة',
    countryFr: 'États-Unis',
    flag: '🇺🇸',
    fields: [
      { id: 'fullName', label: 'Full Name', labelAr: 'الاسم الكامل', labelFr: 'Nom complet', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'dob', label: 'Date of Birth', labelAr: 'تاريخ الميلاد', labelFr: 'Date de naissance', type: 'date', required: true, autoFilled: false, value: '' },
      { id: 'pob', label: 'Place of Birth', labelAr: 'مكان الميلاد', labelFr: 'Lieu de naissance', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'nationality', label: 'Country of Nationality', labelAr: 'بلد الجنسية', labelFr: 'Pays de nationalité', type: 'text', required: true, autoFilled: false, value: 'Algeria' },
      { id: 'passportNo', label: 'Passport Number', labelAr: 'رقم جواز السفر', labelFr: 'Numéro de passeport', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'passportBookNo', label: 'Passport Book Number', labelAr: 'رقم جواز السفر', labelFr: 'Numéro du livret', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'email', label: 'Email Address', labelAr: 'البريد الإلكتروني', labelFr: 'Adresse email', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'phone', label: 'Phone Number', labelAr: 'رقم الهاتف', labelFr: 'Numéro de téléphone', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'address', label: 'Home Address', labelAr: 'عنوان السكن', labelFr: 'Adresse du domicile', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'occupation', label: 'Present Occupation', labelAr: 'المهنة الحالية', labelFr: 'Profession actuelle', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'employer', label: 'Present Employer', labelAr: 'صاحب العمل الحالي', labelFr: 'Employeur actuel', type: 'text', required: false, autoFilled: false, value: '' },
      { id: 'visaType', label: 'Type of Visa', labelAr: 'نوع التأشيرة', labelFr: 'Type de visa', type: 'select', required: true, autoFilled: false, value: '' },
      { id: 'purpose', label: 'Purpose of Travel', labelAr: 'الغرض من السفر', labelFr: 'But du voyage', type: 'select', required: true, autoFilled: false, value: '' },
      { id: 'travelDate', label: 'Intended Date of Arrival', labelAr: 'تاريخ الوصول المقصود', labelFr: "Date d'arrivée prévue", type: 'date', required: true, autoFilled: false, value: '' },
    ]
  },
  {
    id: 'canada',
    name: 'Canada Visa Application',
    nameAr: 'استمارة تأشيرة كندا',
    nameFr: 'Demande de visa canadien',
    country: 'Canada',
    countryAr: 'كندا',
    countryFr: 'Canada',
    flag: '🇨🇦',
    fields: [
      { id: 'surname', label: 'Surname', labelAr: 'اسم العائلة', labelFr: 'Nom de famille', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'givenNames', label: 'Given Names', labelAr: 'الأسماء المعطاة', labelFr: 'Prénom', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'dob', label: 'Date of Birth', labelAr: 'تاريخ الميلاد', labelFr: 'Date de naissance', type: 'date', required: true, autoFilled: false, value: '' },
      { id: 'pob', label: 'Place of Birth', labelAr: 'مكان الميلاد', labelFr: 'Lieu de naissance', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'countryBirth', label: 'Country of Birth', labelAr: 'بلد الميلاد', labelFr: 'Pays de naissance', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'nationality', label: 'Citizenship', labelAr: 'الجنسية', labelFr: 'Nationalité', type: 'text', required: true, autoFilled: false, value: 'Algerian' },
      { id: 'passportNo', label: 'Passport Number', labelAr: 'رقم جواز السفر', labelFr: 'Numéro de passeport', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'passportIssue', label: 'Passport Issue Date', labelAr: 'تاريخ إصدار الجواز', labelFr: "Date d'émission", type: 'date', required: true, autoFilled: false, value: '' },
      { id: 'passportExpiry', label: 'Passport Expiry', labelAr: 'انتهاء الجواز', labelFr: 'Expiration', type: 'date', required: true, autoFilled: false, value: '' },
      { id: 'email', label: 'Email Address', labelAr: 'البريد الإلكتروني', labelFr: 'Email', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'phone', label: 'Phone Number', labelAr: 'رقم الهاتف', labelFr: 'Téléphone', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'address', label: 'Current Address', labelAr: 'العنوان الحالي', labelFr: 'Adresse actuelle', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'occupation', label: 'Current Occupation', labelAr: 'المهنة الحالية', labelFr: 'Profession actuelle', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'travelHistory', label: 'Travel History', labelAr: 'سجل السفر', labelFr: 'Historique de voyage', type: 'text', required: false, autoFilled: false, value: '' },
    ]
  },
  {
    id: 'australia',
    name: 'Australia Visa (ETA)',
    nameAr: 'تأشيرة أستراليا',
    nameFr: "Visa Australia (ETA)",
    country: 'Australia',
    countryAr: 'أستراليا',
    countryFr: 'Australie',
    flag: '🇦🇺',
    fields: [
      { id: 'passportNo', label: 'Passport Number', labelAr: 'رقم جواز السفر', labelFr: 'Numéro de passeport', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'surname', label: 'Surname', labelAr: 'اسم العائلة', labelFr: 'Nom de famille', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'givenNames', label: 'Given Names', labelAr: 'الاسم الأول', labelFr: 'Prénom', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'dob', label: 'Date of Birth', labelAr: 'تاريخ الميلاد', labelFr: 'Date de naissance', type: 'date', required: true, autoFilled: false, value: '' },
      { id: 'nationality', label: 'Nationality', labelAr: 'الجنسية', labelFr: 'Nationalité', type: 'text', required: true, autoFilled: false, value: 'Algerian' },
      { id: 'email', label: 'Email Address', labelAr: 'البريد الإلكتروني', labelFr: 'Email', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'phone', label: 'Phone Number', labelAr: 'رقم الهاتف', labelFr: 'Téléphone', type: 'text', required: true, autoFilled: false, value: '' },
    ]
  },
  {
    id: 'japan',
    name: 'Japan Visa Application',
    nameAr: 'استمارة تأشيرة اليابان',
    nameFr: 'Demande de visa japonais',
    country: 'Japan',
    countryAr: 'اليابان',
    countryFr: 'Japon',
    flag: '🇯🇵',
    fields: [
      { id: 'fullName', label: 'Full Name', labelAr: 'الاسم الكامل', labelFr: 'Nom complet', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'fullNameNative', label: 'Full Name (Native Script)', labelAr: 'الاسم الكامل (باللغة الأصلية)', labelFr: 'Nom (écriture native)', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'dob', label: 'Date of Birth', labelAr: 'تاريخ الميلاد', labelFr: 'Date de naissance', type: 'date', required: true, autoFilled: false, value: '' },
      { id: 'pob', label: 'Place of Birth', labelAr: 'مكان الميلاد', labelFr: 'Lieu de naissance', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'nationality', label: 'Nationality', labelAr: 'الجنسية', labelFr: 'Nationalité', type: 'text', required: true, autoFilled: false, value: 'Algerian' },
      { id: 'passportNo', label: 'Passport Number', labelAr: 'رقم جواز السفر', labelFr: 'Numéro de passeport', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'passportExpiry', label: 'Passport Expiry', labelAr: 'انتهاء الجواز', labelFr: 'Expiration', type: 'date', required: true, autoFilled: false, value: '' },
      { id: 'email', label: 'Email Address', labelAr: 'البريد الإلكتروني', labelFr: 'Email', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'phone', label: 'Phone Number', labelAr: 'رقم الهاتف', labelFr: 'Téléphone', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'address', label: 'Address in Japan', labelAr: 'العنوان في اليابان', labelFr: 'Adresse au Japon', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'purpose', label: 'Purpose of Visit', labelAr: 'الغرض من الزيارة', labelFr: 'But de la visite', type: 'select', required: true, autoFilled: false, value: '' },
      { id: 'duration', label: 'Duration of Stay', labelAr: 'مدة الإقامة', labelFr: 'Durée du séjour', type: 'text', required: true, autoFilled: false, value: '' },
    ]
  },
  {
    id: 'uae',
    name: 'UAE Visa Application',
    nameAr: 'استمارة تأشيرة الإمارات',
    nameFr: 'Demande de visa UAE',
    country: 'United Arab Emirates',
    countryAr: 'الإمارات العربية المتحدة',
    countryFr: 'Émirats Arabes Unis',
    flag: '🇦🇪',
    fields: [
      { id: 'fullName', label: 'Full Name', labelAr: 'الاسم الكامل', labelFr: 'Nom complet', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'dob', label: 'Date of Birth', labelAr: 'تاريخ الميلاد', labelFr: 'Date de naissance', type: 'date', required: true, autoFilled: false, value: '' },
      { id: 'pob', label: 'Place of Birth', labelAr: 'مكان الميلاد', labelFr: 'Lieu de naissance', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'nationality', label: 'Nationality', labelAr: 'الجنسية', labelFr: 'Nationalité', type: 'text', required: true, autoFilled: false, value: 'Algerian' },
      { id: 'passportNo', label: 'Passport Number', labelAr: 'رقم جواز السفر', labelFr: 'Numéro de passeport', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'passportExpiry', label: 'Passport Expiry', labelAr: 'انتهاء الجواز', labelFr: 'Expiration', type: 'date', required: true, autoFilled: false, value: '' },
      { id: 'email', label: 'Email Address', labelAr: 'البريد الإلكتروني', labelFr: 'Email', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'phone', label: 'Phone Number', labelAr: 'رقم الهاتف', labelFr: 'Téléphone', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'visaType', label: 'Visa Type', labelAr: 'نوع التأشيرة', labelFr: 'Type de visa', type: 'select', required: true, autoFilled: false, value: '' },
      { id: 'duration', label: 'Duration', labelAr: 'المدة', labelFr: 'Durée', type: 'select', required: true, autoFilled: false, value: '' },
    ]
  },
  {
    id: 'turkey',
    name: 'Turkey E-Visa',
    nameAr: 'التأشيرة الإلكترونية التركية',
    nameFr: 'E-Visa Turquie',
    country: 'Turkey',
    countryAr: 'تركيا',
    countryFr: 'Turquie',
    flag: '🇹🇷',
    fields: [
      { id: 'surname', label: 'Surname', labelAr: 'اسم العائلة', labelFr: 'Nom de famille', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'givenNames', label: 'Given Names', labelAr: 'الاسم الأول', labelFr: 'Prénom', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'dob', label: 'Date of Birth', labelAr: 'تاريخ الميلاد', labelFr: 'Date de naissance', type: 'date', required: true, autoFilled: false, value: '' },
      { id: 'nationality', label: 'Nationality', labelAr: 'الجنسية', labelFr: 'Nationalité', type: 'text', required: true, autoFilled: false, value: 'Algerian' },
      { id: 'passportNo', label: 'Passport Number', labelAr: 'رقم جواز السفر', labelFr: 'Numéro de passeport', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'passportExpiry', label: 'Passport Expiry', labelAr: 'انتهاء الجواز', labelFr: 'Expiration', type: 'date', required: true, autoFilled: false, value: '' },
      { id: 'email', label: 'Email Address', labelAr: 'البريد الإلكتروني', labelFr: 'Email', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'phone', label: 'Phone Number', labelAr: 'رقم الهاتف', labelFr: 'Téléphone', type: 'text', required: true, autoFilled: false, value: '' },
      { id: 'arrivalDate', label: 'Arrival Date', labelAr: 'تاريخ الوصول', labelFr: "Date d'arrivée", type: 'date', required: true, autoFilled: false, value: '' },
    ]
  }
]

export function VisaFormFiller() {
  const { t, language } = useLanguage()
  const [selectedApp, setSelectedApp] = useState<VisaApplication | null>(null)
  const [isAutoFilling, setIsAutoFilling] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied] = useState(false)
  const [filledFields, setFilledFields] = useState<Map<string, string>>(new Map())

  const getLabel = (field: FormField) => {
    if (language === 'ar') return field.labelAr
    if (language === 'fr') return field.labelFr
    return field.label
  }

  const getAppName = (app: VisaApplication) => {
    if (language === 'ar') return app.nameAr
    if (language === 'fr') return app.nameFr
    return app.name
  }

  const getCountry = (app: VisaApplication) => {
    if (language === 'ar') return app.countryAr
    if (language === 'fr') return app.countryFr
    return app.country
  }

  const handleAutoFill = () => {
    if (!selectedApp) return
    
    setIsAutoFilling(true)
    
    setTimeout(() => {
      const mockData = new Map<string, string>()
      mockData.set('surname', 'بوزيد')
      mockData.set('firstName', 'أحمد محمد')
      mockData.set('nationality', 'Algerian')
      mockData.set('email', 'user@email.com')
      mockData.set('phone', '+213 555 123 456')
      mockData.set('passportNo', 'AB1234567')
      mockData.set('address', '123 Rue Didouche Mourad, Alger')
      
      setFilledFields(mockData)
      setIsAutoFilling(false)
    }, 2500)
  }

  const handleFieldChange = (fieldId: string, value: string) => {
    const newFields = new Map(filledFields)
    newFields.set(fieldId, value)
    setFilledFields(newFields)
  }

  const generateTextOutput = () => {
    if (!selectedApp) return ''
    
    let output = `${selectedApp.flag} ${getAppName(selectedApp)}\n`
    output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    
    selectedApp.fields.forEach(field => {
      const value = filledFields.get(field.id) || ''
      const label = getLabel(field)
      output += `${label}:\n  ${value || '[Not filled]'}\n\n`
    })
    
    return output
  }

  const handleCopy = () => {
    const text = generateTextOutput()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const text = generateTextOutput()
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedApp?.id}_application.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const autoFilledCount = filledFields.size
  const totalFields = selectedApp?.fields.length || 0
  const progress = totalFields > 0 ? (autoFilledCount / totalFields) * 100 : 0

  return (
    <div className="min-h-screen p-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30 mb-4">
            <Bot className="text-neon-purple animate-pulse" size={20} />
            <span className="text-neon-purple text-sm font-medium">
              {language === 'ar' ? 'تعبئة تلقائية بالذكاء الاصطناعي' : language === 'fr' ? 'Remplissage IA automatique' : 'AI Auto-Fill'}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">{t('schengenForm')}</span>
          </h1>
          <p className="text-white/60">
            {language === 'ar' ? 'املأ بياناتك مرة واحدة واحصل على النماذج جاهزة' : language === 'fr' ? 'Remplissez une fois, obtenez tous les formulaires prêts' : 'Fill once, get all forms ready'}
          </p>
        </motion.div>

        {/* AI Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-ai mb-6 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="text-neon-cyan" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1">
                {language === 'ar' ? 'كيف يعمل؟' : language === 'fr' ? 'Comment ça marche?' : 'How it works?'}
              </h3>
              <p className="text-xs text-white/60">
                {language === 'ar' 
                  ? 'احفظ بياناتك في الملف الشخصي وسنملأ الاستمارات تلقائياً. يمكنك تعديل أي قيمة قبل النسخ.'
                  : language === 'fr'
                  ? 'Enregistrez vos données dans votre profil et nous remplirons automatiquement les formulaires. Modifiez toute valeur avant de copier.'
                  : 'Save your data in your profile and we will auto-fill forms. Edit any value before copying.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Application Selection */}
        {!selectedApp ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <FileText className="text-neon-cyan" size={20} />
              {language === 'ar' ? 'اختر الاستمارة' : language === 'fr' ? 'Choisir le formulaire' : 'Select Form'}
            </h3>
            
            {visaApplications.map((app, index) => (
              <motion.button
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedApp(app)}
                className="w-full glass-card-hover p-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{app.flag}</span>
                  <div className="flex-1">
                    <h4 className="font-bold">{getAppName(app)}</h4>
                    <p className="text-sm text-white/50">{getCountry(app)}</p>
                    <p className="text-xs text-white/30 mt-1">
                      {app.fields.length} {language === 'ar' ? 'حقل' : language === 'fr' ? 'champs' : 'fields'}
                    </p>
                  </div>
                  <ChevronRight className="text-white/30" size={24} />
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <>
            {/* Selected App Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4"
            >
              <button
                onClick={() => { setSelectedApp(null); setFilledFields(new Map()); }}
                className="text-sm text-neon-cyan hover:text-neon-cyan/80 flex items-center gap-1 mb-3"
              >
                <ChevronRight className="rotate-180" size={16} />
                {language === 'ar' ? 'العودة للاختيار' : language === 'fr' ? 'Retour à la sélection' : 'Back to selection'}
              </button>
              
              <div className="glass-card p-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedApp.flag}</span>
                  <div className="flex-1">
                    <h3 className="font-bold">{getAppName(selectedApp)}</h3>
                    <p className="text-sm text-white/50">{getCountry(selectedApp)}</p>
                  </div>
                </div>
                
                {/* Progress */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-white/50 mb-1">
                    <span>{language === 'ar' ? 'التقدم' : language === 'fr' ? 'Progression' : 'Progress'}</span>
                    <span>{autoFilledCount}/{totalFields}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Auto Fill Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleAutoFill}
              disabled={isAutoFilling}
              className={cn(
                'w-full mb-6 neon-button flex items-center justify-center gap-2',
                isAutoFilling && 'opacity-70'
              )}
            >
              {isAutoFilling ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {language === 'ar' ? 'جارٍ التعبئة...' : language === 'fr' ? 'Remplissage...' : 'Auto-filling...'}
                </>
              ) : (
                <>
                  <Bot size={20} />
                  {language === 'ar' ? 'تعبئة تلقائية من الملف الشخصي' : language === 'fr' ? 'Remplissage auto depuis le profil' : 'Auto-fill from Profile'}
                </>
              )}
            </motion.button>

            {/* Form Fields */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {selectedApp.fields.map((field, index) => {
                const value = filledFields.get(field.id) || ''
                const isAutoFilled = value.length > 0
                
                return (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="glass-card p-4"
                  >
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      {getLabel(field)}
                      {field.required && <span className="text-red-400">*</span>}
                      {isAutoFilled && (
                        <span className="ml-auto text-xs bg-neon-cyan/20 text-neon-cyan px-2 py-0.5 rounded-full">
                          {language === 'ar' ? 'تم' : language === 'fr' ? 'OK' : 'Filled'}
                        </span>
                      )}
                    </label>
                    
                    {field.type === 'select' ? (
                      <select
                        value={value}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="input-field"
                      >
                        <option value="">-- {language === 'ar' ? 'اختر' : language === 'fr' ? 'Sélectionner' : 'Select'} --</option>
                        {field.id === 'tripPurpose' && (
                          <>
                            <option value="tourism">{language === 'ar' ? 'سياحة' : language === 'fr' ? 'Tourisme' : 'Tourism'}</option>
                            <option value="business">{language === 'ar' ? 'عمل' : language === 'fr' ? 'Affaires' : 'Business'}</option>
                            <option value="family">{language === 'ar' ? 'زيارة عائلية' : language === 'fr' ? 'Famille' : 'Family'}</option>
                            <option value="study">{language === 'ar' ? 'دراسة' : language === 'fr' ? 'Études' : 'Study'}</option>
                          </>
                        )}
                        {field.id === 'entryCountry' && (
                          <>
                            <option value="France">🇫🇷 France</option>
                            <option value="Germany">🇩🇪 Germany</option>
                            <option value="Spain">🇪🇸 Spain</option>
                            <option value="Italy">🇮🇹 Italy</option>
                          </>
                        )}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={value}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="input-field"
                        placeholder={getLabel(field)}
                      />
                    )}
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 grid grid-cols-2 gap-3"
            >
              <button
                onClick={handleCopy}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                {copied 
                  ? (language === 'ar' ? 'تم!' : language === 'fr' ? 'Copié!' : 'Copied!')
                  : (language === 'ar' ? 'نسخ' : language === 'fr' ? 'Copier' : 'Copy')}
              </button>
              <button
                onClick={handleDownload}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Download size={18} />
                {language === 'ar' ? 'تحميل' : language === 'fr' ? 'Télécharger' : 'Download'}
              </button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

export default VisaFormFiller
