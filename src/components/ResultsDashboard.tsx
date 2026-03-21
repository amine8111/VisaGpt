'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, CheckCircle, XCircle, 
  Shield, FileText, Lightbulb, Clock, Globe,
  TrendingUp, TrendingDown, RefreshCw, Download, Printer, AlertCircle,
  Briefcase, Wallet, Plane, Home, FileCheck, Calendar, ChevronDown, ChevronUp
} from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { getScoreColor, getScoreLabel, cn } from '@/lib/utils'
import { useState } from 'react'
import { useLanguage } from './LanguageProvider'

const LABELS = {
  generating: { ar: 'جاري إنشاء التقييم...', en: 'Generating your assessment...', fr: 'Génération de votre évaluation...' },
  officerSummary: { ar: 'ملخص ضابط التأشيرات', en: "Visa Officer's Summary", fr: "Résumé de l'officier" },
  approvalChance: { ar: 'احتمال الموافقة', en: 'Approval Chance', fr: "Chance d'approbation" },
  strongProfile: { ar: '✓ ملف قوي', en: '✓ Strong Profile', fr: '✓ Profil fort' },
  moderateProfile: { ar: '~ ملف متوسط', en: '~ Moderate Profile', fr: '~ Profil moyen' },
  weakProfile: { ar: '⚠ ملف ضعيف', en: '⚠ Weak Profile', fr: '⚠ Profil faible' },
  veryWeakProfile: { ar: '✗ ملف ضعيف جداً', en: '✗ Very Weak Profile', fr: '✗ Profil très faible' },
  assessmentDetails: { ar: 'تفاصيل التقييم', en: 'Assessment Details', fr: 'Détails de l\'évaluation' },
  strengths: { ar: 'نقاط القوة', en: 'Strengths', fr: 'Points forts' },
  weaknesses: { ar: 'نقاط الضعف', en: 'Weaknesses', fr: 'Points faibles' },
  missingDocs: { ar: 'وثائق مفقودة', en: 'Missing Documents', fr: 'Documents manquants' },
  advice: { ar: 'نصائح للتحسين', en: 'Improvement Advice', fr: 'Conseils d\'amélioration' },
  alternatives: { ar: 'بدائل أخرى', en: 'Alternative Countries', fr: 'Autres pays' },
  whatIfSimulator: { ar: 'محاكي ماذا لو', en: 'What-If Simulator', fr: 'Simulateur Et si' },
  tryAgain: { ar: 'حاول مجدداً', en: 'Try Again', fr: 'Réessayer' },
  downloadReport: { ar: 'تحميل التقرير', en: 'Download Report', fr: 'Télécharger le rapport' },
  printReport: { ar: 'طباعة التقرير', en: 'Print Report', fr: 'Imprimer le rapport' },
  newAnalysis: { ar: 'تحليل جديد', en: 'New Analysis', fr: 'Nouvelle analyse' },
  topActions: { ar: 'أهم الإجراءات للتحسين', en: 'Top Actions to Improve', fr: 'Principales actions à améliorer' },
  recommendedWait: { ar: 'الانتظار الموصى به', en: 'Recommended Wait Time', fr: 'Temps d\'attente recommandé' },
  alternativeOpportunities: { ar: 'فرص بديلة', en: 'Alternative Opportunities', fr: 'Opportunités alternatives' },
  easy: { ar: 'سهل', en: 'Easy', fr: 'Facile' },
  medium: { ar: 'متوسط', en: 'Medium', fr: 'Moyen' },
  hard: { ar: 'صعب', en: 'Hard', fr: 'Difficile' },
  disclaimer: { 
    ar: '⚠️ هذا التحليل تقديري فقط ولا يُعتبَر قراراً رسمياً، وأن القنصلية هي الجهة الوحيدة التي تملك سلطة قبول أو رفض التأشيرة.',
    en: '⚠️ This analysis is for guidance only and is not an official decision. The consulate is the sole authority for visa approval or rejection.',
    fr: '⚠️ Cette analyse est indicative seulement et ne constitue pas une décision officielle. Le consulat est la seule autorité pour approuver ou refuser le visa.'
  },
  verdictLabels: {
    excellent: { ar: 'ممتاز', en: 'Excellent', fr: 'Excellent' },
    strong: { ar: 'قوي', en: 'Strong', fr: 'Fort' },
    good: { ar: 'جيد', en: 'Good', fr: 'Bon' },
    average: { ar: 'متوسط', en: 'Average', fr: 'Moyen' },
    moderate: { ar: 'متوسط', en: 'Moderate', fr: 'Moyen' },
    poor: { ar: 'ضعيف', en: 'Poor', fr: 'Faible' },
    critical: { ar: 'حرج', en: 'Critical', fr: 'Critique' },
    very_weak: { ar: 'ضعيف جداً', en: 'Very Weak', fr: 'Très faible' },
  },
}

