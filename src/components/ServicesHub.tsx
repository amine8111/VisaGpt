'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Camera, FileText, PenTool, Scan, Building2, Calendar, 
  MessageSquare, Globe, Users, Briefcase, Plane, AlertTriangle,
  ThumbsUp, ShoppingBag, Clock, Shield, Loader2, Monitor,
  Bot, Award, TrendingUp, Mic, Bookmark, BarChart3, CreditCard,
  Share2, Bell, Sun, Moon
} from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

interface ServiceCard {
  id: string
  title: { ar: string; en: string; fr: string }
  subtitle: { ar: string; en: string; fr: string }
  icon: any
  color: string
  premium?: boolean
}

const services: ServiceCard[] = [
  { id: 'evisa', title: { ar: 'تأشيرة إلكترونية', en: 'E-Visa Hub', fr: 'Centre E-Visa' }, subtitle: { ar: 'تقدم عبر الإنترنت', en: 'Apply online', fr: 'Postulez en ligne' }, icon: Monitor, color: 'neon-cyan' },
  { id: 'success-stories', title: { ar: 'قصص النجاح', en: 'Success Stories', fr: 'Histoires de Succès' }, subtitle: { ar: 'قصص حقيقية', en: 'Real stories', fr: 'Histoires réelles' }, icon: Award, color: 'neon-cyan' },
  { id: 'doc-generator', title: { ar: 'مولّد الوثائق', en: 'AI Document Generator', fr: 'Générateur IA' }, subtitle: { ar: 'وثائق احترافية', en: 'Professional docs', fr: 'Docs professionnels' }, icon: Bot, color: 'neon-purple' },
  { id: 'photo', title: { ar: 'استوديو الصور', en: 'Photo Studio', fr: "Studio Photo" }, subtitle: { ar: 'صورة تأشيرة احترافية', en: 'Professional visa photo', fr: 'Photo visa professionnelle' }, icon: Camera, color: 'neon-magenta', premium: true },
  { id: 'autofill', title: { ar: 'تعبئة الاستمارات', en: 'Form Auto-fill', fr: 'Remplissage Auto' }, subtitle: { ar: 'ملء تلقائي للوثائق', en: 'Auto-fill documents', fr: 'Remplissage automatique' }, icon: FileText, color: 'neon-purple' },
  { id: 'coverletter', title: { ar: 'رسالة الدافع', en: 'Cover Letter', fr: 'Lettre de Motivation' }, subtitle: { ar: 'مولّد الخطابات الرسمية', en: 'Official letter generator', fr: 'Générateur de lettres' }, icon: PenTool, color: 'neon-magenta', premium: true },
  { id: 'scanner', title: { ar: 'فاحص الوثائق', en: 'Document Scanner', fr: 'Scanner de Documents' }, subtitle: { ar: 'تحقق من الامتثال', en: 'Verify compliance', fr: 'Vérifier la conformité' }, icon: Scan, color: 'neon-cyan' },
  { id: 'bank', title: { ar: 'محلل البنكي', en: 'Bank Analyzer', fr: 'Analyseur Bancaire' }, subtitle: { ar: 'فحص كشف الحساب', en: 'Bank statement analysis', fr: 'Analyse de relevé' }, icon: Building2, color: 'neon-purple', premium: true },
  { id: 'appointment', title: { ar: 'رادار المواعيد', en: 'Appointment Radar', fr: 'Radar de Rendez-vous' }, subtitle: { ar: 'تتبع توفر المواعيد', en: 'Track availability', fr: 'Suivre la disponibilité' }, icon: Calendar, color: 'neon-magenta' },
  { id: 'interview', title: { ar: 'محاكي المقابلة', en: 'Interview Simulator', fr: "Simulateur d'Entretien" }, subtitle: { ar: 'تدرب على الأسئلة', en: 'Practice questions', fr: 'Pratiquez les questions' }, icon: MessageSquare, color: 'neon-cyan', premium: true },
  { id: 'visafree', title: { ar: 'وجهات بدون تأشيرة', en: 'Visa-Free Countries', fr: 'Pays sans Visa' }, subtitle: { ar: 'استكشف العالم', en: 'Explore the world', fr: 'Explorez le monde' }, icon: Globe, color: 'neon-purple' },
  { id: 'marketplace', title: { ar: 'سوق الخدمات', en: 'Service Marketplace', fr: 'Marché des Services' }, subtitle: { ar: 'مترجمين ومصورين', en: 'Translators & photographers', fr: 'Traducteurs et photographes' }, icon: ShoppingBag, color: 'neon-magenta' },
  { id: 'itinerary', title: { ar: 'برنامج السفر', en: 'Travel Itinerary', fr: 'Itinéraire de Voyage' }, subtitle: { ar: 'خطة يومية ذكية', en: 'Smart daily plan', fr: 'Plan intelligent' }, icon: Plane, color: 'neon-cyan', premium: true },
  { id: 'family', title: { ar: 'طلبات العائلة', en: 'Family Applications', fr: 'Demandes Familiales' }, subtitle: { ar: 'إدارة جماعية', en: 'Group management', fr: 'Gestion de groupe' }, icon: Users, color: 'neon-purple' },
  { id: 'postvisa', title: { ar: 'ما بعد التأشيرة', en: 'Post-Visa Tools', fr: 'Outils Post-Visa' }, subtitle: { ar: 'أدوات السفر', en: 'Travel tools', fr: 'Outils de voyage' }, icon: Briefcase, color: 'neon-magenta' },
  { id: 'rejection', title: { ar: 'مساعد الطعن', en: 'Appeal Assistant', fr: 'Assistant de Recours' }, subtitle: { ar: 'بعد رفض الطلب', en: 'After rejection', fr: 'Après refus' }, icon: AlertTriangle, color: 'neon-cyan', premium: true },
  { id: 'community', title: { ar: 'المجتمع', en: 'Community', fr: 'Communauté' }, subtitle: { ar: 'قصص النجاح', en: 'Success stories', fr: 'Histoires de succès' }, icon: ThumbsUp, color: 'neon-purple' },
  { id: 'timeline', title: { ar: 'المخطط الزمني', en: 'Timeline Planner', fr: 'Planificateur' }, subtitle: { ar: 'تحضير ذكي', en: 'Smart preparation', fr: 'Préparation intelligente' }, icon: Clock, color: 'neon-magenta' },
  { id: 'insurance', title: { ar: 'تأمين السفر', en: 'Travel Insurance', fr: 'Assurance Voyage' }, subtitle: { ar: 'قارن واختر', en: 'Compare & choose', fr: 'Comparez et choisissez' }, icon: Shield, color: 'neon-cyan' },
  { id: 'policy', title: { ar: 'مراقب السياسات', en: 'Policy Monitor', fr: 'Moniteur de Politique' }, subtitle: { ar: 'تحديثات القنصليات', en: 'Consulate updates', fr: 'Mises à jour consulats' }, icon: AlertTriangle, color: 'neon-purple' },
  { id: 'booking', title: { ar: 'مستشار الحجوزات', en: 'Booking Advisor', fr: 'Conseiller Réservation' }, subtitle: { ar: 'نصائح ذكية', en: 'Smart tips', fr: 'Conseils intelligents' }, icon: Plane, color: 'neon-magenta' },
  { id: 'progress', title: { ar: 'تتبع التقدم', en: 'Progress Tracker', fr: 'Suivi de Progrès' }, subtitle: { ar: 'تتبع رحلتك', en: 'Track your journey', fr: 'Suivez votre parcours' }, icon: TrendingUp, color: 'emerald-400' },
  { id: 'voice-interview', title: { ar: 'مقابلة صوتية', en: 'Voice Interview', fr: 'Entretien Vocal' }, subtitle: { ar: 'تدريب صوتي', en: 'Voice training', fr: 'Entraînement vocal' }, icon: Mic, color: 'neon-magenta' },
  { id: 'deadline-reminders', title: { ar: 'التذكيرات', en: 'Reminders', fr: 'Rappels' }, subtitle: { ar: 'لا تفوت موعد', en: "Don't miss dates", fr: 'Ne manquez pas' }, icon: Bell, color: 'neon-magenta' },
  { id: 'bookmarks', title: { ar: 'المفضلة', en: 'Favorites', fr: 'Favoris' }, subtitle: { ar: 'وجهات محفوظة', en: 'Saved destinations', fr: 'Destinations sauvegardées' }, icon: Bookmark, color: 'neon-purple' },
  { id: 'share-results', title: { ar: 'مشاركة النتائج', en: 'Share Results', fr: 'Partager' }, subtitle: { ar: 'شارك نجاحك', en: 'Share success', fr: 'Partagez' }, icon: Share2, color: 'neon-cyan' },
  { id: 'stats', title: { ar: 'الإحصائيات', en: 'Statistics', fr: 'Statistiques' }, subtitle: { ar: 'إحصائيات المجتمع', en: 'Community stats', fr: 'Stats communauté' }, icon: BarChart3, color: 'neon-purple' },
  { id: 'payment', title: { ar: 'ترقية', en: 'Upgrade', fr: 'Upgrade' }, subtitle: { ar: 'ميزات إضافية', en: 'Premium features', fr: 'Fonctionnalités premium' }, icon: CreditCard, color: 'neon-magenta' },
]

