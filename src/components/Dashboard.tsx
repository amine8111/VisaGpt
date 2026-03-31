'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { 
  Crown, Zap, Shield, CheckCircle, Lock, 
  Star, Sparkles, FileText, Calculator, Clock, MessageSquare,
  Globe, Camera, Users, Briefcase, PenTool, FileCheck, AlertCircle,
  ArrowRight, ChevronRight, Brain, TrendingUp, Target, 
  Award, Bot, Scan, BookOpen, Plane, Home, Monitor, Globe2
} from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'
import { SERVICE_TIERS, PAY_AS_YOU_GO, type ServiceTier } from '@/lib/serviceConfig'
import { AboutUs } from './AboutUs'

export function Dashboard() {
  const { user, membership, setActiveNav, setCurrentStep, resetAssessment, fetchUser, fetchMembership, userProfile, previewTier, setPreviewTier, selectedTier, setSelectedTier } = useVisaStore()
  const { t, dir, language } = useLanguage()
  const [showAboutUs, setShowAboutUs] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchUser()
    fetchMembership()
  }, [])

  useEffect(() => {
    if (mounted && user && !userProfile.isProfileComplete) {
      setActiveNav('profile-setup')
    }
  }, [mounted, user, userProfile.isProfileComplete, setActiveNav])

  const currentTier = membership?.tier || 'free'
  const activeTier = previewTier || currentTier

  const handleStartAssessment = () => {
    resetAssessment()
    setCurrentStep(0)
    setActiveNav('calculator')
  }

  const handleServiceClick = (serviceId: string, requiredTier?: ServiceTier) => {
    if (requiredTier && !isServiceAvailable(requiredTier)) {
      setActiveNav('upgrade')
      return
    }
    
    switch (serviceId) {
      case 'checklist':
        setActiveNav('checklist'); break;
      case 'basic-assessment':
        setActiveNav('calculator'); break;
      case 'profile':
        setActiveNav('profile'); break;
      case 'visa-atlas':
        setActiveNav('visa-atlas'); break;
      case 'trip-cost':
        setActiveNav('trip-cost'); break;
      case 'packing-list':
        setActiveNav('packing-list'); break;
      case 'embassy-locator':
        setActiveNav('embassy-locator'); break;
      case 'hotel-booking':
        setActiveNav('hotel-booking'); break;
      case 'flight-search':
        setActiveNav('flight-search'); break;
      case 'visa-status':
        setActiveNav('visa-status'); break;
      case 'schengen-form':
        setActiveNav('schengen-form'); break;
      case 'document-organizer':
        setActiveNav('documents'); break;
      case 'letter-generator':
        setActiveNav('letters'); break;
      case 'recours':
        setActiveNav('rejection-analyzer'); break;
      case 'savings-plan':
        setActiveNav('savings-plan'); break;
      case 'document-inspector':
        setActiveNav('document-inspector'); break;
      case 'insurance-claim':
        setActiveNav('insurance-claim'); break;
      case 'chat-coach':
        setActiveNav('chat-coach'); break;
      case 'slot-monitor':
        setActiveNav('slot-monitor'); break;
      case 'sim-marketplace':
        setActiveNav('sim-marketplace'); break;
      case 'evisa-hub':
        setActiveNav('evisa-hub'); break;
      case 'agent-booking':
        setActiveNav('booking'); break;
      case 'translation-normal':
      case 'translation-official':
        setActiveNav('translate'); break;
      default:
        setActiveNav('profile'); break;
    }
  }

  const isServiceAvailable = (requiredTier: ServiceTier) => {
    const tierOrder = { free: 0, gold: 1, premium: 2 }
    return tierOrder[activeTier] >= tierOrder[requiredTier]
  }

  const tiers: ServiceTier[] = ['free', 'gold', 'premium']

  const handleUpgrade = () => {
    setActiveNav('upgrade')
  }

  const aiFeatures = [
    { icon: Brain, name: language === 'ar' ? 'محلل ذكي' : 'Smart Analyzer', color: 'neon-cyan', desc: language === 'ar' ? 'تحليل الملف بالذكاء الاصطناعي' : 'AI profile analysis' },
    { icon: Bot, name: language === 'ar' ? 'محاكي المقابلة' : 'Interview Simulator', color: 'neon-magenta', desc: language === 'ar' ? 'تدرب على الأسئلة' : 'Practice questions' },
    { icon: Scan, name: language === 'ar' ? 'فاحص الوثائق' : 'Document Scanner', color: 'neon-purple', desc: language === 'ar' ? 'فحص الامتثال' : 'Check compliance' },
    { icon: Target, name: language === 'ar' ? 'توقع النجاح' : 'Success Predictor', color: 'emerald-400', desc: language === 'ar' ? 'احتمالية الموافقة' : 'Approval chances' },
  ]

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner-lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-neon-magenta/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-lg mx-auto relative z-10">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <Sparkles className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-black">
              {t('welcome')} <span className="gradient-text">{user?.fullName?.split(' ')[0] || t('user')}</span>
            </h1>
          </div>
          <p className="text-white/60 text-sm">{t('smartVisaAssistant')}</p>
          <button 
            onClick={() => setShowAboutUs(true)}
            className="mt-2 text-xs text-neon-cyan hover:text-neon-cyan/80 flex items-center gap-1"
          >
            {language === 'ar' ? 'تعرف علينا أكثر' : language === 'fr' ? 'En savoir plus' : 'Learn more about us'}
            <ChevronRight size={14} />
          </button>
        </motion.div>

        {/* AI Features Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="card-ai relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-neon-cyan/20 to-transparent rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="text-neon-cyan animate-pulse" size={20} />
                <span className="text-sm font-bold text-neon-cyan">{language === 'ar' ? 'ميزات الذكاء الاصطناعي' : language === 'fr' ? 'Fonctionnalités IA' : 'AI Features'}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {aiFeatures.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="glass-card p-3 text-center"
                  >
                    <feature.icon className={cn('mx-auto mb-2', `text-${feature.color}`)} size={24} />
                    <p className="font-bold text-xs">{feature.name}</p>
                    <p className="text-xs text-white/40">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Membership Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={cn(
            'glass-card-elevated p-4 mb-6',
            currentTier === 'premium' && 'card-tier-premium',
            currentTier === 'gold' && 'card-tier-gold',
            currentTier === 'free' && 'card-tier-free'
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center',
                  currentTier === 'premium' && 'bg-gradient-to-br from-neon-purple/30 to-pink-500/30',
                  currentTier === 'gold' && 'bg-gradient-to-br from-yellow-400/30 to-amber-500/30',
                  currentTier === 'free' && 'bg-gradient-to-br from-emerald-400/30 to-green-500/30'
                )}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {currentTier === 'premium' && <Crown className="text-neon-purple" size={28} />}
                {currentTier === 'gold' && <Star className="text-yellow-400" size={28} />}
                {currentTier === 'free' && <Zap className="text-emerald-400" size={28} />}
              </motion.div>
              <div>
                <p className="font-bold text-lg">
                  {currentTier === 'premium' ? t('premium') : currentTier === 'gold' ? t('gold') : t('free')}
                </p>
                <p className="text-xs text-white/60">
                  {currentTier === 'premium' ? t('allServicesAvailable') : 
                   currentTier === 'gold' ? t('goldServicesAvailable') : 
                   t('freeServicesOnly')}
                </p>
              </div>
            </div>
            {currentTier !== 'premium' && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setPreviewTier(currentTier === 'free' ? 'gold' : 'premium')}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-bold',
                  currentTier === 'free' ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-black' : 'bg-gradient-to-r from-neon-purple to-pink-500 text-white'
                )}
              >
                {currentTier === 'free' ? '✨ Try Gold' : '👑 Upgrade'}
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Preview Tier Banner */}
        {previewTier && previewTier !== currentTier && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-2xl border border-neon-cyan/50 bg-neon-cyan/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="text-neon-cyan" size={20} />
                <div>
                  <p className="font-bold text-sm text-neon-cyan">Previewing {previewTier.charAt(0).toUpperCase() + previewTier.slice(1)} Tier</p>
                  <p className="text-xs text-white/60">Test all {previewTier} features</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewTier(null)}
                className="px-3 py-1 text-xs bg-white/10 rounded-full hover:bg-white/20"
              >
                Exit
              </button>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-lg font-bold mb-3">{language === 'ar' ? 'إجراءات سريعة' : language === 'fr' ? 'Actions rapides' : 'Quick Actions'}</h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Calculator, label: t('assessment'), color: 'neon-cyan', action: handleStartAssessment },
              { icon: Monitor, label: t('evisaHub'), color: 'neon-cyan', action: () => handleServiceClick('evisa-hub') },
              { icon: MessageSquare, label: t('interview'), color: 'neon-magenta', action: () => handleServiceClick('chat-coach') },
              { icon: Shield, label: t('insurance'), color: 'emerald-400', action: () => handleServiceClick('insurance') },
            ].map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.05 }}
                onClick={action.action}
                className="glass-card-hover p-4 flex flex-col items-center group"
              >
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-all group-hover:scale-110',
                  `bg-${action.color}/20`
                )}>
                  <action.icon className={cn(`text-${action.color}`)} size={24} />
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* E-Visa Featured Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-6"
        >
          <div className="card-ai relative overflow-hidden cursor-pointer" onClick={() => handleServiceClick('evisa-hub')}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-neon-cyan/20 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-neon-purple/10 to-transparent rounded-full blur-xl" />
            <div className="relative flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 flex items-center justify-center">
                <Globe2 className="text-neon-cyan" size={32} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge badge-neon py-0.5 px-2 text-xs">{language === 'ar' ? 'جديد' : language === 'fr' ? 'Nouveau' : 'NEW'}</span>
                </div>
                <h3 className="font-bold text-lg gradient-text">{t('evisaHub')}</h3>
                <p className="text-sm text-white/60">{t('evisaHubDesc')}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right mr-2">
                  <p className="text-xs text-white/50">{language === 'ar' ? 'ابتداءً من' : language === 'fr' ? 'à partir de' : 'From'}</p>
                  <p className="text-2xl font-black text-neon-cyan">$20</p>
                </div>
                <ChevronRight className="text-white/50" size={24} />
              </div>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {['🇹🇷 تركيا', '🇰🇪 كينيا', '🇮🇳 الهند', '🇷🇼 رواندا'].map((flag, i) => (
                <span key={i} className="text-sm bg-white/10 px-3 py-1 rounded-full whitespace-nowrap">{flag}</span>
              ))}
              <span className="text-sm text-neon-cyan font-medium px-3 py-1">+8 {language === 'ar' ? 'المزيد' : language === 'fr' ? 'plus' : 'more'}</span>
            </div>
          </div>
        </motion.div>

        {/* Service Tiers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h2 className="text-lg font-bold mb-3">{t('services')}</h2>
          
          {/* Tier Selector */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {tiers.map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all',
                  selectedTier === tier && tier === 'free' && 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 border border-emerald-500/50',
                  selectedTier === tier && tier === 'gold' && 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-500/50',
                  selectedTier === tier && tier === 'premium' && 'bg-gradient-to-r from-neon-purple/20 to-pink-500/20 text-neon-purple border border-neon-purple/50',
                  selectedTier !== tier && 'bg-white/5 text-white/60'
                )}
              >
                {tier === 'free' && '🆓 ' + t('free')}
                {tier === 'gold' && '💰 ' + t('gold')}
                {tier === 'premium' && '👑 ' + t('premium')}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-2 gap-3">
            {SERVICE_TIERS[selectedTier].features.map((service, index) => {
              const available = isServiceAvailable(service.tier)
              const isPreview = previewTier && previewTier !== currentTier
              
              return (
                <motion.button
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45 + index * 0.05 }}
                  onClick={() => handleServiceClick(service.id, service.tier)}
                  className={cn(
                    'glass-card-hover p-4 text-left relative transition-all cursor-pointer',
                    available && 'hover:border-neon-cyan/50',
                    !available && 'opacity-70',
                    isPreview && available && 'ring-2 ring-neon-cyan/50 bg-neon-cyan/10'
                  )}
                >
                  {!available && (
                    <div className="absolute top-2 right-2">
                      <Lock size={14} className="text-yellow-400" />
                    </div>
                  )}
                  {isPreview && available && (
                    <div className="absolute -top-2 -right-2 bg-neon-cyan text-black text-xs px-2 py-0.5 rounded-full font-bold">
                      Preview
                    </div>
                  )}
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-2xl flex-shrink-0">{service.icon}</span>
                    <h3 className="font-bold text-sm leading-tight">{language === 'ar' ? service.name : language === 'fr' && service.nameFr ? service.nameFr : service.nameEn}</h3>
                  </div>
                  <p className="text-xs text-white/50 line-clamp-2">{language === 'ar' ? service.description : language === 'fr' && service.descriptionFr ? service.descriptionFr : service.descriptionEn}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    {available ? (
                      <>
                        <CheckCircle size={12} className="text-emerald-400" />
                        <span className="text-emerald-400">{t('available')}</span>
                      </>
                    ) : (
                      <>
                        <Lock size={12} className="text-yellow-400" />
                        <span className="text-yellow-400">
                          {language === 'ar' ? 'اشترِ أو ترقى' : 'Buy or Upgrade'}
                        </span>
                      </>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Upgrade CTA */}
          {selectedTier !== 'premium' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                'mt-4 p-5 rounded-2xl border',
                selectedTier === 'free' && 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/30',
                selectedTier === 'gold' && 'bg-gradient-to-r from-neon-purple/10 to-pink-500/10 border-neon-purple/30'
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    {selectedTier === 'free' ? '⬆️ ' + t('upgradeToGold') : '👑 ' + t('upgradeToPremium')}
                  </h3>
                  <p className="text-xs text-white/60">
                    {selectedTier === 'free' 
                      ? language === 'ar' ? 'تقييم شامل + نصائح احترافية' : language === 'fr' ? 'Évaluation complète + conseils pros' : 'Full assessment + professional advice'
                      : language === 'ar' ? 'كل شيء في Gold + خبرة بشرية + وصول للمكتب' : language === 'fr' ? 'Tout Gold + Experts + Accès Bureau' : 'Everything Gold + Human Experts + Office Access'}
                  </p>
                </div>
                <button
                  onClick={handleUpgrade}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-bold',
                    selectedTier === 'free' ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-black' : 'bg-gradient-to-r from-neon-purple to-pink-500 text-white'
                  )}
                >
                  {SERVICE_TIERS[selectedTier === 'free' ? 'gold' : 'premium'].price.toLocaleString()} DZD
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Pay As You Go Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Plane className="text-neon-cyan" size={18} />
              {language === 'ar' ? '💳 ادفع حسب الحاجة' : language === 'fr' ? '💳 Paiement à la Demande' : '💳 Pay As You Go'}
            </h2>
            <span className="text-xs text-white/50">
              {language === 'ar' ? 'بدون اشتراك' : language === 'fr' ? 'Sans abonnement' : 'No subscription'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {PAY_AS_YOU_GO.services.slice(0, 6).map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + index * 0.05 }}
                className="glass-card p-4 flex items-center gap-4"
              >
                <span className="text-3xl">{service.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-sm">
                    {language === 'ar' ? service.nameAr : language === 'fr' ? service.nameFr : service.name}
                  </h3>
                  <p className="text-xs text-white/50">
                    {language === 'ar' ? service.descriptionAr : language === 'fr' ? service.descriptionFr : service.description}
                  </p>
                </div>
                <div className="text-right">
                  {service.isFree ? (
                    <span className="text-xs text-emerald-400 font-bold">FREE</span>
                  ) : (
                    <>
                      <span className="font-bold text-neon-cyan">{service.price.toLocaleString()}</span>
                      <span className="text-xs text-white/40"> DZD</span>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        {currentTier === 'free' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="card-ai text-center py-8"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
              <Award className="text-neon-cyan" size={32} />
            </div>
            <h3 className="font-bold text-xl mb-2">🚀 {t('startFree')}</h3>
            <p className="text-white/60 text-sm mb-4">
              {t('getInitialAssessment')}
            </p>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleStartAssessment}
              className="btn-primary px-8 py-4"
            >
              {t('startFreeAssessment')}
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* About Us Modal */}
      <AnimatePresence>
        {showAboutUs && (
          <AboutUs onClose={() => setShowAboutUs(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Dashboard
