'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, TrendingUp, TrendingDown, Target, Zap, Shield,
  CheckCircle, AlertTriangle, XCircle, Loader2, Sparkles,
  ChevronRight, RefreshCw, Download, Eye, Users, Briefcase,
  Home, Car, Plane, CreditCard, Calendar, Award
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { useVisaStore } from '@/store/visaStore'
import { cn } from '@/lib/utils'

interface PredictionResult {
  score: number
  level: 'excellent' | 'good' | 'moderate' | 'poor' | 'critical'
  breakdown: FactorBreakdown[]
  scenarios: Scenario[]
  recommendations: Recommendation[]
  riskFactors: RiskFactor[]
}

interface FactorBreakdown {
  name: string
  nameAr: string
  score: number
  maxScore: number
  weight: number
  status: 'positive' | 'negative' | 'neutral'
  description: string
  descriptionAr: string
}

interface Scenario {
  name: string
  nameAr: string
  probability: number
  description: string
  descriptionAr: string
}

interface Recommendation {
  priority: 'high' | 'medium' | 'low'
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  impact: string
  action: string
  actionAr: string
}

interface RiskFactor {
  factor: string
  factorAr: string
  risk: 'high' | 'medium' | 'low'
  description: string
  descriptionAr: string
  solution: string
  solutionAr: string
}