const LABELS = {
  header: { ar: 'خدمات التأشيرة', en: 'Visa Services', fr: 'Services Visa' },
  headerDesc: { ar: 'أدوات متقدمة لتحضير ناجح', en: 'Advanced tools for successful preparation', fr: 'Outils avancés pour une préparation réussie' },
  categories: {
    all: { ar: 'الكل', en: 'All', fr: 'Tous' },
    free: { ar: 'مجاني', en: 'Free', fr: 'Gratuit' },
    premium: { ar: 'بريميوم', en: 'Premium', fr: 'Premium' },
    ai: { ar: 'ذكاء اصطناعي', en: 'AI', fr: 'IA' },
  },
  upgradeTitle: { ar: 'ترقية للخطة المدفوعة', en: 'Upgrade to Paid Plan', fr: 'Passer au Plan Payant' },
  upgradeDesc: { ar: 'احصل على جميع الخدمات المدفوعة بتكلفة أقل بكثير من الوكلاء التقليديين', en: 'Get all paid services at a fraction of traditional agent costs', fr: "Obtenez tous les services payants à une fraction du coût des agents traditionnels" },
  perMonth: { ar: 'شهرياً', en: 'per month', fr: 'par mois' },
  forOneMonth: { ar: 'لمدة شهر', en: 'for one month', fr: 'pour un mois' },
  popular: { ar: 'شعبية', en: 'Popular', fr: 'Populaire' },
  subscribeNow: { ar: 'اشترك الآن', en: 'Subscribe Now', fr: "S'abonner" },
  upgradeToPremium: { ar: 'ترقية إلى Premium', en: 'Upgrade to Premium', fr: 'Passer à Premium' },
  youArePremium: { ar: 'أنت Premium! ✓', en: 'You are Premium! ✓', fr: 'Vous êtes Premium! ✓' },
}

