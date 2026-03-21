'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Wallet, PiggyBank, TrendingUp, Calendar, AlertTriangle,
  CheckCircle, Target, Clock, DollarSign, ArrowRight,
  Info, Lightbulb, Shield, Banknote, CreditCard, Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

interface SavingsPlan {
  months: number
  targetAmount: number
  monthlyIncome: number
  monthlySavings: number
  monthlyExpenses: number
  currentBalance: number
  projectedBalance: number
  dangerLevel: 'safe' | 'moderate' | 'risky'
  tips: string[]
  tipsAr: string[]
  timeline: { month: string; balance: number; action: string; actionAr: string }[]
}

export function LegalSavingsPlan() {
  const { t, dir, language } = useLanguage()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    currentBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    targetAmount: 0,
    tripDate: '',
    visaType: 'schengen'
  })
  const [plan, setPlan] = useState<SavingsPlan | null>(null)

  const calculatePlan = () => {
    const monthlySavings = formData.monthlyIncome - formData.monthlyExpenses
    
    if (monthlySavings <= 0) {
      alert(language === 'ar' ? 'الدخل يجب أن يتجاوز المصروفات!' : 'Income must exceed expenses!')
      return
    }

    if (!formData.tripDate) {
      alert(language === 'ar' ? 'حدد تاريخ الرحلة!' : 'Please set your trip date!')
      return
    }

    const tripDate = new Date(formData.tripDate)
    const today = new Date()
    const monthsUntilTrip = Math.max(1, Math.ceil((tripDate.getTime() - today.getTime()) / (30 * 24 * 60 * 60 * 1000)))
    
    const projectedBalance = formData.currentBalance + (monthlySavings * monthsUntilTrip)
    
    let dangerLevel: 'safe' | 'moderate' | 'risky' = 'safe'
    const savingsRatio = monthlySavings / formData.monthlyIncome
    
    if (savingsRatio < 0.1) dangerLevel = 'risky'
    else if (savingsRatio < 0.25) dangerLevel = 'moderate'
    
    const tips = [
      'Keep deposits consistent - avoid large irregular amounts',
      'Use bank transfers instead of cash deposits',
      'Maintain regular salary deposits from employer',
      'Avoid round-number deposits (suspicious)',
      'Document all income sources',
      'Keep withdrawals minimal during buildup period'
    ]
    
    const tipsAr = [
      'حافظ على الإيداعات منتظمة - تجنب المبالغ الكبيرة غير المنتظمة',
      'استخدم التحويلات البنكية بدلاً من الإيداعات النقدية',
      'حافظ على إيداعات الراتب المنتظمة من صاحب العمل',
      'تجنب الإيداعات ذات الأرقام الدائرية (مريبة)',
      'وثق جميع مصادر الدخل',
      'قلل السحوبات خلال فترة البناء'
    ]
    
    const timeline: { month: string; balance: number; action: string; actionAr: string }[] = []
    for (let i = 1; i <= Math.min(monthsUntilTrip, 6); i++) {
      const monthDate = new Date(today)
      monthDate.setMonth(monthDate.getMonth() + i)
      const balance = formData.currentBalance + (monthlySavings * i)
      
      let action = ''
      let actionAr = ''
      
      if (i === 1) {
        action = 'Start depositing monthly'
        actionAr = 'ابدأ الإيداع الشهري'
      } else if (i === Math.floor(monthsUntilTrip / 2)) {
        action = 'Check progress with bank statement'
        actionAr = 'تحقق من التقدم مع كشف الحساب'
      } else if (i === monthsUntilTrip - 1) {
        action = 'Request updated bank statement'
        actionAr = 'اطلب كشف حساب محدث'
      } else if (i === monthsUntilTrip) {
        action = 'Get final statement for visa'
        actionAr = 'احصل على الكشف النهائي للتأشيرة'
      }
      
      timeline.push({
        month: monthDate.toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'en-US', { month: 'short', year: 'numeric' }),
        balance,
        action,
        actionAr
      })
    }
    
    setPlan({
      months: monthsUntilTrip,
      targetAmount: formData.targetAmount,
      monthlyIncome: formData.monthlyIncome,
      monthlySavings,
      monthlyExpenses: formData.monthlyExpenses,
      currentBalance: formData.currentBalance,
      projectedBalance,
      dangerLevel,
      tips,
      tipsAr,
      timeline
    })
    
    setStep(3)
  }

  const downloadPlan = () => {
    if (!plan) return
    
    const planText = `
═══════════════════════════════════════════════════════════════════
              LEGAL SAVINGS PLAN - بناء الرصيد القانوني
═══════════════════════════════════════════════════════════════════

Generated: ${new Date().toLocaleDateString('ar-DZ')}
Plan Duration: ${plan.months} months

───────────────────────────────────────────────────────────────────
CURRENT SITUATION - الوضع الحالي
───────────────────────────────────────────────────────────────────
Current Balance: ${formData.currentBalance.toLocaleString()} DZD
Monthly Income: ${formData.monthlyIncome.toLocaleString()} DZD
Monthly Expenses: ${formData.monthlyExpenses.toLocaleString()} DZD
Monthly Savings: ${plan.monthlySavings.toLocaleString()} DZD

───────────────────────────────────────────────────────────────────
PROJECTION - التوقع
───────────────────────────────────────────────────────────────────
Target Amount: ${formData.targetAmount.toLocaleString()} DZD
Projected Balance: ${plan.projectedBalance.toLocaleString()} DZD
Risk Level: ${plan.dangerLevel.toUpperCase()}

${plan.projectedBalance >= formData.targetAmount ? '✅ TARGET ACHIEVABLE' : '⚠️ TARGET MAY NOT BE REACHED'}

───────────────────────────────────────────────────────────────────
MONTHLY TIMELINE - الجدول الزمني
───────────────────────────────────────────────────────────────────
${plan.timeline.map((t, i) => `${i + 1}. ${t.month}: ${t.balance.toLocaleString()} DZD - ${t.actionAr}`).join('\n')}

───────────────────────────────────────────────────────────────────
IMPORTANT TIPS - نصائح مهمة
───────────────────────────────────────────────────────────────────
${plan.tipsAr.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}

───────────────────────────────────────────────────────────────────
RED FLAGS TO AVOID - علامات حمراء لتجنب
───────────────────────────────────────────────────────────────────
❌ Large cash deposits (over 50% of monthly income)
❌ Deposits just before visa application
❌ Round numbers (10,000 / 100,000 DZD)
❌ Inconsistent deposit patterns
❌ Withdrawing large amounts after building balance

═══════════════════════════════════════════════════════════════════
Generated by VisaAI DZ - Legal Savings Plan Advisor
═══════════════════════════════════════════════════════════════════
    `.trim()
    
    const blob = new Blob([planText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `savings-plan-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">خطة التوفير القانونية</h2>
          <p className="text-white/60 text-sm">ابنِ رصيدك البنكي بطريقة آمنة للتجنّب الرفض</p>
        </motion.div>

        {step === 1 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-4 mb-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-neon-cyan/20 rounded-lg">
                  <Info className="text-neon-cyan" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">لماذا هذا مهم؟</h3>
                  <p className="text-xs text-white/60">
                    السفارات تشك في الإيداعات المشبوهة. التوفير التدريجي القانوني يرفع فرصك.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm text-white/70 mb-2 block">الرصيد الحالي في البنك (DZD)</label>
                <div className="relative">
                  <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input
                    type="number"
                    value={formData.currentBalance || ''}
                    onChange={(e) => setFormData({ ...formData, currentBalance: Number(e.target.value) })}
                    className="input-field pr-10"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">الدخل الشهري (DZD)</label>
                <div className="relative">
                  <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input
                    type="number"
                    value={formData.monthlyIncome || ''}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: Number(e.target.value) })}
                    className="input-field pr-10"
                    placeholder="100000"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">المصروفات الشهرية (DZD)</label>
                <div className="relative">
                  <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input
                    type="number"
                    value={formData.monthlyExpenses || ''}
                    onChange={(e) => setFormData({ ...formData, monthlyExpenses: Number(e.target.value) })}
                    className="input-field pr-10"
                    placeholder="50000"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">المبلغ المطلوب للتأشيرة (DZD)</label>
                <div className="relative">
                  <Target className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input
                    type="number"
                    value={formData.targetAmount || ''}
                    onChange={(e) => setFormData({ ...formData, targetAmount: Number(e.target.value) })}
                    className="input-field pr-10"
                    placeholder="300000"
                  />
                </div>
                <p className="text-xs text-white/50 mt-1">شنغن: ~200-300€ × عدد الأيام</p>
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">تاريخ الرحلة المخطط</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input
                    type="date"
                    value={formData.tripDate}
                    onChange={(e) => setFormData({ ...formData, tripDate: e.target.value })}
                    className="input-field pr-10"
                  />
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={calculatePlan}
                className="neon-button w-full mt-6"
              >
                إنشاء الخطة
                <ArrowRight size={18} className="inline mr-2" />
              </motion.button>
            </motion.div>
          </>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center mb-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-20 h-20 bg-neon-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <PiggyBank className="text-neon-cyan" size={40} />
              </motion.div>
              <h3 className="font-bold text-lg">جارٍ حساب خطتك...</h3>
            </div>
          </motion.div>
        )}

        {step === 3 && plan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className={cn(
              'glass-card p-4 text-center',
              plan.dangerLevel === 'safe' && 'border-green-500/50',
              plan.dangerLevel === 'moderate' && 'border-yellow-500/50',
              plan.dangerLevel === 'risky' && 'border-red-500/50'
            )}>
              <div className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3',
                plan.dangerLevel === 'safe' && 'bg-green-500/20',
                plan.dangerLevel === 'moderate' && 'bg-yellow-500/20',
                plan.dangerLevel === 'risky' && 'bg-red-500/20'
              )}>
                {plan.dangerLevel === 'safe' && <Shield className="text-green-400" size={32} />}
                {plan.dangerLevel === 'moderate' && <AlertTriangle className="text-yellow-400" size={32} />}
                {plan.dangerLevel === 'risky' && <AlertTriangle className="text-red-400" size={32} />}
              </div>
              
              <h3 className="font-bold text-lg mb-1">
                {plan.dangerLevel === 'safe' && 'مستوى آمن ✓'}
                {plan.dangerLevel === 'moderate' && 'مستوى متوسط ⚠️'}
                {plan.dangerLevel === 'risky' && 'مستوى خطير ⚠️'}
              </h3>
              
              <p className="text-sm text-white/60">
                نسبة التوفير: {((plan.monthlySavings / plan.monthlyIncome) * 100).toFixed(0)}% من الدخل
              </p>
            </div>

            <div className="glass-card p-4">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="text-neon-cyan" size={18} />
                ملخص الخطة
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-xs text-white/50 mb-1">الرصيد الحالي</p>
                  <p className="font-bold text-lg">{plan.currentBalance.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-xs text-white/50 mb-1">الهدف</p>
                  <p className="font-bold text-lg">{plan.targetAmount.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-xs text-white/50 mb-1">التوفير الشهري</p>
                  <p className="font-bold text-lg text-green-400">+{plan.monthlySavings.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-xs text-white/50 mb-1">المتوقع بعد {plan.months} شهر</p>
                  <p className={cn(
                    'font-bold text-lg',
                    plan.projectedBalance >= plan.targetAmount ? 'text-green-400' : 'text-yellow-400'
                  )}>
                    {plan.projectedBalance.toLocaleString()}
                  </p>
                </div>
              </div>
              
              {plan.projectedBalance >= plan.targetAmount ? (
                <div className="mt-4 p-3 bg-green-500/10 rounded-lg text-center">
                  <CheckCircle className="inline text-green-400 mr-2" size={18} />
                  <span className="text-green-400 font-medium">ستصل للهدف!</span>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg text-center">
                  <AlertTriangle className="inline text-yellow-400 mr-2" size={18} />
                  <span className="text-yellow-400 font-medium">
                    تحتاج {(plan.targetAmount - plan.projectedBalance).toLocaleString()} إضافية
                  </span>
                </div>
              )}
            </div>

            <div className="glass-card p-4">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Calendar className="text-neon-cyan" size={18} />
                الجدول الزمني
              </h4>
              <div className="space-y-3">
                {plan.timeline.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-neon-cyan/20 rounded-full flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.month}</p>
                      <p className="text-xs text-white/50">{item.actionAr}</p>
                    </div>
                    <p className="font-bold text-neon-cyan">
                      {item.balance.toLocaleString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass-card p-4">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Lightbulb className="text-yellow-400" size={18} />
                نصائح ذهبية
              </h4>
              <div className="space-y-2">
                {plan.tipsAr.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="text-green-400 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-white/80">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-4 border-red-500/30">
              <h4 className="font-bold mb-4 flex items-center gap-2 text-red-400">
                <AlertTriangle size={18} />
                علامات حمراء تجنبها
              </h4>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  <span>إيداعات نقدية كبيرة (أكثر من 50% من الدخل)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  <span>إيداعات قبل موعد الطلب مباشرة</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  <span>أرقام دائرية (10,000 / 100,000)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  <span>سحوبات كبيرة بعد بناء الرصيد</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={downloadPlan}
                className="flex-1 neon-button py-4"
              >
                تحميل الخطة
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(1)}
                className="px-6 py-4 glass-card-hover rounded-xl"
              >
                إعادة
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default LegalSavingsPlan