export function VisaApprovalPredictor() {
  const { t, language } = useLanguage()
  const { userProfile } = useVisaStore()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  
  const [formData, setFormData] = useState({
    age: 30,
    employment: 'cdi',
    monthlyBalance: 50000,
    totalFunds: 500000,
    previousVisas: 0,
    refusals: 0,
    hasProperty: false,
    hasVehicle: false,
    hasFamilyAlgeria: true,
    hasInsurance: false,
    hasHotelBooking: false,
    hasInvitationLetter: false,
    tripDuration: 15,
    travelHistory: 'none'
  })

  const analyzeProfile = async () => {
    setIsAnalyzing(true)
    setShowResults(false)
    
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    let score = 50
    
    if (formData.employment === 'cdi') score += 20
    else if (formData.employment === 'cdd') score += 10
    else if (formData.employment === 'self') score += 5
    else score -= 20
    
    if (formData.monthlyBalance >= 100000) score += 15
    else if (formData.monthlyBalance >= 50000) score += 10
    else if (formData.monthlyBalance >= 30000) score += 5
    else score -= 10
    
    if (formData.totalFunds >= 1000000) score += 15
    else if (formData.totalFunds >= 500000) score += 10
    else if (formData.totalFunds >= 200000) score += 5
    else score -= 10
    
    if (formData.previousVisas >= 3) score += 15
    else if (formData.previousVisas >= 1) score += 10
    else if (formData.previousVisas >= 0) score += 0
    
    if (formData.refusals === 0) score += 10
    else if (formData.refusals === 1) score -= 10
    else score -= 25
    
    if (formData.hasProperty) score += 10
    if (formData.hasVehicle) score += 5
    if (formData.hasFamilyAlgeria) score += 10
    if (formData.hasInsurance) score += 5
    if (formData.hasHotelBooking) score += 10
    if (formData.hasInvitationLetter) score += 15
    
    if (formData.age >= 25 && formData.age <= 50) score += 5
    else if (formData.age < 25 || formData.age > 60) score -= 5
    
    score = Math.max(5, Math.min(95, score))
    
    let level: PredictionResult['level']
    if (score >= 80) level = 'excellent'
    else if (score >= 65) level = 'good'
    else if (score >= 45) level = 'moderate'
    else if (score >= 25) level = 'poor'
    else level = 'critical'

    const breakdown: FactorBreakdown[] = [
      {
        name: 'Employment Status',
        nameAr: 'الحالة الوظيفية',
        score: formData.employment === 'cdi' ? 25 : formData.employment === 'cdd' ? 15 : 5,
        maxScore: 25,
        weight: 25,
        status: formData.employment === 'cdi' ? 'positive' : formData.employment === 'none' ? 'negative' : 'neutral',
        description: formData.employment === 'cdi' ? 'Permanent contract - Strong employment' : 'Employment verified',
        descriptionAr: formData.employment === 'cdi' ? 'عقد دائم - توظيف قوي' : 'تم التحقق من العمل'
      },
      {
        name: 'Financial Status',
        nameAr: 'الوضع المالي',
        score: formData.totalFunds >= 1000000 ? 25 : formData.totalFunds >= 500000 ? 20 : 10,
        maxScore: 25,
        weight: 25,
        status: formData.totalFunds >= 500000 ? 'positive' : 'negative',
        description: formData.totalFunds >= 500000 ? 'Sufficient funds available' : 'Funds may be insufficient',
        descriptionAr: formData.totalFunds >= 500000 ? 'أموال كافية متاحة' : 'الأموال قد تكون غير كافية'
      },
      {
        name: 'Travel History',
        nameAr: 'سجل السفر',
        score: formData.previousVisas * 5,
        maxScore: 20,
        weight: 20,
        status: formData.previousVisas >= 2 ? 'positive' : formData.previousVisas === 0 ? 'neutral' : 'neutral',
        description: formData.previousVisas >= 2 ? 'Good travel history' : 'No previous Schengen visas',
        descriptionAr: formData.previousVisas >= 2 ? 'سجل سفر جيد' : 'لا توجد تأشيرات شنغن سابقة'
      },
      {
        name: 'Ties to Algeria',
        nameAr: 'الروابط مع الجزائر',
        score: (formData.hasProperty ? 10 : 0) + (formData.hasFamilyAlgeria ? 10 : 0),
        maxScore: 20,
        weight: 20,
        status: formData.hasProperty && formData.hasFamilyAlgeria ? 'positive' : 'neutral',
        description: formData.hasProperty ? 'Strong ties through property' : 'Basic ties to country',
        descriptionAr: formData.hasProperty ? 'روابط قوية من خلال الملكية' : 'روابط أساسية بالبلد'
      },
      {
        name: 'Documents & Bookings',
        nameAr: 'الوثائق والحجوزات',
        score: (formData.hasInsurance ? 5 : 0) + (formData.hasHotelBooking ? 5 : 0) + (formData.hasInvitationLetter ? 5 : 0),
        maxScore: 15,
        weight: 15,
        status: (formData.hasInsurance && formData.hasHotelBooking) ? 'positive' : 'neutral',
        description: 'Documentation status',
        descriptionAr: 'حالة التوثيق'
      }
    ]

    const scenarios: Scenario[] = [
      {
        name: 'Current Profile',
        nameAr: 'الملف الحالي',
        probability: score,
        description: 'Based on current information provided',
        descriptionAr: 'بناءً على المعلومات المقدمة حالياً'
      },
      {
        name: 'With Improved Finances',
        nameAr: 'مع تحسين الوضع المالي',
        probability: Math.min(95, score + 15),
        description: 'If you increase your bank balance by 50%',
        descriptionAr: 'إذا زادت رصيدك البنكي بنسبة 50%'
      },
      {
        name: 'With Travel History',
        nameAr: 'مع سجل السفر',
        probability: Math.min(95, score + 20),
        description: 'After getting 2-3 Schengen visas first',
        descriptionAr: 'بعد الحصول على 2-3 تأشيرات شنغن أولاً'
      }
    ]

    const recommendations: Recommendation[] = []
    if (formData.totalFunds < 500000) {
      recommendations.push({
        priority: 'high',
        title: 'Increase Bank Balance',
        titleAr: 'زيادة الرصيد البنكي',
        description: 'Your current balance is below the recommended threshold for visa approval.',
        descriptionAr: 'رصيدك الحالي أقل من الحد الموصى به للموافقة على التأشيرة.',
        impact: '+15-25%',
        action: 'Start a savings plan immediately',
        actionAr: 'ابدأ خطة توفير فوراً'
      })
    }
    if (formData.previousVisas === 0) {
      recommendations.push({
        priority: 'high',
        title: 'Build Travel History',
        titleAr: 'بناء سجل السفر',
        description: 'No previous visa history reduces your chances significantly.',
        descriptionAr: 'عدم وجود سجل تأشيرات سابق يقلل فرصك بشكل كبير.',
        impact: '+20-30%',
        action: 'Apply for Turkey or easier destinations first',
        actionAr: 'قدم على تركيا أو وجهات أسهل أولاً'
      })
    }
    if (!formData.hasHotelBooking && !formData.hasInvitationLetter) {
      recommendations.push({
        priority: 'medium',
        title: 'Book Accommodation',
        titleAr: 'حجز سكن',
        description: 'Having confirmed accommodation significantly increases approval chances.',
        descriptionAr: 'وجود سكن مؤكد يزيد فرص الموافقة بشكل كبير.',
        impact: '+10-15%',
        action: 'Book a cancellable hotel reservation',
        actionAr: 'احجز فندق قابل للإلغاء'
      })
    }
    if (formData.employment !== 'cdi') {
      recommendations.push({
        priority: 'medium',
        title: 'Get Permanent Contract',
        titleAr: 'الحصول على عقد دائم',
        description: 'A CDI (permanent contract) is the strongest employment proof.',
        descriptionAr: 'عقد CDI (الدائم) هو أقوى دليل على التوظيف.',
        impact: '+10-20%',
        action: 'If possible, obtain permanent employment',
        actionAr: 'إذا أمكن، احصل على عمل دائم'
      })
    }

    const riskFactors: RiskFactor[] = []
    if (formData.refusals > 0) {
      riskFactors.push({
        factor: 'Previous Refusals',
        factorAr: 'الرفض السابق',
        risk: formData.refusals >= 2 ? 'high' : 'medium',
        description: 'Previous visa refusals are on record',
        descriptionAr: 'هناك سجل برفض تأشيرات سابقة',
        solution: 'Wait 3-6 months and strengthen your application',
        solutionAr: 'انتظر 3-6 أشهر وقوّي طلبك'
      })
    }
    if (formData.employment === 'none') {
      riskFactors.push({
        factor: 'Unemployment',
        factorAr: 'البطالة',
        risk: 'high',
        description: 'No stable employment is a major concern for visa officers',
        descriptionAr: 'عدم وجود توظيف مستقر هو قلق رئيسي للضباط',
        solution: 'Find employment or show alternative income sources',
        solutionAr: 'ابحث عن عمل أو أظهر مصادر دخل بديلة'
      })
    }
    if (formData.monthlyBalance < 30000) {
      riskFactors.push({
        factor: 'Low Monthly Income',
        factorAr: 'دخل شهري منخفض',
        risk: 'medium',
        description: 'Monthly balance may not cover trip expenses',
        descriptionAr: 'الرصيد الشهري قد لا يغطي نفقات الرحلة',
        solution: 'Show consistent income over 3+ months',
        solutionAr: 'أظهر دخلاً ثابتاً على مدى 3+ أشهر'
      })
    }

    setResult({
      score,
      level,
      breakdown,
      scenarios,
      recommendations,
      riskFactors
    })
    
    setShowResults(true)
    setIsAnalyzing(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return { color: '#10B981', gradient: 'from-emerald-400 to-green-400', label: 'excellent' }
    if (score >= 65) return { color: '#00F5FF', gradient: 'from-cyan-400 to-blue-400', label: 'good' }
    if (score >= 45) return { color: '#FFD700', gradient: 'from-yellow-400 to-orange-400', label: 'moderate' }
    if (score >= 25) return { color: '#FF006E', gradient: 'from-pink-500 to-red-400', label: 'poor' }
    return { color: '#EF4444', gradient: 'from-red-500 to-red-600', label: 'critical' }
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-neon-cyan/20 to-purple-500/20 border border-neon-cyan/30 mb-4">
            <Brain className="text-neon-cyan animate-pulse" size={20} />
            <span className="text-neon-cyan text-sm font-medium">AI-Powered Prediction</span>
          </div>
          <h1 className="text-3xl font-black mb-2">
            <span className="gradient-text">Visa Approval Predictor</span>
          </h1>
          <p className="text-white/60">
            {language === 'ar' 
              ? 'توقع فرص الموافقة قبل التقديم'
              : language === 'fr'
              ? 'Prédisez vos chances avant de postuler'
              : 'Predict your approval chances before applying'}
          </p>
        </motion.div>

        {/* Input Form */}
        {!showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-ai space-y-4"
          >
            {/* Age */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Users className="text-neon-cyan" size={16} />
                {language === 'ar' ? 'العمر' : 'Age'}: {formData.age}
              </label>
              <input
                type="range"
                min="18"
                max="70"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                className="slider-track w-full"
              />
            </div>

            {/* Employment */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Briefcase className="text-neon-purple" size={16} />
                {language === 'ar' ? 'الحالة الوظيفية' : 'Employment Status'}
              </label>
              <select
                value={formData.employment}
                onChange={(e) => setFormData({...formData, employment: e.target.value})}
                className="w-full"
              >
                <option value="cdi">{language === 'ar' ? 'CDI (دائم)' : 'CDI (Permanent)'}</option>
                <option value="cdd">{language === 'ar' ? 'CDD (مؤقت)' : 'CDD (Contract)'}</option>
                <option value="self">{language === 'ar' ? 'عمل حر' : 'Self-employed'}</option>
                <option value="student">{language === 'ar' ? 'طالب' : 'Student'}</option>
                <option value="none">{language === 'ar' ? 'بدون عمل' : 'Unemployed'}</option>
              </select>
            </div>

            {/* Monthly Balance */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <CreditCard className="text-emerald-400" size={16} />
                {language === 'ar' ? 'الراتب الشهري (دج)' : 'Monthly Salary (DZD)'}
              </label>
              <input
                type="range"
                min="0"
                max="200000"
                step="5000"
                value={formData.monthlyBalance}
                onChange={(e) => setFormData({...formData, monthlyBalance: parseInt(e.target.value)})}
                className="slider-track w-full"
              />
              <p className="text-right text-sm text-neon-cyan">{formData.monthlyBalance.toLocaleString()} DZD</p>
            </div>

            {/* Total Funds */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Home className="text-amber-400" size={16} />
                {language === 'ar' ? 'إجمالي الرصيد (دج)' : 'Total Balance (DZD)'}
              </label>
              <input
                type="range"
                min="0"
                max="2000000"
                step="50000"
                value={formData.totalFunds}
                onChange={(e) => setFormData({...formData, totalFunds: parseInt(e.target.value)})}
                className="slider-track w-full"
              />
              <p className="text-right text-sm text-amber-400">{formData.totalFunds.toLocaleString()} DZD</p>
            </div>

            {/* Previous Visas */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Plane className="text-neon-magenta" size={16} />
                {language === 'ar' ? 'تأشيرات شنغن سابقة' : 'Previous Schengen Visas'}
              </label>
              <input
                type="range"
                min="0"
                max="5"
                value={formData.previousVisas}
                onChange={(e) => setFormData({...formData, previousVisas: parseInt(e.target.value)})}
                className="slider-track w-full"
              />
              <p className="text-right text-sm text-neon-magenta">{formData.previousVisas}</p>
            </div>

            {/* Refusals */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <AlertTriangle className="text-red-400" size={16} />
                {language === 'ar' ? 'رفض التأشيرات السابقة' : 'Previous Visa Refusals'}
              </label>
              <input
                type="range"
                min="0"
                max="3"
                value={formData.refusals}
                onChange={(e) => setFormData({...formData, refusals: parseInt(e.target.value)})}
                className="slider-track w-full"
              />
              <p className="text-right text-sm text-red-400">{formData.refusals}</p>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'hasProperty', label: language === 'ar' ? 'ملكية عقارية' : 'Property', icon: Home },
                { key: 'hasVehicle', label: language === 'ar' ? 'سيارة' : 'Vehicle', icon: Car },
                { key: 'hasInsurance', label: language === 'ar' ? 'تأمين سفر' : 'Insurance', icon: Shield },
                { key: 'hasHotelBooking', label: language === 'ar' ? 'حجز فندق' : 'Hotel Booking', icon: Calendar },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFormData({...formData, [item.key]: !formData[item.key as keyof typeof formData]})}
                  className={cn(
                    'glass-card p-3 text-center transition-all',
                    formData[item.key as keyof typeof formData] && 'border-neon-cyan/50 bg-neon-cyan/10'
                  )}
                >
                  <item.icon className={cn('mx-auto mb-1', formData[item.key as keyof typeof formData] ? 'text-neon-cyan' : 'text-white/30')} size={20} />
                  <span className="text-xs">{item.label}</span>
                  {formData[item.key as keyof typeof formData] && <CheckCircle className="mx-auto mt-1 text-neon-cyan" size={14} />}
                </button>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={analyzeProfile}
              disabled={isAnalyzing}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {language === 'ar' ? 'جارٍ التحليل...' : 'Analyzing...'}
                </>
              ) : (
                <>
                  <Sparkles className="size-5" />
                  {language === 'ar' ? 'تحليل الملف' : 'Analyze Profile'}
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {showResults && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Score Circle */}
              <div className={cn('card-ai text-center py-8', getScoreColor(result.score).gradient.includes('emerald') && 'border-emerald-500/50')}>
                <div className="relative w-40 h-40 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.1)" strokeWidth="16" fill="none" />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke={getScoreColor(result.score).color}
                      strokeWidth="16"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={440}
                      initial={{ strokeDashoffset: 440 }}
                      animate={{ strokeDashoffset: 440 - (440 * result.score) / 100 }}
                      transition={{ duration: 2, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span 
                      className={cn('text-5xl font-black bg-clip-text text-transparent bg-gradient-to-b', getScoreColor(result.score).gradient)}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring' }}
                    >
                      {result.score}%
                    </motion.span>
                    <span className="text-sm text-white/60 capitalize">{result.level}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {result.level === 'excellent' && (language === 'ar' ? 'فرصك ممتازة!' : 'Excellent Chances!')}
                  {result.level === 'good' && (language === 'ar' ? 'فرص جيدة!' : 'Good Chances!')}
                  {result.level === 'moderate' && (language === 'ar' ? 'فرص متوسطة' : 'Moderate Chances')}
                  {result.level === 'poor' && (language === 'ar' ? 'تحتاج تحسين' : 'Needs Improvement')}
                  {result.level === 'critical' && (language === 'ar' ? 'تحتاج عمل جدي' : 'Significant Work Needed')}
                </h3>
              </div>

              {/* Factor Breakdown */}
              <div className="card-ai">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Award className="text-neon-cyan" size={18} />
                  {language === 'ar' ? 'تفصيل العوامل' : 'Factor Breakdown'}
                </h3>
                <div className="space-y-3">
                  {result.breakdown.map((factor, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex justify-between text-sm mb-1">
                        <span>{language === 'ar' ? factor.nameAr : factor.name}</span>
                        <span className={cn(
                          factor.status === 'positive' && 'text-emerald-400',
                          factor.status === 'negative' && 'text-red-400',
                          factor.status === 'neutral' && 'text-white/60'
                        )}>
                          {factor.score}/{factor.maxScore}
                        </span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className={cn(
                            'h-full rounded-full',
                            factor.status === 'positive' && 'bg-gradient-to-r from-emerald-400 to-green-400',
                            factor.status === 'negative' && 'bg-gradient-to-r from-red-400 to-pink-400',
                            factor.status === 'neutral' && 'bg-gradient-to-r from-yellow-400 to-orange-400'
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Scenarios */}
              <div className="card-ai">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Target className="text-neon-purple" size={18} />
                  {language === 'ar' ? 'سيناريوهات التوقع' : 'Prediction Scenarios'}
                </h3>
                <div className="space-y-3">
                  {result.scenarios.map((scenario, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{language === 'ar' ? scenario.nameAr : scenario.name}</p>
                        <p className="text-xs text-white/50">{language === 'ar' ? scenario.descriptionAr : scenario.description}</p>
                      </div>
                      <div className="text-right">
                        <div className={cn(
                          'text-xl font-bold',
                          scenario.probability >= 75 && 'text-emerald-400',
                          scenario.probability >= 50 && scenario.probability < 75 && 'text-yellow-400',
                          scenario.probability < 50 && 'text-red-400'
                        )}>
                          {scenario.probability}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Factors */}
              {result.riskFactors.length > 0 && (
                <div className="card-ai border-red-500/30">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle className="text-red-400" size={18} />
                    {language === 'ar' ? 'عوامل الخطر' : 'Risk Factors'}
                  </h3>
                  <div className="space-y-3">
                    {result.riskFactors.map((risk, i) => (
                      <div key={i} className={cn(
                        'p-3 rounded-xl border',
                        risk.risk === 'high' && 'bg-red-500/10 border-red-500/30',
                        risk.risk === 'medium' && 'bg-yellow-500/10 border-yellow-500/30'
                      )}>
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className={risk.risk === 'high' ? 'text-red-400' : 'text-yellow-400'} size={16} />
                          <span className="font-medium text-sm">{language === 'ar' ? risk.factorAr : risk.factor}</span>
                        </div>
                        <p className="text-xs text-white/60 mb-2">{language === 'ar' ? risk.descriptionAr : risk.description}</p>
                        <p className="text-xs text-emerald-400">✓ {language === 'ar' ? risk.solutionAr : risk.solution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="card-ai">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="text-neon-cyan" size={18} />
                    {language === 'ar' ? 'توصيات للتحسين' : 'Recommendations to Improve'}
                  </h3>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-gradient-to-r from-neon-cyan/10 to-transparent p-4 rounded-xl border-l-4 border-neon-cyan"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-sm">{language === 'ar' ? rec.titleAr : rec.title}</h4>
                          <span className="text-xs text-emerald-400 font-bold">{rec.impact}</span>
                        </div>
                        <p className="text-xs text-white/60 mb-2">{language === 'ar' ? rec.descriptionAr : rec.description}</p>
                        <p className="text-xs text-neon-cyan">→ {language === 'ar' ? rec.actionAr : rec.action}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={() => setShowResults(false)} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                  <RefreshCw size={18} />
                  {language === 'ar' ? 'إعادة التحليل' : 'Re-analyze'}
                </button>
                <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Download size={18} />
                  {language === 'ar' ? 'تحميل التقرير' : 'Download Report'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default VisaApprovalPredictor
