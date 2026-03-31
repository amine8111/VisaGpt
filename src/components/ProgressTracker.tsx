'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, Target, CheckCircle, Circle, Clock,
  Calendar, Trophy, Star, Zap, ChevronRight,
  FileText, CreditCard, Users, Plane, Shield,
  AlertCircle, CheckCheck
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { cn } from '@/lib/utils'

interface Milestone {
  id: string
  title: string
  titleAr: string
  titleFr: string
  description: string
  descriptionAr: string
  descriptionFr: string
  icon: any
  status: 'completed' | 'in_progress' | 'pending'
  date?: string
  dateAr?: string
  dateFr?: string
  aiScoreBonus: number
}

interface VisaProgress {
  id: string
  country: string
  countryAr: string
  countryFr: string
  countryFlag: string
  visaType: string
  visaTypeAr: string
  visaTypeFr: string
  currentScore: number
  targetScore: number
  milestones: Milestone[]
  startedAt: string
  targetDate?: string
  targetDateAr?: string
  targetDateFr?: string
}

const defaultProgress: VisaProgress[] = [
  {
    id: 'progress-1',
    country: 'France',
    countryAr: 'فرنسا',
    countryFr: 'France',
    countryFlag: '🇫🇷',
    visaType: 'Schengen',
    visaTypeAr: 'شنغن',
    visaTypeFr: 'Schengen',
    currentScore: 68,
    targetScore: 75,
    startedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    targetDate: new Date(Date.now() + 60 * 86400000).toISOString(),
    targetDateAr: new Date(Date.now() + 60 * 86400000).toLocaleDateString('ar-DZ'),
    targetDateFr: new Date(Date.now() + 60 * 86400000).toLocaleDateString('fr-FR'),
    milestones: [
      { id: 'm1', title: 'Profile Setup', titleAr: 'إعداد الملف', titleFr: 'Configuration du profil', description: 'Complete your profile with personal info', descriptionAr: 'أكمل ملفك بالمعلومات الشخصية', descriptionFr: 'Complétez votre profil', icon: Users, status: 'completed', date: '2024-01-15', aiScoreBonus: 5 },
      { id: 'm2', title: 'Document Collection', titleAr: 'جمع الوثائق', titleFr: 'Collecte des documents', description: 'Gather all required documents', descriptionAr: 'اجمع جميع الوثائق المطلوبة', descriptionFr: 'Rassembler tous les documents', icon: FileText, status: 'completed', date: '2024-01-20', aiScoreBonus: 10 },
      { id: 'm3', title: 'Financial Health', titleAr: 'الصحة المالية', titleFr: 'Santé financière', description: 'Build stable bank balance', descriptionAr: 'بناء رصيد بنكي مستقر', descriptionFr: 'Construire un solde stable', icon: CreditCard, status: 'in_progress', aiScoreBonus: 15 },
      { id: 'm4', title: 'Interview Practice', titleAr: 'تدريب المقابلة', titleFr: "Pratique d'entretien", description: 'Practice with AI simulator', descriptionAr: 'تدرب مع المحاكي الذكي', descriptionFr: 'Pratiquez avec le simulateur IA', icon: Users, status: 'pending', aiScoreBonus: 10 },
      { id: 'm5', title: 'Book Appointment', titleAr: 'حجز موعد', titleFr: 'Prendre rendez-vous', description: 'Schedule embassy appointment', descriptionAr: 'حدد موعد السفارة', descriptionFr: 'Planifier le rendez-vous', icon: Calendar, status: 'pending', aiScoreBonus: 5 },
      { id: 'm6', title: 'Submit Application', titleAr: 'تقديم الطلب', titleFr: 'Soumettre la demande', description: 'Final submission', descriptionAr: 'التقديم النهائي', descriptionFr: 'Soumission finale', icon: Plane, status: 'pending', aiScoreBonus: 5 },
    ]
  }
]

