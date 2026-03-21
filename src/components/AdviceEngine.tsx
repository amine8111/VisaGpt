'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { 
  Target, CheckCircle, Clock, AlertCircle, Bell,
  MessageSquare, Mail, Phone, ChevronRight, Plus, Trash2
} from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

interface Milestone {
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  targetDate: string
  completed: boolean
  notified: boolean
  notificationType: ('sms' | 'email' | 'whatsapp')[]
  priority: 'high' | 'medium' | 'low'
}

interface Advice {
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  estimatedImprovement: number
  completed: boolean
}

export function AdviceEngine() {
  const { userProfile, setActiveNav } = useVisaStore()
  const { t, dir } = useLanguage()
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: '1',
      title: 'Build savings to 600,000 DZD',
      titleAr: 'بناء التوفير إلى 600,000 دج',
      description: 'Target minimum balance for Schengen visa',
      descriptionAr: 'الحد الأدنى لتأشيرة شنغن',
      targetDate: '2026-06-01',
      completed: false,
      notified: false,
      notificationType: ['sms', 'email'],
      priority: 'high'
    },
    {
      id: '2',
      title: 'Get CDI employment contract',
      titleAr: 'الحصول على عقد CDI',
      description: 'Permanent employment significantly increases chances',
      descriptionAr: 'التوظيف الدائم يزيد الفرص بشكل كبير',
      targetDate: '2026-04-15',
      completed: false,
      notified: false,
      notificationType: ['email'],
      priority: 'high'
    },
    {
      id: '3',
      title: 'Apply for Turkey visa',
      titleAr: 'التقديم على تأشيرة تركيا',
      description: 'Build travel history with easier visa',
      descriptionAr: 'بناء سجل السفر مع تأشيرة أسهل',
      targetDate: '2026-05-01',
      completed: false,
      notified: false,
      notificationType: ['whatsapp'],
      priority: 'medium'
    }
  ])

  const [advices] = useState<Advice[]>([
    {
      id: '1',
      title: 'Increase bank balance',
      titleAr: 'زيادة الرصيد البنكي',
      description: 'Your current balance is below the recommended threshold for Schengen visas.',
      descriptionAr: 'رصيدك الحالي أقل من الحد الموصى به لتأشيرات شنغن.',
      priority: 'critical',
      estimatedImprovement: 25,
      completed: false
    },
    {
      id: '2',
      title: 'Get CDI contract',
      titleAr: 'الحصول على عقد CDI',
      description: 'Permanent employment contract significantly strengthens your application.',
      descriptionAr: 'عقد employment الدائم يقوي طلبك بشكل كبير.',
      priority: 'high',
      estimatedImprovement: 30,
      completed: false
    },
    {
      id: '3',
      title: 'Build travel history',
      titleAr: 'بناء سجل السفر',
      description: 'Previous Schengen or other visas greatly improve your chances.',
      descriptionAr: 'تأشيرات شنغن السابقة أو غيرها تحسن فرصك بشكل كبير.',
      priority: 'medium',
      estimatedImprovement: 20,
      completed: false
    }
  ])

  const [selectedTab, setSelectedTab] = useState<'advices' | 'milestones'>('advices')

  const toggleMilestone = (id: string) => {
    setMilestones(prev => prev.map(m => 
      m.id === id ? { ...m, completed: !m.completed } : m
    ))
  }

  const toggleAdvice = (id: string) => {
    // In real app, this would update the backend
    console.log('Toggle advice:', id)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-500/20'
      case 'high': return 'text-orange-400 bg-orange-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20'
      default: return 'text-green-400 bg-green-500/20'
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
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">نصائح ذكية</h2>
          <p className="text-white/60 text-sm">
            تتبع إنجازاتك واحصل على إشعارات
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-white/60">تقدم الإنجازات</p>
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

        {/* Tab Selector */}
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
            النصائح
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
            الإنجازات
          </button>
        </motion.div>

        {/* Content */}
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
                  className={cn(
                    'glass-card p-4',
                    advice.completed && 'opacity-50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleAdvice(advice.id)}
                      className="mt-1"
                    >
                      {advice.completed ? (
                        <CheckCircle className="text-green-400" size={24} />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-white/30" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn(
                          'px-2 py-1 rounded text-xs font-medium',
                          getPriorityColor(advice.priority)
                        )}>
                          {advice.priority === 'critical' && 'حرج'}
                          {advice.priority === 'high' && 'مرتفع'}
                          {advice.priority === 'medium' && 'متوسط'}
                          {advice.priority === 'low' && 'منخفض'}
                        </span>
                        <span className="text-xs text-neon-cyan">
                          +{advice.estimatedImprovement}%
                        </span>
                      </div>
                      <h4 className="font-medium mb-1">{advice.titleAr}</h4>
                      <p className="text-sm text-white/60">{advice.descriptionAr}</p>
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
                  className={cn(
                    'glass-card p-4',
                    milestone.completed && 'border-green-500/30 bg-green-500/5'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleMilestone(milestone.id)}
                      className="mt-1"
                    >
                      {milestone.completed ? (
                        <CheckCircle className="text-green-400" size={24} />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-white/30" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h4 className={cn(
                        'font-medium mb-1',
                        milestone.completed && 'text-green-400'
                      )}>
                        {milestone.titleAr}
                      </h4>
                      <p className="text-sm text-white/60 mb-3">
                        {milestone.descriptionAr}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-white/50">
                          <Clock size={14} />
                          <span>{new Date(milestone.targetDate).toLocaleDateString('ar-DZ')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {milestone.notificationType.map((type) => (
                            <span key={type} className="text-sm">
                              {getNotificationIcon(type)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Add New Milestone */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full glass-card p-4 border-2 border-dashed border-neon-cyan/30 hover:border-neon-cyan/50 transition-colors text-center"
              >
                <Plus className="text-neon-cyan mx-auto mb-2" size={24} />
                <p className="text-sm text-white/60">إضافة هدف جديد</p>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 glass-card p-4"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Bell className="text-neon-cyan" size={18} />
            إعدادات الإشعارات
          </h3>
          <div className="space-y-3">
            {[
              { id: 'sms', icon: '📱', label: 'رسائل SMS', enabled: true },
              { id: 'email', icon: '📧', label: 'البريد الإلكتروني', enabled: true },
              { id: 'whatsapp', icon: '💬', label: 'WhatsApp', enabled: false },
            ].map((method) => (
              <div key={method.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{method.icon}</span>
                  <span className="text-sm">{method.label}</span>
                </div>
                <button className={cn(
                  'w-12 h-6 rounded-full transition-all relative',
                  method.enabled ? 'bg-neon-cyan' : 'bg-white/20'
                )}>
                  <div className={cn(
                    'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all',
                    method.enabled ? 'right-0.5' : 'right-6'
                  )} />
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
