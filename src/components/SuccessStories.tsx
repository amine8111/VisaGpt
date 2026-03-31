'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, Star, Heart, ThumbsUp, Clock, CheckCircle,
  Sparkles, ChevronRight, Quote, Users, TrendingUp,
  Globe, Shield, Award, MessageSquare
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { cn } from '@/lib/utils'

interface SuccessStory {
  id: string
  name: string
  nameAr: string
  nameFr: string
  city: string
  cityAr: string
  cityFr: string
  visaType: string
  visaTypeAr: string
  visaTypeFr: string
  country: string
  countryAr: string
  countryFr: string
  flag: string
  story: string
  storyAr: string
  storyFr: string
  tips: string[]
  tipsAr: string[]
  tipsFr: string[]
  rating: number
  date: string
  badges: string[]
  badgesAr: string[]
  badgesFr: string[]
  aiScore: number
}

const successStories: SuccessStory[] = [
  {
    id: '1',
    name: 'Ahmed B.',
    nameAr: 'أحمد ب.',
    nameFr: 'Ahmed B.',
    city: 'Algiers',
    cityAr: 'الجزائر العاصمة',
    cityFr: 'Alger',
    visaType: 'Schengen (France)',
    visaTypeAr: 'شنغن (فرنسا)',
    visaTypeFr: 'Schengen (France)',
    country: 'France',
    countryAr: 'فرنسا',
    countryFr: 'France',
    flag: '🇫🇷',
    story: 'After 2 rejections, I used VisaGPT\'s rejection analyzer and discovered my bank statements showed irregular deposits. I followed the legal savings plan for 6 months and was approved on my third attempt!',
    storyAr: 'بعد رفضين، استخدمت محلل الرفض في VisaGPT واكتشفت أن كشوف حسابي البنكية أظهرت إيداعات غير منتظمة. اتبعت خطة التوفير القانونية لمدة 6 أشهر وتمت الموافقة على محاولتي الثالثة!',
    storyFr: 'Après 2 refus, j\'ai utilisé l\'analyseur de refus de VisaGPT et découvert que mes relevés montraient des dépôts irréguliers. J\'ai suivi le plan d\'épargne légal pendant 6 mois et j\'ai été approuvé!',
    tips: [
      'Build bank balance gradually over 6+ months',
      'Get employment letter with consistent salary',
      'Book cancellable hotel initially',
      'Prepare for interview with chatbot simulator'
    ],
    tipsAr: [
      'ابنِ رصيدك البنكي تدريجياً على مدى 6+ أشهر',
      'احصل على شهادة عمل برواتب منتظمة',
      'احجز فندق قابل للإلغاء مبدئياً',
      'استعد للمقابلة مع محاكي الدردشة'
    ],
    tipsFr: [
      'Construisez votre solde progressivement sur 6+ mois',
      'Obtenez une attestation avec salaire régulier',
      'Réservez d\'abord un hôtel annulable',
      'Préparez-vous avec le simulateur d\'entretien'
    ],
    rating: 5,
    date: '2024-01-15',
    badges: ['3rd Attempt', 'Family Visit'],
    badgesAr: ['المحاولة الثالثة', 'زيارة عائلية'],
    badgesFr: ['3ème tentative', 'Visite familiale'],
    aiScore: 78
  },
  {
    id: '2',
    name: 'Fatima M.',
    nameAr: 'فاتن م.',
    nameFr: 'Fatima M.',
    city: 'Oran',
    cityAr: 'وهران',
    cityFr: 'Oran',
    visaType: 'UK Tourist',
    visaTypeAr: 'تأشيرة سياحة بريطانيا',
    visaTypeFr: 'Touriste UK',
    country: 'United Kingdom',
    countryAr: 'المملكة المتحدة',
    countryFr: 'Royaume-Uni',
    flag: '🇬🇧',
    story: 'As a student, I was worried about my weak financial profile. VisaGPT showed me I needed a sponsor. My uncle agreed to sponsor me and I got approved in 2 weeks!',
    storyAr: 'كطالبة، كنت قلقة بشأن ضعفي ملفي المالي. VisaGPT أظهر لي أنني بحاجة لكفيل. عمي وافق على كفالتي وتمت الموافقة في أسبوعين!',
    storyFr: 'En tant qu\'étudiante, je m\'inquiétais de mon profil financier faible. VisaGPT m\'a montré que j\'avais besoin d\'un sponsor. Mon oncle a accepté de me parrainer et j\'ai été approuvé en 2 semaines!',
    tips: [
      'Get a sponsor if you\'re a student',
      'Show strong ties to Algeria (family, property)',
      'Have sponsor provide detailed financial proof',
      'Use interview chatbot for British accent practice'
    ],
    tipsAr: [
      'احصل على كفيل إذا كنت طالباً',
      'أظهر روابط قوية مع الجزائر (عائلة، ملكية)',
      'اطلب من الكفيل تقديم إثبات مالي مفصل',
      'استخدم محاكي المقابلة لممارسة اللهجة البريطانية'
    ],
    tipsFr: [
      'Obtenez un sponsor si vous êtes étudiant',
      'Montrez des liens forts avec l\'Algérie',
      'Faites fournir une preuve financière détaillée par le sponsor',
      'Pratiquez avec le simulateur d\'entretien'
    ],
    rating: 5,
    date: '2024-02-20',
    badges: ['First Try', 'Student'],
    badgesAr: ['المحاولة الأولى', 'طالبة'],
    badgesFr: ['Première tentative', 'Étudiante'],
    aiScore: 65
  },
  {
    id: '3',
    name: 'Karim D.',
    nameAr: 'كريم د.',
    nameFr: 'Karim D.',
    city: 'Constantine',
    cityAr: 'قسنطينة',
    cityFr: 'Constantine',
    visaType: 'US Tourist (B1/B2)',
    visaTypeAr: 'تأشيرة سياحة أمريكا',
    visaTypeFr: 'Touriste USA',
    country: 'United States',
    countryAr: 'الولايات المتحدة',
    countryFr: 'États-Unis',
    flag: '🇺🇸',
    story: 'The US visa has a 50%+ rejection rate for Algerians. I analyzed my profile with VisaGPT, improved my ties to Algeria (got property documents), and practiced extensively with the interview simulator. Got approved!',
    storyAr: 'تأشيرة أمريكا لديها نسبة رفض 50%+ للجزائريين. حللت ملفي مع VisaGPT، حسنت روابطي مع الجزائر (حصلت على وثائق ملكية)، ومارست كثيراً مع محاكي المقابلة. تمت الموافقة!',
    storyFr: 'Le visa USA a un taux de refus de 50%+ pour les Algériens. J\'ai analysé mon profil, amélioré mes liens avec l\'Algérie, et pratiqué avec le simulateur. Approuvé!',
    tips: [
      'Show property ownership in Algeria',
      'Have stable employment (CDI contract)',
      'Practice US visa interview questions extensively',
      'Don\'t mention plans to stay in US',
      'Show strong family ties'
    ],
    tipsAr: [
      'أظهر ملكية عقارية في الجزائر',
      'احصل على عمل ثابت (عقد CDI)',
      'تدرب على أسئلة مقابلة التأشيرة الأمريكية',
      'لا تذكر خطط البقاء في أمريكا',
      'أظهر روابط عائلية قوية'
    ],
    tipsFr: [
      'Montrez la propriété en Algérie',
      'Ayez un emploi stable (contrat CDI)',
      'Pratiquez les questions d\'entretien USA',
      'Ne mentionnez pas de plans de rester aux USA',
      'Montrez des liens familiaux solides'
    ],
    rating: 5,
    date: '2024-03-10',
    badges: ['AI Expert', 'Property Owner'],
    badgesAr: ['خبير AI', 'مالك عقار'],
    badgesFr: ['Expert IA', 'Propriétaire'],
    aiScore: 72
  },
  {
    id: '4',
    name: 'Samira L.',
    nameAr: 'سميرة ل.',
    nameFr: 'Samira L.',
    city: 'Annaba',
    cityAr: 'عنابة',
    cityFr: 'Annaba',
    visaType: 'Turkey E-Visa',
    visaTypeAr: 'تأشيرة إلكترونية تركية',
    visaTypeFr: 'E-Visa Turquie',
    country: 'Turkey',
    countryAr: 'تركيا',
    countryFr: 'Turquie',
    flag: '🇹🇷',
    story: 'Turkey e-visa was super easy! Applied online through VisaGPT\'s e-visa hub, got approval in 24 hours. The AI tip about passport validity was crucial - I almost applied with a passport expiring in 5 months!',
    storyAr: 'التأشيرة الإلكترونية التركية كانت سهلة جداً! تقدمت عبر مركز التأشيرات الإلكترونية في VisaGPT، حصلت على الموافقة في 24 ساعة. نصيحة الذكاء الاصطناعي حول صلاحية الجواز كانت حاسمة - كنت سأقدم ب جواز ينتهي في 5 أشهر!',
    storyFr: 'L\'e-visa turc était super facile! J\'ai postulé via le hub e-visa de VisaGPT, approbation en 24h. Le conseil IA sur la validité du passeport était crucial!',
    tips: [
      'Ensure passport is valid for 6+ months',
      'Apply 1-2 weeks before travel',
      'Have hotel and flight bookings ready',
      'Use credit card for payment'
    ],
    tipsAr: [
      'تأكد من أن جواز سفرك صالح لـ 6+ أشهر',
      'قدم قبل السفر بـ 1-2 أسبوع',
      'احصل على حجز فندق وطيران جاهز',
      'استخدم بطاقة ائتمان للدفع'
    ],
    tipsFr: [
      'Assurez-vous que le passeport est valide 6+ mois',
      'Postulez 1-2 semaines avant le voyage',
      'Ayez les réservations d\'hôtel et vol prêtes',
      'Utilisez une carte de crédit pour le paiement'
    ],
    rating: 5,
    date: '2024-04-05',
    badges: ['E-Visa Pro', 'First E-Visa'],
    badgesAr: ['محترف تأشيرة إلكترونية', 'أول تأشيرة إلكترونية'],
    badgesFr: ['Pro E-Visa', 'Première E-Visa'],
    aiScore: 95
  },
  {
    id: '5',
    name: 'Youcef K.',
    nameAr: 'يوسف ك.',
    nameFr: 'Youcef K.',
    city: 'Blida',
    cityAr: 'البليدة',
    cityFr: 'Blida',
    visaType: 'Schengen (Germany)',
    visaTypeAr: 'شنغن (ألمانيا)',
    visaTypeFr: 'Schengen (Allemagne)',
    country: 'Germany',
    countryAr: 'ألمانيا',
    countryFr: 'Allemagne',
    flag: '🇩🇪',
    story: 'Germany is stricter than France. I used the document inspector to check my documents before applying. Found 2 issues - fixed them and got approved on first try!',
    storyAr: 'ألمانيا أكثر صرامة من فرنسا. استخدمت فاحص الوثائق للتحقق من وثائقي قبل التقديم. وجدت مشكلتين - أصلحتها وتمت الموافقة على المحاولة الأولى!',
    storyFr: 'L\'Allemagne est plus stricte que la France. J\'ai utilisé l\'inspecteur de documents. Trouvé 2 problèmes - corrigés et approuvé!',
    tips: [
      'Use document inspector before applying',
      'German consulates are very detail-oriented',
      'Ensure all translations are certified',
      'Bank statements should be original'
    ],
    tipsAr: [
      'استخدم فاحص الوثائق قبل التقديم',
      'القنصليات الألمانية تهتم بالتفاصيل',
      'تأكد من أن جميع الترجمات معتمدة',
      'كشوف الحساب يجب أن تكون أصلية'
    ],
    tipsFr: [
      'Utilisez l\'inspecteur de documents avant de postuler',
      'Les consulats allemands sont très minutieux',
      'Assurez-vous que les traductions sont certifiées',
      'Les relevés bancaires doivent être originaux'
    ],
    rating: 5,
    date: '2024-05-12',
    badges: ['First Try', 'Document Expert'],
    badgesAr: ['المحاولة الأولى', 'خبير وثائق'],
    badgesFr: ['Première tentative', 'Expert documents'],
    aiScore: 82
  },
  {
    id: '6',
    name: 'Nadia H.',
    nameAr: 'نادية ح.',
    nameFr: 'Nadia H.',
    city: 'Tizi Ouzou',
    cityAr: 'تيزي وزو',
    cityFr: 'Tizi Ouzou',
    visaType: 'Canada Visitor',
    visaTypeAr: 'زائر كندا',
    visaTypeFr: 'Visiteur Canada',
    country: 'Canada',
    countryAr: 'كندا',
    countryFr: 'Canada',
    flag: '🇨🇦',
    story: 'Canada requires strong financial proof. I followed VisaGPT\'s savings plan, documented everything, and used the form filler for error-free application. The AI predicted my approval probability at 68% - got it!',
    storyAr: 'كندا تتطلب إثباتاً مالياً قوياً. اتبعت خطة التوفير في VisaGPT، ووثقت كل شيء، واستخدمت معبئ الاستمارات لتطبيق بدون أخطاء. تنبأ الذكاء الاصطناعي باحتمالية موافقتي بـ 68% - حصلت عليها!',
    storyFr: 'Le Canada exige une forte preuve financière. J\'ai suivi le plan d\'épargne, tout documenté, et utilisé le remplisseur de formulaires. L\'IA a prédit 68% - eu!',
    tips: [
      'Build significant savings (6+ months)',
      'Document every financial transaction',
      'Use form filler to avoid errors',
      'Apply during low season (Oct-Mar)'
    ],
    tipsAr: [
      'ابنِ مدخرات كبيرة (6+ أشهر)',
      'وثق كل معاملة مالية',
      'استخدم معبئ الاستمارات لتجنب الأخطاء',
      'قدم في موسم منخفض (أكتوبر-مارس)'
    ],
    tipsFr: [
      'Construisez des économies importantes (6+ mois)',
      'Documentez chaque transaction financière',
      'Utilisez le remplisseur de formulaires',
      'Postulez hors saison (Oct-Mar)'
    ],
    rating: 5,
    date: '2024-06-20',
    badges: ['AI Predictor', 'Saver'],
    badgesAr: ['متوقع الذكاء الاصطناعي', 'موفر'],
    badgesFr: ['Prédicteur IA', 'Épargnant'],
    aiScore: 68
  }
]

