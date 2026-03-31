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
  {
    id: 'work_permit',
    name: 'Work Permit',
    nameAr: 'تصريح العمل',
    nameFr: 'Permis de travail',
    description: 'Official work authorization from destination country',
    descriptionAr: 'تصريح عمل رسمي من الدولة الوجهة',
    descriptionFr: "Autorisation de travail officielle du pays de destination",
  },
  {
    id: 'payslips',
    name: 'Payslips',
    nameAr: 'كشوفات الرواتب',
    nameFr: 'Fiches de paie',
    description: 'Last 3-6 months salary slips',
    descriptionAr: 'كشوفات الرواتب لآخر 3-6 أشهر',
    descriptionFr: 'Fiches de paie des 3-6 derniers mois',
  },
  {
    id: 'tax_returns',
    name: 'Tax Returns',
    nameAr: 'إقرارات الضريبة',
    nameFr: 'Déclarations fiscales',
    description: 'Income tax returns or proof of tax payments',
    descriptionAr: 'إقرارات ضريبة الدخل أو إثبات دفع الضرائب',
    descriptionFr: 'Déclarations de revenus ou preuve de paiement des impôts',
  },
  {
    id: 'business_registration',
    name: 'Business Registration',
    nameAr: 'سجل تجاري',
    nameFr: "Registre de l'entreprise",
    description: 'Business registration certificate or proof of business ownership',
    descriptionAr: 'شهادة سجل تجاري أو إثبات ملكية عمل تجاري',
    descriptionFr: "Certificat d'enregistrement d'entreprise ou preuve de propriété",
  },
  {
    id: 'business_license',
    name: 'Business License',
    nameAr: 'رخصة تجارية',
    nameFr: "Licence d'entreprise",
    description: 'Business license or trade permit',
    descriptionAr: 'رخصة تجارية أو تصريح تجاري',
    descriptionFr: "Licence d'entreprise ou permis commercial",
  },
  {
    id: 'business_bank_statements',
    name: 'Business Bank Statements',
    nameAr: 'كشوفات حسابات بنكية للشركة',
    nameFr: 'Relevés bancaires de l\'entreprise',
    description: 'Business account bank statements for at least 6 months',
    descriptionAr: 'كشوفات حسابات بنكية للشركة لمدة 6 أشهر على الأقل',
    descriptionFr: 'Relevés bancaires de l\'entreprise pendant au moins 6 mois',
  },
  {
    id: 'tax_filings',
    name: 'Tax Filings',
    nameAr: 'ملفات ضريبية',
    nameFr: 'Dossiers fiscaux',
    description: 'Tax filings or invoices demonstrating ongoing business activity',
    descriptionAr: 'ملفات ضريبية أو فواتير تثبت النشاط التجاري المستمر',
    descriptionFr: 'Dossiers fiscaux ou factures démontrant une activité commerciale continue',
  },
  {
    id: 'client_contracts',
    name: 'Client Contracts',
    nameAr: 'عقود العملاء',
    nameFr: 'Contrats clients',
    description: 'Client contracts or letters of engagement (optional but helpful)',
    descriptionAr: 'عقود العملاء أو خطابات الانخراط (اختياري لكن مفيد)',
    descriptionFr: 'Contrats clients ou lettres d\'engagement (optionnel mais utile)',
  },
  {
    id: 'noc',
    name: 'No Objection Certificate (NOC)',
    nameAr: 'شهادة عدم اعتراض',
    nameFr: 'Certificat de non-objection',
    description: 'NOC from employer or educational institution',
    descriptionAr: 'شهادة عدم اعتراض من صاحب العمل أو المؤسسة التعليمية',
    descriptionFr: 'Certificat de non-objection de l\'employeur ou de l\'établissement',
  },
  {
    id: 'student_id_copy',
    name: 'Student ID Copy',
    nameAr: 'نسخة بطاقة طالب',
    nameFr: 'Copie de la carte étudiant',
    description: 'Student ID or university pass copy',
    descriptionAr: 'بطاقة طالب أو نسخة بطاقة جامعية',
    descriptionFr: 'Carte étudiant ou copie de la carte universitaire',
  },
  {
    id: 'sponsorship_letter',
    name: 'Sponsorship Letter',
    nameAr: 'خطاب الكفالة',
    nameFr: 'Lettre de parrainage',
    description: 'Formal declaration of financial support from sponsor',
    descriptionAr: 'بيان رسمي بالدعم المالي من الكفيل',
    descriptionFr: 'Déclaration officielle de soutien financier du parrain',
  },
  {
    id: 'sponsor_financial_docs',
    name: 'Sponsor Financial Documents',
    nameAr: 'وثائق مالية للكفيل',
    nameFr: 'Documents financiers du parrain',
    description: 'Sponsor\'s bank statements, income proof, and ID copy',
    descriptionAr: 'كشوفات حسابات بنكية للكفيل، إثبات الدخل، ونسخة الهوية',
    descriptionFr: 'Relevés bancaires du parrain, preuve de revenus et copie de pièce d\'identité',
  },
  {
    id: 'cover_letter',
    name: 'Cover Letter',
    nameAr: 'خطاب تعريفي',
    nameFr: 'Lettre de motivation',
    description: 'Detailed letter explaining purpose of visit and ties to home country',
    descriptionAr: 'خطاب مفصل يشرح غرض الزيارة والعلاقات بالوطن',
    descriptionFr: 'Lettre détaillée expliquant le but de la visite et liens avec le pays d\'origine',
  },
  {
    id: 'property_documents',
    name: 'Property Documents',
    nameAr: 'وثائق الملكية',
    nameFr: 'Documents de propriété',
    description: 'Property ownership or rental agreement',
    descriptionAr: 'إثبات ملكية عقار أو عقد إيجار',
    descriptionFr: 'Preuve de propriété ou contrat de location',
  },
  {
    id: 'marriage_certificate',
    name: 'Marriage Certificate',
    nameAr: 'شهادة الزواج',
    nameFr: 'Certificat de mariage',
    description: 'Marriage certificate (if applicable)',
    descriptionAr: 'شهادة زواج (إن وُجدت)',
    descriptionFr: 'Certificat de mariage (si applicable)',
  },
  {
    id: 'birth_certificates',
    name: 'Birth Certificates',
    nameAr: 'شهادات الميلاد',
    nameFr: 'Actes de naissance',
    description: 'Birth certificates for children or family members',
    descriptionAr: 'شهادات ميلاد للأطفال أو أفراد العائلة',
    descriptionFr: 'Actes de naissance pour les enfants ou membres de la famille',
  },
  {
    id: 'retirement_certificate',
    name: 'Retirement Certificate',
    nameAr: 'شهادة التقاعد',
    nameFr: 'Certificat de retraite',
    description: 'Retirement letter or pension certificate',
    descriptionAr: 'خطاب تقاعد أو شهادة معاش',
    descriptionFr: 'Lettre de retraite ou certificat de pension',
  },
  {
    id: 'pension_statements',
    name: 'Pension Statements',
    nameAr: 'كشوفات المعاش',
    nameFr: 'Relevés de pension',
    description: 'Pension payment statements for last 6 months',
    descriptionAr: 'كشوفات دفع المعاش لآخر 6 أشهر',
    descriptionFr: 'Relevés de paiement de pension des 6 derniers mois',
  },
  {
    id: 'scholarship_letter',
    name: 'Scholarship Letter',
    nameAr: 'خطاب المنحة الدراسية',
    nameFr: 'Lettre de bourse',
    description: 'Scholarship award letter or proof of funding',
    descriptionAr: 'خطاب منحة دراسية أو إثبات التمويل',
    descriptionFr: 'Lettre d\'attribution de bourse ou preuve de financement',
  },
  {
    id: 'academic_transcript',
    name: 'Academic Transcript',
    nameAr: 'كشف الدرجات',
    nameFr: 'Relevé de notes',
    description: 'Latest academic transcript or grades',
    descriptionAr: 'كشف درجات حديث أو الدرجات الدراسية',
    descriptionFr: 'Relevé de notes récent ou notes académiques',
  },
  {
    id: 'university_noc',
    name: 'University NOC',
    nameAr: 'شهادة عدم اعتراض من الجامعة',
    nameFr: 'NOC de l\'université',
    description: 'No Objection Certificate from university',
    descriptionAr: 'شهادة عدم اعتراض من الجامعة',
    descriptionFr: 'Certificat de non-objection de l\'université',
  },
  {
    id: 'business_invitation',
    name: 'Business Invitation Letter',
    nameAr: 'دعوة عمل رسمية',
    nameFr: 'Lettre d\'invitation professionnelle',
    description: 'Invitation letter from EU company or partner',
    descriptionAr: 'خطاب دعوة من شركة أوروبية أو شريك',
    descriptionFr: 'Lettre d\'invitation d\'une entreprise européenne',
  },
  {
    id: 'conference_registration',
    name: 'Conference Registration',
    nameAr: 'تسجيل المؤتمر',
    nameFr: 'Inscription à la conférence',
    description: 'Conference or event registration confirmation',
    descriptionAr: 'تأكيد تسجيل المؤتمر أو الحدث',
    descriptionFr: 'Confirmation d\'inscription à la conférence ou événement',
  },
  {
    id: 'host_passport_copy',
    name: 'Host Passport Copy',
    nameAr: 'نسخة جواز المضيف',
    nameFr: 'Copie du passeport de l\'hôte',
    description: 'Copy of host\'s passport or ID',
    descriptionAr: 'نسخة من جواز سفر أو هوية المضيف',
    descriptionFr: 'Copie du passeport ou de la pièce d\'identité de l\'hôte',
  },
  {
    id: 'host_residence_proof',
    name: 'Host Residence Proof',
    nameAr: 'إثبات إقامة المضيف',
    nameFr: 'Preuve de résidence de l\'hôte',
    description: 'Utility bill, rental contract, or residence permit of host',
    descriptionAr: 'فاتورة خدمات، عقد إيجار، أو تصريح إقامة المضيف',
    descriptionFr: 'Facture, contrat de location ou titre de séjour de l\'hôte',
  },
  {
    id: 'previous_passports',
    name: 'Previous Passports',
    nameAr: 'جوازات سفر سابقة',
    nameFr: 'Passeports précédents',
    description: 'Copies of previous passports showing travel history',
    descriptionAr: 'نسخ من جوازات سفر سابقة تُظهر سجل السفر',
    descriptionFr: 'Copies de passeports précédents montrant l\'historique de voyage',
  },
  {
    id: 'visa_application_form',
    name: 'Visa Application Form',
    nameAr: 'نموذج طلب التأشيرة',
    nameFr: 'Formulaire de demande de visa',
    description: 'Completed and signed visa application form',
    descriptionAr: 'نموذج طلب تأشيرة مكتمل وموقع',
    descriptionFr: 'Formulaire de demande de visa complété et signé',
  },
  {
    id: 'leave_approval',
    name: 'Leave Approval Letter',
    nameAr: 'خطاب موافقة الإجازة',
    nameFr: 'Lettre d\'approbation des congés',
    description: 'Leave approval from employer for travel dates',
    descriptionAr: 'موافقة على الإجازة من صاحب العمل لتواريخ السفر',
    descriptionFr: 'Approbation des congés de l\'employeur pour les dates de voyage',
  },
  {
    id: 'company_id',
    name: 'Company ID Card',
    nameAr: 'بطاقة هوية الشركة',
    nameFr: 'Carte d\'identité de l\'entreprise',
    description: 'Company identification card or employee badge',
    descriptionAr: 'بطاقة هوية الشركة أو شارة الموظف',
    descriptionFr: 'Carte d\'identification de l\'entreprise ou badge employé',
  },
  {
    id: 'employment_contract',
    name: 'Employment Contract',
    nameAr: 'عقد العمل',
    nameFr: 'Contrat de travail',
    description: 'Employment contract showing position and salary',
    descriptionAr: 'عقد عمل يظهر المنصب والراتب',
    descriptionFr: 'Contrat de travail montrant le poste et le salaire',
  },
  {
    id: 'business_trade_license',
    name: 'Trade License',
    nameAr: 'رخصة تجارية',
    nameFr: 'Licence commerciale',
    description: 'Commercial trade license or business permit',
    descriptionAr: 'رخصة تجارية أو تصريح ممارسة نشاط تجاري',
    descriptionFr: 'Licence commerciale ou permis d\'exercer une activité',
  },
  {
    id: 'vat_registration',
    name: 'VAT Registration',
    nameAr: 'تسجيل ضريبة القيمة المضافة',
    nameFr: 'Inscription TVA',
    description: 'VAT registration certificate (if applicable)',
    descriptionAr: 'شهادة تسجيل ضريبة القيمة المضافة (إن وُجدت)',
    descriptionFr: 'Certificat d\'inscription TVA (si applicable)',
  },
  {
    id: 'professional_license',
    name: 'Professional License',
    nameAr: 'رخصة مهنية',
    nameFr: 'Licence professionnelle',
    description: 'Professional license for doctors, lawyers, engineers, etc.',
    descriptionAr: 'رخصة مهنية للأطباء والمحامين والمهندسين إلخ',
    descriptionFr: 'Licence professionnelle pour médecins, avocats, ingénieurs, etc.',
  },
  {
    id: 'explanation_letter',
    name: 'Explanation Letter',
    nameAr: 'خطاب توضيحي',
    nameFr: 'Lettre d\'explication',
    description: 'Letter explaining employment status and travel purpose',
    descriptionAr: 'خطاب يوضح حالة العمل وغرض السفر',
    descriptionFr: 'Lettre expliquant la situation professionnelle et le but du voyage',
  },
]

