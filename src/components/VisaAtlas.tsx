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
  flag: string
  continent: string
  visaType: 'free' | 'visa_on_arrival' | 'e_visa' | 'visa_required' | 'refused'
  requirements: string[]
  requirementsAr: string[]
  processingTime: string
  approvalRate: number
  price: number
  currency: string
}

const countries: Country[] = [
  {
    id: 'morocco',
    name: 'Morocco',
    nameAr: 'المغرب',
    flag: '🇲🇦',
    continent: 'Africa',
    visaType: 'free',
    requirements: ['Valid passport', 'Return ticket', 'Hotel booking'],
    requirementsAr: ['جواز سفر ساري', 'تذكرة عودة', 'حجز فندق'],
    processingTime: 'N/A',
    approvalRate: 95,
    price: 0,
    currency: 'DZD'
  },
  {
    id: 'tunisia',
    name: 'Tunisia',
    nameAr: 'تونس',
    flag: '🇹🇳',
    continent: 'Africa',
    visaType: 'free',
    requirements: ['Valid passport', 'Hotel booking', 'Return ticket'],
    requirementsAr: ['جواز سفر ساري', 'حجز فندق', 'تذكرة عودة'],
    processingTime: 'N/A',
    approvalRate: 92,
    price: 0,
    currency: 'DZD'
  },
  {
    id: 'turkey',
    name: 'Turkey',
    nameAr: 'تركيا',
    flag: '🇹🇷',
    continent: 'Asia',
    visaType: 'e_visa',
    requirements: ['E-Visa online', 'Valid passport', 'Return ticket'],
    requirementsAr: ['تأشيرة إلكترونية', 'جواز سفر ساري', 'تذكرة عودة'],
    processingTime: '24-48h',
    approvalRate: 85,
    price: 5000,
    currency: 'USD'
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    nameAr: 'ماليزيا',
    flag: '🇲🇾',
    continent: 'Asia',
    visaType: 'visa_on_arrival',
    requirements: ['Valid passport (6 months)', 'Return ticket', 'Hotel booking', 'Sufficient funds'],
    requirementsAr: ['جواز سفر (6 أشهر)', 'تذكرة عودة', 'حجز فندق', 'أموال كافية'],
    processingTime: 'On arrival',
    approvalRate: 90,
    price: 0,
    currency: 'MYR'
  },
  {
    id: 'maldives',
    name: 'Maldives',
    nameAr: 'جزر المالديف',
    flag: '🇲🇻',
    continent: 'Asia',
    visaType: 'visa_on_arrival',
    requirements: ['Valid passport', 'Hotel booking', 'Return ticket'],
    requirementsAr: ['جواز سفر ساري', 'حجز فندق', 'تذكرة عودة'],
    processingTime: 'On arrival',
    approvalRate: 98,
    price: 0,
    currency: 'USD'
  },
  {
    id: 'georgia',
    name: 'Georgia',
    nameAr: 'جورجيا',
    flag: '🇬🇪',
    continent: 'Europe',
    visaType: 'free',
    requirements: ['Valid passport', 'Return ticket'],
    requirementsAr: ['جواز سفر ساري', 'تذكرة عودة'],
    processingTime: 'N/A',
    approvalRate: 95,
    price: 0,
    currency: 'GEL'
  },
  {
    id: 'france',
    name: 'France',
    nameAr: 'فرنسا',
    flag: '🇫🇷',
    continent: 'Europe',
    visaType: 'visa_required',
    requirements: ['Schengen visa', 'Bank statement', 'Insurance', 'Hotel booking', 'Employment letter'],
    requirementsAr: ['تأشيرة شنغن', 'كشف حساب', 'تأمين', 'حجز فندق', 'شهادة عمل'],
    processingTime: '10-15 days',
    approvalRate: 45,
    price: 8000,
    currency: 'EUR'
  },
  {
    id: 'germany',
    name: 'Germany',
    nameAr: 'ألمانيا',
    flag: '🇩🇪',
    continent: 'Europe',
    visaType: 'visa_required',
    requirements: ['Schengen visa', 'Detailed itinerary', 'Financial proof', 'Insurance'],
    requirementsAr: ['تأشيرة شنغن', 'برنامج مفصل', 'إثبات مالي', 'تأمين'],
    processingTime: '15-20 days',
    approvalRate: 40,
    price: 8000,
    currency: 'EUR'
  },
  {
    id: 'spain',
    name: 'Spain',
    nameAr: 'إسبانيا',
    flag: '🇪🇸',
    continent: 'Europe',
    visaType: 'visa_required',
    requirements: ['Schengen visa', 'Bank statement', 'Insurance', 'Hotel booking'],
    requirementsAr: ['تأشيرة شنغن', 'كشف حساب', 'تأمين', 'حجز فندق'],
    processingTime: '7-15 days',
    approvalRate: 50,
    price: 8000,
    currency: 'EUR'
  },
  {
    id: 'italy',
    name: 'Italy',
    nameAr: 'إيطاليا',
    flag: '🇮🇹',
    continent: 'Europe',
    visaType: 'visa_required',
    requirements: ['Schengen visa', 'Financial proof', 'Insurance', 'Invitation letter'],
    requirementsAr: ['تأشيرة شنغن', 'إثبات مالي', 'تأمين', 'خطاب دعوة'],
    processingTime: '15-20 days',
    approvalRate: 42,
    price: 8000,
    currency: 'EUR'
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    nameAr: 'بريطانيا',
    flag: '🇬🇧',
    continent: 'Europe',
    visaType: 'visa_required',
    requirements: ['UK visa', 'Bank statement (6 months)', 'Employment letter', 'Travel history'],
    requirementsAr: ['تأشيرة بريطانيا', 'كشف حساب (6 أشهر)', 'شهادة عمل', 'سجل سفر'],
    processingTime: '21 days',
    approvalRate: 30,
    price: 12000,
    currency: 'GBP'
  },
  {
    id: 'usa',
    name: 'United States',
    nameAr: 'أمريكا',
    flag: '🇺🇸',
    continent: 'North America',
    visaType: 'visa_required',
    requirements: ['DS-160 form', 'Interview', 'Bank statement', 'Photo', 'Insurance'],
    requirementsAr: ['نموذج DS-160', 'مقابلة', 'كشف حساب', 'صورة', 'تأمين'],
    processingTime: '30+ days',
    approvalRate: 25,
    price: 15000,
    currency: 'USD'
  },
  {
    id: 'canada',
    name: 'Canada',
    nameAr: 'كندا',
    flag: '🇨🇦',
    continent: 'North America',
    visaType: 'visa_required',
    requirements: ['Visa application', 'Biometrics', 'Bank statement', 'Employment letter'],
    requirementsAr: ['طلب تأشيرة', 'بصمات', 'كشف حساب', 'شهادة عمل'],
    processingTime: '28+ days',
    approvalRate: 28,
    price: 10000,
    currency: 'CAD'
  },
  {
    id: 'uae',
    name: 'UAE',
    nameAr: 'الإمارات',
    flag: '🇦🇪',
    continent: 'Asia',
    visaType: 'visa_on_arrival',
    requirements: ['Valid passport', 'Return ticket', 'Hotel booking', 'Insurance'],
    requirementsAr: ['جواز سفر ساري', 'تذكرة عودة', 'حجز فندق', 'تأمين'],
    processingTime: 'On arrival',
    approvalRate: 75,
    price: 100,
    currency: 'AED'
  },
  {
    id: 'japan',
    name: 'Japan',
    nameAr: 'اليابان',
    flag: '🇯🇵',
    continent: 'Asia',
    visaType: 'visa_required',
    requirements: ['Visa application', 'Bank statement (1 year)', 'Employment letter', 'Itinerary'],
    requirementsAr: ['طلب تأشيرة', 'كشف حساب (سنة)', 'شهادة عمل', 'برنامج الرحلة'],
    processingTime: '10 days',
    approvalRate: 35,
    price: 3000,
    currency: 'JPY'
  },
]

