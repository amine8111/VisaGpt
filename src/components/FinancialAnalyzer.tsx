'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wallet, TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  Loader2, Sparkles, DollarSign, CreditCard, PiggyBank,
  Building, Calendar, Shield, Lightbulb, ArrowUp, ArrowDown, Minus
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { cn } from '@/lib/utils'

interface FinancialHealth {
  score: number
  level: 'excellent' | 'good' | 'moderate' | 'poor' | 'critical'
  monthlyIncome: number
  monthlyExpenses: number
  monthlySavings: number
  savingsRate: number
  totalBalance: number
  requiredAmount: number
  deficit: number
  issues: FinancialIssue[]
  recommendations: FinancialRecommendation[]
  patterns: SpendingPattern[]
}

interface FinancialIssue {
  type: 'error' | 'warning' | 'info'
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  solution: string
  solutionAr: string
}

interface FinancialRecommendation {
  priority: 'high' | 'medium' | 'low'
  title: string
  titleAr: string
  action: string
  actionAr: string
  expectedImpact: string
}

interface SpendingPattern {
  category: string
  categoryAr: string
  amount: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
  recommendation: string
  recommendationAr: string
}

export function FinancialAnalyzer() {
  const { t, language } = useLanguage()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [result, setResult] = useState<FinancialHealth | null>(null)
  
  const [formData, setFormData] = useState({
    monthlyIncome: 80000,
    monthlyExpenses: 50000,
    totalBalance: 600000,
    requiredAmount: 1500000,
    monthsBeforeApplication: 6,
    hasSteadyIncome: true,
    hasLargeDeposits: false,
    hasUnexplainedWithdrawals: false
  })

  const analyzeFinancialHealth = async () => {
    setIsAnalyzing(true)
    setShowResults(false)
    
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    const monthlySavings = formData.monthlyIncome - formData.monthlyExpenses
    const savingsRate = (monthlySavings / formData.monthlyIncome) * 100
    const deficit = Math.max(0, formData.requiredAmount - formData.totalBalance)
    const projectedSavings = monthlySavings * formData.monthsBeforeApplication
    const projectedTotal = formData.totalBalance + projectedSavings
    
    let score = 50
    
    if (savingsRate >= 40) score += 25
    else if (savingsRate >= 25) score += 15
    else if (savingsRate >= 10) score += 5
    else score -= 15
    
    const balanceRatio = formData.totalBalance / formData.requiredAmount
    if (balanceRatio >= 1) score += 25
    else if (balanceRatio >= 0.7) score += 15
    else if (balanceRatio >= 0.5) score += 5
    else score -= 20
    
    if (formData.monthlyIncome >= 100000) score += 10
    else if (formData.monthlyIncome >= 50000) score += 5
    
    if (formData.hasSteadyIncome) score += 10
    
    if (formData.hasLargeDeposits) score -= 15
    if (formData.hasUnexplainedWithdrawals) score -= 10
    
    score = Math.max(0, Math.min(100, score))
    
    let level: FinancialHealth['level']
    if (score >= 85) level = 'excellent'
    else if (score >= 70) level = 'good'
    else if (score >= 50) level = 'moderate'
    else if (score >= 25) level = 'poor'
    else level = 'critical'
    
    const issues: FinancialIssue[] = []
    if (savingsRate < 20) {
      issues.push({
        type: 'warning',
        title: 'Low Savings Rate',
        titleAr: 'معدل توفير منخفض',
        description: 'Your savings rate is below the recommended 20-30% for visa applications.',
        descriptionAr: 'معدل التوفير الخاص بك أقل من الموصى به 20-30% لطلبات التأشيرة.',
        solution: 'Try to reduce non-essential expenses and increase savings.',
        solutionAr: 'حاول تقليل المصروفات غير الضرورية وزيادة التوفير.'
      })
    }
    if (deficit > 0) {
      issues.push({
        type: 'error',
        title: 'Financial Gap Detected',
        titleAr: 'فجوة مالية مكتشفة',
        description: `You need ${deficit.toLocaleString()} DZD more to meet the required amount.`,
        descriptionAr: `تحتاج ${deficit.toLocaleString()} دج أكثر لتلبية المبلغ المطلوب.`,
        solution: `Save ${Math.ceil(deficit / formData.monthsBeforeApplication).toLocaleString()} DZD monthly for ${formData.monthsBeforeApplication} months.`,
        solutionAr: `وفّر ${Math.ceil(deficit / formData.monthsBeforeApplication).toLocaleString()} دج شهرياً لمدة ${formData.monthsBeforeApplication} أشهر.`
      })
    }
    if (formData.hasLargeDeposits) {
      issues.push({
        type: 'error',
        title: 'Suspicious Deposits',
        titleAr: 'إيداعات مشبوهة',
        description: 'Large or irregular deposits can raise red flags during visa processing.',
        descriptionAr: 'الإيداعات الكبيرة أو غير المنتظمة يمكن أن تثير علامات حمراء أثناء معالجة التأشيرة.',
        solution: 'Show a consistent, gradual increase in your balance over 3-6 months.',
        solutionAr: 'أظهر زيادة متسقة وتدريجية في رصيدك على مدى 3-6 أشهر.'
      })
    }
    if (formData.totalBalance < formData.requiredAmount * 0.3) {
      issues.push({
        type: 'warning',
        title: 'Low Current Balance',
        titleAr: 'رصيد منخفض حالياً',
        description: 'Your current balance is too low for the required amount.',
        descriptionAr: 'رصيدك الحالي منخفض جداً للمبلغ المطلوب.',
        solution: 'Start building your balance at least 6 months before applying.',
        solutionAr: 'ابدأ في بناء رصيدك قبل 6 أشهر على الأقل من التقديم.'
      })
    }
    
    const recommendations: FinancialRecommendation[] = []
    if (deficit > 0) {
      recommendations.push({
        priority: 'high',
        title: 'Close the Gap',
        titleAr: 'سد الفجوة',
        action: `Save ${Math.ceil(deficit / formData.monthsBeforeApplication).toLocaleString()} DZD/month`,
        actionAr: `وفّر ${Math.ceil(deficit / formData.monthsBeforeApplication).toLocaleString()} دج/شهر`,
        expectedImpact: `+${Math.min(30, Math.round((deficit / formData.requiredAmount) * 100))}% approval chance`
      })
    }
    if (savingsRate < 30) {
      recommendations.push({
        priority: 'medium',
        title: 'Increase Savings Rate',
        titleAr: 'زيادة معدل التوفير',
        action: 'Reduce unnecessary expenses',
        actionAr: 'قلل المصروفات غير الضرورية',
        expectedImpact: '+10-15% approval chance'
      })
    }
    if (!formData.hasSteadyIncome) {
      recommendations.push({
        priority: 'high',
        title: 'Show Stable Income',
        titleAr: 'إظهار دخل ثابت',
        action: 'Get regular salary deposits',
        actionAr: 'احصل على إيداعات راتب منتظمة',
        expectedImpact: '+15-20% approval chance'
      })
    }
    
    const patterns: SpendingPattern[] = [
      { category: 'Rent/Housing', categoryAr: 'الإيجار/السكن', amount: Math.round(formData.monthlyExpenses * 0.35), percentage: 35, trend: 'stable', recommendation: 'Essential expense - keep as is', recommendationAr: 'مصروف ضروري - احتفظ كما هو' },
      { category: 'Food & Groceries', categoryAr: 'الطعام والبقالة', amount: Math.round(formData.monthlyExpenses * 0.25), percentage: 25, trend: 'up', recommendation: 'Could be reduced by 10-15%', recommendationAr: 'يمكن تقليله بنسبة 10-15%' },
      { category: 'Transportation', categoryAr: 'المواصلات', amount: Math.round(formData.monthlyExpenses * 0.15), percentage: 15, trend: 'down', recommendation: 'Good - try to maintain', recommendationAr: 'جيد - حاول الحفاظ عليه' },
      { category: 'Entertainment', categoryAr: 'الترفيه', amount: Math.round(formData.monthlyExpenses * 0.15), percentage: 15, trend: 'up', recommendation: 'This is where you can save more', recommendationAr: 'هنا يمكنك التوفير أكثر' },
      { category: 'Others', categoryAr: 'أخرى', amount: Math.round(formData.monthlyExpenses * 0.10), percentage: 10, trend: 'stable', recommendation: 'Review for unnecessary expenses', recommendationAr: 'راجع المصروفات غير الضرورية' },
    ]
    
    setResult({
      score,
      level,
      monthlyIncome: formData.monthlyIncome,
      monthlyExpenses: formData.monthlyExpenses,
      monthlySavings,
      savingsRate,
      totalBalance: formData.totalBalance,
      requiredAmount: formData.requiredAmount,
      deficit,
      issues,
      recommendations,
      patterns
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
            <PiggyBank className="text-amber-400 animate-pulse" size={20} />
            <span className="text-amber-400 text-sm font-medium">AI Financial Analysis</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text-gold">{t('financialAnalyzer')}</span>
          </h1>
          <p className="text-white/60">{t('financialAnalyzerDesc')}</p>
        </motion.div>

        {/* Input Form */}
        {!showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-tier-gold space-y-4"
          >
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <DollarSign className="text-emerald-400" size={16} />
                {language === 'ar' ? 'الدخل الشهري (دج)' : 'Monthly Income (DZD)'}
              </label>
              <input
                type="range"
                min="0"
                max="300000"
                step="5000"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({...formData, monthlyIncome: parseInt(e.target.value)})}
                className="slider-track w-full"
              />
              <p className="text-right text-lg font-bold text-emerald-400">{formData.monthlyIncome.toLocaleString()} DZD</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <CreditCard className="text-red-400" size={16} />
                {language === 'ar' ? 'المصروفات الشهرية (دج)' : 'Monthly Expenses (DZD)'}
              </label>
              <input
                type="range"
                min="0"
                max="250000"
                step="5000"
                value={formData.monthlyExpenses}
                onChange={(e) => setFormData({...formData, monthlyExpenses: parseInt(e.target.value)})}
                className="slider-track w-full"
              />
              <p className="text-right text-lg font-bold text-red-400">{formData.monthlyExpenses.toLocaleString()} DZD</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Building className="text-amber-400" size={16} />
                {language === 'ar' ? 'إجمالي الرصيد (دج)' : 'Total Balance (DZD)'}
              </label>
              <input
                type="range"
                min="0"
                max="3000000"
                step="50000"
                value={formData.totalBalance}
                onChange={(e) => setFormData({...formData, totalBalance: parseInt(e.target.value)})}
                className="slider-track w-full"
              />
              <p className="text-right text-lg font-bold text-amber-400">{formData.totalBalance.toLocaleString()} DZD</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Shield className="text-neon-cyan" size={16} />
                {language === 'ar' ? 'المبلغ المطلوب للتأشيرة (دج)' : 'Required Amount for Visa (DZD)'}
              </label>
              <input
                type="range"
                min="100000"
                max="5000000"
                step="50000"
                value={formData.requiredAmount}
                onChange={(e) => setFormData({...formData, requiredAmount: parseInt(e.target.value)})}
                className="slider-track w-full"
              />
              <p className="text-right text-lg font-bold text-neon-cyan">{formData.requiredAmount.toLocaleString()} DZD</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Calendar className="text-neon-purple" size={16} />
                {language === 'ar' ? 'أشهر قبل التقديم' : 'Months Before Application'}
              </label>
              <input
                type="range"
                min="1"
                max="12"
                value={formData.monthsBeforeApplication}
                onChange={(e) => setFormData({...formData, monthsBeforeApplication: parseInt(e.target.value)})}
                className="slider-track w-full"
              />
              <p className="text-right text-sm text-neon-purple">{formData.monthsBeforeApplication} {language === 'ar' ? 'أشهر' : 'months'}</p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <AlertTriangle className="text-red-400" size={18} />
                {language === 'ar' ? 'علامات حمراء محتملة' : 'Potential Red Flags'}
              </h4>
              <div className="space-y-2">
                {[
                  { key: 'hasSteadyIncome', label: language === 'ar' ? 'دخل ثابت منتظم' : 'Regular steady income', icon: CheckCircle, color: 'emerald-400' },
                  { key: 'hasLargeDeposits', label: language === 'ar' ? 'إيداعات كبيرة مفاجئة' : 'Large sudden deposits', icon: AlertTriangle, color: 'red-400' },
                  { key: 'hasUnexplainedWithdrawals', label: language === 'ar' ? 'سحوبات غير مفسرة' : 'Unexplained withdrawals', icon: AlertTriangle, color: 'red-400' },
                ].map((flag) => (
                  <button
                    key={flag.key}
                    onClick={() => setFormData({...formData, [flag.key]: !formData[flag.key as keyof typeof formData]})}
                    className={cn(
                      'w-full glass-card p-3 flex items-center justify-between transition-all',
                      formData[flag.key as keyof typeof formData] && 'border-emerald-500/50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <flag.icon className={cn(formData[flag.key as keyof typeof formData] ? `text-${flag.color}` : 'text-white/30')} size={20} />
                      <span className="text-sm">{flag.label}</span>
                    </div>
                    {formData[flag.key as keyof typeof formData] && (
                      <CheckCircle className="text-emerald-400" size={18} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={analyzeFinancialHealth}
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
                  {language === 'ar' ? 'تحليل الوضع المالي' : 'Analyze Financial Health'}
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
              {/* Score Card */}
              <div className={cn('card-tier-gold text-center py-8')}>
                <div className="relative w-40 h-40 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke={getScoreColor(result.score).color}
                      strokeWidth="12"
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
                  {result.level === 'excellent' && (language === 'ar' ? 'ممتاز! ملف مالي قوي' : 'Excellent! Strong financial profile')}
                  {result.level === 'good' && (language === 'ar' ? 'جيد جداً!' : 'Very Good!')}
                  {result.level === 'moderate' && (language === 'ar' ? 'متوسط - يحتاج تحسين' : 'Moderate - Needs improvement')}
                  {result.level === 'poor' && (language === 'ar' ? 'ضعيف - يحتاج عمل' : 'Poor - Needs work')}
                  {result.level === 'critical' && (language === 'ar' ? 'حرج!' : 'Critical!')}
                </h3>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="card-ai p-4 text-center">
                  <DollarSign className="mx-auto mb-2 text-emerald-400" size={24} />
                  <p className="text-2xl font-bold text-emerald-400">{result.monthlySavings.toLocaleString()}</p>
                  <p className="text-xs text-white/50">{language === 'ar' ? 'التوفير الشهري' : 'Monthly Savings'}</p>
                </div>
                <div className="card-ai p-4 text-center">
                  <PiggyBank className="mx-auto mb-2 text-amber-400" size={24} />
                  <p className="text-2xl font-bold text-amber-400">{result.savingsRate.toFixed(0)}%</p>
                  <p className="text-xs text-white/50">{language === 'ar' ? 'معدل التوفير' : 'Savings Rate'}</p>
                </div>
                <div className="card-ai p-4 text-center">
                  <Building className="mx-auto mb-2 text-neon-cyan" size={24} />
                  <p className="text-2xl font-bold text-neon-cyan">{result.totalBalance.toLocaleString()}</p>
                  <p className="text-xs text-white/50">{language === 'ar' ? 'الرصيد الحالي' : 'Current Balance'}</p>
                </div>
                <div className={cn(
                  'card-ai p-4 text-center',
                  result.deficit > 0 ? 'border-red-500/50' : 'border-emerald-500/50'
                )}>
                  {result.deficit > 0 ? (
                    <>
                      <TrendingUp className="mx-auto mb-2 text-red-400" size={24} />
                      <p className="text-2xl font-bold text-red-400">{result.deficit.toLocaleString()}</p>
                      <p className="text-xs text-white/50">{language === 'ar' ? 'الفجوة' : 'Gap'}</p>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mx-auto mb-2 text-emerald-400" size={24} />
                      <p className="text-2xl font-bold text-emerald-400">✓</p>
                      <p className="text-xs text-white/50">{language === 'ar' ? 'جاهز!' : 'Ready!'}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Issues */}
              {result.issues.length > 0 && (
                <div className="card-ai">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle className="text-yellow-400" size={18} />
                    {language === 'ar' ? 'المشاكل المكتشفة' : 'Issues Detected'}
                  </h3>
                  <div className="space-y-3">
                    {result.issues.map((issue, i) => (
                      <div
                        key={i}
                        className={cn(
                          'p-4 rounded-xl border',
                          issue.type === 'error' && 'bg-red-500/10 border-red-500/30',
                          issue.type === 'warning' && 'bg-yellow-500/10 border-yellow-500/30',
                          issue.type === 'info' && 'bg-blue-500/10 border-blue-500/30'
                        )}
                      >
                        <h4 className={cn(
                          'font-bold text-sm mb-2',
                          issue.type === 'error' && 'text-red-400',
                          issue.type === 'warning' && 'text-yellow-400',
                          issue.type === 'info' && 'text-blue-400'
                        )}>
                          {language === 'ar' ? issue.titleAr : issue.title}
                        </h4>
                        <p className="text-xs text-white/70 mb-2">
                          {language === 'ar' ? issue.descriptionAr : issue.description}
                        </p>
                        <div className="bg-emerald-500/10 p-2 rounded-lg">
                          <p className="text-xs text-emerald-400">✓ {language === 'ar' ? issue.solutionAr : issue.solution}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Spending Patterns */}
              <div className="card-ai">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <svg className="text-neon-cyan" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                    <path d="M22 12A10 10 0 0 0 12 2v10z" />
                  </svg>
                  {language === 'ar' ? 'أنماط الإنفاق' : 'Spending Patterns'}
                </h3>
                <div className="space-y-3">
                  {result.patterns.map((pattern, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{language === 'ar' ? pattern.categoryAr : pattern.category}</span>
                        <div className="flex items-center gap-2">
                          {pattern.trend === 'up' && <ArrowUp className="text-red-400" size={14} />}
                          {pattern.trend === 'down' && <ArrowDown className="text-emerald-400" size={14} />}
                          {pattern.trend === 'stable' && <Minus className="text-white/40" size={14} />}
                          <span className="font-bold">{pattern.amount.toLocaleString()} DZD</span>
                        </div>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple"
                          initial={{ width: 0 }}
                          animate={{ width: `${pattern.percentage}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="card-ai">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Lightbulb className="text-amber-400" size={18} />
                    {language === 'ar' ? 'التوصيات' : 'Recommendations'}
                  </h3>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-gradient-to-r from-amber-500/10 to-transparent p-4 rounded-xl border-l-4 border-amber-400"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-sm">{language === 'ar' ? rec.titleAr : rec.title}</h4>
                          <span className="text-xs text-emerald-400 font-bold">{rec.expectedImpact}</span>
                        </div>
                        <p className="text-sm text-white/70">→ {language === 'ar' ? rec.actionAr : rec.action}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setShowResults(false)} className="btn-secondary flex-1">
                  {language === 'ar' ? 'إعادة التحليل' : 'Re-analyze'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default FinancialAnalyzer