export function ServicesHub() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [upgradeError, setUpgradeError] = useState<string | null>(null)
  const { upgradeMembership, membership, setActiveNav } = useVisaStore()
  const { language } = useLanguage()
  const router = useRouter()

  const handleUpgrade = async (tier: 'gold' | 'premium', months: number) => {
    if (membership?.tier === 'premium' || membership?.tier === 'gold') {
      return
    }
    setIsUpgrading(true)
    setUpgradeError(null)
    try {
      await upgradeMembership(tier, months)
    } catch (err: any) {
      setUpgradeError(err.response?.data?.message || 'Upgrade failed')
    } finally {
      setIsUpgrading(false)
    }
  }

  const getLabel = (obj: { ar: string; en: string; fr: string }) => {
    if (language === 'ar') return obj.ar
    if (language === 'fr') return obj.fr
    return obj.en
  }

  const categories = [
    { id: 'all', label: LABELS.categories.all },
    { id: 'free', label: LABELS.categories.free },
    { id: 'premium', label: LABELS.categories.premium },
    { id: 'ai', label: LABELS.categories.ai },
  ]

  const aiServices = ['evisa', 'doc-generator', 'success-stories', 'voice-interview', 'progress', 'share-results']
  
  const filteredServices = services.filter(s => {
    if (activeCategory === 'all') return true
    if (activeCategory === 'free') return !s.premium
    if (activeCategory === 'premium') return s.premium
    if (activeCategory === 'ai') return aiServices.includes(s.id)
    return true
  })

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">{getLabel(LABELS.header)}</h2>
          <p className="text-white/60 text-sm">{getLabel(LABELS.headerDesc)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all',
                activeCategory === cat.id
                  ? 'neon-button'
                  : 'glass-card-hover text-white/70'
              )}
            >
              {getLabel(cat.label)}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {filteredServices.map((service, index) => {
            const Icon = service.icon
            
            const navMap: Record<string, string> = {
              'evisa': 'evisa-hub',
              'photo': 'photo',
              'autofill': 'form-filler',
              'coverletter': 'letters',
              'scanner': 'scanner',
              'bank': 'financial',
              'appointment': 'radar',
              'interview': 'chatbot',
              'visafree': 'visafree',
              'family': 'family',
              'rejection': 'recours',
              'insurance': 'insurance',
              'success-stories': 'success-stories',
              'doc-generator': 'doc-generator',
              'progress': 'progress',
              'voice-interview': 'voice-interview',
              'deadline-reminders': 'deadline-reminders',
              'bookmarks': 'bookmarks',
              'share-results': 'share-results',
              'stats': 'stats',
              'payment': 'payment',
              'marketplace': 'sim-marketplace',
              'itinerary': 'trip-cost',
              'postvisa': 'insurance',
              'timeline': 'progress',
              'policy': 'slot-monitor',
              'community': 'community',
              'booking': 'booking',
            }
            
            const handleClick = () => {
              const nav = navMap[service.id]
              if (nav) setActiveNav(nav)
            }
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                onClick={handleClick}
                className={cn(
                  'glass-card-hover p-4 cursor-pointer relative overflow-hidden',
                  service.premium && 'border-neon-magenta/30'
                )}
              >
                {service.premium && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-neon-magenta/20 rounded-full">
                    <span className="text-xs text-neon-magenta font-medium">PRO</span>
                  </div>
                )}
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center mb-3',
                  service.color === 'neon-cyan' && 'bg-neon-cyan/20',
                  service.color === 'neon-purple' && 'bg-neon-purple/20',
                  service.color === 'neon-magenta' && 'bg-neon-magenta/20'
                )}>
                  <Icon 
                    size={24} 
                    className={
                      service.color === 'neon-cyan' ? 'text-neon-cyan' :
                      service.color === 'neon-purple' ? 'text-neon-purple' :
                      'text-neon-magenta'
                    } 
                  />
                </div>
                <h3 className="font-bold text-sm mb-1">{getLabel(service.title)}</h3>
                <p className="text-xs text-white/50">{getLabel(service.subtitle)}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 glass-card p-6"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Shield className="text-neon-cyan" size={20} />
            {membership?.tier === 'premium' ? LABELS.youArePremium.en : getLabel(LABELS.upgradeTitle)}
          </h3>
          <p className="text-sm text-white/60 mb-4">
            {getLabel(LABELS.upgradeDesc)}
          </p>
          
          {upgradeError && (
            <div className="mb-4 p-3 bg-red-500/20 rounded-lg text-red-400 text-sm">
              {upgradeError}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => handleUpgrade('gold', 1)}
              disabled={isUpgrading || membership?.tier === 'gold' || membership?.tier === 'premium'}
              className="flex-1 p-3 bg-white/5 rounded-xl text-center hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <p className="text-xs text-white/50 mb-1">{getLabel(LABELS.perMonth)}</p>
              <p className="text-xl font-bold gradient-text">5,000 DZD</p>
              <p className="text-xs text-neon-cyan mt-1">Gold</p>
            </button>
            <button
              onClick={() => handleUpgrade('premium', 1)}
              disabled={isUpgrading || membership?.tier === 'premium'}
              className="flex-1 p-3 bg-white/5 rounded-xl text-center relative hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <div className="absolute -top-2 right-2 px-2 py-0.5 bg-neon-magenta rounded-full text-xs">
                {getLabel(LABELS.popular)}
              </div>
              <p className="text-xs text-white/50 mb-1">{getLabel(LABELS.forOneMonth)}</p>
              <p className="text-xl font-bold gradient-text">15,000 DZD</p>
              <p className="text-xs text-neon-magenta mt-1">Premium</p>
            </button>
          </div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handleUpgrade('premium', 1)}
            disabled={isUpgrading || membership?.tier === 'premium'}
            className="w-full mt-4 neon-button flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isUpgrading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : membership?.tier === 'premium' ? (
              getLabel(LABELS.youArePremium)
            ) : membership?.tier === 'gold' ? (
              getLabel(LABELS.upgradeToPremium)
            ) : (
              getLabel(LABELS.subscribeNow)
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
