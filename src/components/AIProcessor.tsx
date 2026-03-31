'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, Sparkles, TrendingUp, TrendingDown, AlertTriangle, 
  CheckCircle, XCircle, Loader2, FileText, Camera, Upload,
  ChevronRight, Copy, RefreshCw, Download, Eye, Zap
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { useVisaStore } from '@/store/visaStore'
import { cn } from '@/lib/utils'

interface AIAnalysisResult {
  score: number
  level: 'excellent' | 'good' | 'moderate' | 'poor' | 'critical'
  factors: AIFactor[]
  recommendations: AIRecommendation[]
  predictions: AIPrediction[]
}

interface AIFactor {
  name: string
  icon: string
  impact: 'positive' | 'negative' | 'neutral'
  weight: number
  description: string
  improvement?: string
}

interface AIRecommendation {
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  action: string
  expectedImpact: string
}

interface AIPrediction {
  scenario: string
  probability: number
  description: string
}

export function AIProcessor() {
  const { t, language } = useLanguage()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisPhase, setAnalysisPhase] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [result, setResult] = useState<AIAnalysisResult | null>(null)
  
  const phases = [
    { icon: '👤', text: t('analyzingPersonalData') || 'Analyzing personal data' },
    { icon: '💰', text: t('analyzingFinancialStatus') || 'Evaluating financial status' },
    { icon: '✈️', text: t('analyzingTravelHistory') || 'Analyzing travel history' },
    { icon: '🤖', text: t('calculatingVisaScore') || 'Calculating visa score with AI' },
  ]

  const startAnalysis = async () => {
    setIsAnalyzing(true)
    setShowResults(false)
    setResult(null)
    
    for (let i = 0; i < phases.length; i++) {
      setAnalysisPhase(i)
      await new Promise(resolve => setTimeout(resolve, 1200))
    }
    
    const mockResult = generateMockAnalysis()
    setResult(mockResult)
    setShowResults(true)
    setIsAnalyzing(false)
  }

  const generateMockAnalysis = (): AIAnalysisResult => {
    const score = Math.floor(Math.random() * 40) + 45
    let level: AIAnalysisResult['level']
    if (score >= 85) level = 'excellent'
    else if (score >= 70) level = 'good'
    else if (score >= 50) level = 'moderate'
    else if (score >= 30) level = 'poor'
    else level = 'critical'

    return {
      score,
      level,
      factors: [
        { name: t('ageCategory') || 'Age & Location', icon: '👤', impact: 'positive', weight: 15, description: language === 'ar' ? 'العمر المثالي للتقديم' : 'Optimal age for application' },
        { name: t('employmentCategory') || 'Employment', icon: '💼', impact: 'positive', weight: 25, description: language === 'ar' ? 'وظيفة مستقرة عامل قوي' : 'Stable employment is a strong factor' },
        { name: t('financeCategory') || 'Financial Status', icon: '💰', impact: score > 60 ? 'positive' : 'negative', weight: 30, description: score > 60 ? (language === 'ar' ? 'الرصيد يتجاوز المطلوب' : 'Balance exceeds requirements') : (language === 'ar' ? 'الرصيد أقل من المطلوب' : 'Balance below requirements') },
        { name: t('travelCategory') || 'Travel History', icon: '✈️', impact: 'neutral', weight: 15, description: language === 'ar' ? 'لا يوجد سجل سفر' : 'No travel history' },
        { name: t('tiesCategory') || 'Ties to Algeria', icon: '🏠', impact: 'positive', weight: 15, description: language === 'ar' ? 'روابط قوية مع الجزائر' : 'Strong ties to Algeria' },
      ],
      recommendations: [
        { priority: 'high', title: language === 'ar' ? 'تقوية الوضع المالي' : 'Strengthen Financial Position', description: language === 'ar' ? 'قم بزيادة الرصيد قبل 3 أشهر من التقديم' : 'Increase balance 3 months before applying', action: language === 'ar' ? 'ابدأ خطة توفير' : 'Start savings plan', expectedImpact: '+15-25%' },
        { priority: 'medium', title: language === 'ar' ? 'بناء سجل سفر' : 'Build Travel History', description: language === 'ar' ? 'احصل على تأشيرة شنغن أسهل أولاً' : 'Get an easier Schengen visa first', action: language === 'ar' ? 'جرب تأشيرة تركيا' : 'Try Turkey visa', expectedImpact: '+10-20%' },
        { priority: 'low', title: language === 'ar' ? 'إكمال الوثائق' : 'Complete Documentation', description: language === 'ar' ? 'تأكد من اكتمال جميع الوثائق' : 'Ensure all documents are complete', action: language === 'ar' ? 'راجع قائمة التحقق' : 'Review checklist', expectedImpact: '+5-10%' },
      ],
      predictions: [
        { scenario: language === 'ar' ? 'مع الوضع الحالي' : 'Current Profile', probability: score, description: language === 'ar' ? 'احتمالية الموافقة' : 'Approval probability' },
        { scenario: language === 'ar' ? 'بعد تحسين المالية' : 'After Financial Improvement', probability: Math.min(95, score + 20), description: language === 'ar' ? 'بتعديل الوضع المالي' : 'With improved finances' },
        { scenario: language === 'ar' ? 'مع سجل سفر' : 'With Travel History', probability: Math.min(95, score + 15), description: language === 'ar' ? 'بعد بناء سجل سفر' : 'After building travel history' },
      ]
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return { color: '#10B981', gradient: 'from-emerald-500 to-green-400' }
    if (score >= 60) return { color: '#00F5FF', gradient: 'from-cyan-400 to-blue-400' }
    if (score >= 40) return { color: '#FFD700', gradient: 'from-yellow-400 to-orange-400' }
    return { color: '#FF006E', gradient: 'from-pink-500 to-red-400' }
  }

  const getLevelLabel = (level: AIAnalysisResult['level']) => {
    const labels = {
      excellent: language === 'ar' ? 'ممتاز' : language === 'fr' ? 'Excellent' : 'Excellent',
      good: language === 'ar' ? 'جيد جداً' : language === 'fr' ? 'Très bien' : 'Very Good',
      moderate: language === 'ar' ? 'متوسط' : language === 'fr' ? 'Moyen' : 'Moderate',
      poor: language === 'ar' ? 'ضعيف' : language === 'fr' ? 'Faible' : 'Poor',
      critical: language === 'ar' ? 'حرج' : language === 'fr' ? 'Critique' : 'Critical',
    }
    return labels[level]
  }

  return (
    <div className="min-h-screen p-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 mb-4">
            <Brain className="text-neon-cyan" size={20} />
            <span className="text-neon-cyan text-sm font-medium">AI-Powered Analysis</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">{t('assessment')}</span>
          </h1>
          <p className="text-white/60">{t('smartRecommendations')}</p>
        </motion.div>

        {/* Analysis Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-ai mb-6"
        >
          {!isAnalyzing && !showResults && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                <Sparkles className="text-neon-cyan" size={48} />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('startAnalysis')}</h3>
              <p className="text-white/60 mb-6 max-w-sm mx-auto">
                {language === 'ar' 
                  ? 'سيحلل الذكاء الاصطناعي ملفك ويقدم لك توصيات مخصصة'
                  : language === 'fr'
                  ? "L'IA analysera votre profil et vous donnera des recommandations personnalisées"
                  : 'AI will analyze your profile and give you personalized recommendations'}
              </p>
              <button onClick={startAnalysis} className="btn-primary inline-flex items-center gap-2">
                <Zap className="size-5" />
                {language === 'ar' ? 'ابدأ التحليل' : language === 'fr' ? "Commencer l'analyse" : 'Start Analysis'}
              </button>
            </div>
          )}

          {/* Analyzing Animation */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12"
              >
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-neon-cyan/20"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-4 rounded-full border-4 border-neon-purple/20"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="text-neon-cyan animate-pulse" size={40} />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={analysisPhase}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center"
                  >
                    <span className="text-3xl mb-3 block">{phases[analysisPhase].icon}</span>
                    <p className="text-white/80">{phases[analysisPhase].text}</p>
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-center gap-2 mt-6">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className={cn(
                        'w-2 h-2 rounded-full',
                        i <= analysisPhase ? 'bg-neon-cyan' : 'bg-white/20'
                      )}
                      animate={i === analysisPhase ? { scale: [1, 1.5, 1] } : {}}
                      transition={{ duration: 0.5, repeat: i === analysisPhase ? Infinity : 0 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {showResults && result && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Score Circle */}
                <div className="flex justify-center">
                  <div className="relative">
                    <svg className="w-44 h-44 transform -rotate-90">
                      <circle
                        cx="88"
                        cy="88"
                        r="76"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="12"
                        fill="none"
                      />
                      <motion.circle
                        cx="88"
                        cy="88"
                        r="76"
                        stroke={getScoreColor(result.score).color}
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={477}
                        initial={{ strokeDashoffset: 477 }}
                        animate={{ strokeDashoffset: 477 - (477 * result.score) / 100 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span
                        className={cn(
                          'text-5xl font-black bg-clip-text text-transparent bg-gradient-to-b',
                          getScoreColor(result.score).gradient
                        )}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                      >
                        {result.score}%
                      </motion.span>
                      <span className="text-white/60 text-sm">{getLevelLabel(result.level)}</span>
                    </div>
                  </div>
                </div>

                {/* Predictions */}
                <div className="bg-black/30 rounded-2xl p-4">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <TrendingUp className="text-neon-cyan" size={18} />
                    {language === 'ar' ? 'توقعات الذكاء الاصطناعي' : language === 'fr' ? "Prédictions de l'IA" : 'AI Predictions'}
                  </h4>
                  <div className="space-y-3">
                    {result.predictions.map((pred, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-white/70">{pred.scenario}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple"
                              initial={{ width: 0 }}
                              animate={{ width: `${pred.probability}%` }}
                              transition={{ delay: 0.5 + i * 0.2, duration: 0.8 }}
                            />
                          </div>
                          <span className="text-sm font-bold text-neon-cyan">{pred.probability}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Factors */}
                <div>
                  <h4 className="font-bold mb-3">{language === 'ar' ? 'العوامل الرئيسية' : language === 'fr' ? 'Facteurs clés' : 'Key Factors'}</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {result.factors.map((factor, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-xl',
                          factor.impact === 'positive' && 'bg-emerald-500/10 border border-emerald-500/20',
                          factor.impact === 'negative' && 'bg-red-500/10 border border-red-500/20',
                          factor.impact === 'neutral' && 'bg-white/5 border border-white/10'
                        )}
                      >
                        <span className="text-2xl">{factor.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{factor.name}</p>
                          <p className="text-xs text-white/50">{factor.description}</p>
                        </div>
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          factor.impact === 'positive' && 'bg-emerald-500/20',
                          factor.impact === 'negative' && 'bg-red-500/20',
                          factor.impact === 'neutral' && 'bg-white/10'
                        )}>
                          {factor.impact === 'positive' && <TrendingUp className="text-emerald-400" size={18} />}
                          {factor.impact === 'negative' && <TrendingDown className="text-red-400" size={18} />}
                          {factor.impact === 'neutral' && <span className="text-white/50">-</span>}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-bold mb-3">{language === 'ar' ? 'توصيات مخصصة' : language === 'fr' ? 'Recommandations' : 'Personalized Recommendations'}</h4>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 + i * 0.15 }}
                        className="bg-gradient-to-r from-neon-cyan/10 to-transparent p-4 rounded-xl border-l-4 border-neon-cyan"
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            'px-2 py-1 rounded text-xs font-bold',
                            rec.priority === 'high' && 'bg-red-500/20 text-red-400',
                            rec.priority === 'medium' && 'bg-yellow-500/20 text-yellow-400',
                            rec.priority === 'low' && 'bg-green-500/20 text-green-400'
                          )}>
                            {rec.priority === 'high' ? (language === 'ar' ? 'عالي' : 'High') :
                             rec.priority === 'medium' ? (language === 'ar' ? 'متوسط' : 'Medium') :
                             (language === 'ar' ? 'منخفض' : 'Low')}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-bold text-sm mb-1">{rec.title}</h5>
                            <p className="text-xs text-white/60 mb-2">{rec.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-neon-cyan">{rec.action}</span>
                              <span className="text-xs text-emerald-400 font-bold">{rec.expectedImpact}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button className="btn-secondary flex-1 flex items-center justify-center gap-2">
                    <RefreshCw size={18} />
                    {language === 'ar' ? 'إعادة التحليل' : language === 'fr' ? "Réanalyser" : 'Re-analyze'}
                  </button>
                  <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <Download size={18} />
                    {language === 'ar' ? 'تحميل التقرير' : language === 'fr' ? 'Télécharger' : 'Download Report'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Features Grid */}
        {!isAnalyzing && !showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: Camera, title: language === 'ar' ? 'مسح الوثائق' : 'Scan Documents', desc: language === 'ar' ? 'بالذكاء الاصطناعي' : 'With AI', color: 'neon-cyan' },
              { icon: FileText, title: language === 'ar' ? 'فحص الامتثال' : 'Compliance Check', desc: language === 'ar' ? 'تلقائي' : 'Automated', color: 'neon-purple' },
              { icon: AlertTriangle, title: language === 'ar' ? 'كشف الاحتيال' : 'Fraud Detection', desc: language === 'ar' ? 'دقة 99%' : '99% Accuracy', color: 'neon-magenta' },
              { icon: CheckCircle, title: language === 'ar' ? 'جاهزية التقديم' : 'Readiness', desc: language === 'ar' ? 'تقييم شامل' : 'Full Assessment', color: 'emerald-400' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="glass-card p-4 text-center"
              >
                <feature.icon className={cn('mx-auto mb-2', `text-${feature.color}`)} size={28} />
                <h4 className="font-bold text-sm">{feature.title}</h4>
                <p className="text-xs text-white/50">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AIProcessor
