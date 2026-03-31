'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Shield, Check, AlertCircle, Download, CreditCard, Calendar, MapPin, User, FileText } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

interface InsurancePlan {
  id: string
  nameAr: string
  nameEn: string
  nameFr: string
  coverageAr: string
  coverageEn: string
  coverageFr: string
  pricePerDay: number
  minPrice: number
  featuresAr: string[]
  featuresEn: string[]
  featuresFr: string[]
  recommended?: boolean
}

const insurancePlans: InsurancePlan[] = [
  {
    id: 'basic',
    nameAr: 'أساسية',
    nameEn: 'Basic',
    nameFr: 'Basique',
    coverageAr: '30,000 يورو',
    coverageEn: '€30,000',
    coverageFr: '30 000 €',
    pricePerDay: 150,
    minPrice: 1500,
    featuresAr: ['تغطية طبية', 'إعادة طبية طارئة', 'دعم على مدار الساعة'],
    featuresEn: ['Medical coverage', 'Emergency repatriation', '24/7 support'],
    featuresFr: ['Couverture médicale', 'Rapatriement d\'urgence', 'Support 24/7'],
  },
  {
    id: 'standard',
    nameAr: 'قياسية',
    nameEn: 'Standard',
    nameFr: 'Standard',
    coverageAr: '50,000 يورو',
    coverageEn: '€50,000',
    coverageFr: '50 000 €',
    pricePerDay: 250,
    minPrice: 2500,
    featuresAr: ['تغطية طبية', 'إعادة طبية طارئة', 'دعم على مدار الساعة', 'تغطية تأخير الرحلة'],
    featuresEn: ['Medical coverage', 'Emergency repatriation', '24/7 support', 'Trip delay coverage'],
    featuresFr: ['Couverture médicale', 'Rapatriement d\'urgence', 'Support 24/7', 'Couverture retard de vol'],
  },
  {
    id: 'premium',
    nameAr: 'ممتازة',
    nameEn: 'Premium',
    nameFr: 'Premium',
    coverageAr: '100,000 يورو',
    coverageEn: '€100,000',
    coverageFr: '100 000 €',
    pricePerDay: 400,
    minPrice: 4000,
    recommended: true,
    featuresAr: ['تغطية طبية', 'إعادة طبية طارئة', 'دعم على مدار الساعة', 'تغطية تأخير الرحلة', 'المسؤولية الشخصية', 'تغطية فقدان الوثائق'],
    featuresEn: ['Medical coverage', 'Emergency repatriation', '24/7 support', 'Trip delay coverage', 'Personal liability', 'Document loss coverage'],
    featuresFr: ['Couverture médicale', 'Rapatriement d\'urgence', 'Support 24/7', 'Couverture retard de vol', 'Responsabilité civile', 'Couverture perte de documents'],
  },
]

