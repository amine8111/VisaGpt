import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number, currency: string = 'DZD'): string => {
  return new Intl.NumberFormat('ar-DZ', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const getScoreColor = (score: number): string => {
  if (score >= 75) return '#00E5FF'
  if (score >= 50) return '#8B5CF6'
  return '#FF007A'
}

export const getScoreLabel = (score: number): string => {
  if (score >= 85) return 'قوي جداً'
  if (score >= 75) return 'جيد'
  if (score >= 55) return 'متوسط'
  if (score >= 35) return 'ضعيف'
  return 'ضعيف جداً'
}

export const countries = [
  { name: 'Turkey', flag: '🇹🇷', code: 'TR' },
  { name: 'Georgia', flag: '🇬🇪', code: 'GE' },
  { name: 'UAE', flag: '🇦🇪', code: 'AE' },
  { name: 'Morocco', flag: '🇲🇦', code: 'MA' },
  { name: 'Tunisia', flag: '🇹🇳', code: 'TN' },
  { name: 'Malaysia', flag: '🇲🇾', code: 'MY' },
  { name: 'Portugal', flag: '🇵🇹', code: 'PT' },
  { name: 'Spain', flag: '🇪🇸', code: 'ES' },
  { name: 'Italy', flag: '🇮🇹', code: 'IT' },
  { name: 'Belgium', flag: '🇧🇪', code: 'BE' },
  { name: 'France', flag: '🇫🇷', code: 'FR' },
  { name: 'Netherlands', flag: '🇳🇱', code: 'NL' },
  { name: 'Germany', flag: '🇩🇪', code: 'DE' },
  { name: 'United Kingdom', flag: '🇬🇧', code: 'GB' },
  { name: 'United States', flag: '🇺🇸', code: 'US' },
  { name: 'Canada', flag: '🇨🇦', code: 'CA' },
]

export const professions = [
  'مهندس', 'طبيب', 'محامي', 'محاسب', 'موظف حكومي', 
  'صاحب عمل', 'تاجر', 'مهني حر', 'طالب', 'عاطل عن العمل',
  'تقني', 'إداري', 'معلم', 'صحفي', 'فنان'
]

export const purposesOfVisit = [
  'سياحة', 'زيارة عائلية', 'عمل', 'دراسة', 'علاج طبي',
  'حضور مؤتمر', 'رياضة', 'دين', 'ترانزيت'
]

export const durations = [
  'أقل من أسبوع', 'أسبوع - أسبوعين', 'شهر - 3 أشهر',
  '3 - 6 أشهر', 'أكثر من 6 أشهر'
]

export const visaCenters = [
  { city: 'الجزائر العاصمة', name: 'VFS Global الجزائر', status: 'متاح', nextDate: '2026-03-25' },
  { city: 'وهران', name: 'TLSContact وهران', status: '有限', nextDate: '2026-03-28' },
  { city: 'عنابة', name: 'VFS Global عنابة', status: 'متاح', nextDate: '2026-03-22' },
  { city: 'قسنطينة', name: 'TLSContact قسنطينة', status: 'متاح', nextDate: '2026-03-26' },
]

export const documentTemplates = [
  { 
    id: 1, 
    name: 'وعد التحمل', 
    description: 'Promesse de prise en charge',
    category: 'عائلي'
  },
  { 
    id: 2, 
    name: 'خطاب动机', 
    description: 'Lettre de motivation',
    category: 'تأشيرة'
  },
  { 
    id: 3, 
    name: 'شهادة العمل', 
    description: 'Attestation de travail',
    category: 'عمل'
  },
  { 
    id: 4, 
    name: 'كشف الحساب البنكي', 
    description: 'Relevé bancaire',
    category: 'مالي'
  },
  { 
    id: 5, 
    name: 'حجز الفندق', 
    description: 'Réservation hôtel',
    category: 'سفر'
  },
  { 
    id: 6, 
    name: 'تذكرة الطيران', 
    description: 'Billet d\'avion',
    category: 'سفر'
  },
]

export const interviewQuestions = [
  { id: 1, question: 'Pourquoi voulez-vous voyager en France?', category: 'motivations' },
  { id: 2, question: 'Combien de temps prévoyez-vous de rester?', category: 'duration' },
  { id: 3, question: 'Où allez-vous loger pendant votre séjour?', category: 'accommodation' },
  { id: 4, question: 'Qui financera votre voyage?', category: 'finance' },
  { id: 5, question: 'Avez-vous des membres de famille en France?', category: 'family' },
  { id: 6, question: 'Quel est votre métier actuel?', category: 'profession' },
  { id: 7, question: 'Pourquoi ne pas voyager pendant le Ramadhan?', category: 'cultural' },
  { id: 8, question: 'Avez-vous déjà voyagé à l\'étranger?', category: 'travel_history' },
  { id: 9, question: 'Quand avez-vous obtenu votre passeport?', category: 'passport' },
  { id: 10, question: 'Combien d\'argent avez-vous sur votre compte?', category: 'finance' },
]