const VISA_CHECKLISTS: Record<string, Record<string, string[]>> = {
  France: {
    tourist: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'employment_letter',
      'payslips', 'tax_returns', 'property_documents', 'travel_history', 'marriage_certificate', 'birth_certificates'
    ],
    business: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'business_invitation', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance',
      'business_docs', 'employment_letter', 'business_bank_statements', 'tax_filings',
      'conference_registration', 'purpose_letter'
    ],
    student: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'enrollment', 'university_noc', 'student_id_copy', 'academic_transcript',
      'scholarship_letter', 'proof_funds', 'insurance', 'accommodation', 'birth_certificates'
    ],
    work: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'work_permit', 'employment_letter', 'financial_proof', 'insurance', 'payslips',
      'tax_returns', 'travel_history', 'accommodation'
    ],
    family: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'invitation', 'accommodation_host', 'host_passport_copy', 'host_residence_proof',
      'financial_proof', 'insurance', 'marriage_certificate', 'birth_certificates',
      'purpose_letter', 'accommodation'
    ],
  },
  Germany: {
    tourist: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'employment_letter',
      'payslips', 'tax_returns', 'property_documents', 'travel_history', 'marriage_certificate', 'birth_certificates'
    ],
    business: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'business_invitation', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance',
      'business_docs', 'employment_letter', 'business_bank_statements', 'tax_filings',
      'conference_registration', 'purpose_letter'
    ],
    student: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'enrollment', 'university_noc', 'student_id_copy', 'academic_transcript',
      'scholarship_letter', 'proof_funds', 'insurance', 'accommodation', 'birth_certificates'
    ],
    work: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'work_permit', 'employment_letter', 'financial_proof', 'insurance', 'payslips',
      'tax_returns', 'travel_history', 'accommodation'
    ],
    family: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'invitation', 'accommodation_host', 'host_passport_copy', 'host_residence_proof',
      'financial_proof', 'insurance', 'marriage_certificate', 'birth_certificates',
      'purpose_letter', 'accommodation'
    ],
  },
  Spain: {
    tourist: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'employment_letter',
      'payslips', 'tax_returns', 'property_documents', 'travel_history', 'marriage_certificate', 'birth_certificates'
    ],
    business: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'business_invitation', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance',
      'business_docs', 'employment_letter', 'business_bank_statements', 'tax_filings',
      'conference_registration', 'purpose_letter'
    ],
    student: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'enrollment', 'university_noc', 'student_id_copy', 'academic_transcript',
      'scholarship_letter', 'proof_funds', 'insurance', 'accommodation', 'birth_certificates'
    ],
    work: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'work_permit', 'employment_letter', 'financial_proof', 'insurance', 'payslips',
      'tax_returns', 'travel_history', 'accommodation'
    ],
    family: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'invitation', 'accommodation_host', 'host_passport_copy', 'host_residence_proof',
      'financial_proof', 'insurance', 'marriage_certificate', 'birth_certificates',
      'purpose_letter', 'accommodation'
    ],
  },
  Italy: {
    tourist: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'employment_letter',
      'payslips', 'tax_returns', 'property_documents', 'travel_history', 'marriage_certificate', 'birth_certificates'
    ],
    business: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'business_invitation', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance',
      'business_docs', 'employment_letter', 'business_bank_statements', 'tax_filings',
      'conference_registration', 'purpose_letter'
    ],
    student: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'enrollment', 'university_noc', 'student_id_copy', 'academic_transcript',
      'scholarship_letter', 'proof_funds', 'insurance', 'accommodation', 'birth_certificates'
    ],
    work: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'work_permit', 'employment_letter', 'financial_proof', 'insurance', 'payslips',
      'tax_returns', 'travel_history', 'accommodation'
    ],
    family: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'invitation', 'accommodation_host', 'host_passport_copy', 'host_residence_proof',
      'financial_proof', 'insurance', 'marriage_certificate', 'birth_certificates',
      'purpose_letter', 'accommodation'
    ],
  },
  Portugal: {
    tourist: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'employment_letter',
      'payslips', 'tax_returns', 'property_documents', 'travel_history', 'marriage_certificate', 'birth_certificates'
    ],
    business: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'business_invitation', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance',
      'business_docs', 'employment_letter', 'business_bank_statements', 'tax_filings',
      'conference_registration', 'purpose_letter'
    ],
    student: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'enrollment', 'university_noc', 'student_id_copy', 'academic_transcript',
      'scholarship_letter', 'proof_funds', 'insurance', 'accommodation', 'birth_certificates'
    ],
    work: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'work_permit', 'employment_letter', 'financial_proof', 'insurance', 'payslips',
      'tax_returns', 'travel_history', 'accommodation'
    ],
    family: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'invitation', 'accommodation_host', 'host_passport_copy', 'host_residence_proof',
      'financial_proof', 'insurance', 'marriage_certificate', 'birth_certificates',
      'purpose_letter', 'accommodation'
    ],
  },
  Belgium: {
    tourist: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'employment_letter',
      'payslips', 'tax_returns', 'property_documents', 'travel_history', 'marriage_certificate', 'birth_certificates'
    ],
    business: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'business_invitation', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance',
      'business_docs', 'employment_letter', 'business_bank_statements', 'tax_filings',
      'conference_registration', 'purpose_letter'
    ],
    student: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'enrollment', 'university_noc', 'student_id_copy', 'academic_transcript',
      'scholarship_letter', 'proof_funds', 'insurance', 'accommodation', 'birth_certificates'
    ],
    work: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'work_permit', 'employment_letter', 'financial_proof', 'insurance', 'payslips',
      'tax_returns', 'travel_history', 'accommodation'
    ],
    family: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'invitation', 'accommodation_host', 'host_passport_copy', 'host_residence_proof',
      'financial_proof', 'insurance', 'marriage_certificate', 'birth_certificates',
      'purpose_letter', 'accommodation'
    ],
  },
  Netherlands: {
    tourist: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'employment_letter',
      'payslips', 'tax_returns', 'property_documents', 'travel_history', 'marriage_certificate', 'birth_certificates'
    ],
    business: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'business_invitation', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance',
      'business_docs', 'employment_letter', 'business_bank_statements', 'tax_filings',
      'conference_registration', 'purpose_letter'
    ],
    student: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'enrollment', 'university_noc', 'student_id_copy', 'academic_transcript',
      'scholarship_letter', 'proof_funds', 'insurance', 'accommodation', 'birth_certificates'
    ],
    work: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'work_permit', 'employment_letter', 'financial_proof', 'insurance', 'payslips',
      'tax_returns', 'travel_history', 'accommodation'
    ],
    family: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'invitation', 'accommodation_host', 'host_passport_copy', 'host_residence_proof',
      'financial_proof', 'insurance', 'marriage_certificate', 'birth_certificates',
      'purpose_letter', 'accommodation'
    ],
  },
  UK: {
    tourist: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'travel_itinerary', 'accommodation', 'financial_proof', 'employment_letter',
      'payslips', 'tax_returns', 'property_documents', 'travel_history', 'marriage_certificate', 'birth_certificates'
    ],
    business: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'business_invitation', 'travel_itinerary', 'accommodation', 'financial_proof',
      'business_docs', 'business_bank_statements', 'tax_filings', 'conference_registration', 'purpose_letter'
    ],
    student: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'enrollment', 'university_noc', 'student_id_copy', 'academic_transcript',
      'scholarship_letter', 'proof_funds', 'accommodation', 'birth_certificates'
    ],
    work: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'work_permit', 'employment_letter', 'financial_proof', 'payslips', 'tax_returns', 'accommodation'
    ],
    family: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'invitation', 'accommodation_host', 'host_passport_copy', 'host_residence_proof',
      'financial_proof', 'marriage_certificate', 'birth_certificates', 'accommodation'
    ],
  },
  USA: {
    tourist: [
      'passport', 'photo', 'ds160', 'interview', 'cover_letter',
      'financial_proof', 'employment_letter', 'payslips', 'tax_returns',
      'property_documents', 'travel_history', 'marriage_certificate', 'birth_certificates'
    ],
    business: [
      'passport', 'photo', 'ds160', 'interview', 'cover_letter',
      'business_invitation', 'financial_proof', 'business_docs', 'employment_letter',
      'business_bank_statements', 'tax_filings', 'conference_registration', 'purpose_letter'
    ],
    student: [
      'passport', 'photo', 'ds160', 'interview', 'cover_letter',
      'enrollment', 'proof_funds', 'scholarship_letter', 'academic_transcript',
      'birth_certificates', 'sponsorship_letter', 'sponsor_financial_docs'
    ],
    work: [
      'passport', 'photo', 'ds160', 'interview', 'cover_letter',
      'work_permit', 'employment_letter', 'financial_proof', 'payslips', 'tax_returns'
    ],
    family: [
      'passport', 'photo', 'ds160', 'interview', 'cover_letter',
      'invitation', 'financial_proof', 'marriage_certificate', 'birth_certificates',
      'host_passport_copy', 'host_residence_proof'
    ],
  },
  Canada: {
    tourist: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'travel_itinerary', 'accommodation', 'financial_proof', 'biometrics',
      'employment_letter', 'payslips', 'tax_returns', 'property_documents',
      'travel_history', 'marriage_certificate', 'birth_certificates'
    ],
    business: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'business_invitation', 'travel_itinerary', 'accommodation', 'financial_proof', 'biometrics',
      'business_docs', 'business_bank_statements', 'tax_filings', 'conference_registration', 'purpose_letter'
    ],
    student: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'enrollment', 'university_noc', 'student_id_copy', 'academic_transcript',
      'scholarship_letter', 'proof_funds', 'biometrics', 'birth_certificates'
    ],
    work: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'work_permit', 'employment_letter', 'financial_proof', 'biometrics',
      'payslips', 'tax_returns', 'accommodation'
    ],
    family: [
      'visa_application_form', 'passport', 'photo', 'previous_passports', 'cover_letter',
      'invitation', 'accommodation_host', 'host_passport_copy', 'host_residence_proof',
      'financial_proof', 'biometrics', 'marriage_certificate', 'birth_certificates', 'accommodation'
    ],
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

