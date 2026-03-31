'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, TrendingDown, Target, Award, Zap, Clock,
  Calendar, MapPin, Plane, Globe, CheckCircle, AlertTriangle,
  Sparkles, Brain, ArrowRight, ChevronRight, Loader2, Download
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { cn } from '@/lib/utils'

interface TimelineEvent {
  id: string
  phase: string
  phaseAr: string
  duration: string
  durationAr: string
  description: string
  descriptionAr: string
  status: 'past' | 'current' | 'future'
  tips: string[]
  tipsAr: string[]
}

interface VisaRoadmapProps {
  destination?: string
  visaType?: string
}

const generateVisaRoadmap = (destination: string, visaType: string): TimelineEvent[] => {
  const baseEvents: TimelineEvent[] = [
    {
      id: '1',
      phase: 'Preparation',
      phaseAr: 'التحضير',
      duration: '3-6 months',
      durationAr: '3-6 أشهر',
      description: 'Gather documents and strengthen profile',
      descriptionAr: 'جمع الوثائق وتقوية الملف',
      status: 'past',
      tips: [
        'Open a savings account with regular deposits',
        'Get a permanent work contract',
        'Build travel history if possible',
        'Start collecting required documents'
      ],
      tipsAr: [
        'افتح حساب توفير مع إيداعات منتظمة',
        'احصل على عقد عمل دائم',
        'ابنِ سجل السفر إن أمكن',
        'ابدأ بجمع الوثائق المطلوبة'
      ]
    },
    {
      id: '2',
      phase: 'Document Collection',
      phaseAr: 'جمع الوثائق',
      duration: '2-4 weeks',
      durationAr: '2-4 أسابيع',
      description: 'Collect all required documents',
      descriptionAr: 'جمع جميع الوثائق المطلوبة',
      status: 'past',
      tips: [
        'Passport (valid 6+ months)',
        'Bank statements (last 3 months)',
        'Employment letter',
        'Travel insurance',
        'Hotel bookings'
      ],
      tipsAr: [
        'جواز السفر (صالح 6+ أشهر)',
        'كشوف الحساب (آخر 3 أشهر)',
        'خطاب العمل',
        'تأمين السفر',
        'حجوزات الفندق'
      ]
    },
    {
      id: '3',
      phase: 'Application Form',
      phaseAr: 'نموذج الطلب',
      duration: '1-2 days',
      durationAr: '1-2 يوم',
      description: 'Fill out visa application correctly',
      descriptionAr: 'املأ نموذج التأشيرة بشكل صحيح',
      status: 'current',
      tips: [
        'Double-check all information',
        'Ensure consistency across documents',
        'Use our AI form assistant',
        'Review before submission'
      ],
      tipsAr: [
        'تحقق من جميع المعلومات مرتين',
        'تأكد من الاتساق عبر الوثائق',
        'استخدم مساعدنا الذكي',
        'راجع قبل الإرسال'
      ]
    },
    {
      id: '4',
      phase: 'Appointment Booking',
      phaseAr: 'حجز موعد',
      duration: '1 day',
      durationAr: 'يوم واحد',
      description: 'Book appointment at embassy/consulate',
      descriptionAr: 'احجز موعد في السفارة/القنصلية',
      status: 'future',
      tips: [
        'Book early - slots fill quickly',
        'Use our slot monitor to find openings',
        'Choose morning appointments',
        'Arrive 30 minutes early'
      ],
      tipsAr: [
        'احجز مبكراً - المواعيد تنتهي بسرعة',
        'استخدم مراقب المواعيد لدينا',
        'اختر مواعيد الصباح',
        'وصل قبل 30 دقيقة'
      ]
    },
    {
      id: '5',
      phase: 'Interview Preparation',
      phaseAr: 'التحضير للمقابلة',
      duration: '1 week',
      durationAr: 'أسبوع واحد',
      description: 'Prepare for visa interview',
      descriptionAr: 'التحضير لمقابلة التأشيرة',
      status: 'future',
      tips: [
        'Practice with our AI interview simulator',
        'Know your application details',
        'Prepare honest answers',
        'Dress professionally'
      ],
      tipsAr: [
        'تدرب مع محاكي المقابلة الذكي',
        'اعرف تفاصيل طلبك',
        'جهز إجابات صادقة',
        'البس بشكل احترافي'
      ]
    },
    {
      id: '6',
      phase: 'Interview Day',
      phaseAr: 'يوم المقابلة',
      duration: '1 day',
      durationAr: 'يوم واحد',
      description: 'Attend visa interview',
      descriptionAr: 'حضور مقابلة التأشيرة',
      status: 'future',
      tips: [
        'Bring all original documents',
        'Stay calm and honest',
        'Answer confidently',
        'Ask questions if unclear'
      ],
      tipsAr: [
        'أحضر جميع الوثائق الأصلية',
        'ابقَ هادئاً وصادقاً',
        'أجب بثقة',
        'اسأل إذا لم تفهم'
      ]
    },
    {
      id: '7',
      phase: 'Waiting Period',
      phaseAr: 'فترة الانتظار',
      duration: '2-4 weeks',
      durationAr: '2-4 أسابيع',
      description: 'Wait for visa processing',
      descriptionAr: 'الانتظار لمعالجة التأشيرة',
      status: 'future',
      tips: [
        'Track application status',
        'Use our visa status tracker',
        'Be patient - processing takes time',
        'Prepare for travel if approved'
      ],
      tipsAr: [
        'تتبع حالة الطلب',
        'استخدم متتبع حالة التأشيرة',
        'تحلى بالصبر - المعالجة تحتاج وقت',
        'استعد للسفر إذا وافقت'
      ]
    },
    {
      id: '8',
      phase: 'Visa Received!',
      phaseAr: 'استلام التأشيرة!',
      duration: 'Done',
      durationAr: 'تم',
      description: 'Collect your visa and travel',
      descriptionAr: 'استلم تأشيرتك وسافر',
      status: 'future',
      tips: [
        'Check visa details carefully',
        'Verify dates and name spelling',
        'Book flight tickets',
        'Enjoy your trip!'
      ],
      tipsAr: [
        'تحقق من تفاصيل التأشيرة بعناية',
        'تأكد من التواريخ واسمك',
        'احجز تذاكر الطيران',
        'استمتع برحلتك!'
      ]
    }
  ]

  return baseEvents
}