export function InsurancePurchase() {
  const { membership, user } = useVisaStore()
  const { t, dir, language } = useLanguage()
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan | null>(null)
  const [tripDuration, setTripDuration] = useState(15)
  const [startDate, setStartDate] = useState('')
  const [travelerName, setTravelerName] = useState(user?.fullName || '')
  const [passportNumber, setPassportNumber] = useState('')
  const [destination, setDestination] = useState('')
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)
  const [policyNumber, setPolicyNumber] = useState('')

  const isPremium = membership?.tier === 'premium'

  const getLocalizedText = (item: { ar: string; en: string; fr: string }) => {
    if (language === 'ar') return item.ar
    if (language === 'fr') return item.fr
    return item.en
  }

  const getLocalizedFeatures = (plan: InsurancePlan) => {
    if (language === 'ar') return plan.featuresAr
    if (language === 'fr') return plan.featuresFr
    return plan.featuresEn
  }

  const getLocalizedCoverage = (plan: InsurancePlan) => {
    if (language === 'ar') return plan.coverageAr
    if (language === 'fr') return plan.coverageFr
    return plan.coverageEn
  }

  const getLocalizedName = (plan: InsurancePlan) => {
    if (language === 'ar') return plan.nameAr
    if (language === 'fr') return plan.nameFr
    return plan.nameEn
  }

  const calculatePrice = (plan: InsurancePlan, days: number) => {
    return Math.max(plan.minPrice, plan.pricePerDay * days)
  }

  const handlePurchase = async () => {
    if (!selectedPlan || !startDate || !travelerName || !passportNumber || !destination) return
    
    setIsPurchasing(true)
    
    setTimeout(() => {
      setPolicyNumber(`POL-${Date.now()}`)
      setPurchaseSuccess(true)
      setIsPurchasing(false)
    }, 2000)
  }

  const resetPurchase = () => {
    setSelectedPlan(null)
    setPurchaseSuccess(false)
    setPolicyNumber('')
    setStartDate('')
    setPassportNumber('')
    setDestination('')
    setTravelerName(user?.fullName || '')
  }

  const downloadPolicy = () => {
    const planName = selectedPlan ? getLocalizedName(selectedPlan) : ''
    const coverage = selectedPlan ? getLocalizedCoverage(selectedPlan) : ''
    const features = selectedPlan ? getLocalizedFeatures(selectedPlan) : []
    
    const content = `
${t('insurancePolicy')} #${policyNumber}
━━━━━━━━━━━━━━━━━━━━━━━━━━

${t('traveler')}: ${travelerName}
${t('passportNumber')}: ${passportNumber}
${t('destination')}: ${destination}

${t('insurancePlan')} ${planName}
${t('duration')}: ${tripDuration} ${t('days')}
${t('startDate')}: ${startDate}
${t('coverage')}: ${coverage}

${t('benefits')}:
${features.map(f => `• ${f}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━
${t('thankYouVisaGPT')}
    `.trim()
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `insurance-policy-${policyNumber}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (purchaseSuccess && policyNumber) {
    return (
      <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
        <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Shield className="text-green-400" size={40} />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">{t('insurancePurchased')}</h2>
              <p className="text-white/60">{t('policyNumber')}: {policyNumber}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 mb-6"
            >
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                <div className="p-2 bg-neon-cyan/20 rounded-lg">
                  <Shield className="text-neon-cyan" size={24} />
                </div>
                <div>
                  <h3 className="font-bold">{t('insurancePolicy')} {selectedPlan ? getLocalizedName(selectedPlan) : ''}</h3>
                  <p className="text-sm text-white/60">{t('coverage')} {selectedPlan ? getLocalizedCoverage(selectedPlan) : ''}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="text-white/50" size={18} />
                  <span>{travelerName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-white/50" size={18} />
                  <span>{destination}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="text-white/50" size={18} />
                  <span>{tripDuration} {t('days')} - {t('from')} {startDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="text-white/50" size={18} />
                  <span>{calculatePrice(selectedPlan!, tripDuration).toLocaleString()} DZD</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-4 mb-6"
            >
              <h3 className="font-bold mb-3">{t('importantInfo')}</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-neon-cyan rounded-full mt-1.5" />
                  {t('savePolicyNumber')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-neon-cyan rounded-full mt-1.5" />
                  {t('needPolicyForVisa')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-neon-cyan rounded-full mt-1.5" />
                  {t('emergencyCallNumber')}
                </li>
              </ul>
            </motion.div>

            <div className="flex gap-3">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileTap={{ scale: 0.98 }}
                onClick={downloadPolicy}
                className="flex-1 py-3 rounded-xl neon-button flex items-center justify-center gap-2"
              >
                <Download size={18} />
                {t('downloadPolicy')}
              </motion.button>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetPurchase}
                className="px-6 py-3 rounded-xl glass-card-hover"
              >
                {t('newPurchase')}
              </motion.button>
            </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">{t('travelInsurance')}</h2>
          <p className="text-white/60 text-sm">{t('travelInsuranceDesc')}</p>
        </motion.div>

        {!isPremium && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-4 mb-6 border-neon-purple/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neon-purple/20 rounded-lg">
                <AlertCircle className="text-neon-purple" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{t('premiumOnly')}</p>
                <p className="text-xs text-white/60">{t('subscribeForAdvanced')}</p>
              </div>
            </div>
          </motion.div>
        )}

        {!selectedPlan ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="font-bold">{t('selectPlan')}</h3>
            {insurancePlans.map((plan, index) => (
              <motion.button
                key={plan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                onClick={() => isPremium && setSelectedPlan(plan)}
                disabled={!isPremium}
                className={cn(
                  'glass-card-hover p-4 w-full text-right relative',
                  !isPremium && 'opacity-50 cursor-not-allowed'
                )}
              >
                {plan.recommended && (
                  <span className="absolute -top-2 right-4 px-2 py-0.5 bg-neon-cyan text-xs font-bold rounded-full">
                    {t('recommended')}
                  </span>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold">{getLocalizedName(plan)}</h4>
                    <p className="text-2xl font-bold text-neon-cyan">{getLocalizedCoverage(plan)}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-white/50">{t('startingFrom')}</p>
                    <p className="text-lg font-bold">{plan.minPrice.toLocaleString()} DZD</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {getLocalizedFeatures(plan).map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-white/70">
                      <Check size={14} className="text-green-400" />
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-4 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neon-cyan/20 rounded-lg">
                    <Shield className="text-neon-cyan" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">{getLocalizedName(selectedPlan)}</h4>
                    <p className="text-xs text-white/60">{t('coverage')}: {getLocalizedCoverage(selectedPlan)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="text-xs text-white/50 underline"
                >
                  {t('change')}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-4 mb-6 space-y-4"
            >
              <div>
                <label className="text-sm text-white/70 mb-2 block">{t('travelerName')}</label>
                <input
                  type="text"
                  value={travelerName}
                  onChange={(e) => setTravelerName(e.target.value)}
                  placeholder={t('fullNameAsPassport')}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">{t('passportNumber')}</label>
                <input
                  type="text"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  placeholder={t('passportNumber')}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">{t('destination')}</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder={t('destinationPlaceholder')}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">{t('startDate')}</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block flex items-center justify-between">
                  <span>{t('tripDuration')}</span>
                  <span className="text-neon-cyan font-bold">{tripDuration} {t('days')}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="90"
                  value={tripDuration}
                  onChange={(e) => setTripDuration(parseInt(e.target.value))}
                  className="w-full accent-neon-cyan"
                />
                <div className="flex justify-between text-xs text-white/50 mt-1">
                  <span>1 {t('day')}</span>
                  <span>90 {t('days')}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">{t('totalPrice')}</span>
                  <span className="text-2xl font-bold text-neon-cyan">
                    {calculatePrice(selectedPlan, tripDuration).toLocaleString()} DZD
                  </span>
                </div>
                <p className="text-xs text-white/50 mt-1">
                  ({selectedPlan.pricePerDay} DZD × {tripDuration} {t('days')})
                </p>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handlePurchase}
                disabled={
                  isPurchasing || 
                  !startDate || 
                  !travelerName || 
                  !passportNumber || 
                  !destination
                }
                className="neon-button w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPurchasing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    {t('processing')}
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    {t('purchaseInsurance')}
                  </>
                )}
              </motion.button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

export default InsurancePurchase
