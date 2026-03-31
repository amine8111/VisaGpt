'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, TrendingUp, Award, Globe, Star, Heart,
  MessageSquare, ChevronRight, Filter, Search, Sparkles,
  ThumbsUp, Clock, MapPin, CheckCircle, Crown
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { cn } from '@/lib/utils'

interface SuccessStory {
  id: string
  name: string
  avatar: string
  country: string
  countryFlag: string
  visaType: string
  visaTypeAr: string
  date: string
  score: number
  story: string
  storyAr: string
  tips: string[]
  tipsAr: string[]
  likes: number
  comments: number
  verified: boolean
}

const successStories: SuccessStory[] = [
  {
    id: '1',
    name: 'Ahmed B.',
    avatar: '👨‍💼',
    country: 'France',
    countryFlag: '🇫🇷',
    visaType: 'Tourist Visa',
    visaTypeAr: 'تأشيرة سياحة',
    date: '2025-03-15',
    score: 95,
    story: 'After 3 failed attempts, I finally got my Schengen visa! The key was building my bank balance for 6 months and getting a proper invitation letter. VisaGPT helped me identify all the weaknesses in my profile.',
    storyAr: 'بعد 3 محاولات فاشلة، حصلت أخيراً على تأشيرة شنغن! كان المفتاح هو بناء رصيدي البنكي لمدة 6 أشهر والحصول على خطاب دعوة صحيح. ساعدني VisaGPT في تحديد جميع نقاط الضعف في ملفي.',
    tips: [
      'Build bank balance consistently for 6+ months',
      'Get a certified invitation letter',
      'Use the AI document checker before submitting',
      'Practice interview questions'
    ],
    tipsAr: [
      'ابنِ رصيدك البنكي بانتظام لمدة 6+ أشهر',
      'احصل على خطاب دعوة مصدق',
      'استخدم فاحص الوثائق قبل الإرسال',
      'تدرب على أسئلة المقابلة'
    ],
    likes: 234,
    comments: 45,
    verified: true
  },
  {
    id: '2',
    name: 'Fatima M.',
    avatar: '👩‍🔬',
    country: 'Germany',
    countryFlag: '🇩🇪',
    visaType: 'Business Visa',
    visaTypeAr: 'تأشيرة عمل',
    date: '2025-02-28',
    score: 92,
    story: 'The AI interview simulator prepared me perfectly. I knew exactly what questions they would ask and how to answer confidently. First-time success for a Schengen visa!',
    storyAr: 'مprepareني محاكي المقابلة الذكي بشكل مثالي. عرفت بالضبط ما هي الأسئلة التي سيطرحونها وكيف أجيب بثقة. نجاح من أول مرة لتأشيرة شنغن!',
    tips: [
      'Practice with AI simulator at least 10 times',
      'Know your business purpose clearly',
      'Prepare strong financial documents',
      'Have all hotel and flight bookings ready'
    ],
    tipsAr: [
      'تدرب مع المحاكي الذكي 10 مرات على الأقل',
      'اعرف غرضك التجاري بوضوح',
      'جهز وثائق مالية قوية',
      'احضر جميع حجوزات الفندق والطيران'
    ],
    likes: 189,
    comments: 32,
    verified: true
  },
  {
    id: '3',
    name: 'Yacine K.',
    avatar: '👨‍🎓',
    country: 'Spain',
    countryFlag: '🇪🇸',
    visaType: 'Student Visa',
    visaTypeAr: 'تأشيرة طالب',
    date: '2025-01-20',
    score: 98,
    story: 'VisaGPT is a game changer! The document checker caught 3 errors in my application that would have caused rejection. I fixed them and got my visa in 5 days!',
    storyAr: 'VisaGPT يغير قواعد اللعبة! اكتشف فاحص الوثائق 3 أخطاء في طلبي كان سيؤدي للرفض. أصلحتها وحصلت على تأشيرتي في 5 أيام!',
    tips: [
      'Use document checker before submitting',
      'Fix all warnings, especially red ones',
      'Keep bank statements consistent',
      'Get employment letter on company letterhead'
    ],
    tipsAr: [
      'استخدم فاحص الوثائق قبل الإرسال',
      'أصلح جميع التحذيرات، خاصة الحمراء',
      'حافظ على اتساق كشوف الحساب',
      'احصل على خطاب العمل على ورقة الشركة'
    ],
    likes: 312,
    comments: 67,
    verified: true
  },
  {
    id: '4',
    name: 'Sara L.',
    avatar: '👩‍💻',
    country: 'UK',
    countryFlag: '🇬🇧',
    visaType: 'Standard Visitor',
    visaTypeAr: 'زائر عادي',
    date: '2025-03-01',
    score: 88,
    story: 'I was afraid of UK visa after hearing stories of high rejection rates. But with VisaGPT help analyzing my profile and suggesting improvements, I got approved on first try!',
    storyAr: 'كنت خائفة من تأشيرة بريطانيا بعد سماع قصص معدلات الرفض العالية. لكن بمساعدة VisaGPT في تحليل ملفي واقتراح التحسينات، وافقت من أول مرة!',
    tips: [
      'Build strong ties to Algeria',
      'Show property ownership if possible',
      'Get invitation from UK resident',
      'Prepare detailed itinerary'
    ],
    tipsAr: [
      'ابنِ روابط قوية مع الجزائر',
      'أظهر الملكية العقارية إن أمكن',
      'احصل على دعوة من مقيم في بريطانيا',
      'جهز برنامج سفر مفصل'
    ],
    likes: 156,
    comments: 28,
    verified: true
  },
  {
    id: '5',
    name: 'Karim H.',
    avatar: '👨‍🏫',
    country: 'Italy',
    countryFlag: '🇮🇹',
    visaType: 'Tourist Visa',
    visaTypeAr: 'تأشيرة سياحة',
    date: '2025-02-14',
    score: 90,
    story: 'After using the financial analyzer, I discovered I needed to save 200,000 DZD more. I followed the AI recommendations for 4 months and my visa was approved immediately!',
    storyAr: 'بعد استخدام المحلل المالي، اكتشفت أنني بحاجة لتوفير 200,000 دج إضافية. اتبعت توصيات الذكاء الاصطناعي لمدة 4 أشهر وتمت الموافقة على تأشيرتي فوراً!',
    tips: [
      'Use financial analyzer early',
      'Follow savings recommendations',
      'Show consistent income',
      'Avoid large irregular deposits'
    ],
    tipsAr: [
      'استخدم المحلل المالي مبكراً',
      'اتبع توصيات التوفير',
      'أظهر دخلاً ثابتاً',
      'تجنب الإيداعات الكبيرة غير المنتظمة'
    ],
    likes: 201,
    comments: 41,
    verified: true
  }
]

