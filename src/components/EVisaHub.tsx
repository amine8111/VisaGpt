'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Globe, ExternalLink, Clock, CheckCircle, AlertCircle,
  Search, Filter, Star, MapPin, Calendar, FileText,
  ChevronRight, ArrowRight, Globe2, Shield, Sparkles,
  Plane, CreditCard, Home, ArrowUpRight
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { cn } from '@/lib/utils'

interface EVisaCountry {
  id: string
  name: string
  nameAr: string
  nameFr: string
  flag: string
  region: string
  processingTime: string
  processingTimeAr: string
  processingTimeFr: string
  validity: string
  validityAr: string
  maxStay: string
  maxStayAr: string
  price: number
  currency: string
  requirements: string[]
  requirementsAr: string[]
  requirementsFr: string[]
  url: string
  featured: boolean
  rating: number
  reviews: number
  description: string
  descriptionAr: string
  descriptionFr: string
}

const evisaCountries: EVisaCountry[] = [
  {
    id: 'turkey',
    name: 'Turkey',
    nameAr: 'تركيا',
    nameFr: 'Turquie',
    flag: '🇹🇷',
    region: 'Europe/Asia',
    processingTime: '24-48 hours',
    processingTimeAr: '24-48 ساعة',
    processingTimeFr: '24-48 heures',
    validity: '180 days',
    validityAr: '180 يوم',
    maxStay: '90 days',
    maxStayAr: '90 يوم',
    price: 50,
    currency: 'USD',
    requirements: [
      'Valid passport (6+ months)',
      'Return ticket',
      'Hotel reservation',
      'Email address',
      'Credit/debit card'
    ],
    requirementsAr: [
      'جواز سفر صالح (6+ أشهر)',
      'تذكرة عودة',
      'حجز فندق',
      'بريد إلكتروني',
      'بطاقة ائتمان/خصم'
    ],
    requirementsFr: [
      'Passeport valide (6+ mois)',
      'Billet de retour',
      'Réservation hôtel',
      'Adresse e-mail',
      'Carte crédit/débit'
    ],
    url: 'https://www.evisa.gov.tr',
    featured: true,
    rating: 4.8,
    reviews: 15420,
    description: 'Most popular e-visa destination for Algerians. Beautiful culture, affordable travel.',
    descriptionAr: 'أكثر وجهة تأشيرة إلكترونية شعبية للجزائريين. ثقافة جميلة وسفر بأسعار معقولة.',
    descriptionFr: 'Destination e-visa la plus populaire pour les Algériens. Belle culture, voyage abordable.'
  },
  {
    id: 'kenya',
    name: 'Kenya',
    nameAr: 'كينيا',
    nameFr: 'Kenya',
    flag: '🇰🇪',
    region: 'Africa',
    processingTime: '2-3 days',
    processingTimeAr: '2-3 أيام',
    processingTimeFr: '2-3 jours',
    validity: '90 days',
    validityAr: '90 يوم',
    maxStay: '90 days',
    maxStayAr: '90 يوم',
    price: 35,
    currency: 'USD',
    requirements: [
      'Valid passport',
      'Yellow fever certificate',
      'Return ticket',
      'Email address',
      'Photo'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'شهادة الحمى الصفراء',
      'تذكرة عودة',
      'بريد إلكتروني',
      'صورة'
    ],
    requirementsFr: [
      'Passeport valide',
      'Certificat fièvre jaune',
      'Billet de retour',
      'Adresse e-mail',
      'Photo'
    ],
    url: 'https://evisa.go.ke',
    featured: true,
    rating: 4.5,
    reviews: 8930,
    description: 'Safari adventures and beaches. Perfect for nature lovers.',
    descriptionAr: 'مغامرات السفاري والشواطئ. مثالية لمحبي الطبيعة.',
    descriptionFr: 'Aventures safari et plages. Parfait pour les amateurs de nature.'
  },
  {
    id: 'india',
    name: 'India',
    nameAr: 'الهند',
    nameFr: 'Inde',
    flag: '🇮🇳',
    region: 'Asia',
    processingTime: '3-5 days',
    processingTimeAr: '3-5 أيام',
    processingTimeFr: '3-5 jours',
    validity: '1 year',
    validityAr: 'سنة واحدة',
    maxStay: '90 days',
    maxStayAr: '90 يوم',
    price: 25,
    currency: 'USD',
    requirements: [
      'Valid passport',
      'Return ticket',
      'Hotel confirmation',
      'Photo',
      'Financial proof'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'تذكرة عودة',
      'تأكيد الفندق',
      'صورة',
      'إثبات مالي'
    ],
    requirementsFr: [
      'Passeport valide',
      'Billet de retour',
      'Confirmation hôtel',
      'Photo',
      'Preuve financière'
    ],
    url: 'https://indianvisaonline.gov.in',
    featured: true,
    rating: 4.3,
    reviews: 6230,
    description: 'Rich culture, ancient temples, and diverse landscapes await.',
    descriptionAr: 'ثقافة غنية ومعابد قديمة ومناظر طبيعية متنوعة في انتظارك.',
    descriptionFr: 'Culture riche, temples anciens et paysages divers vous attendent.'
  },
  {
    id: 'rwanda',
    name: 'Rwanda',
    nameAr: 'رواندا',
    nameFr: 'Rwanda',
    flag: '🇷🇼',
    region: 'Africa',
    processingTime: '1-3 days',
    processingTimeAr: '1-3 أيام',
    processingTimeFr: '1-3 jours',
    validity: '30 days',
    validityAr: '30 يوم',
    maxStay: '30 days',
    maxStayAr: '30 يوم',
    price: 30,
    currency: 'USD',
    requirements: [
      'Valid passport',
      'Return ticket',
      'Vaccination certificate',
      'Photo'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'تذكرة عودة',
      'شهادة تطعيم',
      'صورة'
    ],
    requirementsFr: [
      'Passeport valide',
      'Billet de retour',
      'Certificat vaccination',
      'Photo'
    ],
    url: 'https://www.rwandair.com',
    featured: false,
    rating: 4.6,
    reviews: 4120,
    description: 'Land of a thousand hills. Mountain gorillas and friendly people.',
    descriptionAr: 'أرض ألف تلة. غوريلات الجبال وشعب ودود.',
    descriptionFr: 'Terre des mille collines. Gorilles de montagne et gens sympathiques.'
  },
  {
    id: 'gabon',
    name: 'Gabon',
    nameAr: 'الغابون',
    nameFr: 'Gabon',
    flag: '🇬🇦',
    region: 'Africa',
    processingTime: '3-5 days',
    processingTimeAr: '3-5 أيام',
    processingTimeFr: '3-5 jours',
    validity: '6 months',
    validityAr: '6 أشهر',
    maxStay: '90 days',
    maxStayAr: '90 يوم',
    price: 70,
    currency: 'USD',
    requirements: [
      'Valid passport',
      'Return ticket',
      'Yellow fever certificate',
      'Hotel reservation'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'تذكرة عودة',
      'شهادة الحمى الصفراء',
      'حجز فندق'
    ],
    requirementsFr: [
      'Passeport valide',
      'Billet de retour',
      'Certificat fièvre jaune',
      'Réservation hôtel'
    ],
    url: 'https://evisagabon.ga',
    featured: false,
    rating: 4.2,
    reviews: 1890,
    description: 'Rainforests, wildlife, and pristine beaches.',
    descriptionAr: 'غابات مطيرة وحيوانات برية وشواطئ نظيفة.',
    descriptionFr: 'Forêts tropicales, faune et plages immaculées.'
  },
  {
    id: 'cambodia',
    name: 'Cambodia',
    nameAr: 'كمبوديا',
    nameFr: 'Cambodge',
    flag: '🇰🇭',
    region: 'Asia',
    processingTime: '3 days',
    processingTimeAr: '3 أيام',
    processingTimeFr: '3 jours',
    validity: '3 months',
    validityAr: '3 أشهر',
    maxStay: '30 days',
    maxStayAr: '30 يوم',
    price: 30,
    currency: 'USD',
    requirements: [
      'Valid passport',
      'Photo',
      'Email address'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'صورة',
      'بريد إلكتروني'
    ],
    requirementsFr: [
      'Passeport valide',
      'Photo',
      'Adresse e-mail'
    ],
    url: 'https://www.evisa.gov.kh',
    featured: false,
    rating: 4.4,
    reviews: 5670,
    description: 'Ancient temples of Angkor Wat and rich history.',
    descriptionAr: 'معابد أنغكور وات القديمة وتاريخ غني.',
    descriptionFr: 'Temples anciens d\'Angkor Wat et histoire riche.'
  },
  {
    id: 'georgia',
    name: 'Georgia',
    nameAr: 'جيورجيا',
    nameFr: 'Géorgie',
    flag: '🇬🇪',
    region: 'Europe',
    processingTime: '5 days',
    processingTimeAr: '5 أيام',
    processingTimeFr: '5 jours',
    validity: '120 days',
    validityAr: '120 يوم',
    maxStay: '90 days',
    maxStayAr: '90 يوم',
    price: 20,
    currency: 'USD',
    requirements: [
      'Valid passport',
      'Photo',
      'Email address'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'صورة',
      'بريد إلكتروني'
    ],
    requirementsFr: [
      'Passeport valide',
      'Photo',
      'Adresse e-mail'
    ],
    url: 'https://www.evisa.gov.ge',
    featured: false,
    rating: 4.7,
    reviews: 3450,
    description: 'Caucasus mountains, wine country, and warm hospitality.',
    descriptionAr: 'جبال القوقاز وبلد النبيذ والضيافة الدافئة.',
    descriptionFr: 'Montagnes du Caucase, pays du vin et hospitalité chaleureuse.'
  },
  {
    id: 'azerbaijan',
    name: 'Azerbaijan',
    nameAr: 'أذربيجان',
    nameFr: 'Azerbaïdjan',
    flag: '🇦🇿',
    region: 'Europe/Asia',
    processingTime: '3 days',
    processingTimeAr: '3 أيام',
    processingTimeFr: '3 jours',
    validity: '90 days',
    validityAr: '90 يوم',
    maxStay: '30 days',
    maxStayAr: '30 يوم',
    price: 25,
    currency: 'USD',
    requirements: [
      'Valid passport',
      'Photo',
      'Email address'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'صورة',
      'بريد إلكتروني'
    ],
    requirementsFr: [
      'Passeport valide',
      'Photo',
      'Adresse e-mail'
    ],
    url: 'https://www.evisa.gov.az',
    featured: false,
    rating: 4.3,
    reviews: 2890,
    description: 'Ancient Silk Road meets modern Baku. Fire Temple and Caspian coast.',
    descriptionAr: 'طريق الحرير القديم يلتقي بباكو الحديثة. معبد النار وساحل بحر قزوين.',
    descriptionFr: 'La Route de la Soie ancienne rencontre Bakou moderne. Temple du Feu et côte caspienne.'
  },
  {
    id: 'bahrain',
    name: 'Bahrain',
    nameAr: 'البحرين',
    nameFr: 'Bahreïn',
    flag: '🇧🇭',
    region: 'Middle East',
    processingTime: '3 days',
    processingTimeAr: '3 أيام',
    processingTimeFr: '3 jours',
    validity: '90 days',
    validityAr: '90 يوم',
    maxStay: '14 days',
    maxStayAr: '14 يوم',
    price: 25,
    currency: 'BHD',
    requirements: [
      'Valid passport',
      'Photo',
      'Hotel booking',
      'Return ticket'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'صورة',
      'حجز فندق',
      'تذكرة عودة'
    ],
    requirementsFr: [
      'Passeport valide',
      'Photo',
      'Réservation hôtel',
      'Billet de retour'
    ],
    url: 'https://www.evisa.gov.bh',
    featured: false,
    rating: 4.1,
    reviews: 1560,
    description: 'Modern Gulf hub with ancient history and luxury shopping.',
    descriptionAr: 'مركز خليجي حديث مع تاريخ قديم وتسوق فاخر.',
    descriptionFr: 'Centre du Golfe moderne avec une histoire ancienne et du shopping de luxe.'
  },
  {
    id: 'qatar',
    name: 'Qatar',
    nameAr: 'قطر',
    nameFr: 'Qatar',
    flag: '🇶🇦',
    region: 'Middle East',
    processingTime: '3-5 days',
    processingTimeAr: '3-5 أيام',
    processingTimeFr: '3-5 jours',
    validity: '30 days',
    validityAr: '30 يوم',
    maxStay: '30 days',
    maxStayAr: '30 يوم',
    price: 100,
    currency: 'USD',
    requirements: [
      'Valid passport',
      'Photo',
      'Hotel booking',
      'Return ticket',
      'Health insurance'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'صورة',
      'حجز فندق',
      'تذكرة عودة',
      'تأمين صحي'
    ],
    requirementsFr: [
      'Passeport valide',
      'Photo',
      'Réservation hôtel',
      'Billet de retour',
      'Assurance santé'
    ],
    url: 'https://www.qatarvisas.com',
    featured: false,
    rating: 4.4,
    reviews: 4230,
    description: 'Luxury experiences, desert safaris, and world-class museums.',
    descriptionAr: 'تجارب فاخرة ورحلات صحراء ومتاحف عالمية.',
    descriptionFr: 'Expériences de luxe, safaris dans le désert et musées de classe mondiale.'
  },
  {
    id: 'uganda',
    name: 'Uganda',
    nameAr: 'أوغندا',
    nameFr: 'Ouganda',
    flag: '🇺🇬',
    region: 'Africa',
    processingTime: '2-3 days',
    processingTimeAr: '2-3 أيام',
    processingTimeFr: '2-3 jours',
    validity: '90 days',
    validityAr: '90 يوم',
    maxStay: '90 days',
    maxStayAr: '90 يوم',
    price: 50,
    currency: 'USD',
    requirements: [
      'Valid passport',
      'Yellow fever certificate',
      'Photo',
      'Return ticket'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'شهادة الحمى الصفراء',
      'صورة',
      'تذكرة عودة'
    ],
    requirementsFr: [
      'Passeport valide',
      'Certificat fièvre jaune',
      'Photo',
      'Billet de retour'
    ],
    url: 'https://visas.immigration.go.ug',
    featured: false,
    rating: 4.2,
    reviews: 2340,
    description: 'Home of mountain gorillas. Incredible wildlife experiences.',
    descriptionAr: 'موطن غوريلات الجبال. تجارب حياة برية لا تصدق.',
    descriptionFr: 'Maison des gorilles de montagne. Expériences de faune incroyables.'
  },
  {
    id: 'zimbabwe',
    name: 'Zimbabwe',
    nameAr: 'زيمبابوي',
    nameFr: 'Zimbabwe',
    flag: '🇿🇼',
    region: 'Africa',
    processingTime: '5 days',
    processingTimeAr: '5 أيام',
    processingTimeFr: '5 jours',
    validity: '90 days',
    validityAr: '90 يوم',
    maxStay: '90 days',
    maxStayAr: '90 يوم',
    price: 30,
    currency: 'USD',
    requirements: [
      'Valid passport',
      'Photo',
      'Return ticket',
      'Yellow fever certificate'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'صورة',
      'تذكرة عودة',
      'شهادة الحمى الصفراء'
    ],
    requirementsFr: [
      'Passeport valide',
      'Photo',
      'Billet de retour',
      'Certificat fièvre jaune'
    ],
    url: 'https://evisa.zimimmigration.gov.zw',
    featured: false,
    rating: 4.0,
    reviews: 1780,
    description: 'Victoria Falls and incredible safari adventures await.',
    descriptionAr: 'شلالات فيكتوريا ومغامرات سفاري لا تصدق.',
    descriptionFr: 'Chutes Victoria et safaris incroyables vous attendent.'
  },
  {
    id: 'saudi',
    name: 'Saudi Arabia',
    nameAr: 'المملكة العربية السعودية',
    nameFr: 'Arabie Saoudite',
    flag: '🇸🇦',
    region: 'Middle East',
    processingTime: '24-72 hours',
    processingTimeAr: '24-72 ساعة',
    processingTimeFr: '24-72 heures',
    validity: '90 days',
    validityAr: '90 يوم',
    maxStay: '90 days',
    maxStayAr: '90 يوم',
    price: 117,
    currency: 'USD',
    requirements: [
      'Valid passport',
      'Photo',
      'Email address',
      'Credit card',
      'Travel itinerary'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'صورة',
      'بريد إلكتروني',
      'بطاقة ائتمان',
      'خط سير الرحلة'
    ],
    requirementsFr: [
      'Passeport valide',
      'Photo',
      'Adresse e-mail',
      'Carte de crédit',
      'Itinéraire'
    ],
    url: 'https://visa.visitsaudi.com',
    featured: true,
    rating: 4.6,
    reviews: 12450,
    description: 'Visit Mecca & Medina for Umrah or explore modern Saudi cities.',
    descriptionAr: 'زيارة مكة والمدينة للعمرة أو استكشاف المدن السعودية الحديثة.',
    descriptionFr: 'Visitez La Mecque et Médine pour Omra ou explorez les villes modernes.'
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    nameAr: 'ماليزيا',
    nameFr: 'Malaisie',
    flag: '🇲🇾',
    region: 'Asia',
    processingTime: '48 hours',
    processingTimeAr: '48 ساعة',
    processingTimeFr: '48 heures',
    validity: '90 days',
    validityAr: '90 يوم',
    maxStay: '30 days',
    maxStayAr: '30 يوم',
    price: 28,
    currency: 'USD',
    requirements: [
      'Valid passport',
      'Photo',
      'Return ticket',
      'Hotel booking',
      'Email address'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'صورة',
      'تذكرة عودة',
      'حجز فندق',
      'بريد إلكتروني'
    ],
    requirementsFr: [
      'Passeport valide',
      'Photo',
      'Billet de retour',
      'Réservation hôtel',
      'Adresse e-mail'
    ],
    url: 'https://www.immigration.gov.my',
    featured: false,
    rating: 4.7,
    reviews: 8920,
    description: 'Modern cities, beautiful beaches, and amazing food culture.',
    descriptionAr: 'مدن حديثة وشواطئ جميلة وثقافة طعام مذهلة.',
    descriptionFr: 'Villes modernes, belles plages et culture culinaire incroyable.'
  },
  {
    id: 'maldives',
    name: 'Maldives',
    nameAr: 'جزر المالديف',
    nameFr: 'Maldives',
    flag: '🇲🇻',
    region: 'Asia',
    processingTime: '1-3 days',
    processingTimeAr: '1-3 أيام',
    processingTimeFr: '1-3 jours',
    validity: '30 days',
    validityAr: '30 يوم',
    maxStay: '30 days',
    maxStayAr: '30 يوم',
    price: 30,
    currency: 'USD',
    requirements: [
      'Valid passport',
      'Photo',
      'Hotel booking confirmation',
      'Email address'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'صورة',
      'تأكيد حجز الفندق',
      'بريد إلكتروني'
    ],
    requirementsFr: [
      'Passeport valide',
      'Photo',
      'Confirmation réservation hôtel',
      'Adresse e-mail'
    ],
    url: 'https://evisa.immigration.gov.mv',
    featured: false,
    rating: 4.9,
    reviews: 6540,
    description: 'Paradise islands with overwater villas and crystal clear waters.',
    descriptionAr: 'جزر فردوسية مع فيلات مائية وشواطئ رملية بيضاء.',
    descriptionFr: 'Îles de paradis avec villas sur l\'eau et eaux cristallines.'
  },
  {
    id: 'oman',
    name: 'Oman',
    nameAr: 'سلطنة عُمان',
    nameFr: 'Oman',
    flag: '🇴🇲',
    region: 'Middle East',
    processingTime: '3-5 days',
    processingTimeAr: '3-5 أيام',
    processingTimeFr: '3-5 jours',
    validity: '30 days',
    validityAr: '30 يوم',
    maxStay: '30 days',
    maxStayAr: '30 يوم',
    price: 50,
    currency: 'OMR',
    requirements: [
      'Valid passport',
      'Photo',
      'Hotel booking',
      'Return ticket',
      'Travel insurance'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'صورة',
      'حجز فندق',
      'تذكرة عودة',
      'تأمين سفر'
    ],
    requirementsFr: [
      'Passeport valide',
      'Photo',
      'Réservation hôtel',
      'Billet de retour',
      'Assurance voyage'
    ],
    url: 'https://evisa.rop.gov.om',
    featured: false,
    rating: 4.5,
    reviews: 4230,
    description: 'Ancient forts, stunning deserts, and traditional Omani culture.',
    descriptionAr: 'قلاع قديمة وصحارٍ خلابة وثقافة عمانية تقليدية.',
    descriptionFr: 'Fortifications anciennes, déserts époustouflants et culture omanaise.'
  },
  {
    id: 'srilanka',
    name: 'Sri Lanka',
    nameAr: 'سريلانكا',
    nameFr: 'Sri Lanka',
    flag: '🇱🇰',
    region: 'Asia',
    processingTime: '24-48 hours',
    processingTimeAr: '24-48 ساعة',
    processingTimeFr: '24-48 heures',
    validity: '30 days',
    validityAr: '30 يوم',
    maxStay: '30 days',
    maxStayAr: '30 يوم',
    price: 35,
    currency: 'USD',
    requirements: [
      'Valid passport',
      'Photo',
      'Return ticket',
      'Hotel booking',
      'Email address'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'صورة',
      'تذكرة عودة',
      'حجز فندق',
      'بريد إلكتروني'
    ],
    requirementsFr: [
      'Passeport valide',
      'Photo',
      'Billet de retour',
      'Réservation hôtel',
      'Adresse e-mail'
    ],
    url: 'https://eta.gov.lk',
    featured: false,
    rating: 4.4,
    reviews: 5670,
    description: 'Ancient temples, tea plantations, and beautiful beaches.',
    descriptionAr: 'معابد قديمة ومزارع شاي وشواطئ جميلة.',
    descriptionFr: 'Temples anciens, plantations de thé et belles plages.'
  },
  {
    id: 'nepal',
    name: 'Nepal',
    nameAr: 'نيبال',
    nameFr: 'Népal',
    flag: '🇳🇵',
    region: 'Asia',
    processingTime: '24 hours',
    processingTimeAr: '24 ساعة',
    processingTimeFr: '24 heures',
    validity: '150 days',
    validityAr: '150 يوم',
    maxStay: '150 days',
    maxStayAr: '150 يوم',
    price: 30,
    currency: 'USD',
    requirements: [
      'Valid passport',
      'Photo',
      'Hotel booking',
      'Travel itinerary'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'صورة',
      'حجز فندق',
      'خط سير الرحلة'
    ],
    requirementsFr: [
      'Passeport valide',
      'Photo',
      'Réservation hôtel',
      'Itinéraire'
    ],
    url: 'https://nepaliport.immigration.gov.np',
    featured: false,
    rating: 4.3,
    reviews: 3450,
    description: 'Himalayan adventures, ancient temples, and spiritual experiences.',
    descriptionAr: 'مغامرات الهيمالايا ومعابد قديمة وتجارب روحية.',
    descriptionFr: 'Aventures himalayennes, temples anciens et expériences spirituelles.'
  },
  {
    id: 'ethiopia',
    name: 'Ethiopia',
    nameAr: 'إثيوبيا',
    nameFr: 'Éthiopie',
    flag: '🇪🇹',
    region: 'Africa',
    processingTime: '3 days',
    processingTimeAr: '3 أيام',
    processingTimeFr: '3 jours',
    validity: '90 days',
    validityAr: '90 يوم',
    maxStay: '90 days',
    maxStayAr: '90 يوم',
    price: 82,
    currency: 'USD',
    requirements: [
      'Valid passport',
      'Photo',
      'Yellow fever certificate',
      'Return ticket',
      'Hotel booking'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'صورة',
      'شهادة الحمى الصفراء',
      'تذكرة عودة',
      'حجز فندق'
    ],
    requirementsFr: [
      'Passeport valide',
      'Photo',
      'Certificat fièvre jaune',
      'Billet de retour',
      'Réservation hôtel'
    ],
    url: 'https://www.evisa.gov.et',
    featured: false,
    rating: 4.1,
    reviews: 2890,
    description: 'Ancient rock-hewn churches, Simien Mountains, and unique culture.',
    descriptionAr: 'كنائس منحوتة في الصخور وجبال سيمين وثقافة فريدة.',
    descriptionFr: 'Églises taillées dans la roche, montagnes Simien et culture unique.'
  },
  {
    id: 'benin',
    name: 'Benin',
    nameAr: 'بنين',
    nameFr: 'Bénin',
    flag: '🇧🇯',
    region: 'Africa',
    processingTime: '3-5 days',
    processingTimeAr: '3-5 أيام',
    processingTimeFr: '3-5 jours',
    validity: '30 days',
    validityAr: '30 يوم',
    maxStay: '30 days',
    maxStayAr: '30 يوم',
    price: 50,
    currency: 'USD',
    requirements: [
      'Valid passport',
      'Photo',
      'Yellow fever certificate',
      'Return ticket',
      'Hotel booking'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'صورة',
      'شهادة الحمى الصفراء',
      'تذكرة عودة',
      'حجز فندق'
    ],
    requirementsFr: [
      'Passeport valide',
      'Photo',
      'Certificat fièvre jaune',
      'Billet de retour',
      'Réservation hôtel'
    ],
    url: 'https://evisa.bj',
    featured: false,
    rating: 4.0,
    reviews: 1230,
    description: 'Voodoo culture, ancient kingdoms, and beautiful nature parks.',
    descriptionAr: 'ثقافة الفودو وممالك قديمة وحدائق طبيعية جميلة.',
    descriptionFr: 'Culture vaudou, royaumes anciens et beaux parcs naturels.'
  },
  {
    id: 'vietnam',
    name: 'Vietnam',
    nameAr: 'فيتنام',
    nameFr: 'Viêt Nam',
    flag: '🇻🇳',
    region: 'Asia',
    processingTime: '3-5 days',
    processingTimeAr: '3-5 أيام',
    processingTimeFr: '3-5 jours',
    validity: '30 days',
    validityAr: '30 يوم',
    maxStay: '30 days',
    maxStayAr: '30 يوم',
    price: 25,
    currency: 'USD',
    requirements: [
      'Valid passport',
      'Photo',
      'Return ticket',
      'Hotel booking',
      'Email address'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'صورة',
      'تذكرة عودة',
      'حجز فندق',
      'بريد إلكتروني'
    ],
    requirementsFr: [
      'Passeport valide',
      'Photo',
      'Billet de retour',
      'Réservation hôtel',
      'Adresse e-mail'
    ],
    url: 'https://evisa.xuatnhapcanh.gov.vn',
    featured: false,
    rating: 4.4,
    reviews: 7890,
    description: 'Ancient temples, stunning landscapes, and delicious cuisine.',
    descriptionAr: 'معابد قديمة ومناظر طبيعية خلابة ومطبخ لذيذ.',
    descriptionFr: 'Temples anciens, paysages époustouflants et cuisine délicieuse.'
  },
  {
    id: 'cameron',
    name: 'Cameroon',
    nameAr: 'الكاميرون',
    nameFr: 'Cameroun',
    flag: '🇨🇲',
    region: 'Africa',
    processingTime: '3-5 days',
    processingTimeAr: '3-5 أيام',
    processingTimeFr: '3-5 jours',
    validity: '90 days',
    validityAr: '90 يوم',
    maxStay: '90 days',
    maxStayAr: '90 يوم',
    price: 60,
    currency: 'USD',
    requirements: [
      'Valid passport',
      'Photo',
      'Yellow fever certificate',
      'Return ticket',
      'Hotel booking'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'صورة',
      'شهادة الحمى الصفراء',
      'تذكرة عودة',
      'حجز فندق'
    ],
    requirementsFr: [
      'Passeport valide',
      'Photo',
      'Certificat fièvre jaune',
      'Billet de retour',
      'Réservation hôtel'
    ],
    url: 'https://evisa.cm',
    featured: false,
    rating: 3.9,
    reviews: 890,
    description: 'Mount Cameroon, wildlife reserves, and diverse landscapes.',
    descriptionAr: 'جبل الكاميرون ومحميات الحياة البرية ومناظر طبيعية متنوعة.',
    descriptionFr: 'Mont Cameroun, réserves naturelles et paysages divers.'
  },
  {
    id: 'ivorycoast',
    name: 'Ivory Coast',
    nameAr: 'ساحل العاج',
    nameFr: "Côte d'Ivoire",
    flag: '🇨🇮',
    region: 'Africa',
    processingTime: '3 days',
    processingTimeAr: '3 أيام',
    processingTimeFr: '3 jours',
    validity: '90 days',
    validityAr: '90 يوم',
    maxStay: '90 days',
    maxStayAr: '90 يوم',
    price: 65,
    currency: 'USD',
    requirements: [
      'Valid passport',
      'Photo',
      'Yellow fever certificate',
      'Return ticket',
      'Hotel booking'
    ],
    requirementsAr: [
      'جواز سفر صالح',
      'صورة',
      'شهادة الحمى الصفراء',
      'تذكرة عودة',
      'حجز فندق'
    ],
    requirementsFr: [
      'Passeport valide',
      'Photo',
      'Certificat fièvre jaune',
      'Billet de retour',
      'Réservation hôtel'
    ],
    url: 'https://snedai.apps.prurence.com',
    featured: false,
    rating: 4.1,
    reviews: 1560,
    description: 'West African culture, beautiful beaches, and vibrant cities.',
    descriptionAr: 'ثقافة غرب أفريقيا وشواطئ جميلة ومدن نابضة بالحياة.',
    descriptionFr: 'Culture ouest-africaine, belles plages et villes vibrantes.'
  }
]

