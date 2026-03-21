'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Search, Plane, CheckCircle, AlertCircle, Clock, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Destination {
  name: string
  nameAr: string
  flag: string
  requirement: 'free' | 'evisa' | 'voa' | 'visa'
  stay: string
  processing: string
}

const destinations: Destination[] = [
  { name: 'Turkey', nameAr: 'تركيا', flag: '🇹🇷', requirement: 'evisa', stay: '90 يوم', processing: '24 ساعة' },
  { name: 'Malaysia', nameAr: 'ماليزيا', flag: '🇲🇾', requirement: 'free', stay: '90 يوم', processing: '-' },
  { name: 'Maldives', nameAr: 'جزر المالديف', flag: '🇲🇻', requirement: 'voa', stay: '30 يوم', processing: 'عند الوصول' },
  { name: 'Georgia', nameAr: 'جورجيا', flag: '🇬🇪', requirement: 'free', stay: '365 يوم', processing: '-' },
  { name: 'Mauritania', nameAr: 'موريتانيا', flag: '🇲🇷', requirement: 'free', stay: '90 يوم', processing: '-' },
  { name: 'Tunisia', nameAr: 'تونس', flag: '🇹🇳', requirement: 'free', stay: '90 يوم', processing: '-' },
  { name: 'Morocco', nameAr: 'المغرب', flag: '🇲🇦', requirement: 'free', stay: '90 يوم', processing: '-' },
  { name: 'Senegal', nameAr: 'السنغال', flag: '🇸🇳', requirement: 'free', stay: '90 يوم', processing: '-' },
  { name: 'France', nameAr: 'فرنسا', flag: '🇫🇷', requirement: 'visa', stay: '90 يوم', processing: '2-3 أسابيع' },
  { name: 'Spain', nameAr: 'إسبانيا', flag: '🇪🇸', requirement: 'visa', stay: '90 يوم', processing: '2-4 أسابيع' },
  { name: 'Germany', nameAr: 'ألمانيا', flag: '🇩🇪', requirement: 'visa', stay: '90 يوم', processing: '2-3 أسابيع' },
  { name: 'Italy', nameAr: 'إيطاليا', flag: '🇮🇹', requirement: 'visa', stay: '90 يوم', processing: '2-4 أسابيع' },
  { name: 'UK', nameAr: 'المملكة المتحدة', flag: '🇬🇧', requirement: 'visa', stay: '6 أشهر', processing: '3 أسابيع' },
  { name: 'USA', nameAr: 'الولايات المتحدة', flag: '🇺🇸', requirement: 'visa', stay: '90 يوم', processing: 'متغير' },
  { name: 'Canada', nameAr: 'كندا', flag: '🇨🇦', requirement: 'visa', stay: '6 أشهر', processing: '4-6 أسابيع' },
  { name: 'UAE', nameAr: 'الإمارات', flag: '🇦🇪', requirement: 'evisa', stay: '30 يوم', processing: '2-3 أيام' },
]

export function VisaFreeMap() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<Destination | null>(null)

  const filteredDestinations = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nameAr.includes(searchQuery)
  )

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
        return 'بدون تأشيرة'
      case 'evisa':
        return 'تأشيرة إلكترونية'
      case 'voa':
        return 'تأشيرة عند الوصول'
      case 'visa':
        return 'تأشيرة مطلوبة'
      default:
        return req
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">وجهات بدون تأشيرة</h2>
          <p className="text-white/60 text-sm">استكشف العالم - جواز السفر الجزائري</p>
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
            placeholder="ابحث عن دولة..."
            className="input-field pr-12"
          />
        </motion.div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: 'بدون تأشيرة', count: destinations.filter(d => d.requirement === 'free').length, color: 'green' },
            { label: 'إلكترونية', count: destinations.filter(d => d.requirement === 'evisa').length, color: 'cyan' },
            { label: 'عند الوصول', count: destinations.filter(d => d.requirement === 'voa').length, color: 'yellow' },
            { label: 'تأشيرة', count: destinations.filter(d => d.requirement === 'visa').length, color: 'red' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-3 text-center">
              <p className="text-2xl font-bold gradient-text">{stat.count}</p>
              <p className="text-xs text-white/50">{stat.label}</p>
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
                  <h3 className="font-bold">{dest.nameAr}</h3>
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
                <h3 className="font-bold text-lg">{selectedCountry.nameAr}</h3>
                <p className="text-white/50">{selectedCountry.name}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-white/5 rounded-xl">
                <p className="text-xs text-white/50 mb-1">مدة الإقامة</p>
                <p className="font-medium">{selectedCountry.stay}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl">
                <p className="text-xs text-white/50 mb-1">وقت المعالجة</p>
                <p className="font-medium">{selectedCountry.processing}</p>
              </div>
            </div>
            <div className={cn('text-center py-2 rounded-xl mb-4', getRequirementStyle(selectedCountry.requirement))}>
              {getRequirementLabel(selectedCountry.requirement)}
            </div>
            <div className="flex gap-3">
              <button className="flex-1 glass-card-hover py-3 rounded-xl font-medium">
                التفاصيل
              </button>
              <button className="flex-1 neon-button py-3 rounded-xl font-medium flex items-center justify-center gap-2">
                <Plane size={18} />
                احجز رحلتك
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