export function ResultsDashboard() {
  const { results, setActiveNav, resetAssessment, setCurrentStep } = useVisaStore()
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['all']))
  const { language } = useLanguage()

  const getLabel = (obj: { ar: string; en: string; fr: string }) => {
    if (language === 'ar') return obj.ar
    if (language === 'fr') return obj.fr
    return obj.en
  }

  if (!results) {
    return (
      <div className="min-h-screen px-4 py-6 pb-28 relative z-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-white/60">{getLabel(LABELS.generating)}</p>
        </div>
      </div>
    )
  }

  const scoreColor = getScoreColor(results.mainScore)

  const handleTryAgain = () => {
    resetAssessment()
    setCurrentStep(0)
    setActiveNav('calculator')
  }

  const handleWhatIf = () => {
    setActiveNav('whatif')
  }

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'excellent':
      case 'strong':
        return <CheckCircle size={20} className="text-green-400" />
      case 'good':
        return <CheckCircle size={20} className="text-green-400" />
      case 'average':
        return <AlertCircle size={20} className="text-yellow-400" />
      case 'poor':
        return <AlertTriangle size={20} className="text-orange-400" />
      case 'critical':
      case 'very_weak':
        return <XCircle size={20} className="text-red-400" />
      default:
        return <AlertCircle size={20} className="text-white/50" />
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'excellent':
      case 'strong':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'good':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'average':
      case 'moderate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'poor':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'critical':
      case 'very_weak':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-white/10 text-white/50 border-white/20'
    }
  }

  const getVerdictLabel = (verdict: string) => {
    const label = LABELS.verdictLabels[verdict as keyof typeof LABELS.verdictLabels]
    return label ? getLabel(label) : verdict
  }

  const getCategoryIcon = (category: string) => {
    if (category.includes('Financial') || category.includes('المالية') || category.includes('Capacité')) return <Wallet size={18} />
    if (category.includes('Employment') || category.includes('الEmployment')) return <Briefcase size={18} />
    if (category.includes('Travel') || category.includes('السفر') || category.includes('Historique')) return <Plane size={18} />
    if (category.includes('Ties') || category.includes('الروابط') || category.includes('Liens')) return <Home size={18} />
    if (category.includes('Documents') || category.includes('الوثائق')) return <FileCheck size={18} />
    if (category.includes('Purpose') || category.includes('الغرض') || category.includes('Motif')) return <Calendar size={18} />
    return <FileText size={18} />
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return getLabel(LABELS.easy)
      case 'medium': return getLabel(LABELS.medium)
      case 'hard': return getLabel(LABELS.hard)
      default: return difficulty
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        {/* Officer Summary Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 mb-4 border-neon-cyan/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <Shield className="text-neon-cyan" size={20} />
            <span className="text-sm font-medium text-neon-cyan">{getLabel(LABELS.officerSummary)}</span>
          </div>
          <p className="text-sm text-white/80 leading-relaxed">
            {results.officerSummary}
          </p>
        </motion.div>

        {/* Main Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-6 text-center relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at center, ${scoreColor} 0%, transparent 70%)`,
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <div className="relative z-10">
            <p className="text-white/60 text-sm mb-2">{getLabel(LABELS.approvalChance)}</p>
            <motion.div
              className="text-7xl font-bold mb-2"
              style={{
                color: scoreColor,
                textShadow: `0 0 40px ${scoreColor}`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {results.mainScore}%
            </motion.div>
            <p className="text-lg font-medium" style={{ color: scoreColor }}>
              {getScoreLabel(results.mainScore)}
            </p>
            <div className={cn(
              'inline-block mt-3 px-4 py-1 rounded-full text-sm border',
              results.overallVerdict === 'strong' && 'bg-green-500/20 text-green-400 border-green-500/30',
              results.overallVerdict === 'moderate' && 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
              results.overallVerdict === 'weak' && 'bg-orange-500/20 text-orange-400 border-orange-500/30',
              results.overallVerdict === 'very_weak' && 'bg-red-500/20 text-red-400 border-red-500/30'
            )}>
              {results.overallVerdict === 'strong' && getLabel(LABELS.strongProfile)}
              {results.overallVerdict === 'moderate' && getLabel(LABELS.moderateProfile)}
              {results.overallVerdict === 'weak' && getLabel(LABELS.weakProfile)}
              {results.overallVerdict === 'very_weak' && getLabel(LABELS.veryWeakProfile)}
            </div>
          </div>
        </motion.div>

        {/* Warnings */}
        <AnimatePresence>
          {results.warnings && results.warnings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 space-y-2"
            >
              {results.warnings.map((warning: string, index: number) => (
                <div key={index} className="p-3 bg-red-500/20 rounded-xl flex items-start gap-3 border border-red-500/30">
                  <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-sm text-red-300">{warning}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Assessment Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <FileText className="text-neon-cyan" size={20} />
            {getLabel(LABELS.assessmentDetails)}
          </h3>
          
          <div className="space-y-3">
            {results.factors && results.factors.map((factor: any, index: number) => (
              <motion.div
                key={factor.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => toggleCategory(factor.category)}
                  className="w-full p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'p-2 rounded-lg',
                      (factor.verdict === 'excellent' || factor.verdict === 'strong' || factor.verdict === 'good') && 'bg-green-500/20',
                      (factor.verdict === 'average' || factor.verdict === 'moderate') && 'bg-yellow-500/20',
                      factor.verdict === 'poor' && 'bg-orange-500/20',
                      (factor.verdict === 'critical' || factor.verdict === 'very_weak') && 'bg-red-500/20'
                    )}>
                      {getCategoryIcon(factor.category)}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">{factor.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ 
                              backgroundColor: factor.score >= 70 ? '#22c55e' : factor.score >= 50 ? '#eab308' : '#ef4444',
                              width: `${factor.score}%`
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${factor.score}%` }}
                            transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                          />
                        </div>
                        <span className="text-xs text-white/50">{factor.score}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn('px-2 py-1 rounded-full text-xs border', getVerdictColor(factor.verdict))}>
                      {getVerdictLabel(factor.verdict)}
                    </span>
                    {expandedCategories.has(factor.category) ? (
                      <ChevronUp size={18} className="text-white/50" />
                    ) : (
                      <ChevronDown size={18} className="text-white/50" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {expandedCategories.has(factor.category) && factor.factors && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4"
                    >
                      <div className="border-t border-white/10 pt-4 space-y-3">
                        {factor.factors.map((f: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            {f.includes('❌') || f.includes('⚠️') || f.includes('⚠') ? (
                              <XCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                            ) : f.includes('✓') || f.includes('✅') ? (
                              <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-1.5 flex-shrink-0" />
                            )}
                            <span className={cn(
                              'text-white/80',
                              (f.includes('❌') || f.includes('⚠️') || f.includes('⚠')) && 'text-red-300'
                            )}>
                              {f.replace(/[❌✓⚠️✅]/g, '').trim()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Strengths & Weaknesses */}
        {results.strengths && results.weaknesses && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 gap-3 mb-6"
          >
            <div className="glass-card p-4">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2 text-green-400">
                <CheckCircle size={16} />
                {getLabel(LABELS.strengths)}
              </h4>
              <ul className="space-y-2">
                {results.strengths.slice(0, 3).map((s: string, i: number) => (
                  <li key={i} className="text-xs text-white/70 flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card p-4">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2 text-red-400">
                <AlertTriangle size={16} />
                {getLabel(LABELS.weaknesses)}
              </h4>
              <ul className="space-y-2">
                {results.weaknesses.slice(0, 3).map((w: string, i: number) => (
                  <li key={i} className="text-xs text-white/70 flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Top Actions */}
        {results.advice && results.advice.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card p-4 mb-6"
          >
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="text-neon-magenta" size={20} />
              {getLabel(LABELS.topActions)}
            </h3>
            <div className="space-y-3">
              {results.advice.slice(0, 3).map((advice: any, index: number) => (
                <motion.div
                  key={advice.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className={cn(
                    'p-3 rounded-xl border',
                    advice.priority === 'critical' && 'bg-red-500/10 border-red-500/30',
                    advice.priority === 'high' && 'bg-orange-500/10 border-orange-500/30',
                    advice.priority === 'medium' && 'bg-yellow-500/10 border-yellow-500/30',
                    advice.priority === 'low' && 'bg-white/5 border-white/10'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                      advice.priority === 'critical' && 'bg-red-500/30 text-red-400',
                      advice.priority === 'high' && 'bg-orange-500/30 text-orange-400',
                      advice.priority === 'medium' && 'bg-yellow-500/30 text-yellow-400',
                      advice.priority === 'low' && 'bg-white/20 text-white/60'
                    )}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{advice.title}</h4>
                      {advice.description && <p className="text-xs text-white/60 mb-2">{advice.description}</p>}
                      {advice.impact && <p className="text-xs text-white/40 italic">{advice.impact}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Alternative Countries */}
        {results.alternatives && results.alternatives.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card p-4 mb-6"
          >
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Globe className="text-neon-purple" size={20} />
              {getLabel(LABELS.alternatives)}
            </h3>
            <div className="space-y-2">
              {results.alternatives.map((alt: any, index: number) => (
                <div
                  key={alt.country}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{alt.flag}</span>
                    <div>
                      <span className="font-medium">{alt.country}</span>
                      <span className={cn(
                        'mr-2 text-xs px-2 py-0.5 rounded-full',
                        alt.difficulty === 'easy' && 'bg-green-500/20 text-green-400',
                        alt.difficulty === 'medium' && 'bg-yellow-500/20 text-yellow-400',
                        alt.difficulty === 'hard' && 'bg-red-500/20 text-red-400'
                      )}>
                        {getDifficultyLabel(alt.difficulty)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="font-bold"
                      style={{ color: getScoreColor(alt.score) }}
                    >
                      {alt.score}%
                    </span>
                    {alt.score > results.mainScore ? (
                      <TrendingUp className="text-green-400" size={16} />
                    ) : (
                      <TrendingDown className="text-red-400" size={16} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommended Wait Time */}
        {results.recommendedWaitTime && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-4 mb-6 border-yellow-500/30"
          >
            <div className="flex items-center gap-3">
              <Clock className="text-yellow-400" size={24} />
              <div>
                <p className="font-medium">{getLabel(LABELS.recommendedWait)}</p>
                <p className="text-sm text-white/60">{results.recommendedWaitTime}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="p-4 bg-white/5 rounded-xl mb-6"
        >
          <p className="text-xs text-white/50 text-center leading-relaxed">
            {getLabel(LABELS.disclaimer)}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col gap-3"
        >
          <button onClick={handleWhatIf} className="neon-button flex items-center justify-center gap-2">
            <RefreshCw size={18} />
            {getLabel(LABELS.whatIfSimulator)}
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button className="glass-card-hover py-3 px-4 flex items-center justify-center gap-2 text-sm">
              <Printer size={16} />
              {getLabel(LABELS.printReport)}
            </button>
            <button onClick={handleTryAgain} className="glass-card-hover py-3 px-4 flex items-center justify-center gap-2 text-sm">
              <FileText size={16} />
              {getLabel(LABELS.newAnalysis)}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ResultsDashboard