const continents = ['All', 'Africa', 'Europe', 'Asia', 'North America', 'South America']
const visaFilters = [
  { id: 'all', name: 'الكل', nameEn: 'All', icon: Globe },
  { id: 'free', name: 'بدون تأشيرة', nameEn: 'Visa Free', icon: CheckCircle },
  { id: 'visa_on_arrival', name: 'تأشيرة عند الوصول', nameEn: 'On Arrival', icon: Clock },
  { id: 'e_visa', name: 'تأشيرة إلكترونية', nameEn: 'E-Visa', icon: Globe },
  { id: 'visa_required', name: 'تأشيرة مطلوبة', nameEn: 'Visa Required', icon: AlertTriangle },
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
                         c.nameAr.includes(searchQuery)
    return matchesContinent && matchesFilter && matchesSearch
  })

  const getVisaStatusInfo = (type: Country['visaType']) => {
    switch (type) {
      case 'free':
        return { color: 'text-green-400', bg: 'bg-green-500/20', label: 'بدون تأشيرة', labelEn: 'Visa Free', icon: CheckCircle }
      case 'visa_on_arrival':
        return { color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'عند الوصول', labelEn: 'On Arrival', icon: Clock }
      case 'e_visa':
        return { color: 'text-purple-400', bg: 'bg-purple-500/20', label: 'إلكترونية', labelEn: 'E-Visa', icon: Globe }
      case 'visa_required':
        return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'مطلوبة', labelEn: 'Visa Required', icon: AlertTriangle }
      case 'refused':
        return { color: 'text-red-400', bg: 'bg-red-500/20', label: 'مرفوض', labelEn: 'Refused', icon: XCircle }
    }
  }

  const getApprovalColor = (rate: number) => {
    if (rate >= 80) return 'text-green-400'
    if (rate >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">أطلس التأشيرات</h2>
          <p className="text-white/60 text-sm">استكشف متطلبات التأشيرة للدول</p>
        </motion.div>

        <div className="relative mb-4">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث عن دولة...' : 'Search country...'}
            className="w-full input-field pr-10"
          />
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {continents.map((continent) => (
            <button
              key={continent}
              onClick={() => setSelectedContinent(continent)}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                selectedContinent === continent 
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50' 
                  : 'bg-white/5 text-white/60'
              )}
            >
              {continent}
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
              {filter.name}
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
                    <h4 className="font-bold">{country.nameAr}</h4>
                    <span className="text-xs text-white/50">{country.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs', status.bg, status.color)}>
                      {status.label}
                    </span>
                    {country.visaType === 'visa_required' && (
                      <span className={cn('text-xs font-medium', getApprovalColor(country.approvalRate))}>
                        {country.approvalRate}% قبول
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
            <p className="text-white/60">لا توجد نتائج</p>
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
                  <h3 className="text-2xl font-bold">{selectedCountry.nameAr}</h3>
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
                  <span className="text-white/60">نوع التأشيرة</span>
                  {(() => {
                    const status = getVisaStatusInfo(selectedCountry.visaType)
                    return (
                      <span className={cn('px-3 py-1 rounded-full text-sm font-medium', status.bg, status.color)}>
                        {status.label}
                      </span>
                    )
                  })()}
                </div>
                
                {selectedCountry.visaType === 'visa_required' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">معدل القبول</span>
                      <span className={cn('font-bold text-lg', getApprovalColor(selectedCountry.approvalRate))}>
                        {selectedCountry.approvalRate}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">وقت المعالجة</span>
                      <span>{selectedCountry.processingTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">تكلفة التأشيرة</span>
                      <span>{selectedCountry.price.toLocaleString()} {selectedCountry.currency}</span>
                    </div>
                  </>
                )}
                
                <div>
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Info size={16} className="text-neon-cyan" />
                    {language === 'ar' ? 'المتطلبات' : 'Requirements'}
                  </h4>
                  <ul className="space-y-1">
                    {selectedCountry.requirementsAr.map((req, i) => (
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
                      ? 'ابدأ التقييم' 
                      : 'تحقق من المتطلبات'}
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
          <h4 className="font-bold mb-3">ملاحظة</h4>
          <p className="text-xs text-white/60">
            المعلومات قابلة للتغيير. تحقق دائماً من الموقع الرسمي للسفارة قبل التقديم.
            معدلات القبول تقريبية بناءً على بياناتنا.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default VisaAtlas
