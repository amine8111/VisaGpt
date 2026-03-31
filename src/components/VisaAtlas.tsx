'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Globe, MapPin, CheckCircle, Clock, AlertTriangle,
  XCircle, ChevronRight, Filter, Search, Info
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

interface Country {
  id: string
  name: string
  nameAr: string
  nameFr: string
  flag: string
  continent: string
  visaType: 'free' | 'visa_on_arrival' | 'e_visa' | 'visa_required' | 'refused'
  requirements: string[]
  requirementsAr: string[]
  requirementsFr: string[]
  processingTime: string
  processingTimeAr: string
  processingTimeFr: string
  approvalRate: number
  price: number
  currency: string
  duration?: string
}

const countries: Country[] = [
  {
    id: 'tunisia',
    name: 'Tunisia',
    nameAr: 'تونس',
    nameFr: 'Tunisie',
    flag: '🇹🇳',
    continent: 'Africa',
    visaType: 'free',
    requirements: ['Valid passport (6 months)', 'Return ticket', 'Hotel booking', 'Proof of funds'],
    requirementsAr: ['جواز سفر ساري (6 أشهر)', 'تذكرة عودة', 'حجز فندق', 'إثبات مالي'],
    requirementsFr: ['Passeport valide (6 mois)', 'Billet retour', 'Réservation hôtel', 'Justificatif de fonds'],
    processingTime: 'N/A',
    processingTimeAr: 'غير مطلوب',
    processingTimeFr: 'Non requis',
    approvalRate: 95,
    price: 0,
    currency: 'TND',
    duration: '90 days'
  },
  {
    id: 'morocco',
    name: 'Morocco',
    nameAr: 'المغرب',
    nameFr: 'Maroc',
    flag: '🇲🇦',
    continent: 'Africa',
    visaType: 'free',
    requirements: ['Valid passport (6 months)', 'Return ticket', 'Hotel booking'],
    requirementsAr: ['جواز سفر ساري (6 أشهر)', 'تذكرة عودة', 'حجز فندق'],
    requirementsFr: ['Passeport valide (6 mois)', 'Billet retour', 'Réservation hôtel'],
    processingTime: 'N/A',
    processingTimeAr: 'غير مطلوب',
    processingTimeFr: 'Non requis',
    approvalRate: 95,
    price: 0,
    currency: 'MAD',
    duration: '90 days'
  },
  {
    id: 'mali',
    name: 'Mali',
    nameAr: 'مالي',
    nameFr: 'Mali',
    flag: '🇲🇱',
    continent: 'Africa',
    visaType: 'free',
    requirements: ['Valid passport', 'Return ticket'],
    requirementsAr: ['جواز سفر ساري', 'تذكرة عودة'],
    requirementsFr: ['Passeport valide', 'Billet retour'],
    processingTime: 'N/A',
    processingTimeAr: 'غير مطلوب',
    processingTimeFr: 'Non requis',
    approvalRate: 90,
    price: 0,
    currency: 'XOF',
    duration: '30 days'
  },
  {
    id: 'mauritania',
    name: 'Mauritania',
    nameAr: 'موريتانيا',
    nameFr: 'Mauritanie',
    flag: '🇲🇷',
    continent: 'Africa',
    visaType: 'free',
    requirements: ['Valid passport', 'Return ticket'],
    requirementsAr: ['جواز سفر ساري', 'تذكرة عودة'],
    requirementsFr: ['Passeport valide', 'Billet retour'],
    processingTime: 'N/A',
    processingTimeAr: 'غير مطلوب',
    processingTimeFr: 'Non requis',
    approvalRate: 90,
    price: 0,
    currency: 'MRU',
    duration: '90 days'
  },
  {
    id: 'libya',
    name: 'Libya',
    nameAr: 'ليبيا',
    nameFr: 'Libye',
    flag: '🇱🇾',
    continent: 'Africa',
    visaType: 'free',
    requirements: ['Valid passport', 'Return ticket'],
    requirementsAr: ['جواز سفر ساري', 'تذكرة عودة'],
    requirementsFr: ['Passeport valide', 'Billet retour'],
    processingTime: 'N/A',
    processingTimeAr: 'غير مطلوب',
    processingTimeFr: 'Non requis',
    approvalRate: 85,
    price: 0,
    currency: 'LYD'
  },
  {
    id: 'benin',
    name: 'Benin',
    nameAr: 'السنغال',
    nameFr: 'Bénin',
    flag: '🇧🇯',
    continent: 'Africa',
    visaType: 'free',
    requirements: ['Valid passport', 'Return ticket', 'Yellow fever certificate'],
    requirementsAr: ['جواز سفر ساري', 'تذكرة عودة', 'شهادة الحمى الصفراء'],
    requirementsFr: ['Passeport valide', 'Billet retour', 'Certificat fièvre jaune'],
    processingTime: 'N/A',
    processingTimeAr: 'غير مطلوب',
    processingTimeFr: 'Non requis',
    approvalRate: 92,
    price: 0,
    currency: 'XOF',
    duration: '90 days'
  },
  {
    id: 'gambia',
    name: 'Gambia',
    nameAr: 'غامبيا',
    nameFr: 'Gambie',
    flag: '🇬🇲',
    continent: 'Africa',
    visaType: 'free',
    requirements: ['Valid passport', 'Return ticket', 'Yellow fever certificate'],
    requirementsAr: ['جواز سفر ساري', 'تذكرة عودة', 'شهادة الحمى الصفراء'],
    requirementsFr: ['Passeport valide', 'Billet retour', 'Certificat fièvre jaune'],
    processingTime: 'N/A',
    processingTimeAr: 'غير مطلوب',
    processingTimeFr: 'Non requis',
    approvalRate: 90,
    price: 0,
    currency: 'GMD',
    duration: '90 days'
  },
  {
    id: 'guinea',
    name: 'Guinea',
    nameAr: 'غينيا',
    nameFr: 'Guinée',
    flag: '🇬🇳',
    continent: 'Africa',
    visaType: 'free',
    requirements: ['Valid passport', 'Return ticket'],
    requirementsAr: ['جواز سفر ساري', 'تذكرة عودة'],
    requirementsFr: ['Passeport valide', 'Billet retour'],
    processingTime: 'N/A',
    processingTimeAr: 'غير مطلوب',
    processingTimeFr: 'Non requis',
    approvalRate: 85,
    price: 0,
    currency: 'GNF'
  },
  {
    id: 'kenya',
    name: 'Kenya',
    nameAr: 'كينيا',
    nameFr: 'Kenya',
    flag: '🇰🇪',
    continent: 'Africa',
    visaType: 'free',
    requirements: ['Valid passport (6 months)', 'Return ticket', 'Yellow fever certificate', 'Proof of funds'],
    requirementsAr: ['جواز سفر ساري (6 أشهر)', 'تذكرة عودة', 'شهادة الحمى الصفراء', 'إثبات مالي'],
    requirementsFr: ['Passeport valide (6 mois)', 'Billet retour', 'Certificat fièvre jaune', 'Justificatif de fonds'],
    processingTime: 'N/A',
    processingTimeAr: 'غير مطلوب',
    processingTimeFr: 'Non requis',
    approvalRate: 88,
    price: 0,
    currency: 'KES',
    duration: '60 days'
  },
  {
    id: 'rwanda',
    name: 'Rwanda',
    nameAr: 'رواندا',
    nameFr: 'Rwanda',
    flag: '🇷🇼',
    continent: 'Africa',
    visaType: 'free',
    requirements: ['Valid passport', 'Return ticket', 'Yellow fever certificate'],
    requirementsAr: ['جواز سفر ساري', 'تذكرة عودة', 'شهادة الحمى الصفراء'],
    requirementsFr: ['Passeport valide', 'Billet retour', 'Certificat fièvre jaune'],
    processingTime: 'N/A',
    processingTimeAr: 'غير مطلوب',
    processingTimeFr: 'Non requis',
    approvalRate: 92,
    price: 0,
    currency: 'RWF',
    duration: '30 days'
  },
  {
    id: 'angola',
    name: 'Angola',
    nameAr: 'أنغولا',
    nameFr: 'Angola',
    flag: '🇦🇴',
    continent: 'Africa',
    visaType: 'free',
    requirements: ['Valid passport', 'Return ticket', 'Yellow fever certificate'],
    requirementsAr: ['جواز سفر ساري', 'تذكرة عودة', 'شهادة الحمى الصفراء'],
    requirementsFr: ['Passeport valide', 'Billet retour', 'Certificat fièvre jaune'],
    processingTime: 'N/A',
    processingTimeAr: 'غير مطلوب',
    processingTimeFr: 'Non requis',
    approvalRate: 80,
    price: 0,
    currency: 'AOA',
    duration: '30 days'
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    nameAr: 'ماليزيا',
    nameFr: 'Malaisie',
    flag: '🇲🇾',
    continent: 'Asia',
    visaType: 'free',
    requirements: ['Valid passport (6 months)', 'Return ticket', 'Hotel booking', 'Proof of funds'],
    requirementsAr: ['جواز سفر ساري (6 أشهر)', 'تذكرة عودة', 'حجز فندق', 'إثبات مالي'],
    requirementsFr: ['Passeport valide (6 mois)', 'Billet retour', 'Réservation hôtel', 'Justificatif de fonds'],
    processingTime: 'N/A',
    processingTimeAr: 'غير مطلوب',
    processingTimeFr: 'Non requis',
    approvalRate: 95,
    price: 0,
    currency: 'MYR',
    duration: '90 days'
  },
  {
    id: 'hong_kong',
    name: 'Hong Kong',
    nameAr: 'هونغ كونغ',
    nameFr: 'Hong Kong',
    flag: '🇭🇰',
    continent: 'Asia',
    visaType: 'free',
    requirements: ['Valid passport (6 months)', 'Return ticket', 'Proof of funds'],
    requirementsAr: ['جواز سفر ساري (6 أشهر)', 'تذكرة عودة', 'إثبات مالي'],
    requirementsFr: ['Passeport valide (6 mois)', 'Billet retour', 'Justificatif de fonds'],
    processingTime: 'N/A',
    processingTimeAr: 'غير مطلوب',
    processingTimeFr: 'Non requis',
    approvalRate: 98,
    price: 0,
    currency: 'HKD',
    duration: '14 days'
  },
  {
    id: 'turkey',
    name: 'Turkey',
    nameAr: 'تركيا',
    nameFr: 'Turquie',
    flag: '🇹🇷',
    continent: 'Asia',
    visaType: 'visa_required',
    requirements: ['Visa application', 'Valid passport', 'Return ticket', 'Hotel booking', 'Financial proof'],
    requirementsAr: ['طلب تأشيرة', 'جواز سفر ساري', 'تذكرة عودة', 'حجز فندق', 'إثبات مالي'],
    requirementsFr: ['Demande de visa', 'Passeport valide', 'Billet retour', 'Réservation hôtel', 'Justificatif de fonds'],
    processingTime: 'Varies',
    processingTimeAr: 'متغير',
    processingTimeFr: 'Variable',
    approvalRate: 85,
    price: 5000,
    currency: 'USD'
  },
  {
    id: 'georgia',
    name: 'Georgia',
    nameAr: 'جورجيا',
    nameFr: 'Géorgie',
    flag: '🇬🇪',
    continent: 'Europe',
    visaType: 'visa_required',
    requirements: ['Visa application', 'Valid passport (6 months)', 'Return ticket', 'Financial proof', 'Travel insurance'],
    requirementsAr: ['طلب تأشيرة', 'جواز سفر ساري (6 أشهر)', 'تذكرة عودة', 'إثبات مالي', 'تأمين سفر'],
    requirementsFr: ['Demande de visa', 'Passeport valide (6 mois)', 'Billet retour', 'Justificatif de fonds', 'Assurance voyage'],
    processingTime: '5-10 days',
    processingTimeAr: '5-10 أيام',
    processingTimeFr: '5-10 jours',
    approvalRate: 75,
    price: 0,
    currency: 'GEL'
  },
  {
    id: 'uae',
    name: 'UAE',
    nameAr: 'الإمارات العربية المتحدة',
    nameFr: 'Émirats Arabes Unis',
    flag: '🇦🇪',
    continent: 'Asia',
    visaType: 'e_visa',
    requirements: ['E-Visa application online', 'Valid passport (6 months)', 'Return ticket', 'Hotel booking', 'Photo'],
    requirementsAr: ['طلب تأشيرة إلكترونية', 'جواز سفر ساري (6 أشهر)', 'تذكرة عودة', 'حجز فندق', 'صورة'],
    requirementsFr: ['Demande e-visa en ligne', 'Passeport valide (6 mois)', 'Billet retour', 'Réservation hôtel', 'Photo'],
    processingTime: '3-5 days',
    processingTimeAr: '3-5 أيام',
    processingTimeFr: '3-5 jours',
    approvalRate: 85,
    price: 350,
    currency: 'AED'
  },
  {
    id: 'maldives',
    name: 'Maldives',
    nameAr: 'جزر المالديف',
    nameFr: 'Maldives',
    flag: '🇲🇻',
    continent: 'Asia',
    visaType: 'visa_on_arrival',
    requirements: ['Valid passport (6 months)', 'Return ticket', 'Hotel booking', 'Proof of funds'],
    requirementsAr: ['جواز سفر ساري (6 أشهر)', 'تذكرة عودة', 'حجز فندق', 'إثبات مالي'],
    requirementsFr: ['Passeport valide (6 mois)', 'Billet retour', 'Réservation hôtel', 'Justificatif de fonds'],
    processingTime: 'On arrival',
    processingTimeAr: 'عند الوصول',
    processingTimeFr: 'À l\'arrivée',
    approvalRate: 98,
    price: 0,
    currency: 'USD',
    duration: '30 days'
  },
  {
    id: 'lebanon',
    name: 'Lebanon',
    nameAr: 'لبنان',
    nameFr: 'Liban',
    flag: '🇱🇧',
    continent: 'Asia',
    visaType: 'visa_on_arrival',
    requirements: ['Valid passport (6 months)', 'Return ticket', 'Hotel booking', 'Photo'],
    requirementsAr: ['جواز سفر ساري (6 أشهر)', 'تذكرة عودة', 'حجز فندق', 'صورة'],
    requirementsFr: ['Passeport valide (6 mois)', 'Billet retour', 'Réservation hôtel', 'Photo'],
    processingTime: 'On arrival',
    processingTimeAr: 'عند الوصول',
    processingTimeFr: 'À l\'arrivée',
    approvalRate: 85,
    price: 0,
    currency: 'LBP',
    duration: '30 days'
  },
  {
    id: 'jordan',
    name: 'Jordan',
    nameAr: 'الأردن',
    nameFr: 'Jordanie',
    flag: '🇯🇴',
    continent: 'Asia',
    visaType: 'visa_on_arrival',
    requirements: ['Valid passport (6 months)', 'Return ticket', 'Photo', 'Proof of funds'],
    requirementsAr: ['جواز سفر ساري (6 أشهر)', 'تذكرة عودة', 'صورة', 'إثبات مالي'],
    requirementsFr: ['Passeport valide (6 mois)', 'Billet retour', 'Photo', 'Justificatif de fonds'],
    processingTime: 'On arrival',
    processingTimeAr: 'عند الوصول',
    processingTimeFr: 'À l\'arrivée',
    approvalRate: 88,
    price: 60,
    currency: 'JOD',
    duration: '30 days'
  },
  {
    id: 'iran',
    name: 'Iran',
    nameAr: 'إيران',
    nameFr: 'Iran',
    flag: '🇮🇷',
    continent: 'Asia',
    visaType: 'visa_on_arrival',
    requirements: ['Valid passport', 'Return ticket', 'Photo', 'Visa fee'],
    requirementsAr: ['جواز سفر ساري', 'تذكرة عودة', 'صورة', 'رسوم التأشيرة'],
    requirementsFr: ['Passeport valide', 'Billet retour', 'Photo', 'Frais de visa'],
    processingTime: 'On arrival',
    processingTimeAr: 'عند الوصول',
    processingTimeFr: 'À l\'arrivée',
    approvalRate: 80,
    price: 100,
    currency: 'EUR',
    duration: '30 days'
  },
  {
    id: 'thailand',
    name: 'Thailand',
    nameAr: 'تايلاند',
    nameFr: 'Thaïlande',
    flag: '🇹🇭',
    continent: 'Asia',
    visaType: 'e_visa',
    requirements: ['E-Visa application', 'Valid passport (6 months)', 'Return ticket', 'Hotel booking'],
    requirementsAr: ['طلب تأشيرة إلكترونية', 'جواز سفر ساري (6 أشهر)', 'تذكرة عودة', 'حجز فندق'],
    requirementsFr: ['Demande e-visa', 'Passeport valide (6 mois)', 'Billet retour', 'Réservation hôtel'],
    processingTime: '3-7 days',
    processingTimeAr: '3-7 أيام',
    processingTimeFr: '3-7 jours',
    approvalRate: 90,
    price: 1500,
    currency: 'THB'
  },
  {
    id: 'india',
    name: 'India',
    nameAr: 'الهند',
    nameFr: 'Inde',
    flag: '🇮🇳',
    continent: 'Asia',
    visaType: 'e_visa',
    requirements: ['E-Visa application', 'Valid passport (6 months)', 'Return ticket', 'Photo', 'Financial proof'],
    requirementsAr: ['طلب تأشيرة إلكترونية', 'جواز سفر ساري (6 أشهر)', 'تذكرة عودة', 'صورة', 'إثبات مالي'],
    requirementsFr: ['Demande e-visa', 'Passeport valide (6 mois)', 'Billet retour', 'Photo', 'Justificatif de fonds'],
    processingTime: '3-5 days',
    processingTimeAr: '3-5 أيام',
    processingTimeFr: '3-5 jours',
    approvalRate: 85,
    price: 2500,
    currency: 'INR'
  },
  {
    id: 'vietnam',
    name: 'Vietnam',
    nameAr: 'فيتنام',
    nameFr: 'Vietnam',
    flag: '🇻🇳',
    continent: 'Asia',
    visaType: 'e_visa',
    requirements: ['E-Visa application', 'Valid passport (6 months)', 'Return ticket', 'Photo'],
    requirementsAr: ['طلب تأشيرة إلكترونية', 'جواز سفر ساري (6 أشهر)', 'تذكرة عودة', 'صورة'],
    requirementsFr: ['Demande e-visa', 'Passeport valide (6 mois)', 'Billet retour', 'Photo'],
    processingTime: '5-7 days',
    processingTimeAr: '5-7 أيام',
    processingTimeFr: '5-7 jours',
    approvalRate: 88,
    price: 1500,
    currency: 'VND',
    duration: '90 days'
  },
  {
    id: 'cambodia',
    name: 'Cambodia',
    nameAr: 'كمبوديا',
    nameFr: 'Cambodge',
    flag: '🇰🇭',
    continent: 'Asia',
    visaType: 'e_visa',
    requirements: ['E-Visa application', 'Valid passport (6 months)', 'Photo'],
    requirementsAr: ['طلب تأشيرة إلكترونية', 'جواز سفر ساري (6 أشهر)', 'صورة'],
    requirementsFr: ['Demande e-visa', 'Passeport valide (6 mois)', 'Photo'],
    processingTime: '3 days',
    processingTimeAr: '3 أيام',
    processingTimeFr: '3 jours',
    approvalRate: 95,
    price: 1200,
    currency: 'KHR',
    duration: '30 days'
  },
  {
    id: 'sri_lanka',
    name: 'Sri Lanka',
    nameAr: 'سريلانكا',
    nameFr: 'Sri Lanka',
    flag: '🇱🇰',
    continent: 'Asia',
    visaType: 'e_visa',
    requirements: ['ETA application', 'Valid passport', 'Return ticket', 'Photo'],
    requirementsAr: ['طلب ETA', 'جواز سفر ساري', 'تذكرة عودة', 'صورة'],
    requirementsFr: ['Demande ETA', 'Passeport valide', 'Billet retour', 'Photo'],
    processingTime: '1-2 days',
    processingTimeAr: '1-2 أيام',
    processingTimeFr: '1-2 jours',
    approvalRate: 90,
    price: 3500,
    currency: 'LKR',
    duration: '30 days'
  },
  {
    id: 'bahrain',
    name: 'Bahrain',
    nameAr: 'البحرين',
    nameFr: 'Bahreïn',
    flag: '🇧🇭',
    continent: 'Asia',
    visaType: 'e_visa',
    requirements: ['E-Visa application', 'Valid passport', 'Return ticket', 'Photo'],
    requirementsAr: ['طلب تأشيرة إلكترونية', 'جواز سفر ساري', 'تذكرة عودة', 'صورة'],
    requirementsFr: ['Demande e-visa', 'Passeport valide', 'Billet retour', 'Photo'],
    processingTime: '3-5 days',
    processingTimeAr: '3-5 أيام',
    processingTimeFr: '3-5 jours',
    approvalRate: 88,
    price: 85,
    currency: 'BHD'
  },
  {
    id: 'qatar',
    name: 'Qatar',
    nameAr: 'قطر',
    nameFr: 'Qatar',
    flag: '🇶🇦',
    continent: 'Asia',
    visaType: 'e_visa',
    requirements: ['E-Visa application', 'Valid passport', 'Return ticket', 'Hotel booking'],
    requirementsAr: ['طلب تأشيرة إلكترونية', 'جواز سفر ساري', 'تذكرة عودة', 'حجز فندق'],
    requirementsFr: ['Demande e-visa', 'Passeport valide', 'Billet retour', 'Réservation hôtel'],
    processingTime: '3-5 days',
    processingTimeAr: '3-5 أيام',
    processingTimeFr: '3-5 jours',
    approvalRate: 90,
    price: 100,
    currency: 'QAR'
  },
  {
    id: 'saudi_arabia',
    name: 'Saudi Arabia',
    nameAr: 'المملكة العربية السعودية',
    nameFr: 'Arabie Saoudite',
    flag: '🇸🇦',
    continent: 'Asia',
    visaType: 'e_visa',
    requirements: ['E-Visa application', 'Valid passport', 'Return ticket', 'Photo', 'Travel insurance'],
    requirementsAr: ['طلب تأشيرة إلكترونية', 'جواز سفر ساري', 'تذكرة عودة', 'صورة', 'تأمين سفر'],
    requirementsFr: ['Demande e-visa', 'Passeport valide', 'Billet retour', 'Photo', 'Assurance voyage'],
    processingTime: '24-48h',
    processingTimeAr: '24-48 ساعة',
    processingTimeFr: '24-48h',
    approvalRate: 92,
    price: 300,
    currency: 'SAR'
  },
  {
    id: 'oman',
    name: 'Oman',
    nameAr: 'عُمان',
    nameFr: 'Oman',
    flag: '🇴🇲',
    continent: 'Asia',
    visaType: 'e_visa',
    requirements: ['E-Visa application', 'Valid passport', 'Return ticket', 'Hotel booking'],
    requirementsAr: ['طلب تأشيرة إلكترونية', 'جواز سفر ساري', 'تذكرة عودة', 'حجز فندق'],
    requirementsFr: ['Demande e-visa', 'Passeport valide', 'Billet retour', 'Réservation hôtel'],
    processingTime: '3-5 days',
    processingTimeAr: '3-5 أيام',
    processingTimeFr: '3-5 jours',
    approvalRate: 88,
    price: 50,
    currency: 'OMR'
  },
  {
    id: 'azerbaijan',
    name: 'Azerbaijan',
    nameAr: 'أذربيجان',
    nameFr: 'Azerbaïdjan',
    flag: '🇦🇿',
    continent: 'Asia',
    visaType: 'e_visa',
    requirements: ['E-Visa application', 'Valid passport', 'Return ticket'],
    requirementsAr: ['طلب تأشيرة إلكترونية', 'جواز سفر ساري', 'تذكرة عودة'],
    requirementsFr: ['Demande e-visa', 'Passeport valide', 'Billet retour'],
    processingTime: '3 days',
    processingTimeAr: '3 أيام',
    processingTimeFr: '3 jours',
    approvalRate: 90,
    price: 35,
    currency: 'USD',
    duration: '30 days'
  },
  {
    id: 'france',
    name: 'France',
    nameAr: 'فرنسا',
    nameFr: 'France',
    flag: '🇫🇷',
    continent: 'Europe',
    visaType: 'visa_required',
    requirements: ['Schengen visa application', 'Bank statement (6 months)', 'Travel insurance', 'Hotel booking', 'Employment letter', 'Flight booking'],
    requirementsAr: ['طلب تأشيرة شنغن', 'كشف حساب (6 أشهر)', 'تأمين سفر', 'حجز فندق', 'شهادة عمل', 'حجز طيران'],
    requirementsFr: ['Demande visa Schengen', 'Relevé bancaire (6 mois)', 'Assurance voyage', 'Réservation hôtel', 'Attestation d\'emploi', 'Réservation vol'],
    processingTime: '10-15 days',
    processingTimeAr: '10-15 يوم',
    processingTimeFr: '10-15 jours',
    approvalRate: 45,
    price: 8000,
    currency: 'EUR'
  },
  {
    id: 'germany',
    name: 'Germany',
    nameAr: 'ألمانيا',
    nameFr: 'Allemagne',
    flag: '🇩🇪',
    continent: 'Europe',
    visaType: 'visa_required',
    requirements: ['Schengen visa application', 'Detailed itinerary', 'Financial proof (6 months)', 'Travel insurance', 'Employment letter'],
    requirementsAr: ['طلب تأشيرة شنغن', 'برنامج مفصل', 'إثبات مالي (6 أشهر)', 'تأمين سفر', 'شهادة عمل'],
    requirementsFr: ['Demande visa Schengen', 'Itinéraire détaillé', 'Justificatif de fonds (6 mois)', 'Assurance voyage', 'Attestation d\'emploi'],
    processingTime: '15-20 days',
    processingTimeAr: '15-20 يوم',
    processingTimeFr: '15-20 jours',
    approvalRate: 40,
    price: 8000,
    currency: 'EUR'
  },
  {
    id: 'spain',
    name: 'Spain',
    nameAr: 'إسبانيا',
    nameFr: 'Espagne',
    flag: '🇪🇸',
    continent: 'Europe',
    visaType: 'visa_required',
    requirements: ['Schengen visa application', 'Bank statement (6 months)', 'Travel insurance', 'Hotel booking', 'Flight booking'],
    requirementsAr: ['طلب تأشيرة شنغن', 'كشف حساب (6 أشهر)', 'تأمين سفر', 'حجز فندق', 'حجز طيران'],
    requirementsFr: ['Demande visa Schengen', 'Relevé bancaire (6 mois)', 'Assurance voyage', 'Réservation hôtel', 'Réservation vol'],
    processingTime: '7-15 days',
    processingTimeAr: '7-15 يوم',
    processingTimeFr: '7-15 jours',
    approvalRate: 50,
    price: 8000,
    currency: 'EUR'
  },
  {
    id: 'italy',
    name: 'Italy',
    nameAr: 'إيطاليا',
    nameFr: 'Italie',
    flag: '🇮🇹',
    continent: 'Europe',
    visaType: 'visa_required',
    requirements: ['Schengen visa application', 'Financial proof (6 months)', 'Travel insurance', 'Invitation letter', 'Flight booking'],
    requirementsAr: ['طلب تأشيرة شنغن', 'إثبات مالي (6 أشهر)', 'تأمين سفر', 'خطاب دعوة', 'حجز طيران'],
    requirementsFr: ['Demande visa Schengen', 'Justificatif de fonds (6 mois)', 'Assurance voyage', 'Lettre d\'invitation', 'Réservation vol'],
    processingTime: '15-20 days',
    processingTimeAr: '15-20 يوم',
    processingTimeFr: '15-20 jours',
    approvalRate: 42,
    price: 8000,
    currency: 'EUR'
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    nameAr: 'المملكة المتحدة',
    nameFr: 'Royaume-Uni',
    flag: '🇬🇧',
    continent: 'Europe',
    visaType: 'visa_required',
    requirements: ['UK visa application', 'Bank statement (6 months)', 'Employment letter', 'Travel history', 'Travel insurance'],
    requirementsAr: ['طلب تأشيرة بريطانيا', 'كشف حساب (6 أشهر)', 'شهادة عمل', 'سجل السفر', 'تأمين سفر'],
    requirementsFr: ['Demande visa UK', 'Relevé bancaire (6 mois)', 'Attestation d\'emploi', 'Historique de voyage', 'Assurance voyage'],
    processingTime: '21 days',
    processingTimeAr: '21 يوم',
    processingTimeFr: '21 jours',
    approvalRate: 30,
    price: 12000,
    currency: 'GBP'
  },
  {
    id: 'usa',
    name: 'United States',
    nameAr: 'الولايات المتحدة',
    nameFr: 'États-Unis',
    flag: '🇺🇸',
    continent: 'North America',
    visaType: 'visa_required',
    requirements: ['DS-160 form', 'Visa interview', 'Bank statement', 'Photo (2x2)', 'Travel insurance', 'Employment letter'],
    requirementsAr: ['نموذج DS-160', 'مقابلة التأشيرة', 'كشف حساب', 'صورة (2x2)', 'تأمين سفر', 'شهادة عمل'],
    requirementsFr: ['Formulaire DS-160', 'Entretien visa', 'Relevé bancaire', 'Photo (2x2)', 'Assurance voyage', 'Attestation d\'emploi'],
    processingTime: '30+ days',
    processingTimeAr: '30+ يوم',
    processingTimeFr: '30+ jours',
    approvalRate: 25,
    price: 15000,
    currency: 'USD'
  },
  {
    id: 'canada',
    name: 'Canada',
    nameAr: 'كندا',
    nameFr: 'Canada',
    flag: '🇨🇦',
    continent: 'North America',
    visaType: 'visa_required',
    requirements: ['Visa application', 'Biometrics', 'Bank statement (6 months)', 'Employment letter', 'Travel insurance'],
    requirementsAr: ['طلب التأشيرة', 'البصمات', 'كشف حساب (6 أشهر)', 'شهادة عمل', 'تأمين سفر'],
    requirementsFr: ['Demande de visa', 'Biométrie', 'Relevé bancaire (6 mois)', 'Attestation d\'emploi', 'Assurance voyage'],
    processingTime: '28+ days',
    processingTimeAr: '28+ يوم',
    processingTimeFr: '28+ jours',
    approvalRate: 28,
    price: 10000,
    currency: 'CAD'
  },
  {
    id: 'barbados',
    name: 'Barbados',
    nameAr: 'باربادوس',
    nameFr: 'Barbade',
    flag: '🇧🇧',
    continent: 'North America',
    visaType: 'free',
    requirements: ['Valid passport', 'Return ticket', 'Proof of funds'],
    requirementsAr: ['جواز سفر ساري', 'تذكرة عودة', 'إثبات مالي'],
    requirementsFr: ['Passeport valide', 'Billet retour', 'Justificatif de fonds'],
    processingTime: 'N/A',
    processingTimeAr: 'غير مطلوب',
    processingTimeFr: 'Non requis',
    approvalRate: 95,
    price: 0,
    currency: 'BBD',
    duration: '90 days'
  },
  {
    id: 'dominica',
    name: 'Dominica',
    nameAr: 'دومينيكا',
    nameFr: 'Dominique',
    flag: '🇩🇲',
    continent: 'North America',
    visaType: 'free',
    requirements: ['Valid passport', 'Return ticket', 'Proof of funds'],
    requirementsAr: ['جواز سفر ساري', 'تذكرة عودة', 'إثبات مالي'],
    requirementsFr: ['Passeport valide', 'Billet retour', 'Justificatif de fonds'],
    processingTime: 'N/A',
    processingTimeAr: 'غير مطلوب',
    processingTimeFr: 'Non requis',
    approvalRate: 95,
    price: 0,
    currency: 'XCD',
    duration: '21 days'
  },
  {
    id: 'ecuador',
    name: 'Ecuador',
    nameAr: 'الإكوادور',
    nameFr: 'Équateur',
    flag: '🇪🇨',
    continent: 'South America',
    visaType: 'free',
    requirements: ['Valid passport', 'Return ticket'],
    requirementsAr: ['جواز سفر ساري', 'تذكرة عودة'],
    requirementsFr: ['Passeport valide', 'Billet retour'],
    processingTime: 'N/A',
    processingTimeAr: 'غير مطلوب',
    processingTimeFr: 'Non requis',
    approvalRate: 95,
    price: 0,
    currency: 'USD',
    duration: '90 days'
  },
  {
    id: 'haiti',
    name: 'Haiti',
    nameAr: 'هايتي',
    nameFr: 'Haïti',
    flag: '🇭🇹',
    continent: 'North America',
    visaType: 'free',
    requirements: ['Valid passport', 'Return ticket'],
    requirementsAr: ['جواز سفر ساري', 'تذكرة عودة'],
    requirementsFr: ['Passeport valide', 'Billet retour'],
    processingTime: 'N/A',
    processingTimeAr: 'غير مطلوب',
    processingTimeFr: 'Non requis',
    approvalRate: 90,
    price: 0,
    currency: 'HTG',
    duration: '90 days'
  },
  {
    id: 'nicaragua',
    name: 'Nicaragua',
    nameAr: 'نيكاراغوا',
    nameFr: 'Nicaragua',
    flag: '🇳🇮',
    continent: 'North America',
    visaType: 'free',
    requirements: ['Valid passport', 'Return ticket', 'Proof of funds'],
    requirementsAr: ['جواز سفر ساري', 'تذكرة عودة', 'إثبات مالي'],
    requirementsFr: ['Passeport valide', 'Billet retour', 'Justificatif de fonds'],
    processingTime: 'N/A',
    processingTimeAr: 'غير مطلوب',
    processingTimeFr: 'Non requis',
    approvalRate: 92,
    price: 0,
    currency: 'NIO',
    duration: '90 days'
  },
  {
    id: 'micronesia',
    name: 'Micronesia',
    nameAr: 'ميكرونيزيا',
    nameFr: 'Micronésie',
    flag: '🇫🇲',
    continent: 'Oceania',
    visaType: 'free',
    requirements: ['Valid passport', 'Return ticket', 'Proof of funds'],
    requirementsAr: ['جواز سفر ساري', 'تذكرة عودة', 'إثبات مالي'],
    requirementsFr: ['Passeport valide', 'Billet retour', 'Justificatif de fonds'],
    processingTime: 'N/A',
    processingTimeAr: 'غير مطلوب',
    processingTimeFr: 'Non requis',
    approvalRate: 95,
    price: 0,
    currency: 'USD',
    duration: '30 days'
  },
  {
    id: 'samoa',
    name: 'Samoa',
    nameAr: 'ساموا',
    nameFr: 'Samoa',
    flag: '🇼🇸',
    continent: 'Oceania',
    visaType: 'visa_on_arrival',
    requirements: ['Valid passport', 'Return ticket', 'Proof of funds', 'Photo'],
    requirementsAr: ['جواز سفر ساري', 'تذكرة عودة', 'إثبات مالي', 'صورة'],
    requirementsFr: ['Passeport valide', 'Billet retour', 'Justificatif de fonds', 'Photo'],
    processingTime: 'On arrival',
    processingTimeAr: 'عند الوصول',
    processingTimeFr: 'À l\'arrivée',
    approvalRate: 90,
    price: 0,
    currency: 'WST',
    duration: '90 days'
  },
  {
    id: 'japan',
    name: 'Japan',
    nameAr: 'اليابان',
    nameFr: 'Japon',
    flag: '🇯🇵',
    continent: 'Asia',
    visaType: 'visa_required',
    requirements: ['Visa application', 'Bank statement (1 year)', 'Employment letter', 'Detailed itinerary', 'Travel insurance'],
    requirementsAr: ['طلب تأشيرة', 'كشف حساب (سنة)', 'شهادة عمل', 'برنامج مفصل', 'تأمين سفر'],
    requirementsFr: ['Demande de visa', 'Relevé bancaire (1 an)', 'Attestation d\'emploi', 'Itinéraire détaillé', 'Assurance voyage'],
    processingTime: '10 days',
    processingTimeAr: '10 أيام',
    processingTimeFr: '10 jours',
    approvalRate: 35,
    price: 3000,
    currency: 'JPY'
  },
]

