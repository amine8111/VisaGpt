'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Smartphone, Check, ExternalLink, Star, Globe } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { useLanguage } from './LanguageProvider'

interface SimPlan {
  id: string
  country: string
  countryCode: string
  data: string
  days: number
  price: number
  operator: string
  coverage: string
  hotspots: boolean
}

const mockPlans: SimPlan[] = [
  { id: 'es-1', country: 'France', countryCode: 'FR', data: '10GB', days: 30, price: 19, operator: 'Orange', coverage: '4G/5G', hotspots: true },
  { id: 'es-2', country: 'France', countryCode: 'FR', data: '20GB', days: 30, price: 29, operator: 'SFR', coverage: '4G/5G', hotspots: true },
  { id: 'de-1', country: 'Germany', countryCode: 'DE', data: '10GB', days: 30, price: 18, operator: 'Telekom', coverage: '4G/5G', hotspots: true },
  { id: 'de-2', country: 'Germany', countryCode: 'DE', data: '5GB', days: 14, price: 12, operator: 'Vodafone', coverage: '4G', hotspots: false },
  { id: 'es-country-1', country: 'Spain', countryCode: 'ES', data: '15GB', days: 30, price: 22, operator: 'Movistar', coverage: '4G/5G', hotspots: true },
  { id: 'uk-1', country: 'United Kingdom', countryCode: 'GB', data: '10GB', days: 30, price: 25, operator: 'EE', coverage: '4G/5G', hotspots: true },
  { id: 'uk-2', country: 'United Kingdom', countryCode: 'GB', data: '3GB', days: 7, price: 10, operator: 'O2', coverage: '4G', hotspots: false },
  { id: 'it-1', country: 'Italy', countryCode: 'IT', data: '10GB', days: 30, price: 17, operator: 'TIM', coverage: '4G/5G', hotspots: true },
  { id: 'us-1', country: 'United States', countryCode: 'US', data: '10GB', days: 30, price: 35, operator: 'AT&T', coverage: '4G/5G', hotspots: true },
  { id: 'ca-1', country: 'Canada', countryCode: 'CA', data: '10GB', days: 30, price: 30, operator: 'Rogers', coverage: '4G/5G', hotspots: true },
]

export function SimMarketplace() {
  const { membership } = useVisaStore()
  const { t, language } = useLanguage()
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [selectedPlan, setSelectedPlan] = useState<SimPlan | null>(null)

  const isPremium = membership?.tier === 'premium'

  const countries = [
    { code: 'FR', name: language === 'ar' ? 'فرنسا' : language === 'fr' ? 'France' : 'France', flag: '🇫🇷' },
    { code: 'DE', name: language === 'ar' ? 'ألمانيا' : language === 'fr' ? 'Allemagne' : 'Germany', flag: '🇩🇪' },
    { code: 'ES', name: language === 'ar' ? 'إسبانيا' : language === 'fr' ? 'Espagne' : 'Spain', flag: '🇪🇸' },
    { code: 'GB', name: language === 'ar' ? 'المملكة المتحدة' : language === 'fr' ? 'Royaume-Uni' : 'UK', flag: '🇬🇧' },
    { code: 'IT', name: language === 'ar' ? 'إيطاليا' : language === 'fr' ? 'Italie' : 'Italy', flag: '🇮🇹' },
    { code: 'US', name: language === 'ar' ? 'أمريكا' : language === 'fr' ? 'États-Unis' : 'USA', flag: '🇺🇸' },
    { code: 'CA', name: language === 'ar' ? 'كندا' : language === 'fr' ? 'Canada' : 'Canada', flag: '🇨🇦' },
  ]

  const filteredPlans = selectedCountry 
    ? mockPlans.filter(p => p.countryCode === selectedCountry)
    : mockPlans

  const handlePurchase = (plan: SimPlan) => {
    setSelectedPlan(plan)
  }

  if (!isPremium) {
    return (
      <div className="glass-card p-6 text-center">
        <Smartphone size={40} className="text-neon-cyan mx-auto mb-3" />
        <h3 className="font-bold mb-2">{t('simMarketplace')}</h3>
        <p className="text-white/60 text-sm mb-4">{t('premiumOnly')}</p>
        <button className="neon-button px-6 py-2 rounded-xl text-sm">
          {t('upgradeNow')}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h2 className="text-2xl font-bold mb-2 gradient-text">{t('simMarketplace')}</h2>
          <p className="text-white/60 text-sm">{t('simMarketplaceDesc')}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="glass-card p-4 mb-6"
        >
          <label className="text-xs text-white/50 mb-2 block">{t('selectCountry')}</label>
          <select 
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="input-field text-sm w-full"
          >
            <option value="">{t('allCountries')}</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
            ))}
          </select>
        </motion.div>

        <div className="space-y-3">
          {filteredPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe size={16} className="text-neon-cyan" />
                    <span className="font-bold">{plan.country}</span>
                    <span className="text-xs text-white/50">({plan.operator})</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <span>📊 {plan.data}</span>
                    <span>📅 {plan.days} {t('days')}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {plan.coverage.includes('5G') && (
                      <span className="text-xs bg-neon-cyan/20 text-neon-cyan px-2 py-0.5 rounded">5G</span>
                    )}
                    {plan.hotspots && (
                      <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">WiFi</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-neon-magenta">${plan.price}</p>
                  <button
                    onClick={() => handlePurchase(plan)}
                    className="mt-2 text-xs bg-neon-cyan/20 text-neon-cyan px-3 py-1 rounded-lg hover:bg-neon-cyan/30 transition-colors"
                  >
                    {t('book')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedPlan && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPlan(null)}
          >
            <div className="glass-card p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">{t('confirmBooking')}</h3>
              <div className="space-y-2 mb-4">
                <p><span className="text-white/50">{t('country')}:</span> {selectedPlan.country}</p>
                <p><span className="text-white/50">{t('data')}:</span> {selectedPlan.data}</p>
                <p><span className="text-white/50">{t('duration')}:</span> {selectedPlan.days} {t('days')}</p>
                <p><span className="text-white/50">{t('price')}:</span> <span className="text-neon-magenta font-bold">${selectedPlan.price}</span></p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedPlan(null)}
                  className="flex-1 py-3 glass-card-hover rounded-xl"
                >
                  {t('cancel')}
                </button>
                <button 
                  onClick={() => {
                    setSelectedPlan(null)
                  }}
                  className="flex-1 neon-button rounded-xl"
                >
                  {t('confirmPayment')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
