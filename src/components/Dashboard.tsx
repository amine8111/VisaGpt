'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { 
  Crown, Zap, Shield, CheckCircle, Lock, 
  Star, Sparkles, FileText, Calculator, Clock, MessageSquare,
  Globe, Camera, Users, Briefcase, PenTool, FileCheck, AlertCircle,
  ArrowRight, ArrowLeft, ChevronRight
} from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'
import { SERVICE_TIERS, PAY_AS_YOU_GO, type ServiceTier } from '@/lib/serviceConfig'

export function Dashboard() {
  const { user, membership, setActiveNav, setCurrentStep, resetAssessment, fetchUser, fetchMembership, userProfile, previewTier, setPreviewTier, selectedTier, setSelectedTier } = useVisaStore()
  const { t, dir, language } = useLanguage()

  useEffect(() => {
    fetchUser()
    fetchMembership()
  }, [])

  useEffect(() => {
    if (user && !userProfile.isProfileComplete) {
      setActiveNav('profile-setup')
    }
  }, [user, userProfile.isProfileComplete, setActiveNav])

  const currentTier = membership?.tier || 'free'
  const activeTier = previewTier || currentTier

  const handleStartAssessment = () => {
    resetAssessment()
    setCurrentStep(0)
    setActiveNav('calculator')
  }

  const handleServiceClick = (serviceId: string) => {
    switch (serviceId) {
      case 'checklist':
        setActiveNav('checklist')
        break
      case 'basic-assessment':
      case 'detailed-assessment':
        setActiveNav('calculator')
        break
      case 'profile':
        setActiveNav('profile')
        break
      case 'advice':
        setActiveNav('advice')
        break
      case 'schengen-form':
        setActiveNav('schengen-form')
        break
      case 'document-organizer':
        setActiveNav('documents')
        break
      case 'financial-planner':
        setActiveNav('financial')
        break
      case 'letter-generator':
        setActiveNav('letters')
        break
      case 'simulator':
        setActiveNav('simulator')
        break
      case 'translation-normal':
      case 'translation-official':
        setActiveNav('translation')
        break
      case 'insurance':
        setActiveNav('insurance')
        break
      case 'photo':
        setActiveNav('photo')
        break
      case 'agent-booking':
        setActiveNav('booking')
        break
      case 'recours':
        setActiveNav('recours')
        break
      case 'rejection-analyzer':
        setActiveNav('rejection-analyzer')
        break
      case 'visa-atlas':
        setActiveNav('visa-atlas')
        break
      case 'insurance-claim':
        setActiveNav('insurance-claim')
        break
      case 'savings-plan':
        setActiveNav('savings-plan')
        break
      case 'document-inspector':
        setActiveNav('document-inspector')
        break
      case 'chat-coach':
        setActiveNav('chat-coach')
        break
      case 'slot-monitor':
        setActiveNav('slot-monitor')
        break
      case 'pro-assessment':
        setActiveNav('pro-assessment')
        break
      default:
        setActiveNav('home')
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

  return (
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold mb-2">
            {t('welcome')} {user?.fullName?.split(' ')[0] || t('user')}
          </h1>
          <p className="text-white/60 text-sm">VisaAI DZ - {t('smartVisaAssistant')}</p>
        </motion.div>

        {/* Membership Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'glass-card p-4 mb-6 flex items-center justify-between',
            currentTier === 'premium' && 'border-neon-purple/50',
            currentTier === 'gold' && 'border-yellow-500/50',
            currentTier === 'free' && 'border-green-500/50'
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center',
              currentTier === 'premium' && 'bg-neon-purple/20',
              currentTier === 'gold' && 'bg-yellow-500/20',
              currentTier === 'free' && 'bg-green-500/20'
            )}>
              {currentTier === 'premium' && <Crown className="text-neon-purple" size={24} />}
              {currentTier === 'gold' && <Star className="text-yellow-400" size={24} />}
              {currentTier === 'free' && <Zap className="text-green-400" size={24} />}
            </div>
            <div>
              <p className="font-bold">
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
            <div className="flex flex-col gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setPreviewTier(currentTier === 'free' ? 'gold' : 'premium')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium',
                  currentTier === 'free' ? 'neon-button' : 'bg-neon-purple text-white'
                )}
              >
                {currentTier === 'free' ? 'Try Gold Free' : t('upgradeToPremium')}
              </motion.button>
              <button
                onClick={handleUpgrade}
                className="text-xs text-white/40 hover:text-white/60"
              >
                {currentTier === 'free' ? 'or upgrade now' : ''}
              </button>
            </div>
          )}
        </motion.div>

        {/* Preview Tier Banner */}
        {previewTier && previewTier !== currentTier && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-xl border border-neon-cyan/50 bg-neon-cyan/10"
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
                Exit Preview
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setPreviewTier('gold')}
                className={cn(
                  'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                  previewTier === 'gold' ? 'bg-yellow-500/30 text-yellow-400 border border-yellow-500/50' : 'bg-white/5'
                )}
              >
                Preview Gold
              </button>
              <button
                onClick={() => setPreviewTier('premium')}
                className={cn(
                  'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                  previewTier === 'premium' ? 'bg-neon-purple/30 text-neon-purple border border-neon-purple/50' : 'bg-white/5'
                )}
              >
                Preview Premium
              </button>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-4 gap-3 mb-6"
        >
          {[
            { icon: Calculator, label: t('assessment'), color: 'neon-cyan', action: handleStartAssessment },
            { icon: FileText, label: t('documents'), color: 'neon-purple', action: () => handleServiceClick('document-organizer') },
            { icon: MessageSquare, label: t('interview'), color: 'neon-magenta', action: () => handleServiceClick('basic-assessment') },
            { icon: Shield, label: t('insurance'), color: 'green-400', action: () => handleServiceClick('insurance') },
          ].map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={action.action}
              className="glass-card-hover p-4 flex flex-col items-center"
            >
              <action.icon className={cn('mb-2', `text-${action.color}`)} size={24} />
              <span className="text-xs">{action.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Service Tiers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-lg font-bold mb-4">{t('services')}</h2>
          
          {/* Tier Selector */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {tiers.map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                  selectedTier === tier && tier === 'free' && 'bg-green-500/20 text-green-400 border border-green-500/50',
                  selectedTier === tier && tier === 'gold' && 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50',
                  selectedTier === tier && tier === 'premium' && 'bg-neon-purple/20 text-neon-purple border border-neon-purple/50',
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
                  transition={{ delay: 0.3 + index * 0.05 }}
                  onClick={() => handleServiceClick(service.id)}
                  disabled={!available}
                  className={cn(
                    'p-4 text-left relative transition-all',
                    available 
                      ? 'glass-card-hover cursor-pointer hover:scale-105' 
                      : 'opacity-50 cursor-not-allowed',
                    isPreview && available && 'ring-2 ring-neon-cyan/50 bg-neon-cyan/10'
                  )}
                >
                  {!available && (
                    <div className="absolute top-2 right-2">
                      <Lock size={14} className="text-white/40" />
                    </div>
                  )}
                  {isPreview && available && (
                    <div className="absolute -top-2 -right-2 bg-neon-cyan text-black text-xs px-2 py-0.5 rounded-full">
                      Preview
                    </div>
                  )}
                  <span className="text-2xl mb-2 block">{service.icon}</span>
                  <h3 className="font-bold text-sm mb-1">{language === 'ar' ? service.name : language === 'fr' && service.nameFr ? service.nameFr : service.nameEn}</h3>
                  <p className="text-xs text-white/50 line-clamp-2">{language === 'ar' ? service.description : language === 'fr' && service.descriptionFr ? service.descriptionFr : service.descriptionEn}</p>
                  {available && (
                    <div className="mt-2 flex items-center gap-1 text-xs">
                      <CheckCircle size={12} className="text-green-400" />
                      <span className="text-green-400">{t('available')}</span>
                    </div>
                  )}
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
                'mt-4 p-5 rounded-xl border',
                selectedTier === 'free' && 'bg-yellow-500/10 border-yellow-500/30',
                selectedTier === 'gold' && 'bg-neon-purple/10 border-neon-purple/30'
              )}
            >
              <div className="flex items-center justify-between mb-3">
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
                    'px-4 py-2 rounded-lg text-sm font-medium',
                    selectedTier === 'free' ? 'neon-button' : 'bg-neon-purple text-white'
                  )}
                >
                  {SERVICE_TIERS[selectedTier === 'free' ? 'gold' : 'premium'].price.toLocaleString()} DZD
                  <span className="text-xs block opacity-70">{language === 'ar' ? 'شهرياً' : '/month'}</span>
                </button>
              </div>
              {selectedTier === 'gold' && (
                <div className="flex items-center gap-2 text-xs text-neon-purple">
                  <Shield size={14} />
                  <span>{language === 'ar' ? '✓ وصول للمكتب | ✓ ترجمة معتمدة | ✓ حجز وكيل' : language === 'fr' ? '✓ Accès bureau | ✓ Traduction certifiée | ✓ Réservation agent' : '✓ Office Access | ✓ Certified Translation | ✓ Agent Booking'}</span>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Pay As You Go Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">
              {language === 'ar' ? '💳 ادفع حسب الحاجة' : language === 'fr' ? '💳 Paiement à la Demande' : '💳 Pay As You Go'}
            </h2>
            <span className="text-xs text-white/50">
              {language === 'ar' ? 'بدون اشتراك' : language === 'fr' ? 'Sans abonnement' : 'No subscription'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PAY_AS_YOU_GO.services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="glass-card p-4 flex flex-col"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{service.icon}</span>
                  <div className="text-right">
                    {service.isQuote ? (
                      <span className="text-xs text-neon-cyan">
                        {language === 'ar' ? 'سعر السوق + 10%' : language === 'fr' ? 'Tarif marché + 10%' : 'Market rate + 10%'}
                      </span>
                    ) : (
                      <>
                        <span className="font-bold text-neon-cyan">{service.price.toLocaleString()}</span>
                        <span className="text-xs text-white/50"> DZD</span>
                        {service.unit && <span className="text-xs text-white/40 ml-1">{service.unit}</span>}
                      </>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-sm mb-1">
                  {language === 'ar' ? service.nameAr : language === 'fr' ? service.nameFr : service.name}
                </h3>
                <p className="text-xs text-white/50 flex-1">
                  {language === 'ar' ? service.descriptionAr : language === 'fr' ? service.descriptionFr : service.description}
                </p>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleServiceClick(service.id)}
                  className={cn(
                    'mt-3 w-full py-2 rounded-lg text-xs font-medium transition-all',
                    service.isQuote 
                      ? 'bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30'
                      : 'bg-white/10 hover:bg-white/20'
                  )}
                >
                  {language === 'ar' ? 'اطلب الآن' : language === 'fr' ? 'Commander' : 'Order Now'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Start Assessment */}
        {currentTier === 'free' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6 text-center"
          >
            <h3 className="font-bold mb-2">🚀 {t('startFree')}</h3>
            <p className="text-sm text-white/60 mb-4">
              {t('getInitialAssessment')}
            </p>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleStartAssessment}
              className="neon-button w-full"
            >
              {t('startFreeAssessment')}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