const continents = [
  { id: 'All', name: 'الكل', nameEn: 'All', nameFr: 'Tous' },
  { id: 'Africa', name: 'أفريقيا', nameEn: 'Africa', nameFr: 'Afrique' },
  { id: 'Europe', name: 'أوروبا', nameEn: 'Europe', nameFr: 'Europe' },
  { id: 'Asia', name: 'آسيا', nameEn: 'Asia', nameFr: 'Asie' },
  { id: 'North America', name: 'أمريكا الشمالية', nameEn: 'North America', nameFr: 'Amérique du Nord' },
  { id: 'South America', name: 'أمريكا الجنوبية', nameEn: 'South America', nameFr: 'Amérique du Sud' },
  { id: 'Oceania', name: 'أوقيانوسيا', nameEn: 'Oceania', nameFr: 'Océanie' },
]

const visaFilters = [
  { id: 'all', name: 'الكل', nameEn: 'All', nameFr: 'Tous', icon: Globe },
  { id: 'free', name: 'بدون تأشيرة', nameEn: 'Visa Free', nameFr: 'Sans visa', icon: CheckCircle },
  { id: 'visa_on_arrival', name: 'تأشيرة عند الوصول', nameEn: 'On Arrival', nameFr: 'À l\'arrivée', icon: Clock },
  { id: 'e_visa', name: 'تأشيرة إلكترونية', nameEn: 'E-Visa', nameFr: 'E-Visa', icon: Globe },
  { id: 'visa_required', name: 'تأشيرة مطلوبة', nameEn: 'Visa Required', nameFr: 'Visa requis', icon: AlertTriangle },
]