interface ProfessionDocuments {
  employed: string[]
  selfEmployed: string[]
  unemployed: string[]
  retired: string[]
  student: string[]
}

const PROFESSION_DOCUMENTS: ProfessionDocuments = {
  employed: ['employment_letter', 'payslips', 'employment_contract', 'leave_approval', 'company_id'],
  selfEmployed: ['business_registration', 'business_license', 'tax_returns', 'business_bank_statements', 'professional_license'],
  unemployed: ['explanation_letter', 'sponsorship_letter', 'sponsor_financial_docs'],
  retired: ['retirement_certificate', 'pension_statements'],
  student: ['enrollment', 'university_noc', 'student_id_copy', 'academic_transcript'],
}

const getProfessionDocuments = (profession: string): string[] => {
  switch (profession) {
    case 'employed':
      return PROFESSION_DOCUMENTS.employed
    case 'self_employed':
    case 'business_owner':
    case 'freelancer':
      return PROFESSION_DOCUMENTS.selfEmployed
    case 'unemployed':
    case 'homemaker':
      return PROFESSION_DOCUMENTS.unemployed
    case 'retired':
      return PROFESSION_DOCUMENTS.retired
    case 'student':
      return PROFESSION_DOCUMENTS.student
    default:
      return PROFESSION_DOCUMENTS.employed
  }
}

