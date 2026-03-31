'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  DollarSign, TrendingUp, Info, CheckCircle,
  AlertTriangle, Calendar
} from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'
import { COUNTRY_REQUIREMENTS } from '@/lib/serviceConfig'

const COUNTRY_NAMES: Record<string, { nameAr: string; nameFr: string }> = {
  France: { nameAr: 'فرنسا', nameFr: 'France' },
  Germany: { nameAr: 'ألمانيا', nameFr: 'Allemagne' },
  Spain: { nameAr: 'إسبانيا', nameFr: 'Espagne' },
  Italy: { nameAr: 'إيطاليا', nameFr: 'Italie' },
  Portugal: { nameAr: 'البرتغال', nameFr: 'Portugal' },
  Belgium: { nameAr: 'بلجيكا', nameFr: 'Belgique' },
  Netherlands: { nameAr: 'هولندا', nameFr: 'Pays-Bas' },
  UK: { nameAr: 'المملكة المتحدة', nameFr: 'Royaume-Uni' },
  USA: { nameAr: 'الولايات المتحدة', nameFr: 'États-Unis' },
  Canada: { nameAr: 'كندا', nameFr: 'Canada' },
}

const LABELS = {
  header: { ar: 'المخطط المالي', fr: 'Planificateur Financier', en: 'Financial Planner' },
  headerDesc: { ar: 'احسب المبلغ المطلوب لرحلتك وفقاً لمتطلبات الاتحاد الأوروبي', fr: 'Calculez le montant requis selon les exigences européennes', en: 'Calculate required amount based on EU requirements' },
  selectCountry: { ar: 'اختر الدولة', fr: 'Sélectionner le pays', en: 'Select Country' },
  processingTime: { ar: 'مدة المعالجة', fr: 'Délai', en: 'Processing Time' },
  days: { ar: 'أيام', fr: 'jours', en: 'days' },
  dailyMin: { ar: 'الحد الأدنى يومياً', fr: 'Minimum quotidien', en: 'Daily Minimum' },
  totalMin: { ar: 'الحد الأدنى للـ', fr: 'Minimum pour', en: 'Minimum for' },
  duration: { ar: 'مدة الرحلة', fr: 'Durée du voyage', en: 'Trip Duration' },
  daysLabel: { ar: 'أيام', fr: 'jours', en: 'days' },
  monthlyIncome: { ar: 'الراتب الشهري', fr: 'Revenu mensuel', en: 'Monthly Income' },
  currency: { ar: 'دج', fr: 'DZD', en: 'DZD' },
  currentBalance: { ar: 'الرصيد البنكي الحالي', fr: 'Solde bancaire actuel', en: 'Current Bank Balance' },
  requiredAmount: { ar: 'المبلغ المطلوب', fr: 'Montant requis', en: 'Required Amount' },
  coverage: { ar: 'التغطية', fr: 'Couverture', en: 'Coverage' },
  balanceGood: { ar: 'رصيدك كافٍ!', fr: 'Votre solde est suffisant!', en: 'Your balance is sufficient!' },
  balanceGoodDesc: { ar: 'رصيدك يغطي', fr: 'Votre solde couvre', en: 'Your balance covers' },
  extraDays: { ar: 'يوم إضافية', fr: 'jours supplémentaires', en: 'extra days' },
  balanceWarning: { ar: 'رصيدك شبه كافٍ', fr: 'Solde presque suffisant', en: 'Balance almost sufficient' },
  balanceWarningDesc: { ar: 'تحتاج', fr: 'Vous avez besoin de', en: 'You need' },
  extraNeeded: { ar: 'إضافية لتغطية الحد الأدنى', fr: 'supplémentaire pour le minimum', en: 'extra to meet minimum' },
  balanceDanger: { ar: 'رصيدك غير كافٍ', fr: 'Solde insuffisant', en: 'Balance insufficient' },
  balanceDangerDesc: { ar: 'تحتاج', fr: 'Vous avez besoin de', en: 'You need' },
  atLeast: { ar: 'على الأقل', fr: 'au moins', en: 'at least' },
  tips: { ar: 'نصائح لتحسين وضعك المالي', fr: 'Conseils pour améliorer votre situation', en: 'Tips to improve your financial standing' },
  tip1Title: { ar: 'بناء الرصيد', fr: 'Construire le solde', en: 'Build Balance' },
  tip1Desc: { ar: 'حافظ على رصيد مستقر لمدة 3 أشهر على الأقل قبل التقديم. لا تسحب كل المال فجأة.', fr: 'Maintenez un solde stable pendant 3 mois. Ne retirez pas tout soudainement.', en: 'Maintain stable balance for 3+ months before applying. Don\'t withdraw all money suddenly.' },
  tip2Title: { ar: 'كشف الحساب', fr: 'Relevé bancaire', en: 'Bank Statement' },
  tip2Desc: { ar: 'جهّز كشف حساب بنكي من آخر 3 أشهر. يجب أن يظهر تدفق مالي طبيعي.', fr: 'Préparez un relevé des 3 derniers mois montrant un flux naturel.', en: 'Prepare 3-month bank statement showing natural money flow.' },
  tip3Title: { ar: 'التوقيت', fr: 'Timing', en: 'Timing' },
  tip3Desc: { ar: 'قدّم في الوقت المناسب. لا تتأخر كثيراً بعد توفر الرصيد.', fr: 'Appliquez au bon moment. Ne tardez pas après avoir le solde.', en: 'Apply at the right time. Don\'t delay after having the balance.' },
  reference: { ar: 'المرجع', fr: 'Référence', en: 'Reference' },
  referenceDesc: { ar: 'هذه الأرقام مبنية على الحد الأدنى للمتطلبات اليومية في دول شنغن (65€/يوم). المبلغ الفعلي الموصى به عادة أعلى لضمان قبول الطلب.', fr: 'Basé sur le minimum quotidien Schengen (65€/jour). Le montant recommandé est généralement plus élevé.', en: 'Based on Schengen daily minimum (65€/day). Recommended amount is usually higher for approval.' },
}