export function EVisaHub() {
  const { t, language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRegion, setFilterRegion] = useState('all')
  const [selectedCountry, setSelectedCountry] = useState<EVisaCountry | null>(null)
  const [showFeatured, setShowFeatured] = useState(false)

  const regions = ['all', 'Europe', 'Asia', 'Africa', 'Middle East']

  const filteredCountries = evisaCountries.filter(country => {
    const matchesSearch = 
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.nameAr.includes(searchQuery) ||
      country.nameFr.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = filterRegion === 'all' || country.region.includes(filterRegion)
    return matchesSearch && matchesRegion
  })

  const featuredCountries = evisaCountries.filter(c => c.featured)
  const stats = {
    totalCountries: evisaCountries.length,
    avgRating: 4.5,
    totalApplications: 85000,
    successRate: 98
  }

  const getCountryName = (country: EVisaCountry) => {
    if (language === 'ar') return country.nameAr
    if (language === 'fr') return country.nameFr
    return country.name
  }

  const getRequirements = (country: EVisaCountry) => {
    if (language === 'ar') return country.requirementsAr
    if (language === 'fr') return country.requirementsFr
    return country.requirements
  }

  const getDescription = (country: EVisaCountry) => {
    if (language === 'ar') return country.descriptionAr
    if (language === 'fr') return country.descriptionFr
    return country.description
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
            <Globe className="text-neon-cyan animate-pulse" size={20} />
            <span className="text-neon-cyan text-sm font-medium">E-Visa Portal</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">{t('evisaHub')}</span>
          </h1>
          <p className="text-white/60">{t('evisaHubDesc')}</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-ai mb-6"
        >
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <Globe2 className="mx-auto mb-1 text-neon-cyan" size={20} />
              <p className="text-xl font-bold text-neon-cyan">{stats.totalCountries}</p>
              <p className="text-xs text-white/50">{language === 'ar' ? 'دولة' : language === 'fr' ? 'pays' : 'Countries'}</p>
            </div>
            <div className="text-center">
              <Star className="mx-auto mb-1 text-amber-400" size={20} />
              <p className="text-xl font-bold text-amber-400">{stats.avgRating}</p>
              <p className="text-xs text-white/50">{language === 'ar' ? 'تقييم' : language === 'fr' ? 'note' : 'Rating'}</p>
            </div>
            <div className="text-center">
              <FileText className="mx-auto mb-1 text-neon-purple" size={20} />
              <p className="text-xl font-bold text-neon-purple">{(stats.totalApplications / 1000).toFixed(0)}K</p>
              <p className="text-xs text-white/50">{language === 'ar' ? 'طلب' : language === 'fr' ? 'demandes' : 'Applied'}</p>
            </div>
            <div className="text-center">
              <Shield className="mx-auto mb-1 text-emerald-400" size={20} />
              <p className="text-xl font-bold text-emerald-400">{stats.successRate}%</p>
              <p className="text-xs text-white/50">{language === 'ar' ? 'نجاح' : language === 'fr' ? 'réussite' : 'Success'}</p>
            </div>
          </div>
        </motion.div>

        {/* Search & Filter */}
        <div className="mb-6 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'ابحث عن دولة...' : language === 'fr' ? 'Rechercher un pays...' : 'Search for a country...'}
              className="input-field pl-12"
            />
          </div>

          {/* Region Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setFilterRegion(region)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                  filterRegion === region 
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50' 
                    : 'bg-white/5 text-white/60'
                )}
              >
                {region === 'all' 
                  ? (language === 'ar' ? 'الكل' : language === 'fr' ? 'Tous' : 'All')
                  : region}
              </button>
            ))}
          </div>
        </div>

        {/* Featured */}
        {featuredCountries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold flex items-center gap-2">
                <Sparkles className="text-amber-400" size={18} />
                {language === 'ar' ? 'الأكثر شعبية' : language === 'fr' ? 'Les plus populaires' : 'Most Popular'}
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {featuredCountries.map((country) => (
                <motion.button
                  key={country.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCountry(country)}
                  className="glass-card-hover p-4 text-center relative overflow-hidden"
                >
                  <span className="text-3xl block mb-2">{country.flag}</span>
                  <p className="font-bold text-sm">{getCountryName(country)}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star className="text-amber-400" size={10} />
                    <span className="text-xs text-white/50">{country.rating}</span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="badge badge-gold py-0.5 px-1.5 text-[10px]">Popular</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Countries */}
        <div>
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Globe className="text-neon-cyan" size={18} />
            {language === 'ar' ? 'جميع دول التأشيرة الإلكترونية' : language === 'fr' ? 'Tous les e-Visas' : 'All E-Visa Countries'}
            <span className="text-white/50 text-sm font-normal">({filteredCountries.length})</span>
          </h3>
          
          <div className="space-y-3">
            {filteredCountries.map((country, index) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card-hover p-4"
                onClick={() => setSelectedCountry(country)}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{country.flag}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold">{getCountryName(country)}</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="text-amber-400" size={12} />
                          <span className="text-sm font-medium">{country.rating}</span>
                        </div>
                        <span className="text-neon-cyan font-bold">
                          ${country.price}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-white/50 mb-2">{country.region}</p>
                    <p className="text-sm text-white/70 line-clamp-2">{getDescription(country)}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-white/50">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{language === 'ar' ? country.processingTimeAr : language === 'fr' ? country.processingTimeFr : country.processingTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{language === 'ar' ? country.maxStayAr : country.maxStay}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="text-white/30" size={20} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Country Detail Modal */}
        <AnimatePresence>
          {selectedCountry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
              onClick={() => setSelectedCountry(null)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="glass-card-elevated w-full max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-start gap-4">
                    <span className="text-5xl">{selectedCountry.flag}</span>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">{getCountryName(selectedCountry)}</h3>
                      <p className="text-white/50">{selectedCountry.region}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="text-amber-400" size={14} />
                          <span className="font-medium">{selectedCountry.rating}</span>
                        </div>
                        <span className="text-white/30">•</span>
                        <span className="text-sm text-white/50">{selectedCountry.reviews.toLocaleString()} {language === 'ar' ? 'مراجعة' : language === 'fr' ? 'avis' : 'reviews'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="glass-card p-3 text-center">
                      <Clock className="mx-auto mb-1 text-neon-cyan" size={18} />
                      <p className="text-xs text-white/50">{language === 'ar' ? 'المعالجة' : language === 'fr' ? 'Délai' : 'Processing'}</p>
                      <p className="text-sm font-bold">{language === 'ar' ? selectedCountry.processingTimeAr : language === 'fr' ? selectedCountry.processingTimeFr : selectedCountry.processingTime}</p>
                    </div>
                    <div className="glass-card p-3 text-center">
                      <Calendar className="mx-auto mb-1 text-neon-purple" size={18} />
                      <p className="text-xs text-white/50">{language === 'ar' ? 'الصلاحية' : language === 'fr' ? 'Validité' : 'Validity'}</p>
                      <p className="text-sm font-bold">{language === 'ar' ? selectedCountry.validityAr : selectedCountry.validity}</p>
                    </div>
                    <div className="glass-card p-3 text-center">
                      <Home className="mx-auto mb-1 text-emerald-400" size={18} />
                      <p className="text-xs text-white/50">{language === 'ar' ? 'الإقامة' : language === 'fr' ? 'Séjour' : 'Max Stay'}</p>
                      <p className="text-sm font-bold">{language === 'ar' ? selectedCountry.maxStayAr : selectedCountry.maxStay}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-white/70">{getDescription(selectedCountry)}</p>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <FileText className="text-neon-cyan" size={16} />
                      {language === 'ar' ? 'المتطلبات' : language === 'fr' ? 'Exigences' : 'Requirements'}
                    </h4>
                    <ul className="space-y-2">
                      {getRequirements(selectedCountry).map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="text-emerald-400 mt-0.5 flex-shrink-0" size={16} />
                          <span className="text-white/70">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price */}
                  <div className="bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/50">{language === 'ar' ? 'سعر التقديم' : language === 'fr' ? 'Frais de demande' : 'Application Fee'}</p>
                        <p className="text-3xl font-black text-neon-cyan">
                          ${selectedCountry.price}
                          <span className="text-sm text-white/50 font-normal"> {selectedCountry.currency}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white/50">{language === 'ar' ? 'وقت المعالجة' : language === 'fr' ? 'Délai' : 'Processing Time'}</p>
                        <p className="text-sm font-medium">
                          {language === 'ar' ? selectedCountry.processingTimeAr : language === 'fr' ? selectedCountry.processingTimeFr : selectedCountry.processingTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AI Tip */}
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Sparkles className="text-amber-400 flex-shrink-0" size={20} />
                      <div>
                        <p className="font-bold text-sm text-amber-400 mb-1">
                          {language === 'ar' ? 'نصيحة الذكاء الاصطناعي' : language === 'fr' ? "Conseil de l'IA" : 'AI Tip'}
                        </p>
                        <p className="text-sm text-white/70">
                          {language === 'ar' 
                            ? 'تأكد من أن جواز سفرك صالح لمدة 6 أشهر على الأقل من تاريخ السفر. قدّم قبل 2-3 أسابيع من رحلتك.'
                            : language === 'fr'
                            ? "Assurez-vous que votre passeport est valide pendant au moins 6 mois à compter de la date de voyage. Soumettez 2-3 semaines avant votre voyage."
                            : 'Ensure your passport is valid for at least 6 months from your travel date. Submit 2-3 weeks before your trip.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <a
                    href={selectedCountry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={18} />
                    {language === 'ar' ? 'قدم الآن على الموقع الرسمي' : language === 'fr' ? 'Postuler maintenant' : 'Apply Now on Official Website'}
                    <ArrowUpRight size={16} />
                  </a>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedCountry(null)}
                    className="w-full py-3 text-center text-white/50 hover:text-white transition-colors"
                  >
                    {language === 'ar' ? 'إغلاق' : language === 'fr' ? 'Fermer' : 'Close'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default EVisaHub