export function Checklist() {
  const { userProfile, updateProfile, setActiveNav } = useVisaStore()
  const { language } = useLanguage()
  
  const [selectedCountry, setSelectedCountry] = useState(userProfile.targetCountry || 'France')
  const [selectedVisaType, setSelectedVisaType] = useState(userProfile.purposeOfVisit || 'tourist')
  const [selectedProfession, setSelectedProfession] = useState(userProfile.employmentStatus || 'employed')
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const countryData = COUNTRY_DATA[selectedCountry]
  const visaTypeData = VISA_TYPES_DATA[selectedVisaType]

  const baseDocs = VISA_CHECKLISTS[selectedCountry]?.[selectedVisaType] || VISA_CHECKLISTS[selectedCountry]?.tourist || []
  const professionDocs = getProfessionDocuments(selectedProfession)
  
  // Combine base docs and profession docs, removing duplicates
  const allRequiredDocs = Array.from(new Set([...baseDocs, ...professionDocs]))

  const toggleItem = (docId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [docId]: !prev[docId]
    }))
  }

  const completionPercentage = allRequiredDocs.length > 0 
    ? Math.round((Object.values(checkedItems).filter(Boolean).length / allRequiredDocs.length) * 100)
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

  const handleProfessionChange = (profession: string) => {
    setSelectedProfession(profession)
    updateProfile({ employmentStatus: profession })
    setCheckedItems({})
  }

  const getLabel = (ar: string, fr: string, en: string) => {
    if (language === 'ar') return ar
    if (language === 'fr') return fr
    return en
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
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
            {Object.values(checkedItems).filter(Boolean).length} / {allRequiredDocs.length} {getLabel('وثيقة جاهزة', 'documents prêts', 'documents ready')}
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

        {/* Profession Selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-4 mb-6"
        >
          <label className="text-xs text-white/60 mb-2 block">
            {getLabel('الحالة المهنية', 'Statut professionnel', 'Employment Status')}
          </label>
          <select
            value={selectedProfession}
            onChange={(e) => handleProfessionChange(e.target.value)}
            className="input-field w-full"
          >
            <option value="employed">{getLabel('موظف', 'Employé', 'Employed')}</option>
            <option value="self_employed">{getLabel('عمل حر / صاحب عمل', 'Travailleur indépendant', 'Self-Employed / Business Owner')}</option>
            <option value="unemployed">{getLabel('عاطل عن العمل', 'Sans emploi', 'Unemployed')}</option>
            <option value="retired">{getLabel('متقاعد', 'Retraité', 'Retired')}</option>
            <option value="student">{getLabel('طالب', 'Étudiant', 'Student')}</option>
          </select>
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
          
          {allRequiredDocs.map((docId, index) => {
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
