'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Users, MessageCircle, Heart, Share2, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Post {
  id: number
  name: string
  country: string
  flag: string
  date: string
  content: string
  likes: number
  comments: number
  type: 'success' | 'tip' | 'question'
}

const posts: Post[] = [
  {
    id: 1,
    name: 'أحمد من الجزائر',
    country: 'France',
    flag: '🇫🇷',
    date: 'منذ يومين',
    content: 'الحمدلله! حصلت على تأشيرة شنغن من المحاولة الثانية. الفضل يرجع لله ثم لمتابعة النصائح هنا. أهم شيء كان كشف حساب ب 6 أشهر.',
    likes: 45,
    comments: 12,
    type: 'success',
  },
  {
    id: 2,
    name: 'سارة من وهران',
    country: 'Canada',
    flag: '🇨🇦',
    date: 'منذ 3 أيام',
    content: 'نصيحة مهمة: لا تنسوا أن ترسلوا شهادة الميلاد مصدقة إذا كان لديكم أطفال.服务中心 طلبوها مني فجأة.',
    likes: 38,
    comments: 8,
    type: 'tip',
  },
  {
    id: 3,
    name: 'كريم من قسنطينة',
    country: 'Spain',
    flag: '🇪🇸',
    date: 'منذ أسبوع',
    content: 'موعدي في TLS وهران كان متاح مباشرة بدون انتظار! لا تستعجلوا الحجز في الجزائر العاصمة.',
    likes: 52,
    comments: 15,
    type: 'tip',
  },
]

export function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<'feed' | 'top'>('feed')

  return (
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">مجتمع التأشيرة</h2>
          <p className="text-white/60 text-sm">قصص نجاح ونصائح من المتقدمين</p>
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
            آخر المشاركات
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
            أفضل المساهمين
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
                    <span className="font-medium text-sm">{post.name}</span>
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
                  {post.type === 'success' && 'نجاح'}
                  {post.type === 'tip' && 'نصيحة'}
                  {post.type === 'question' && 'سؤال'}
                </div>
              </div>

              <p className="text-sm text-white/80 leading-relaxed mb-4">
                {post.content}
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
            شارك قصتك
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