interface CommunitySuccessProps {
  limit?: number
}

export function CommunitySuccess({ limit }: CommunitySuccessProps) {
  const { t, language } = useLanguage()
  const [filter, setFilter] = useState('all')
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null)
  
  const filteredStories = filter === 'all' 
    ? successStories 
    : successStories.filter(s => s.country.toLowerCase().includes(filter.toLowerCase()))

  const displayedStories = limit ? filteredStories.slice(0, limit) : filteredStories

  const stats = {
    totalSuccess: 1547,
    avgScore: 89,
    topCountry: 'France',
    topCountryFlag: '🇫🇷'
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-4">
            <Award className="text-emerald-400 animate-pulse" size={20} />
            <span className="text-emerald-400 text-sm font-medium">Success Stories</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text gradient-text-emerald">{t('communitySuccess')}</span>
          </h1>
          <p className="text-white/60">{t('communitySuccessDesc')}</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-ai mb-6"
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Users className="text-emerald-400" size={24} />
              </div>
              <p className="text-2xl font-bold text-emerald-400">{(stats.totalSuccess / 1000).toFixed(1)}K</p>
              <p className="text-xs text-white/50">{language === 'ar' ? 'ناجح' : language === 'fr' ? 'Réussis' : 'Success'}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-neon-cyan/20 flex items-center justify-center">
                <TrendingUp className="text-neon-cyan" size={24} />
              </div>
              <p className="text-2xl font-bold text-neon-cyan">{stats.avgScore}%</p>
              <p className="text-xs text-white/50">{language === 'ar' ? 'متوسط الدرجة' : language === 'fr' ? 'Score moyen' : 'Avg Score'}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-neon-purple/20 flex items-center justify-center">
                <Globe className="text-neon-purple" size={24} />
              </div>
              <p className="text-2xl">{stats.topCountryFlag}</p>
              <p className="text-xs text-white/50">{language === 'ar' ? 'الأكثر طلباً' : language === 'fr' ? 'Plus populaire' : 'Top Country'}</p>
            </div>
          </div>
        </motion.div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'France', 'Germany', 'Spain', 'Italy', 'UK', 'USA'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                filter === f 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                  : 'bg-white/5 text-white/60'
              )}
            >
              {f === 'all' 
                ? (language === 'ar' ? 'الكل' : language === 'fr' ? 'Tous' : 'All')
                : f}
            </button>
          ))}
        </div>

        {/* Stories */}
        <div className="space-y-4">
          {displayedStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card-hover p-4"
              onClick={() => setSelectedStory(story)}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center text-2xl">
                  {story.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold">{story.name}</h4>
                    {story.verified && (
                      <span className="badge badge-emerald py-0.5 px-2 text-xs">
                        <CheckCircle size={10} className="mr-1" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <span>{story.countryFlag}</span>
                    <span>{story.country}</span>
                    <span>•</span>
                    <span>{story.visaTypeAr}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn(
                    'text-lg font-bold',
                    story.score >= 90 && 'text-emerald-400',
                    story.score >= 70 && story.score < 90 && 'text-neon-cyan',
                    story.score < 70 && 'text-yellow-400'
                  )}>
                    {story.score}%
                  </div>
                  <p className="text-xs text-white/50">{language === 'ar' ? 'درجة النجاح' : 'Success Score'}</p>
                </div>
              </div>

              {/* Story Preview */}
              <p className="text-sm text-white/70 line-clamp-2 mb-3">
                {language === 'ar' ? story.storyAr : story.story}
              </p>

              {/* Tips Preview */}
              <div className="bg-neon-cyan/5 p-3 rounded-xl mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="text-neon-cyan" size={14} />
                  <span className="text-xs font-medium text-neon-cyan">
                    {language === 'ar' ? 'أهم نصيحة' : language === 'fr' ? 'Conseil clé' : 'Key Tip'}
                  </span>
                </div>
                <p className="text-xs text-white/60">
                  {language === 'ar' ? story.tipsAr[0] : story.tips[0]}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div className="flex items-center gap-4 text-sm text-white/50">
                  <div className="flex items-center gap-1">
                    <ThumbsUp size={14} />
                    <span>{story.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={14} />
                    <span>{story.comments}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <Clock size={12} />
                  <span>{new Date(story.date).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Story Modal */}
        <AnimatePresence>
          {selectedStory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedStory(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card-elevated p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center text-3xl">
                    {selectedStory.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{selectedStory.name}</h3>
                      {selectedStory.verified && (
                        <CheckCircle className="text-emerald-400" size={16} />
                      )}
                    </div>
                    <p className="text-sm text-white/50">
                      {selectedStory.countryFlag} {selectedStory.country} • {selectedStory.visaTypeAr}
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div className={cn(
                  'text-center p-4 rounded-xl mb-4',
                  selectedStory.score >= 90 && 'bg-emerald-500/10',
                  selectedStory.score >= 70 && selectedStory.score < 90 && 'bg-neon-cyan/10',
                  selectedStory.score < 70 && 'bg-yellow-500/10'
                )}>
                  <p className="text-xs text-white/50 mb-1">{language === 'ar' ? 'درجة النجاح' : 'Success Score'}</p>
                  <p className={cn(
                    'text-4xl font-black',
                    selectedStory.score >= 90 && 'text-emerald-400',
                    selectedStory.score >= 70 && selectedStory.score < 90 && 'text-neon-cyan',
                    selectedStory.score < 70 && 'text-yellow-400'
                  )}>
                    {selectedStory.score}%
                  </p>
                </div>

                {/* Story */}
                <div className="mb-4">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <MessageSquare className="text-neon-cyan" size={16} />
                    {language === 'ar' ? 'قصتي' : language === 'fr' ? 'Mon histoire' : 'My Story'}
                  </h4>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {language === 'ar' ? selectedStory.storyAr : selectedStory.story}
                  </p>
                </div>

                {/* Tips */}
                <div className="mb-4">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Sparkles className="text-amber-400" size={16} />
                    {language === 'ar' ? 'نصائح للنجاح' : language === 'fr' ? 'Conseils pour réussir' : 'Tips for Success'}
                  </h4>
                  <ul className="space-y-2">
                    {(language === 'ar' ? selectedStory.tipsAr : selectedStory.tips).map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <ChevronRight className="text-neon-cyan mt-0.5 flex-shrink-0" size={16} />
                        <span className="text-white/70">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedStory(null)}
                  className="btn-secondary w-full"
                >
                  {language === 'ar' ? 'إغلاق' : language === 'fr' ? 'Fermer' : 'Close'}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More */}
        {limit && filteredStories.length > limit && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="btn-glow w-full mt-6"
          >
            {language === 'ar' ? 'عرض المزيد' : language === 'fr' ? 'Voir plus' : 'Load More'}
            <ChevronRight className="inline-block ml-2" size={16} />
          </motion.button>
        )}
      </div>
    </div>
  )
}

export default CommunitySuccess
