'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Shield, Check, AlertCircle, Download, CreditCard, Calendar, MapPin, User, FileText } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

interface InsurancePlan {
  id: string
  name: string
  nameAr: string
  coverage: string
  coverageAr: string
  pricePerDay: number
  minPrice: number
  features: string[]
  featuresAr: string[]
  recommended?: boolean
}

const insurancePlans: InsurancePlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    nameAr: 'أساسية',
    coverage: '€30,000',
    coverageAr: '30,000 يورو',
    pricePerDay: 150,
    minPrice: 1500,
    features: ['Medical coverage', 'Emergency repatriation', '24/7 support'],
    featuresAr: ['تغطية طبية', 'إعادة طبية طارئة', 'دعم على مدار الساعة'],
  },
  {
    id: 'standard',
    name: 'Standard',
    nameAr: 'قياسية',
    coverage: '€50,000',
    coverageAr: '50,000 يورو',
    pricePerDay: 250,
    minPrice: 2500,
    features: ['Medical coverage', 'Emergency repatriation', '24/7 support', 'Trip delay coverage'],
    featuresAr: ['تغطية طبية', 'إعادة طبية طارئة', 'دعم على مدار الساعة', 'تغطية تأخير الرحلة'],
  },
  {
    id: 'premium',
    name: 'Premium',
    nameAr: 'ممتازة',
    coverage: '€100,000',
    coverageAr: '100,000 يورو',
    pricePerDay: 400,
    minPrice: 4000,
    recommended: true,
    features: ['Medical coverage', 'Emergency repatriation', '24/7 support', 'Trip delay coverage', 'Personal liability', 'Document loss coverage'],
    featuresAr: ['تغطية طبية', 'إعادة طبية طارئة', 'دعم على مدار الساعة', 'تغطية تأخير الرحلة', 'المسؤولية الشخصية', 'تغطية فقدان الوثائق'],
  },
]

export function InsurancePurchase() {
  const { membership, user } = useVisaStore()
  const { t, dir } = useLanguage()
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
    const content = `
بوليصة التأمين رقم: ${policyNumber}
━━━━━━━━━━━━━━━━━━━━━━━━━━

المسافر: ${travelerName}
رقم جواز السفر: ${passportNumber}
الوجهة: ${destination}

بوليصة التأمين ${selectedPlan?.nameAr}
المدة: ${tripDuration} يوم
تاريخ البدء: ${startDate}
التغطية: ${selectedPlan?.coverageAr}

المزايا:
${selectedPlan?.featuresAr.map(f => `• ${f}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━
شكراً لاستخدام VisaAI DZ
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
      <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
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
            <h2 className="text-2xl font-bold mb-2">تم شراء التأمين بنجاح!</h2>
            <p className="text-white/60">رقم البوليصة: {policyNumber}</p>
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
                <h3 className="font-bold">بوليصة التأمين {selectedPlan?.nameAr}</h3>
                <p className="text-sm text-white/60">تغطية {selectedPlan?.coverageAr}</p>
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
                <span>{tripDuration} يوم - من {startDate}</span>
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
            <h3 className="font-bold mb-3">معلومات مهمة</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-neon-cyan rounded-full mt-1.5" />
                أحفظ رقم البوليصة بشكل آمن
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-neon-cyan rounded-full mt-1.5" />
                ستحتاج البوليصة عند طلب التأشيرة
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-neon-cyan rounded-full mt-1.5" />
                في حالة الطوارئ، اتصل بالرقم الموجود في البوليصة
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
              تحميل البوليصة
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetPurchase}
              className="px-6 py-3 rounded-xl glass-card-hover"
            >
              شراء جديد
            </motion.button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">تأمين السفر</h2>
          <p className="text-white/60 text-sm">احصل على تأمين سفر معتمد لجميع التأشيرات</p>
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
                <p className="font-medium text-sm">هذه الخدمة متاحة فقط للمشتركين بريميوم</p>
                <p className="text-xs text-white/60">اشترك الآن للحصول على جميع الخدمات المتقدمة</p>
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
            <h3 className="font-bold">اختر الباقة</h3>
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
                    مُوصى به
                  </span>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold">{plan.nameAr}</h4>
                    <p className="text-2xl font-bold text-neon-cyan">{plan.coverageAr}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-white/50">ابتداءً من</p>
                    <p className="text-lg font-bold">{plan.minPrice.toLocaleString()} DZD</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {plan.featuresAr.map((feature) => (
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
                    <h4 className="font-bold">{selectedPlan.nameAr}</h4>
                    <p className="text-xs text-white/60">تغطية {selectedPlan.coverageAr}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="text-xs text-white/50 underline"
                >
                  تغيير
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
                <label className="text-sm text-white/70 mb-2 block">اسم المسافر</label>
                <input
                  type="text"
                  value={travelerName}
                  onChange={(e) => setTravelerName(e.target.value)}
                  placeholder="الاسم الكامل كما في الجواز"
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">رقم الجواز</label>
                <input
                  type="text"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  placeholder="رقم الجواز"
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">الوجهة</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="مثال: فرنسا، ألمانيا، إسبانيا"
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">تاريخ البداية</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block flex items-center justify-between">
                  <span>مدة الرحلة</span>
                  <span className="text-neon-cyan font-bold">{tripDuration} يوم</span>
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
                  <span>1 يوم</span>
                  <span>90 يوم</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">السعر الإجمالي</span>
                  <span className="text-2xl font-bold text-neon-cyan">
                    {calculatePrice(selectedPlan, tripDuration).toLocaleString()} DZD
                  </span>
                </div>
                <p className="text-xs text-white/50 mt-1">
                  ({selectedPlan.pricePerDay} DZD × {tripDuration} يوم)
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
                    جارٍ الشراء...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    شراء التأمين
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