export function SuccessStories() {
  const { t, language } = useLanguage()
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null)
  const [filter, setFilter] = useState('all')

  const getName = (story: SuccessStory) => {
    if (language === 'ar') return story.nameAr
    if (language === 'fr') return story.nameFr
    return story.name
  }

  const getCity = (story: SuccessStory) => {
    if (language === 'ar') return story.cityAr
    if (language === 'fr') return story.cityFr
    return story.city
  }

  const getVisaType = (story: SuccessStory) => {
    if (language === 'ar') return story.visaTypeAr
    if (language === 'fr') return story.visaTypeFr
    return story.visaType
  }

  const getCountry = (story: SuccessStory) => {
    if (language === 'ar') return story.countryAr
    if (language === 'fr') return story.countryFr
    return story.country
  }

  const getStory = (story: SuccessStory) => {
    if (language === 'ar') return story.storyAr
    if (language === 'fr') return story.storyFr
    return story.story
  }

  const getTips = (story: SuccessStory) => {
    if (language === 'ar') return story.tipsAr
    if (language === 'fr') return story.tipsFr
    return story.tips
  }

  const getBadges = (story: SuccessStory) => {
    if (language === 'ar') return story.badgesAr
    if (language === 'fr') return story.badgesFr
    return story.badges
  }

  const filteredStories = filter === 'all' 
    ? successStories 
    : filter === 'easy' 
      ? successStories.filter(s => s.aiScore >= 80)
      : successStories.filter(s => s.aiScore < 80)

  const stats = {
    totalStories: successStories.length,
    avgRating: (successStories.reduce((acc, s) => acc + s.rating, 0) / successStories.length).toFixed(1),
    topCountries: [...new Set(successStories.map(s => s.country))].length,
    avgAiScore: Math.round(successStories.reduce((acc, s) => acc + s.aiScore, 0) / successStories.length)
  }

  return (
    <div className="min-h-screen p-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
            <Trophy className="text-amber-400" size={20} />
            <span className="text-amber-400 text-sm font-medium">
              {language === 'ar' ? 'قصص نجاح حقيقية' : language === 'fr' ? 'Histoires de réussite' : 'Real Success Stories'}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">
              {language === 'ar' ? 'قصص النجاح' : language === 'fr' ? 'Histoires de Succès' : 'Success Stories'}
            </span>
          </h1>
          <p className="text-white/60">
            {language === 'ar' ? 'تعلم من الجزائريين الذين حصلوا على تأشيراتهم' : language === 'fr' ? 'Apprenez des Algériens qui ont obtenu leur visa' : 'Learn from Algerians who got their visas'}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-ai mb-6 p-4"
        >
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <Users className="mx-auto mb-1 text-neon-cyan" size={20} />
              <p className="text-xl font-bold text-neon-cyan">{stats.totalStories}</p>
              <p className="text-xs text-white/50">{language === 'ar' ? 'قصة' : language === 'fr' ? 'histoires' : 'Stories'}</p>
            </div>
            <div className="text-center">
              <Star className="mx-auto mb-1 text-amber-400" size={20} />
              <p className="text-xl font-bold text-amber-400">{stats.avgRating}</p>
              <p className="text-xs text-white/50">{language === 'ar' ? 'تقييم' : language === 'fr' ? 'note' : 'Rating'}</p>
            </div>
            <div className="text-center">
              <Globe className="mx-auto mb-1 text-neon-purple" size={20} />
              <p className="text-xl font-bold text-neon-purple">{stats.topCountries}</p>
              <p className="text-xs text-white/50">{language === 'ar' ? 'دولة' : language === 'fr' ? 'pays' : 'Countries'}</p>
            </div>
            <div className="text-center">
              <TrendingUp className="mx-auto mb-1 text-emerald-400" size={20} />
              <p className="text-xl font-bold text-emerald-400">{stats.avgAiScore}%</p>
              <p className="text-xs text-white/50">{language === 'ar' ? 'معدل AI' : language === 'fr' ? 'score IA' : 'AI Score'}</p>
            </div>
          </div>
        </motion.div>

        {/* Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all',
              filter === 'all' && 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
            )}
          >
            {language === 'ar' ? 'الكل' : language === 'fr' ? 'Tous' : 'All'}
          </button>
          <button
            onClick={() => setFilter('easy')}
            className={cn(
              'px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all',
              filter === 'easy' && 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
            )}
          >
            {language === 'ar' ? 'سهل (AI >80%)' : language === 'fr' ? 'Facile (IA >80%)' : 'Easy (AI >80%)'}
          </button>
          <button
            onClick={() => setFilter('challenging')}
            className={cn(
              'px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all',
              filter === 'challenging' && 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
            )}
          >
            {language === 'ar' ? 'صعب (AI <80%)' : language === 'fr' ? 'Difficile (IA <80%)' : 'Challenging (AI <80%)'}
          </button>
        </div>

        {/* Stories List */}
        <div className="space-y-3">
          {filteredStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedStory(story)}
              className="glass-card-hover p-4 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center">
                  <span className="text-2xl">{story.flag}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold">{getName(story)}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-neon-cyan">{getVisaType(story)}</p>
                  <p className="text-xs text-white/50">{getCity(story)} • {getCountry(story)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {getBadges(story).map((badge, i) => (
                      <span key={i} className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                        {badge}
                      </span>
                    ))}
                    <span className="text-xs bg-neon-cyan/20 text-neon-cyan px-2 py-0.5 rounded-full ml-auto">
                      AI: {story.aiScore}%
                    </span>
                  </div>
                </div>
                <ChevronRight className="text-white/30 mt-2" size={20} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Story Modal */}
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setSelectedStory(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="glass-card-elevated w-full max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{selectedStory.flag}</span>
                  <div>
                    <h3 className="text-xl font-bold">{getName(selectedStory)}</h3>
                    <p className="text-white/50">{getVisaType(selectedStory)}</p>
                    <p className="text-sm text-white/30">{getCity(selectedStory)}, {getCountry(selectedStory)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  {[...Array(selectedStory.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Story */}
                <div>
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <MessageSquare size={16} className="text-neon-cyan" />
                    {language === 'ar' ? 'القصة' : language === 'fr' ? 'L\'Histoire' : 'The Story'}
                  </h4>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <Quote className="text-neon-cyan/30 mb-2" size={24} />
                    <p className="text-white/80 leading-relaxed">{getStory(selectedStory)}</p>
                  </div>
                </div>

                {/* AI Tips */}
                <div>
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-400" />
                    {language === 'ar' ? 'نصائح من الفائز' : language === 'fr' ? 'Conseils du Winner' : 'Winner\'s Tips'}
                  </h4>
                  <div className="space-y-2">
                    {getTips(selectedStory).map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 bg-emerald-500/10 p-3 rounded-lg">
                        <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-white/80">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Score */}
                <div className="bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="text-neon-cyan" size={20} />
                      <span className="font-medium">{language === 'ar' ? 'درجة الذكاء الاصطناعي' : language === 'fr' ? 'Score IA' : 'AI Score'}</span>
                    </div>
                    <span className="text-2xl font-black text-neon-cyan">{selectedStory.aiScore}%</span>
                  </div>
                  <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedStory.aiScore}%` }}
                      className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"
                    />
                  </div>
                </div>

                {/* Close */}
                <button
                  onClick={() => setSelectedStory(null)}
                  className="w-full py-3 text-center text-white/50 hover:text-white transition-colors"
                >
                  {language === 'ar' ? 'إغلاق' : language === 'fr' ? 'Fermer' : 'Close'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default SuccessStories