export function VisaAtlas() {
  const { t, dir, language } = useLanguage()
  const [selectedContinent, setSelectedContinent] = useState('All')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCountries = countries.filter(c => {
    const matchesContinent = selectedContinent === 'All' || c.continent === selectedContinent
    const matchesFilter = selectedFilter === 'all' || c.visaType === selectedFilter
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.nameAr.includes(searchQuery) ||
                         c.nameFr.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesContinent && matchesFilter && matchesSearch
  })

  const getVisaStatusInfo = (type: Country['visaType']) => {
    switch (type) {
      case 'free':
        return { 
          color: 'text-green-400', 
          bg: 'bg-green-500/20', 
          label: 'بدون تأشيرة', 
          labelEn: 'Visa Free', 
          labelFr: 'Sans visa', 
          icon: CheckCircle 
        }
      case 'visa_on_arrival':
        return { 
          color: 'text-blue-400', 
          bg: 'bg-blue-500/20', 
          label: 'تأشيرة عند الوصول', 
          labelEn: 'On Arrival', 
          labelFr: 'À l\'arrivée', 
          icon: Clock 
        }
      case 'e_visa':
        return { 
          color: 'text-purple-400', 
          bg: 'bg-purple-500/20', 
          label: 'تأشيرة إلكترونية', 
          labelEn: 'E-Visa', 
          labelFr: 'E-Visa', 
          icon: Globe 
        }
      case 'visa_required':
        return { 
          color: 'text-yellow-400', 
          bg: 'bg-yellow-500/20', 
          label: 'تأشيرة مطلوبة', 
          labelEn: 'Visa Required', 
          labelFr: 'Visa requis', 
          icon: AlertTriangle 
        }
      case 'refused':
        return { 
          color: 'text-red-400', 
          bg: 'bg-red-500/20', 
          label: 'مرفوض', 
          labelEn: 'Refused', 
          labelFr: 'Refusé', 
          icon: XCircle 
        }
    }
  }

  const getApprovalColor = (rate: number) => {
    if (rate >= 80) return 'text-green-400'
    if (rate >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getLabel = (ar: string, en: string, fr: string) => {
    if (language === 'ar') return ar
    if (language === 'fr') return fr
    return en
  }

  const getCountryName = (country: Country) => {
    if (language === 'ar') return country.nameAr
    if (language === 'fr') return country.nameFr
    return country.name
  }

  const getRequirements = (country: Country) => {
    if (language === 'ar') return country.requirementsAr
    if (language === 'fr') return country.requirementsFr
    return country.requirements
  }

  const getProcessingTime = (country: Country) => {
    if (language === 'ar') return country.processingTimeAr
    if (language === 'fr') return country.processingTimeFr
    return country.processingTime
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">
            {getLabel('أطلس التأشيرات', 'Visa Atlas', 'Atlas des Visas')}
          </h2>
          <p className="text-white/60 text-sm">
            {getLabel('استكشف متطلبات التأشيرة للمواطنين الجزائريين', 'Explore visa requirements for Algerian citizens', 'Explorez les exigences de visa pour les citoyens algériens')}
          </p>
        </motion.div>

        <div className="relative mb-4">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getLabel('ابحث عن دولة...', 'Search country...', 'Rechercher un pays...')}
            className="w-full input-field pr-10"
          />
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {continents.map((continent) => (
            <button
              key={continent.id}
              onClick={() => setSelectedContinent(continent.id)}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                selectedContinent === continent.id 
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50' 
                  : 'bg-white/5 text-white/60'
              )}
            >
              {getLabel(continent.name, continent.nameEn, continent.nameFr)}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {visaFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1',
                selectedFilter === filter.id 
                  ? filter.id === 'free' ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                  : filter.id === 'visa_on_arrival' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                  : filter.id === 'e_visa' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                  : filter.id === 'visa_required' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                  : 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                  : 'bg-white/5 text-white/60'
              )}
            >
              <filter.icon size={12} />
              {getLabel(filter.name, filter.nameEn, filter.nameFr)}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filteredCountries.map((country, index) => {
            const status = getVisaStatusInfo(country.visaType)
            
            return (
              <motion.button
                key={country.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => setSelectedCountry(country)}
                className="w-full glass-card-hover p-4 flex items-center gap-4 text-right"
              >
                <span className="text-3xl">{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold">{getCountryName(country)}</h4>
                    <span className="text-xs text-white/50">{country.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs', status.bg, status.color)}>
                      {getLabel(status.label, status.labelEn, status.labelFr)}
                    </span>
                    {country.visaType === 'visa_required' && (
                      <span className={cn('text-xs font-medium', getApprovalColor(country.approvalRate))}>
                        {country.approvalRate}% {getLabel('قبول', 'approval', 'approbation')}
                      </span>
                    )}
                    {country.duration && (
                      <span className="text-xs text-white/40">
                        ({country.duration})
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight size={18} className="text-white/30" />
              </motion.button>
            )
          })}
        </div>

        {filteredCountries.length === 0 && (
          <div className="text-center py-12">
            <Globe className="mx-auto mb-4 text-white/30" size={48} />
            <p className="text-white/60">{getLabel('لا توجد نتائج', 'No results found', 'Aucun résultat trouvé')}</p>
          </div>
        )}

        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setSelectedCountry(null)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="glass-card w-full max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className="bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 p-6 text-center">
                  <span className="text-6xl mb-3 block">{selectedCountry.flag}</span>
                  <h3 className="text-2xl font-bold">{getCountryName(selectedCountry)}</h3>
                  <p className="text-white/60">{selectedCountry.name}</p>
                </div>
                
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center"
                >
                  <XCircle size={18} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">{getLabel('نوع التأشيرة', 'Visa Type', 'Type de visa')}</span>
                  {(() => {
                    const status = getVisaStatusInfo(selectedCountry.visaType)
                    return (
                      <span className={cn('px-3 py-1 rounded-full text-sm font-medium', status.bg, status.color)}>
                        {getLabel(status.label, status.labelEn, status.labelFr)}
                      </span>
                    )
                  })()}
                </div>

                {selectedCountry.duration && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">{getLabel('المدة المسموحة', 'Duration', 'Durée')}</span>
                    <span>{selectedCountry.duration}</span>
                  </div>
                )}
                
                {selectedCountry.visaType === 'visa_required' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">{getLabel('معدل القبول', 'Approval Rate', 'Taux d\'approbation')}</span>
                      <span className={cn('font-bold text-lg', getApprovalColor(selectedCountry.approvalRate))}>
                        {selectedCountry.approvalRate}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">{getLabel('وقت المعالجة', 'Processing Time', 'Délai de traitement')}</span>
                      <span>{getProcessingTime(selectedCountry)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">{getLabel('تكلفة التأشيرة', 'Visa Fee', 'Frais de visa')}</span>
                      <span>{selectedCountry.price > 0 ? `${selectedCountry.price.toLocaleString()} ${selectedCountry.currency}` : getLabel('مجاني', 'Free', 'Gratuit')}</span>
                    </div>
                  </>
                )}

                {(selectedCountry.visaType === 'e_visa' || selectedCountry.visaType === 'visa_on_arrival') && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">{getLabel('وقت المعالجة', 'Processing Time', 'Délai de traitement')}</span>
                      <span>{getProcessingTime(selectedCountry)}</span>
                    </div>
                    
                    {selectedCountry.price > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">{getLabel('التكلفة', 'Cost', 'Coût')}</span>
                        <span>{selectedCountry.price.toLocaleString()} {selectedCountry.currency}</span>
                      </div>
                    )}
                  </>
                )}
                
                <div>
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Info size={16} className="text-neon-cyan" />
                    {getLabel('المتطلبات', 'Requirements', 'Exigences')}
                  </h4>
                  <ul className="space-y-1">
                    {getRequirements(selectedCountry).map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                        <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedCountry(null)
                    }}
                    className="neon-button w-full"
                  >
                    {selectedCountry.visaType === 'visa_required' 
                      ? getLabel('ابدأ التقييم', 'Start Assessment', 'Commencer l\'évaluation')
                      : getLabel('تحقق من المتطلبات', 'Check Requirements', 'Vérifier les exigences')}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 glass-card p-4"
        >
          <h4 className="font-bold mb-2">{getLabel('ملاحظة مهمة', 'Important Notice', 'Avis important')}</h4>
          <p className="text-xs text-white/60">
            {getLabel(
              'المعلومات قابلة للتغيير. تحقق دائماً من الموقع الرسمي للسفارة قبل التقديم. معدلات القبول تقريبية بناءً على البيانات المتاحة.',
              'Information is subject to change. Always verify with the official embassy website before applying. Approval rates are approximate based on available data.',
              'Les informations sont susceptibles de changement. Vérifiez toujours sur le site officiel de l\'ambassade avant de postuler. Les taux d\'approbation sont approximatifs.'
            )}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default VisaAtlas