export function ProgressTracker() {
  const { t, language } = useLanguage()
  const [progress, setProgress] = useState<VisaProgress[]>(defaultProgress)
  const [selectedVisa, setSelectedVisa] = useState<VisaProgress | null>(defaultProgress[0])
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('month')

  useEffect(() => {
    const saved = localStorage.getItem('visagpt_progress')
    if (saved) {
      const parsed = JSON.parse(saved)
      setProgress(parsed)
      if (parsed.length > 0) {
        setSelectedVisa(parsed[0])
      }
    }
  }, [])

  const overallStats = {
    totalProgress: progress.reduce((acc, p) => acc + p.currentScore, 0) / (progress.length || 1),
    totalMilestones: progress.reduce((acc, p) => acc + p.milestones.filter(m => m.status === 'completed').length, 0),
    totalMilestonesTarget: progress.reduce((acc, p) => acc + p.milestones.length, 0),
    avgDaysToGoal: 45,
    streak: 12,
  }

  const getTitle = (item: Milestone) => {
    if (language === 'ar') return item.titleAr
    if (language === 'fr') return item.titleFr
    return item.title
  }

  const getDescription = (item: Milestone) => {
    if (language === 'ar') return item.descriptionAr
    if (language === 'fr') return item.descriptionFr
    return item.description
  }

  const getCountry = (item: VisaProgress) => {
    if (language === 'ar') return item.countryAr
    if (language === 'fr') return item.countryFr
    return item.country
  }

  const getVisaType = (item: VisaProgress) => {
    if (language === 'ar') return item.visaTypeAr
    if (language === 'fr') return item.visaTypeFr
    return item.visaType
  }

  const getMilestoneStatus = (status: Milestone['status']) => {
    switch (status) {
      case 'completed': return { label: language === 'ar' ? 'مكتمل' : language === 'fr' ? 'Terminé' : 'Done', color: 'text-emerald-400 bg-emerald-400/20' }
      case 'in_progress': return { label: language === 'ar' ? 'قيد التنفيذ' : language === 'fr' ? 'En cours' : 'In Progress', color: 'text-amber-400 bg-amber-400/20' }
      default: return { label: language === 'ar' ? 'معلق' : language === 'fr' ? 'En attente' : 'Pending', color: 'text-white/40 bg-white/10' }
    }
  }

  const completedMilestones = selectedVisa?.milestones.filter(m => m.status === 'completed').length || 0
  const progressPercent = selectedVisa ? (completedMilestones / selectedVisa.milestones.length) * 100 : 0

  return (
    <div className="min-h-screen p-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-4">
            <TrendingUp className="text-emerald-400" size={20} />
            <span className="text-emerald-400 text-sm font-medium">
              {language === 'ar' ? 'تتبع تقدمك' : language === 'fr' ? 'Suivez vos progrès' : 'Track Your Progress'}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">
              {language === 'ar' ? 'مخطط التقدم' : language === 'fr' ? 'Plan de Progrès' : 'Progress Tracker'}
            </span>
          </h1>
          <p className="text-white/60">
            {language === 'ar' 
              ? 'تتبع رحلتك نحو الحصول على التأشيرة' 
              : language === 'fr' 
              ? 'Suivez votre parcours vers l\'obtention du visa' 
              : 'Track your journey to visa approval'}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="glass-card p-4 text-center">
            <Trophy className="mx-auto mb-2 text-amber-400" size={24} />
            <p className="text-2xl font-bold text-white">{Math.round(overallStats.totalProgress)}%</p>
            <p className="text-xs text-white/50">{language === 'ar' ? 'متوسط الدرجة' : language === 'fr' ? 'Score moyen' : 'Average Score'}</p>
          </div>
          <div className="glass-card p-4 text-center">
            <CheckCircle className="mx-auto mb-2 text-emerald-400" size={24} />
            <p className="text-2xl font-bold text-white">{overallStats.totalMilestones}/{overallStats.totalMilestonesTarget}</p>
            <p className="text-xs text-white/50">{language === 'ar' ? 'المراحل' : language === 'fr' ? 'Étapes' : 'Milestones'}</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Clock className="mx-auto mb-2 text-neon-cyan" size={24} />
            <p className="text-2xl font-bold text-white">{overallStats.avgDaysToGoal}</p>
            <p className="text-xs text-white/50">{language === 'ar' ? 'يوم للهدف' : language === 'fr' ? 'jours' : 'days to goal'}</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Zap className="mx-auto mb-2 text-neon-purple" size={24} />
            <p className="text-2xl font-bold text-white">{overallStats.streak}</p>
            <p className="text-xs text-white/50">{language === 'ar' ? 'أيام متتالية' : language === 'fr' ? 'jours consécutifs' : 'day streak'}</p>
          </div>
        </motion.div>

        {/* Visa Selection */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {progress.map((visa) => (
            <button
              key={visa.id}
              onClick={() => setSelectedVisa(visa)}
              className={cn(
                'flex-shrink-0 px-4 py-3 rounded-xl transition-all flex items-center gap-2',
                selectedVisa?.id === visa.id 
                  ? 'bg-neon-cyan/20 border border-neon-cyan/50' 
                  : 'glass-card hover:bg-white/5'
              )}
            >
              <span className="text-2xl">{visa.countryFlag}</span>
              <div className="text-left">
                <p className="font-medium text-sm">{getCountry(visa)}</p>
                <p className="text-xs text-white/50">{getVisaType(visa)}</p>
              </div>
            </button>
          ))}
          <button className="flex-shrink-0 glass-card p-3 rounded-xl hover:bg-white/5">
            <span className="text-2xl">➕</span>
          </button>
        </div>

        {/* Selected Visa Progress */}
        {selectedVisa && (
          <>
            {/* Score Card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-4 mb-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedVisa.countryFlag}</span>
                  <div>
                    <h3 className="font-bold">{getCountry(selectedVisa)}</h3>
                    <p className="text-sm text-white/50">{getVisaType(selectedVisa)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-neon-cyan">{selectedVisa.currentScore}%</p>
                  <p className="text-xs text-white/50">
                    {language === 'ar' ? 'من' : language === 'fr' ? 'sur' : 'of'} {selectedVisa.targetScore}%
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-2">
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(selectedVisa.currentScore / selectedVisa.targetScore) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-neon-cyan to-emerald-400 rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                  </motion.div>
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-white/50">
                <span>{language === 'ar' ? 'ابدأ' : language === 'fr' ? 'Début' : 'Start'}</span>
                <span>{language === 'ar' ? 'الهدف' : language === 'fr' ? 'Objectif' : 'Target'}: {selectedVisa.targetScore}%</span>
              </div>

              {selectedVisa.targetDate && (
                <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
                  <Calendar size={14} />
                  <span>
                    {language === 'ar' ? 'الموعد المستهدف' : language === 'fr' ? 'Date cible' : 'Target date'}: {selectedVisa.targetDateAr || selectedVisa.targetDate}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Milestones Timeline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Target size={18} className="text-neon-purple" />
                  {language === 'ar' ? 'المراحل' : language === 'fr' ? 'Étapes' : 'Milestones'}
                </h3>
                <span className="text-sm text-white/50">
                  {completedMilestones}/{selectedVisa.milestones.length}
                </span>
              </div>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-white/10" />
                
                <div className="space-y-4">
                  {selectedVisa.milestones.map((milestone, index) => {
                    const Icon = milestone.icon
                    const statusInfo = getMilestoneStatus(milestone.status)
                    const isLast = index === selectedVisa.milestones.length - 1
                    
                    return (
                      <motion.div
                        key={milestone.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex gap-4"
                      >
                        {/* Icon */}
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center z-10 flex-shrink-0',
                          milestone.status === 'completed' && 'bg-emerald-400 text-black',
                          milestone.status === 'in_progress' && 'bg-amber-400 text-black',
                          milestone.status === 'pending' && 'bg-white/10 text-white/50'
                        )}>
                          {milestone.status === 'completed' ? (
                            <CheckCheck size={20} />
                          ) : milestone.status === 'in_progress' ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            >
                              <Icon size={20} />
                            </motion.div>
                          ) : (
                            <Icon size={20} />
                          )}
                        </div>

                        {/* Content */}
                        <div className={cn(
                          'flex-1 glass-card p-4 rounded-xl',
                          milestone.status === 'completed' && 'bg-emerald-400/5 border-emerald-400/20',
                          milestone.status === 'in_progress' && 'bg-amber-400/5 border-amber-400/20'
                        )}>
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium flex items-center gap-2">
                                {getTitle(milestone)}
                                <span className={cn('text-xs px-2 py-0.5 rounded-full', statusInfo.color)}>
                                  {statusInfo.label}
                                </span>
                              </h4>
                              <p className="text-sm text-white/50 mt-1">{getDescription(milestone)}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-neon-cyan font-medium">+{milestone.aiScoreBonus}%</span>
                            </div>
                          </div>
                          {milestone.status === 'in_progress' && (
                            <div className="mt-3">
                              <button className="text-sm text-neon-cyan hover:text-neon-cyan/80 flex items-center gap-1">
                                {language === 'ar' ? 'ابدأ الآن' : language === 'fr' ? 'Commencer' : 'Start now'}
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* AI Recommendation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 card-ai p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-neon-purple/20 flex items-center justify-center">
                  <Star className="text-neon-purple" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">
                    {language === 'ar' ? 'توصية الذكاء الاصطناعي' : language === 'fr' ? 'Recommandation IA' : 'AI Recommendation'}
                  </h4>
                  <p className="text-xs text-white/60">
                    {language === 'ar' 
                      ? `لتحقيق هدفك بنسبة ${selectedVisa.targetScore}%، ركز على "${selectedVisa.milestones.find(m => m.status === 'in_progress')?.titleAr}" -，这将给你增加 ${selectedVisa.milestones.find(m => m.status === 'in_progress')?.aiScoreBonus}%`
                      : language === 'fr'
                      ? `Pour atteindre votre objectif de ${selectedVisa.targetScore}%, concentrez-vous sur "${selectedVisa.milestones.find(m => m.status === 'in_progress')?.titleFr}" - cela vous donnera +${selectedVisa.milestones.find(m => m.status === 'in_progress')?.aiScoreBonus}%`
                      : `To reach your ${selectedVisa.targetScore}% goal, focus on "${selectedVisa.milestones.find(m => m.status === 'in_progress')?.title}" - this will give you +${selectedVisa.milestones.find(m => m.status === 'in_progress')?.aiScoreBonus}%`
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProgressTracker
