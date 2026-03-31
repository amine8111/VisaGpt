'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { 
  Target, CheckCircle, Clock, Bell,
  MessageSquare, Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

interface MilestoneData {
  titleAr: string
  titleEn: string
  titleFr: string
  descAr: string
  descEn: string
  descFr: string
  targetDate: string
  notificationType: ('sms' | 'email' | 'whatsapp')[]
  priority: 'high' | 'medium' | 'low'
}

interface AdviceData {
  titleAr: string
  titleEn: string
  titleFr: string
  descAr: string
  descEn: string
  descFr: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  estimatedImprovement: number
}

interface Milestone extends MilestoneData {
  id: string
  completed: boolean
  notified: boolean
}

interface Advice extends AdviceData {
  id: string
  completed: boolean
}

const milestonesData: MilestoneData[] = [
  {
    titleAr: 'بناء التوفير إلى 600,000 دج',
    titleEn: 'Build savings to 600,000 DZD',
    titleFr: 'Épargner 600 000 DZD',
    descAr: 'الحد الأدنى لتأشيرة شنغن',
    descEn: 'Target minimum balance for Schengen visa',
    descFr: 'Solde minimum pour visa Schengen',
    targetDate: '2026-06-01',
    notificationType: ['sms', 'email'],
    priority: 'high'
  },
  {
    titleAr: 'الحصول على عقد CDI',
    titleEn: 'Get CDI employment contract',
    titleFr: 'Obtenir un contrat CDI',
    descAr: 'التوظيف الدائم يزيد الفرص بشكل كبير',
    descEn: 'Permanent employment significantly increases chances',
    descFr: 'Un emploi permanent augmente considérablement vos chances',
    targetDate: '2026-04-15',
    notificationType: ['email'],
    priority: 'high'
  },
  {
    titleAr: 'التقديم على تأشيرة تركيا',
    titleEn: 'Apply for Turkey visa',
    titleFr: 'Demander un visa pour la Turquie',
    descAr: 'بناء سجل السفر مع تأشيرة أسهل',
    descEn: 'Build travel history with easier visa',
    descFr: 'Construire un historique de voyage avec un visa plus facile',
    targetDate: '2026-05-01',
    notificationType: ['whatsapp'],
    priority: 'medium'
  }
]

const advicesData: AdviceData[] = [
  {
    titleAr: 'زيادة الرصيد البنكي',
    titleEn: 'Increase bank balance',
    titleFr: 'Augmenter le solde bancaire',
    descAr: 'رصيدك الحالي أقل من الحد الموصى به لتأشيرات شنغن.',
    descEn: 'Your current balance is below the recommended threshold for Schengen visas.',
    descFr: 'Votre solde actuel est inférieur au seuil recommandé pour les visas Schengen.',
    priority: 'critical',
    estimatedImprovement: 25,
  },
  {
    titleAr: 'الحصول على عقد CDI',
    titleEn: 'Get CDI contract',
    titleFr: 'Obtenir un contrat CDI',
    descAr: 'عقد employment الدائم يقوي طلبك بشكل كبير.',
    descEn: 'Permanent employment contract significantly strengthens your application.',
    descFr: 'Un contrat de travail permanent renforce considérablement votre demande.',
    priority: 'high',
    estimatedImprovement: 30,
  },
  {
    titleAr: 'بناء سجل السفر',
    titleEn: 'Build travel history',
    titleFr: 'Construire un historique de voyage',
    descAr: 'تأشيرات شنغن السابقة أو غيرها تحسن فرصك بشكل كبير.',
    descEn: 'Previous Schengen or other visas greatly improve your chances.',
    descFr: 'Les visas Schengen ou autres antérieurs améliorent considérablement vos chances.',
    priority: 'medium',
    estimatedImprovement: 20,
  }
]

export function AdviceEngine() {
  const { t, language, dir } = useLanguage()
  const [milestones, setMilestones] = useState<Milestone[]>(
    milestonesData.map((m, i) => ({ ...m, id: String(i + 1), completed: false, notified: false }))
  )
  const [advices] = useState<Advice[]>(
    advicesData.map((a, i) => ({ ...a, id: String(i + 1), completed: false }))
  )
  const [selectedTab, setSelectedTab] = useState<'advices' | 'milestones'>('advices')

  const toggleMilestone = (id: string) => {
    setMilestones(prev => prev.map(m => 
      m.id === id ? { ...m, completed: !m.completed } : m
    ))
  }

  const getMilestoneTitle = (m: Milestone) => 
    language === 'ar' ? m.titleAr : language === 'fr' ? m.titleFr : m.titleEn
  const getMilestoneDesc = (m: Milestone) => 
    language === 'ar' ? m.descAr : language === 'fr' ? m.descFr : m.descEn
  const getAdviceTitle = (a: Advice) => 
    language === 'ar' ? a.titleAr : language === 'fr' ? a.titleFr : a.titleEn
  const getAdviceDesc = (a: Advice) => 
    language === 'ar' ? a.descAr : language === 'fr' ? a.descFr : a.descEn

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-500/20'
      case 'high': return 'text-orange-400 bg-orange-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20'
      default: return 'text-green-400 bg-green-500/20'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical': return t('critical')
      case 'high': return t('high')
      case 'medium': return t('medium')
      default: return t('low')
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'sms': return '📱'
      case 'email': return '📧'
      case 'whatsapp': return '💬'
      default: return '🔔'
    }
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">{t('smartAdvice')}</h2>
          <p className="text-white/60 text-sm">{t('smartAdviceDesc')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-white/60">{t('milestonesProgress')}</p>
              <p className="text-2xl font-bold">
                {milestones.filter(m => m.completed).length}/{milestones.length}
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-neon-cyan/20 flex items-center justify-center">
              <Target className="text-neon-cyan" size={32} />
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(milestones.filter(m => m.completed).length / milestones.length) * 100}%` }}
              className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 mb-6"
        >
          <button
            onClick={() => setSelectedTab('advices')}
            className={cn(
              'flex-1 py-3 rounded-lg text-sm font-medium transition-all',
              selectedTab === 'advices' && 'neon-button',
              selectedTab !== 'advices' && 'glass-card-hover'
            )}
          >
            <MessageSquare className="inline-block ml-2" size={16} />
            {t('adviceTab')}
          </button>
          <button
            onClick={() => setSelectedTab('milestones')}
            className={cn(
              'flex-1 py-3 rounded-lg text-sm font-medium transition-all',
              selectedTab === 'milestones' && 'neon-button',
              selectedTab !== 'milestones' && 'glass-card-hover'
            )}
          >
            <Bell className="inline-block ml-2" size={16} />
            {t('milestonesTab')}
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedTab === 'advices' && (
            <motion.div
              key="advices"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {advices.map((advice, index) => (
                <motion.div
                  key={advice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn('glass-card p-4', advice.completed && 'opacity-50')}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {advice.completed ? (
                        <CheckCircle className="text-green-400" size={24} />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-white/30" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn('px-2 py-1 rounded text-xs font-medium', getPriorityColor(advice.priority))}>
                          {getPriorityLabel(advice.priority)}
                        </span>
                        <span className="text-xs text-neon-cyan">+{advice.estimatedImprovement}%</span>
                      </div>
                      <h4 className="font-medium mb-1">{getAdviceTitle(advice)}</h4>
                      <p className="text-sm text-white/60">{getAdviceDesc(advice)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {selectedTab === 'milestones' && (
            <motion.div
              key="milestones"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn('glass-card p-4', milestone.completed && 'border-green-500/30 bg-green-500/5')}
                >
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggleMilestone(milestone.id)} className="mt-1">
                      {milestone.completed ? (
                        <CheckCircle className="text-green-400" size={24} />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-white/30" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h4 className={cn('font-medium mb-1', milestone.completed && 'text-green-400')}>
                        {getMilestoneTitle(milestone)}
                      </h4>
                      <p className="text-sm text-white/60 mb-3">{getMilestoneDesc(milestone)}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-white/50">
                          <Clock size={14} />
                          <span>{new Date(milestone.targetDate).toLocaleDateString(language === 'ar' ? 'ar-DZ' : language === 'fr' ? 'fr-DZ' : 'en-US')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {milestone.notificationType.map((type) => (
                            <span key={type} className="text-sm">{getNotificationIcon(type)}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full glass-card p-4 border-2 border-dashed border-neon-cyan/30 hover:border-neon-cyan/50 transition-colors text-center"
              >
                <Plus className="text-neon-cyan mx-auto mb-2" size={24} />
                <p className="text-sm text-white/60">{t('addNewGoal')}</p>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 glass-card p-4"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Bell className="text-neon-cyan" size={18} />
            {t('notificationSettings')}
          </h3>
          <div className="space-y-3">
            {[
              { id: 'sms', icon: '📱', label: t('smsMessages') },
              { id: 'email', icon: '📧', label: t('email') },
              { id: 'whatsapp', icon: '💬', label: 'WhatsApp' },
            ].map((method, idx) => (
              <div key={method.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{method.icon}</span>
                  <span className="text-sm">{method.label}</span>
                </div>
                <button className={cn('w-12 h-6 rounded-full transition-all relative', idx === 0 || idx === 1 ? 'bg-neon-cyan' : 'bg-white/20')}>
                  <div className={cn('w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all', idx === 0 || idx === 1 ? 'right-0.5' : 'right-6')} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdviceEngine
