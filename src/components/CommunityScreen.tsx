'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Users, MessageCircle, Heart, Share2, Award } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

interface PostData {
  nameAr: string
  nameEn: string
  nameFr: string
  countryCode: string
  flag: string
  contentAr: string
  contentEn: string
  contentFr: string
  likes: number
  comments: number
  type: 'success' | 'tip' | 'question'
}

const postsData: PostData[] = [
  {
    nameAr: 'أحمد من الجزائر',
    nameEn: 'Ahmed from Algiers',
    nameFr: 'Ahmed d\'Alger',
    countryCode: 'FR',
    flag: '🇫🇷',
    contentAr: 'الحمدلله! حصلت على تأشيرة شنغن من المحاولة الثانية. الفضل يرجع لله ثم لمتابعة النصائح هنا. أهم شيء كان كشف حساب ب 6 أشهر.',
    contentEn: 'Praise God! I got my Schengen visa on the second attempt. The credit goes to God then following the tips here. The most important thing was a 6-month bank statement.',
    contentFr: 'Praise Allah ! J\'ai obtenu mon visa Schengen à la deuxième tentative. Le mérite revient à Dieu puis aux conseils ici. La chose la plus importante était un relevé bancaire de 6 mois.',
    likes: 45,
    comments: 12,
    type: 'success',
  },
  {
    nameAr: 'سارة من وهران',
    nameEn: 'Sarah from Oran',
    nameFr: 'Sarah d\'Oran',
    countryCode: 'CA',
    flag: '🇨🇦',
    contentAr: 'نصيحة مهمة: لا تنسوا أن ترسلوا شهادة الميلاد مصدقة إذا كان لديكم أطفال.服务中心 طلبوها مني فجأة.',
    contentEn: 'Important tip: Don\'t forget to send a certified birth certificate if you have children. They requested it from me suddenly.',
    contentFr: 'Conseil important : N\'oubliez pas d\'envoyer un acte de naissance certifié si vous avez des enfants. Ils me l\'ont demandé soudainement.',
    likes: 38,
    comments: 8,
    type: 'tip',
  },
  {
    nameAr: 'كريم من قسنطينة',
    nameEn: 'Karim from Constantine',
    nameFr: 'Karim de Constantine',
    countryCode: 'ES',
    flag: '🇪🇸',
    contentAr: 'موعدي في TLS وهران كان متاح مباشرة بدون انتظار! لا تستعجلوا الحجز في الجزائر العاصمة.',
    contentEn: 'My appointment at TLS Oran was available immediately without waiting! Don\'t rush booking in Algiers.',
    contentFr: 'Mon rendez-vous à TLS Oran était disponible immédiatement sans attente ! Ne vous précipitez pas pour réserver à Alger.',
    likes: 52,
    comments: 15,
    type: 'tip',
  },
]

interface Post extends PostData {
  id: number
  date: string
}

export function CommunityScreen() {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState<'feed' | 'top'>('feed')

  const posts: Post[] = postsData.map((post, index) => ({
    ...post,
    id: index + 1,
    date: new Date(Date.now() - index * 86400000).toLocaleDateString(language === 'ar' ? 'ar-DZ' : language === 'fr' ? 'fr-DZ' : 'en-US'),
  }))

  const getLocalizedContent = (post: PostData) => {
    if (language === 'ar') return { name: post.nameAr, content: post.contentAr }
    if (language === 'fr') return { name: post.nameFr, content: post.contentFr }
    return { name: post.nameEn, content: post.contentEn }
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">{t('communityTitle')}</h2>
          <p className="text-white/60 text-sm">{t('communityDescription')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6"
        >
          <button
            onClick={() => setActiveTab('feed')}
            className={cn(
              'flex-1 py-3 rounded-xl font-medium transition-all',
              activeTab === 'feed'
                ? 'neon-button'
                : 'glass-card-hover'
            )}
          >
            {t('latestPosts')}
          </button>
          <button
            onClick={() => setActiveTab('top')}
            className={cn(
              'flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2',
              activeTab === 'top'
                ? 'neon-button'
                : 'glass-card-hover'
            )}
          >
            <Award size={16} />
            {t('topContributors')}
          </button>
        </motion.div>

        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center">
                  <Users size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{getLocalizedContent(post).name}</span>
                    <span className="text-lg">{post.flag}</span>
                  </div>
                  <p className="text-xs text-white/50">{post.date}</p>
                </div>
                <div className={cn(
                  'px-2 py-1 rounded-full text-xs',
                  post.type === 'success' && 'bg-green-500/20 text-green-400',
                  post.type === 'tip' && 'bg-neon-cyan/20 text-neon-cyan',
                  post.type === 'question' && 'bg-yellow-500/20 text-yellow-400'
                )}>
                  {post.type === 'success' && t('success')}
                  {post.type === 'tip' && t('tip')}
                  {post.type === 'question' && t('question')}
                </div>
              </div>

              <p className="text-sm text-white/80 leading-relaxed mb-4">
                {getLocalizedContent(post).content}
              </p>

              <div className="flex items-center gap-6 text-white/50">
                <button className="flex items-center gap-2 text-sm hover:text-neon-magenta transition-colors">
                  <Heart size={16} />
                  {post.likes}
                </button>
                <button className="flex items-center gap-2 text-sm hover:text-neon-cyan transition-colors">
                  <MessageCircle size={16} />
                  {post.comments}
                </button>
                <button className="flex items-center gap-2 text-sm hover:text-white transition-colors mr-auto">
                  <Share2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full neon-button flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            {t('shareYourStory')}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