export function FinancialPlanner() {
  const { userProfile, updateProfile } = useVisaStore()
  const { language } = useLanguage()
  
  const [country, setCountry] = useState(userProfile.targetCountry || 'France')
  const [duration, setDuration] = useState('14')
  const [bankBalance, setBankBalance] = useState((userProfile.bankBalance || 0).toString())
  const [monthlyIncome, setMonthlyIncome] = useState((userProfile.monthlyIncome || 0).toString())

  const countryData = COUNTRY_REQUIREMENTS[country as keyof typeof COUNTRY_REQUIREMENTS]
  const countryName = COUNTRY_NAMES[country] || { nameAr: country, nameFr: country }
  const durationDays = parseInt(duration) || 1
  const minRequiredEUR = countryData?.minDailyEUR * durationDays
  const minRequiredDZD = minRequiredEUR * 145
  
  const currentBalance = parseInt(bankBalance) || 0
  const balanceStatus = currentBalance >= minRequiredDZD ? 'good' : currentBalance >= minRequiredDZD * 0.8 ? 'warning' : 'danger'
  
  const shortfall = Math.max(0, minRequiredDZD - currentBalance)
  const coveragePercentage = Math.round((currentBalance / minRequiredDZD) * 100)

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry)
    updateProfile({ targetCountry: newCountry })
  }

  const getLabel = (ar: string, fr: string, en: string) => {
    if (language === 'ar') return ar
    if (language === 'fr') return fr
    return en
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">
            {getLabel(LABELS.header.ar, LABELS.header.fr, LABELS.header.en)}
          </h2>
          <p className="text-white/60 text-sm">
            {getLabel(LABELS.headerDesc.ar, LABELS.headerDesc.fr, LABELS.headerDesc.en)}
          </p>
        </motion.div>

        {/* Country Selection */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <label className="block text-sm text-white/60 mb-2">
            {getLabel(LABELS.selectCountry.ar, LABELS.selectCountry.fr, LABELS.selectCountry.en)}
          </label>
          <select
            value={country}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="input-field w-full"
          >
            {Object.keys(COUNTRY_REQUIREMENTS).map((c) => {
              const name = COUNTRY_NAMES[c] || { nameAr: c, nameFr: c }
              return (
                <option key={c} value={c}>
                  {COUNTRY_REQUIREMENTS[c as keyof typeof COUNTRY_REQUIREMENTS].flag} {language === 'ar' ? name.nameAr : language === 'fr' ? name.nameFr : c}
                </option>
              )
            })}
          </select>
        </motion.div>

        {/* Country Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{countryData?.flag}</span>
            <div>
              <h3 className="font-bold">
                {language === 'ar' ? countryName.nameAr : language === 'fr' ? countryName.nameFr : country}
              </h3>
              <p className="text-sm text-white/60">
                {getLabel(LABELS.processingTime.ar, LABELS.processingTime.fr, LABELS.processingTime.en)}: {countryData?.processingDays} {getLabel(LABELS.days.ar, LABELS.days.fr, LABELS.days.en)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-xs text-white/60 mb-1">
                {getLabel(LABELS.dailyMin.ar, LABELS.dailyMin.fr, LABELS.dailyMin.en)}
              </p>
              <p className="font-bold text-neon-cyan">{countryData?.minDailyEUR}€</p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-xs text-white/60 mb-1">
                {getLabel(LABELS.totalMin.ar, LABELS.totalMin.fr, LABELS.totalMin.en)} {durationDays} {getLabel(LABELS.daysLabel.ar, LABELS.daysLabel.fr, LABELS.daysLabel.en)}
              </p>
              <p className="font-bold text-neon-cyan">{minRequiredEUR}€</p>
            </div>
          </div>
        </motion.div>

        {/* Duration & Financial Inputs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="glass-card p-4">
            <label className="block text-sm text-white/60 mb-2">
              {getLabel(LABELS.duration.ar, LABELS.duration.fr, LABELS.duration.en)} ({getLabel(LABELS.daysLabel.ar, LABELS.daysLabel.fr, LABELS.daysLabel.en)})
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="input-field w-full"
              min="1"
              max="90"
            />
          </div>
          <div className="glass-card p-4">
            <label className="block text-sm text-white/60 mb-2">
              {getLabel(LABELS.monthlyIncome.ar, LABELS.monthlyIncome.fr, LABELS.monthlyIncome.en)} ({getLabel(LABELS.currency.ar, LABELS.currency.fr, LABELS.currency.en)})
            </label>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              className="input-field w-full"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 mb-6"
        >
          <label className="block text-sm text-white/60 mb-2">
            {getLabel(LABELS.currentBalance.ar, LABELS.currentBalance.fr, LABELS.currentBalance.en)} ({getLabel(LABELS.currency.ar, LABELS.currency.fr, LABELS.currency.en)})
          </label>
          <input
            type="number"
            value={bankBalance}
            onChange={(e) => setBankBalance(e.target.value)}
            className="input-field w-full text-lg"
          />
        </motion.div>

        {/* Results Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className={cn(
            'p-6 rounded-xl mb-6',
            balanceStatus === 'good' && 'bg-green-500/10 border border-green-500/30',
            balanceStatus === 'warning' && 'bg-yellow-500/10 border border-yellow-500/30',
            balanceStatus === 'danger' && 'bg-red-500/10 border border-red-500/30'
          )}
        >
          <div className="text-center mb-6">
            {balanceStatus === 'good' && (
              <CheckCircle className="text-green-400 mx-auto mb-2" size={48} />
            )}
            {balanceStatus === 'warning' && (
              <AlertTriangle className="text-yellow-400 mx-auto mb-2" size={48} />
            )}
            {balanceStatus === 'danger' && (
              <AlertTriangle className="text-red-400 mx-auto mb-2" size={48} />
            )}
            
            <p className="text-sm text-white/60 mb-2">
              {getLabel(LABELS.requiredAmount.ar, LABELS.requiredAmount.fr, LABELS.requiredAmount.en)}
            </p>
            <p className="text-4xl font-bold mb-2">
              {minRequiredDZD.toLocaleString()} <span className="text-lg">{getLabel(LABELS.currency.ar, LABELS.currency.fr, LABELS.currency.en)}</span>
            </p>
            <p className="text-2xl font-bold text-neon-cyan">
              {minRequiredEUR.toLocaleString()} <span className="text-sm">€</span>
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>{getLabel(LABELS.coverage.ar, LABELS.coverage.fr, LABELS.coverage.en)}</span>
              <span className={cn(
                'font-bold',
                balanceStatus === 'good' && 'text-green-400',
                balanceStatus === 'warning' && 'text-yellow-400',
                balanceStatus === 'danger' && 'text-red-400'
              )}>
                {coveragePercentage}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, coveragePercentage)}%` }}
                className={cn(
                  'h-full rounded-full',
                  balanceStatus === 'good' && 'bg-green-400',
                  balanceStatus === 'warning' && 'bg-yellow-400',
                  balanceStatus === 'danger' && 'bg-red-400'
                )}
              />
            </div>
          </div>

          {/* Status Messages */}
          {balanceStatus === 'good' && (
            <div className="text-center">
              <p className="text-green-400 font-medium mb-2">✓ {getLabel(LABELS.balanceGood.ar, LABELS.balanceGood.fr, LABELS.balanceGood.en)}</p>
              <p className="text-sm text-white/70">
                {getLabel(LABELS.balanceGoodDesc.ar, LABELS.balanceGoodDesc.fr, LABELS.balanceGoodDesc.en)} {Math.round(currentBalance / (minRequiredDZD / durationDays))} {getLabel(LABELS.extraDays.ar, LABELS.extraDays.fr, LABELS.extraDays.en)}
              </p>
            </div>
          )}
          
          {balanceStatus === 'warning' && (
            <div className="text-center">
              <p className="text-yellow-400 font-medium mb-2">⚠ {getLabel(LABELS.balanceWarning.ar, LABELS.balanceWarning.fr, LABELS.balanceWarning.en)}</p>
              <p className="text-sm text-white/70">
                {getLabel(LABELS.balanceWarningDesc.ar, LABELS.balanceWarningDesc.fr, LABELS.balanceWarningDesc.en)} {shortfall.toLocaleString()} {getLabel(LABELS.currency.ar, LABELS.currency.fr, LABELS.currency.en)} {getLabel(LABELS.extraNeeded.ar, LABELS.extraNeeded.fr, LABELS.extraNeeded.en)}
              </p>
            </div>
          )}
          
          {balanceStatus === 'danger' && (
            <div className="text-center">
              <p className="text-red-400 font-medium mb-2">✗ {getLabel(LABELS.balanceDanger.ar, LABELS.balanceDanger.fr, LABELS.balanceDanger.en)}</p>
              <p className="text-sm text-white/70">
                {getLabel(LABELS.balanceDangerDesc.ar, LABELS.balanceDangerDesc.fr, LABELS.balanceDangerDesc.en)} {shortfall.toLocaleString()} {getLabel(LABELS.currency.ar, LABELS.currency.fr, LABELS.currency.en)} {getLabel(LABELS.atLeast.ar, LABELS.atLeast.fr, LABELS.atLeast.en)}
              </p>
            </div>
          )}
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <h3 className="font-bold">💡 {getLabel(LABELS.tips.ar, LABELS.tips.fr, LABELS.tips.en)}</h3>
          
          {balanceStatus !== 'good' && (
            <div className="glass-card p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="text-neon-cyan flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-medium text-sm mb-1">
                    {getLabel(LABELS.tip1Title.ar, LABELS.tip1Title.fr, LABELS.tip1Title.en)}
                  </h4>
                  <p className="text-xs text-white/70">
                    {getLabel(LABELS.tip1Desc.ar, LABELS.tip1Desc.fr, LABELS.tip1Desc.en)}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="glass-card p-4">
            <div className="flex items-start gap-3">
              <DollarSign className="text-neon-magenta flex-shrink-0" size={20} />
              <div>
                <h4 className="font-medium text-sm mb-1">
                  {getLabel(LABELS.tip2Title.ar, LABELS.tip2Title.fr, LABELS.tip2Title.en)}
                </h4>
                <p className="text-xs text-white/70">
                  {getLabel(LABELS.tip2Desc.ar, LABELS.tip2Desc.fr, LABELS.tip2Desc.en)}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-start gap-3">
              <Calendar className="text-neon-purple flex-shrink-0" size={20} />
              <div>
                <h4 className="font-medium text-sm mb-1">
                  {getLabel(LABELS.tip3Title.ar, LABELS.tip3Title.fr, LABELS.tip3Title.en)}
                </h4>
                <p className="text-xs text-white/70">
                  {getLabel(LABELS.tip3Desc.ar, LABELS.tip3Desc.fr, LABELS.tip3Desc.en)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* EU Reference */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 bg-neon-cyan/10 rounded-xl border border-neon-cyan/20"
        >
          <div className="flex items-start gap-3">
            <Info className="text-neon-cyan flex-shrink-0" size={20} />
            <div className="text-sm">
              <h4 className="font-medium text-neon-cyan mb-1">
                {getLabel(LABELS.reference.ar, LABELS.reference.fr, LABELS.reference.en)}
              </h4>
              <p className="text-white/70">
                {getLabel(LABELS.referenceDesc.ar, LABELS.referenceDesc.fr, LABELS.referenceDesc.en)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default FinancialPlanner