export function VisaRoadmap({ destination = 'Schengen', visaType = 'Tourist' }: VisaRoadmapProps) {
  const { t, language } = useLanguage()
  const [roadmap] = useState(() => generateVisaRoadmap(destination, visaType))
  const [expandedPhase, setExpandedPhase] = useState<string | null>('3')

  const completedPhases = roadmap.filter(e => e.status === 'past').length
  const totalProgress = (completedPhases / roadmap.length) * 100

  return (
    <div className="min-h-screen p-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30 mb-4">
            <MapPin className="text-neon-purple animate-pulse" size={20} />
            <span className="text-neon-purple text-sm font-medium">AI-Powered</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">{t('visaRoadmap')}</span>
          </h1>
          <p className="text-white/60">{t('visaRoadmapDesc')}</p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-ai mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold">{language === 'ar' ? 'تقدمك' : language === 'fr' ? 'Votre progression' : 'Your Progress'}</h3>
              <p className="text-sm text-white/50">
                {completedPhases}/{roadmap.length} {language === 'ar' ? 'مرحلة مكتملة' : language === 'fr' ? 'phases terminées' : 'phases completed'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-neon-cyan">{Math.round(totalProgress)}%</div>
              <p className="text-xs text-white/50">{language === 'ar' ? 'مكتمل' : 'Complete'}</p>
            </div>
          </div>
          <div className="progress-bar">
            <motion.div 
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${totalProgress}%` }}
            />
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neon-cyan via-neon-purple to-neon-magenta" />

          {/* Events */}
          <div className="space-y-4">
            {roadmap.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div 
                  className={cn(
                    'relative pl-20 cursor-pointer',
                    event.status === 'future' && 'opacity-60'
                  )}
                  onClick={() => setExpandedPhase(expandedPhase === event.id ? null : event.id)}
                >
                  {/* Timeline Dot */}
                  <div className={cn(
                    'absolute left-5 w-6 h-6 rounded-full flex items-center justify-center z-10',
                    event.status === 'past' && 'bg-emerald-500',
                    event.status === 'current' && 'bg-neon-cyan animate-pulse',
                    event.status === 'future' && 'bg-white/20'
                  )}>
                    {event.status === 'past' && <CheckCircle size={14} className="text-white" />}
                    {event.status === 'current' && <Target size={14} className="text-white" />}
                    {event.status === 'future' && <div className="w-2 h-2 rounded-full bg-white/50" />}
                  </div>

                  {/* Content Card */}
                  <motion.div
                    className={cn(
                      'glass-card p-4 transition-all',
                      event.status === 'current' && 'border-neon-cyan/50 bg-neon-cyan/5',
                      expandedPhase === event.id && 'bg-white/10'
                    )}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">
                            {language === 'ar' ? event.phaseAr : event.phase}
                          </span>
                          {event.status === 'current' && (
                            <span className="badge badge-cyan">Current</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={12} className="text-white/50" />
                          <span className="text-xs text-white/50">
                            {language === 'ar' ? event.durationAr : event.duration}
                          </span>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedPhase === event.id ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight size={20} className="text-white/50" />
                      </motion.div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {expandedPhase === event.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-white/10"
                        >
                          <p className="text-sm text-white/70 mb-4">
                            {language === 'ar' ? event.descriptionAr : event.description}
                          </p>
                          
                          {/* AI Tips */}
                          <div className="bg-gradient-to-r from-neon-cyan/10 to-transparent p-4 rounded-xl">
                            <div className="flex items-center gap-2 mb-3">
                              <Sparkles className="text-neon-cyan" size={16} />
                              <span className="font-bold text-sm text-neon-cyan">
                                {language === 'ar' ? 'نصائح الذكاء الاصطناعي' : language === 'fr' ? "Conseils de l'IA" : 'AI Tips'}
                              </span>
                            </div>
                            <ul className="space-y-2">
                              {(language === 'ar' ? event.tipsAr : event.tips).map((tip, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <ArrowRight size={14} className="text-neon-cyan mt-0.5 flex-shrink-0" />
                                  <span className="text-white/70">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Action Button */}
                          {event.status !== 'past' && (
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              className="mt-4 btn-primary w-full flex items-center justify-center gap-2"
                            >
                              {language === 'ar' ? 'ابدأ هذه المرحلة' : language === 'fr' ? 'Commencer cette phase' : 'Start This Phase'}
                              <ArrowRight size={16} />
                            </motion.button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Assistant CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <div className="card-ai text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
              <Brain className="text-neon-cyan" size={32} />
            </div>
            <h3 className="font-bold text-lg mb-2">
              {language === 'ar' ? 'هل تحتاج مساعدة?' : language === 'fr' ? "Besoin d'aide?" : 'Need Help?'}
            </h3>
            <p className="text-white/60 text-sm mb-4">
              {language === 'ar' 
                ? 'تواصل مع مساعد الذكاء الاصطناعي لأي سؤال'
                : language === 'fr'
                ? 'Discutez avec notre assistant IA pour toute question'
                : 'Chat with our AI assistant for any questions'}
            </p>
            <button className="btn-primary">
              <Sparkles className="inline-block mr-2" size={16} />
              {language === 'ar' ? 'تحدث مع AI' : language === 'fr' ? 'Parler à l\'IA' : 'Chat with AI'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default VisaRoadmap
