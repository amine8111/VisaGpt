'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Search, Plane, CheckCircle, AlertCircle, Clock, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

interface Destination {
  name: string
  nameAr: string
  nameFr: string
  flag: string
  continent: string
  requirement: 'free' | 'evisa' | 'voa' | 'visa'
  stay: string
  stayAr: string
  stayFr: string
  processing: string
  processingAr: string
  processingFr: string
}

const destinations: Destination[] = [
  { name: 'Tunisia', nameAr: 'تونس', nameFr: 'Tunisie', flag: '🇹🇳', continent: 'Africa', requirement: 'free', stay: '90 days', stayAr: '90 يوم', stayFr: '90 jours', processing: 'N/A', processingAr: 'غير مطلوب', processingFr: 'Non requis' },
  { name: 'Morocco', nameAr: 'المغرب', nameFr: 'Maroc', flag: '🇲🇦', continent: 'Africa', requirement: 'free', stay: '90 days', stayAr: '90 يوم', stayFr: '90 jours', processing: 'N/A', processingAr: 'غير مطلوب', processingFr: 'Non requis' },
  { name: 'Mali', nameAr: 'مالي', nameFr: 'Mali', flag: '🇲🇱', continent: 'Africa', requirement: 'free', stay: '30 days', stayAr: '30 يوم', stayFr: '30 jours', processing: 'N/A', processingAr: 'غير مطلوب', processingFr: 'Non requis' },
  { name: 'Mauritania', nameAr: 'موريتانيا', nameFr: 'Mauritanie', flag: '🇲🇷', continent: 'Africa', requirement: 'free', stay: '90 days', stayAr: '90 يوم', stayFr: '90 jours', processing: 'N/A', processingAr: 'غير مطلوب', processingFr: 'Non requis' },
  { name: 'Libya', nameAr: 'ليبيا', nameFr: 'Libye', flag: '🇱🇾', continent: 'Africa', requirement: 'free', stay: 'Varies', stayAr: 'متغير', stayFr: 'Variable', processing: 'N/A', processingAr: 'غير مطلوب', processingFr: 'Non requis' },
  { name: 'Kenya', nameAr: 'كينيا', nameFr: 'Kenya', flag: '🇰🇪', continent: 'Africa', requirement: 'free', stay: '60 days', stayAr: '60 يوم', stayFr: '60 jours', processing: 'N/A', processingAr: 'غير مطلوب', processingFr: 'Non requis' },
  { name: 'Benin', nameAr: 'السنغال', nameFr: 'Bénin', flag: '🇧🇯', continent: 'Africa', requirement: 'free', stay: '90 days', stayAr: '90 يوم', stayFr: '90 jours', processing: 'N/A', processingAr: 'غير مطلوب', processingFr: 'Non requis' },
  { name: 'Gambia', nameAr: 'غامبيا', nameFr: 'Gambie', flag: '🇬🇲', continent: 'Africa', requirement: 'free', stay: '90 days', stayAr: '90 يوم', stayFr: '90 jours', processing: 'N/A', processingAr: 'غير مطلوب', processingFr: 'Non requis' },
  { name: 'Rwanda', nameAr: 'رواندا', nameFr: 'Rwanda', flag: '🇷🇼', continent: 'Africa', requirement: 'free', stay: '30 days', stayAr: '30 يوم', stayFr: '30 jours', processing: 'N/A', processingAr: 'غير مطلوب', processingFr: 'Non requis' },
  { name: 'Angola', nameAr: 'أنغولا', nameFr: 'Angola', flag: '🇦🇴', continent: 'Africa', requirement: 'free', stay: '30 days', stayAr: '30 يوم', stayFr: '30 jours', processing: 'N/A', processingAr: 'غير مطلوب', processingFr: 'Non requis' },
  { name: 'Malaysia', nameAr: 'ماليزيا', nameFr: 'Malaisie', flag: '🇲🇾', continent: 'Asia', requirement: 'free', stay: '90 days', stayAr: '90 يوم', stayFr: '90 jours', processing: 'N/A', processingAr: 'غير مطلوب', processingFr: 'Non requis' },
  { name: 'Hong Kong', nameAr: 'هونغ كونغ', nameFr: 'Hong Kong', flag: '🇭🇰', continent: 'Asia', requirement: 'free', stay: '14 days', stayAr: '14 يوم', stayFr: '14 jours', processing: 'N/A', processingAr: 'غير مطلوب', processingFr: 'Non requis' },
  { name: 'Maldives', nameAr: 'جزر المالديف', nameFr: 'Maldives', flag: '🇲🇻', continent: 'Asia', requirement: 'voa', stay: '30 days', stayAr: '30 يوم', stayFr: '30 jours', processing: 'On arrival', processingAr: 'عند الوصول', processingFr: 'À l\'arrivée' },
  { name: 'Lebanon', nameAr: 'لبنان', nameFr: 'Liban', flag: '🇱🇧', continent: 'Asia', requirement: 'voa', stay: '30 days', stayAr: '30 يوم', stayFr: '30 jours', processing: 'On arrival', processingAr: 'عند الوصول', processingFr: 'À l\'arrivée' },
  { name: 'Jordan', nameAr: 'الأردن', nameFr: 'Jordanie', flag: '🇯🇴', continent: 'Asia', requirement: 'voa', stay: '30 days', stayAr: '30 يوم', stayFr: '30 jours', processing: 'On arrival', processingAr: 'عند الوصول', processingFr: 'À l\'arrivée' },
  { name: 'Iran', nameAr: 'إيران', nameFr: 'Iran', flag: '🇮🇷', continent: 'Asia', requirement: 'voa', stay: '30 days', stayAr: '30 يوم', stayFr: '30 jours', processing: 'On arrival', processingAr: 'عند الوصول', processingFr: 'À l\'arrivée' },
  { name: 'Samoa', nameAr: 'ساموا', nameFr: 'Samoa', flag: '🇼🇸', continent: 'Oceania', requirement: 'voa', stay: '90 days', stayAr: '90 يوم', stayFr: '90 jours', processing: 'On arrival', processingAr: 'عند الوصول', processingFr: 'À l\'arrivée' },
  { name: 'UAE', nameAr: 'الإمارات', nameFr: 'Émirats Arabes Unis', flag: '🇦🇪', continent: 'Asia', requirement: 'evisa', stay: '30 days', stayAr: '30 يوم', stayFr: '30 jours', processing: '3-5 days', processingAr: '3-5 أيام', processingFr: '3-5 jours' },
  { name: 'Turkey', nameAr: 'تركيا', nameFr: 'Turquie', flag: '🇹🇷', continent: 'Asia', requirement: 'visa', stay: '90 days', stayAr: '90 يوم', stayFr: '90 jours', processing: 'Varies', processingAr: 'متغير', processingFr: 'Variable' },
  { name: 'Georgia', nameAr: 'جورجيا', nameFr: 'Géorgie', flag: '🇬🇪', continent: 'Europe', requirement: 'visa', stay: 'Varies', stayAr: 'متغير', stayFr: 'Variable', processing: '5-10 days', processingAr: '5-10 أيام', processingFr: '5-10 jours' },
  { name: 'France', nameAr: 'فرنسا', nameFr: 'France', flag: '🇫🇷', continent: 'Europe', requirement: 'visa', stay: '90 days', stayAr: '90 يوم', stayFr: '90 jours', processing: '10-15 days', processingAr: '10-15 يوم', processingFr: '10-15 jours' },
  { name: 'Spain', nameAr: 'إسبانيا', nameFr: 'Espagne', flag: '🇪🇸', continent: 'Europe', requirement: 'visa', stay: '90 days', stayAr: '90 يوم', stayFr: '90 jours', processing: '7-15 days', processingAr: '7-15 يوم', processingFr: '7-15 jours' },
  { name: 'Germany', nameAr: 'ألمانيا', nameFr: 'Allemagne', flag: '🇩🇪', continent: 'Europe', requirement: 'visa', stay: '90 days', stayAr: '90 يوم', stayFr: '90 jours', processing: '15-20 days', processingAr: '15-20 يوم', processingFr: '15-20 jours' },
  { name: 'Italy', nameAr: 'إيطاليا', nameFr: 'Italie', flag: '🇮🇹', continent: 'Europe', requirement: 'visa', stay: '90 days', stayAr: '90 يوم', stayFr: '90 jours', processing: '15-20 days', processingAr: '15-20 يوم', processingFr: '15-20 jours' },
  { name: 'UK', nameAr: 'المملكة المتحدة', nameFr: 'Royaume-Uni', flag: '🇬🇧', continent: 'Europe', requirement: 'visa', stay: '6 months', stayAr: '6 أشهر', stayFr: '6 mois', processing: '21 days', processingAr: '21 يوم', processingFr: '21 jours' },
  { name: 'USA', nameAr: 'الولايات المتحدة', nameFr: 'États-Unis', flag: '🇺🇸', continent: 'North America', requirement: 'visa', stay: '90 days', stayAr: '90 يوم', stayFr: '90 jours', processing: '30+ days', processingAr: '30+ يوم', processingFr: '30+ jours' },
  { name: 'Canada', nameAr: 'كندا', nameFr: 'Canada', flag: '🇨🇦', continent: 'North America', requirement: 'visa', stay: '6 months', stayAr: '6 أشهر', stayFr: '6 mois', processing: '28+ days', processingAr: '28+ يوم', processingFr: '28+ jours' },
  { name: 'Japan', nameAr: 'اليابان', nameFr: 'Japon', flag: '🇯🇵', continent: 'Asia', requirement: 'visa', stay: '15 days', stayAr: '15 يوم', stayFr: '15 jours', processing: '10 days', processingAr: '10 أيام', processingFr: '10 jours' },
  { name: 'Thailand', nameAr: 'تايلاند', nameFr: 'Thaïlande', flag: '🇹🇭', continent: 'Asia', requirement: 'evisa', stay: '60 days', stayAr: '60 يوم', stayFr: '60 jours', processing: '3-7 days', processingAr: '3-7 أيام', processingFr: '3-7 jours' },
  { name: 'India', nameAr: 'الهند', nameFr: 'Inde', flag: '🇮🇳', continent: 'Asia', requirement: 'evisa', stay: '30 days', stayAr: '30 يوم', stayFr: '30 jours', processing: '3-5 days', processingAr: '3-5 أيام', processingFr: '3-5 jours' },
  { name: 'Saudi Arabia', nameAr: 'السعودية', nameFr: 'Arabie Saoudite', flag: '🇸🇦', continent: 'Asia', requirement: 'evisa', stay: '90 days', stayAr: '90 يوم', stayFr: '90 jours', processing: '24-48h', processingAr: '24-48 ساعة', processingFr: '24-48h' },
  { name: 'Qatar', nameAr: 'قطر', nameFr: 'Qatar', flag: '🇶🇦', continent: 'Asia', requirement: 'evisa', stay: '30 days', stayAr: '30 يوم', stayFr: '30 jours', processing: '3-5 days', processingAr: '3-5 أيام', processingFr: '3-5 jours' },
  { name: 'Singapore', nameAr: 'سنغافورة', nameFr: 'Singapour', flag: '🇸🇬', continent: 'Asia', requirement: 'evisa', stay: '30 days', stayAr: '30 يوم', stayFr: '30 jours', processing: '3-5 days', processingAr: '3-5 أيام', processingFr: '3-5 jours' },
]

export function VisaFreeMap() {
  const { language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<Destination | null>(null)

  const filteredDestinations = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nameAr.includes(searchQuery) ||
      d.nameFr.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getLabel = (ar: string, en: string, fr: string) => {
    if (language === 'ar') return ar
    if (language === 'fr') return fr
    return en
  }

  const getName = (dest: Destination) => {
    if (language === 'ar') return dest.nameAr
    if (language === 'fr') return dest.nameFr
    return dest.name
  }

  const getStay = (dest: Destination) => {
    if (language === 'ar') return dest.stayAr
    if (language === 'fr') return dest.stayFr
    return dest.stay
  }

  const getProcessing = (dest: Destination) => {
    if (language === 'ar') return dest.processingAr
    if (language === 'fr') return dest.processingFr
    return dest.processing
  }

  const getRequirementStyle = (req: string) => {
    switch (req) {
      case 'free':
        return 'bg-green-500/20 text-green-400'
      case 'evisa':
        return 'bg-neon-cyan/20 text-neon-cyan'
      case 'voa':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'visa':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-white/10 text-white/60'
    }
  }

  const getRequirementLabel = (req: string) => {
    switch (req) {
      case 'free':
        return getLabel('بدون تأشيرة', 'Visa Free', 'Sans visa')
      case 'evisa':
        return getLabel('تأشيرة إلكترونية', 'E-Visa', 'E-Visa')
      case 'voa':
        return getLabel('تأشيرة عند الوصول', 'Visa on Arrival', 'À l\'arrivée')
      case 'visa':
        return getLabel('تأشيرة مطلوبة', 'Visa Required', 'Visa requis')
      default:
        return req
    }
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
            {getLabel('وجهات بدون تأشيرة', 'Visa-Free Destinations', 'Destinations sans visa')}
          </h2>
          <p className="text-white/60 text-sm">
            {getLabel('استكشف العالم - جواز السفر الجزائري', 'Explore the world - Algerian passport', 'Explorez le monde - Passeport algérien')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative mb-4"
        >
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getLabel('ابحث عن دولة...', 'Search country...', 'Rechercher un pays...')}
            className="input-field pr-12"
          />
        </motion.div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: 'بدون تأشيرة', labelEn: 'Visa Free', labelFr: 'Sans visa', count: destinations.filter(d => d.requirement === 'free').length, color: 'green' },
            { label: 'إلكترونية', labelEn: 'E-Visa', labelFr: 'E-Visa', count: destinations.filter(d => d.requirement === 'evisa').length, color: 'cyan' },
            { label: 'عند الوصول', labelEn: 'On Arrival', labelFr: 'À l\'arrivée', count: destinations.filter(d => d.requirement === 'voa').length, color: 'yellow' },
            { label: 'تأشيرة', labelEn: 'Visa Required', labelFr: 'Visa requis', count: destinations.filter(d => d.requirement === 'visa').length, color: 'red' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-3 text-center">
              <p className="text-2xl font-bold gradient-text">{stat.count}</p>
              <p className="text-xs text-white/50">{getLabel(stat.label, stat.labelEn, stat.labelFr)}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {filteredDestinations.map((dest, index) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.03 }}
              onClick={() => setSelectedCountry(dest)}
              className={cn(
                'glass-card p-4 cursor-pointer transition-all',
                selectedCountry?.name === dest.name && 'border-neon-cyan'
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{dest.flag}</span>
                <div className="flex-1">
                  <h3 className="font-bold">{getName(dest)}</h3>
                  <p className="text-sm text-white/50">{dest.name}</p>
                </div>
                <div className={cn('px-3 py-1 rounded-full text-xs font-medium', getRequirementStyle(dest.requirement))}>
                  {getRequirementLabel(dest.requirement)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-x-4 bottom-20 z-50 glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{selectedCountry.flag}</span>
              <div>
                <h3 className="font-bold text-lg">{getName(selectedCountry)}</h3>
                <p className="text-white/50">{selectedCountry.name}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-white/5 rounded-xl">
                <p className="text-xs text-white/50 mb-1">{getLabel('مدة الإقامة', 'Duration', 'Durée')}</p>
                <p className="font-medium">{getStay(selectedCountry)}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl">
                <p className="text-xs text-white/50 mb-1">{getLabel('وقت المعالجة', 'Processing', 'Délai')}</p>
                <p className="font-medium">{getProcessing(selectedCountry)}</p>
              </div>
            </div>
            <div className={cn('text-center py-2 rounded-xl mb-4', getRequirementStyle(selectedCountry.requirement))}>
              {getRequirementLabel(selectedCountry.requirement)}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedCountry(null)}
                className="flex-1 glass-card-hover py-3 rounded-xl font-medium"
              >
                {getLabel('إغلاق', 'Close', 'Fermer')}
              </button>
              <button className="flex-1 neon-button py-3 rounded-xl font-medium flex items-center justify-center gap-2">
                <Plane size={18} />
                {getLabel('احجز رحلتك', 'Book Now', 'Réservez')}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
