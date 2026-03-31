'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useVisaStore } from '@/store/visaStore'
import { generateProAssessment } from '@/lib/ai'
import { useLanguage } from './LanguageProvider'
import { 
  Shield, CheckCircle, AlertTriangle, XCircle, Sparkles, Target, Calendar, 
  MessageSquare, Clock, ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function ProAssessment() {
  const { t, language } = useLanguage()
  const { userProfile } = useVisaStore()
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const profile = {
        age: userProfile.age || 30,
        nationality: 'Algeria',
        employmentType: (userProfile.employmentType as any) || 'cdi',
        monthlyIncome: userProfile.monthlyIncome || 50000,
        bankBalance: userProfile.bankBalance || 200000,
        averageMonthlyBalance: userProfile.averageMonthlyBalance || 200000,
        yearsEmployed: userProfile.yearsEmployed || 0,
        maritalStatus: (userProfile.maritalStatus as any) || 'single',
        children: userProfile.children || 0,
        hasProperty: userProfile.hasProperty || false,
        hasVehicle: userProfile.hasVehicle || false,
        schengenCount: userProfile.schengenCount || 0,
        previousStamps: userProfile.previousStamps || [],
        visaRefusals: userProfile.visaRefusals || 0,
        overstayHistory: userProfile.overstayHistory || false,
        hasCNAS: userProfile.hasCNAS || false,
        hasSponsor: userProfile.hasSponsor || false,
        sponsorIncome: userProfile.sponsorIncome || 0,
        targetCountry: userProfile.targetCountry || 'France',
        purposeOfVisit: userProfile.purposeOfVisit || 'tourism',
        durationOfStay: userProfile.durationOfStay || '1-2 weeks',
        entryType: (userProfile.entryType as any) || 'single',
        plannedTravelDate: userProfile.plannedTravelDate || '',
        plannedReturnDate: userProfile.plannedReturnDate || '',
        hasBookings: userProfile.hasBookings || false,
        hasInsurance: userProfile.hasInsurance || false,
        hasInvitationLetter: userProfile.hasInvitationLetter || false,
      }
      
      const assessment = generateProAssessment(profile)
      setResult(assessment)
      setLoading(false)
    } catch (err) {
      console.error('ProAssessment error:', err)
      setError('Failed to generate assessment')
      setLoading(false)
    }
  }, [userProfile])

  const getLabel = (en: string, ar: string) => language === 'ar' ? ar : en

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': case 'A': return '#22c55e'
      case 'B+': case 'B': return '#84cc16'
      case 'C': return '#eab308'
      case 'D': return '#f97316'
      default: return '#ef4444'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen px-4 pt-20 pb-28 relative z-10 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta p-1"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <Sparkles className="text-neon-cyan" size={28} />
            </div>
          </motion.div>
          <h2 className="text-xl font-bold mb-2 gradient-text">{t('analyzing')}</h2>
          <p className="text-white/60 text-sm">{t('generatingProAssessment')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen px-4 pt-20 pb-28 relative z-10 flex items-center justify-center">
        <div className="text-center glass-card p-8 rounded-xl">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">{t('error')}</h2>
          <p className="text-white/60">{error}</p>
        </div>
      </div>
    )
  }

  const gradeColor = getGradeColor(result?.grade || 'F')

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-magenta flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold">{t('proAssessment')}</h1>
              <p className="text-xs text-white/60">{t('professionalAnalysis')}</p>
            </div>
          </div>
        </motion.div>

        {/* Grade Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 mb-6 text-center relative overflow-hidden"
        >
          <div 
            className="absolute inset-0 opacity-20"
            style={{ background: `radial-gradient(circle at center, ${gradeColor} 0%, transparent 70%)` }}
          />
          
          <div className="relative z-10">
            <p className="text-white/60 text-sm mb-2">{getLabel('Your Grade', 'درجتك')}</p>
            <motion.div
              className="text-7xl font-bold mb-2"
              style={{ color: gradeColor, textShadow: `0 0 60px ${gradeColor}` }}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
            >
              {result?.grade || 'N/A'}
            </motion.div>
            <p className="text-sm font-medium mb-4" style={{ color: gradeColor }}>
              {result?.gradeDescription || 'Assessment'}
            </p>
            
            {/* Score */}
            <div className="max-w-xs mx-auto">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/60">{getLabel('Overall Score', 'النتيجة الإجمالية')}</span>
                <span className="font-bold">{result?.overallScore || 0}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: gradeColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${result?.overallScore || 0}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Score Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 mb-6"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Target className="text-neon-cyan" size={18} />
            {getLabel('Application Breakdown', 'تفصيل الطلب')}
          </h3>
          
          <div className="space-y-3">
            {result?.fields?.map((field: any, index: number) => (
              <div key={index} className="p-3 bg-white/5 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">{getLabel(field.name, field.nameAr)}</span>
                  <span className="text-sm font-bold" style={{ 
                    color: field.status === 'excellent' || field.status === 'good' ? '#22c55e' : 
                           field.status === 'average' ? '#eab308' : '#ef4444' 
                  }}>
                    {field.score}/{field.maxScore}
                  </span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(field.score / field.maxScore) * 100}%`,
                      backgroundColor: field.status === 'excellent' || field.status === 'good' ? '#22c55e' : 
                                     field.status === 'average' ? '#eab308' : '#ef4444'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Advice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5 mb-6"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Sparkles className="text-neon-purple" size={18} />
            {getLabel('AI Recommendations', 'توصيات الذكاء الاصطناعي')}
          </h3>
          
          {result?.aiAdvice?.length === 0 ? (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
              <p className="text-white/70">{t('applicationLooksGreat')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {result?.aiAdvice?.slice(0, 3).map((advice: any, index: number) => (
                <div
                  key={index}
                  className={cn(
                    'p-4 rounded-xl border',
                    advice.category === 'critical' && 'bg-red-500/10 border-red-500/30',
                    advice.category === 'high' && 'bg-orange-500/10 border-orange-500/30',
                    advice.category === 'medium' && 'bg-yellow-500/10 border-yellow-500/30'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                      advice.category === 'critical' && 'bg-red-500/30 text-red-400',
                      advice.category === 'high' && 'bg-orange-500/30 text-orange-400',
                      advice.category === 'medium' && 'bg-yellow-500/30 text-yellow-400'
                    )}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm mb-1">{getLabel(advice.title, advice.titleAr)}</h4>
                      <p className="text-xs text-white/70 mb-2">{getLabel(advice.description, advice.descriptionAr)}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-white/10 rounded-full flex items-center gap-1">
                          <Clock size={12} />
                          {getLabel(advice.timeline, advice.timelineAr)}
                        </span>
                        <span className="text-xs px-2 py-1 bg-neon-cyan/20 text-neon-cyan rounded-full">
                          +{advice.estimatedImprovement}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Missing Documents */}
        {result?.missingDocuments?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-5 mb-6 border-red-500/30"
          >
            <h3 className="font-bold mb-3 flex items-center gap-2 text-red-400">
              <AlertTriangle size={18} />
              {getLabel('Missing Documents', 'وثائق مفقودة')}
            </h3>
            <ul className="space-y-2">
              {result.missingDocuments.map((doc: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {doc}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-5"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Calendar className="text-neon-cyan" size={18} />
            {getLabel('Your Action Plan', 'خطة العمل')}
          </h3>
          
          <div className="space-y-4">
            {result?.personalizedPlan?.steps?.map((step: any, i: number) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-neon-cyan/20 border-2 border-neon-cyan flex items-center justify-center text-sm font-bold">
                    {step.week}
                  </div>
                  {i < (result?.personalizedPlan?.steps?.length || 0) - 1 && (
                    <div className="w-0.5 h-full bg-neon-cyan/30 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <h4 className="font-medium text-sm mb-1">{getLabel(step.title, step.titleAr)}</h4>
                  <p className="text-xs text-white/60 mb-2">{getLabel(step.target, step.targetAr)}</p>
                  <ul className="space-y-1">
                    {(language === 'ar' ? step.actionsAr : step.actions)?.map((action: string, j: number) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-white/70">
                        <ArrowRight size={12} />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
