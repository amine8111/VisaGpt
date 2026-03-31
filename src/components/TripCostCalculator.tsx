'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Calculator, Plane, Hotel, Shield, DollarSign, Info } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { useLanguage } from './LanguageProvider'

interface CostBreakdown {
  visa: number
  flight: number
  hotel: number
  insurance: number
  food: number
  transport: number
  total: number
}

export function TripCostCalculator() {
  const { membership, userProfile } = useVisaStore()
  const { t, language } = useLanguage()
  const [days, setDays] = useState('7')
  const [travelers, setTravelers] = useState('1')
  const [hotelLevel, setHotelLevel] = useState('3')
  const [includeInsurance, setIncludeInsurance] = useState(true)
  const [result, setResult] = useState<CostBreakdown | null>(null)

  const countries = [
    { code: 'FR', name: language === 'ar' ? 'فرنسا' : language === 'fr' ? 'France' : 'France', flag: '🇫🇷', visaFee: 80, dailyCost: 100 },
    { code: 'DE', name: language === 'ar' ? 'ألمانيا' : language === 'fr' ? 'Allemagne' : 'Germany', flag: '🇩🇪', visaFee: 80, dailyCost: 90 },
    { code: 'ES', name: language === 'ar' ? 'إسبانيا' : language === 'fr' ? 'Espagne' : 'Spain', flag: '🇪🇸', visaFee: 80, dailyCost: 80 },
    { code: 'IT', name: language === 'ar' ? 'إيطاليا' : language === 'fr' ? 'Italie' : 'Italy', flag: '🇮🇹', visaFee: 80, dailyCost: 85 },
    { code: 'UK', name: language === 'ar' ? 'المملكة المتحدة' : language === 'fr' ? 'Royaume-Uni' : 'UK', flag: '🇬🇧', visaFee: 100, dailyCost: 120 },
    { code: 'US', name: language === 'ar' ? 'أمريكا' : language === 'fr' ? 'États-Unis' : 'USA', flag: '🇺🇸', visaFee: 160, dailyCost: 150 },
    { code: 'CA', name: language === 'ar' ? 'كندا' : language === 'fr' ? 'Canada' : 'Canada', flag: '🇨🇦', visaFee: 100, dailyCost: 110 },
  ]
  const [selectedCountry, setSelectedCountry] = useState(countries[0])

  const calculateCost = () => {
    const numDays = parseInt(days) || 1
    const numTravelers = parseInt(travelers) || 1
    const dailyRate = parseInt(hotelLevel) * 30 + 50

    const visa = selectedCountry.visaFee * numTravelers
    const flight = 500 * numTravelers
    const hotel = dailyRate * numDays * numTravelers
    const insurance = includeInsurance ? (30 * numDays * numTravelers) : 0
    const food = 40 * numDays * numTravelers
    const transport = 20 * numDays * numTravelers

    setResult({
      visa,
      flight,
      hotel,
      insurance,
      food,
      transport,
      total: visa + flight + hotel + insurance + food + transport,
    })
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString() + ' DZD'
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h2 className="text-2xl font-bold mb-2 gradient-text">{t('tripCostCalculator')}</h2>
          <p className="text-white/60 text-sm">{t('tripCostDesc')}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="glass-card p-4 space-y-4"
        >
          <div>
            <label className="text-xs text-white/50 mb-1 block">{t('country')}</label>
            <select 
              value={selectedCountry.code}
              onChange={(e) => setSelectedCountry(countries.find(c => c.code === e.target.value) || countries[0])}
              className="input-field text-sm w-full"
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/50 mb-1 block">{t('numberOfDays')}</label>
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                min="1"
                className="input-field text-sm w-full"
              />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">{t('travelers')}</label>
              <input
                type="number"
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                min="1"
                className="input-field text-sm w-full"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-white/50 mb-1 block">{t('hotelLevel')}</label>
            <select 
              value={hotelLevel}
              onChange={(e) => setHotelLevel(e.target.value)}
              className="input-field text-sm w-full"
            >
              <option value="2">⭐ {language === 'ar' ? 'اقتصادي' : language === 'fr' ? 'Économique' : 'Budget'} (2*)</option>
              <option value="3">⭐⭐ {language === 'ar' ? 'قياسي' : language === 'fr' ? 'Standard' : 'Standard'} (3*)</option>
              <option value="4">⭐⭐⭐ {language === 'ar' ? 'مريح' : language === 'fr' ? 'Confort' : 'Comfort'} (4*)</option>
              <option value="5">⭐⭐⭐⭐ {language === 'ar' ? 'فاخر' : language === 'fr' ? 'Luxe' : 'Luxury'} (5*)</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeInsurance}
              onChange={(e) => setIncludeInsurance(e.target.checked)}
              className="w-4 h-4 rounded accent-neon-cyan"
            />
            <span className="text-sm">{t('travelInsurance')}</span>
          </label>

          <button onClick={calculateCost} className="w-full neon-button flex items-center justify-center gap-2">
            <Calculator size={20} />
            {t('calculateCost')}
          </button>
        </motion.div>

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 mt-6"
          >
            <h3 className="font-bold mb-4">{t('costBreakdown')}</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Plane size={16} className="text-neon-cyan" />
                  <span className="text-sm">{t('visa')}</span>
                </div>
                <span className="font-bold">{formatCurrency(result.visa)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Plane size={16} className="text-neon-cyan" />
                  <span className="text-sm">{t('flightTickets')}</span>
                </div>
                <span className="font-bold">{formatCurrency(result.flight)}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Hotel size={16} className="text-neon-cyan" />
                  <span className="text-sm">{t('hotel')}</span>
                </div>
                <span className="font-bold">{formatCurrency(result.hotel)}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-neon-cyan" />
                  <span className="text-sm">{t('insurance')}</span>
                </div>
                <span className="font-bold">{formatCurrency(result.insurance)}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-neon-cyan" />
                  <span className="text-sm">{t('food')}</span>
                </div>
                <span className="font-bold">{formatCurrency(result.food)}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-neon-cyan" />
                  <span className="text-sm">{t('transport')}</span>
                </div>
                <span className="font-bold">{formatCurrency(result.transport)}</span>
              </div>

              <div className="border-t border-white/20 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold">{t('total')}</span>
                  <span className="text-2xl font-bold text-neon-magenta">{formatCurrency(result.total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-neon-cyan/10 rounded-xl">
              <div className="flex items-start gap-2">
                <Info size={16} className="text-neon-cyan mt-0.5" />
                <p className="text-xs text-white/70">
                  {t('costDisclaimer')}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
