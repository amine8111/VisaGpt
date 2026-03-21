'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Star, Crown, Check, CreditCard, ArrowRight, ArrowLeft, Sparkles, Shield, Camera, Globe, Users, FileText } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'
import { SERVICE_TIERS, type ServiceTier } from '@/lib/serviceConfig'

export function UpgradePage() {
  const { membership, upgradeMembership, setActiveNav } = useVisaStore()
  const { t } = useLanguage()
  const [selectedTier, setSelectedTier] = useState<'gold' | 'premium'>('gold')
  const [duration, setDuration] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const currentTier = membership?.tier || 'free'
  
  const handleUpgrade = async () => {
    setIsProcessing(true)
    setError('')
    
    try {
      await upgradeMembership(selectedTier, duration)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء الترقية')
    } finally {
      setIsProcessing(false)
    }
  }

  const goldFeatures = [
    { icon: Shield, text: 'تقييم مفصل للتأشيرة' },
    { icon: FileText, text: 'تعبئة تلقائية لاستمارة شنغن' },
    { icon: Globe, text: 'نصائح ذكية مع تتبع للإنجازات' },
    { icon: Users, text: 'مولد الخطابات الرسمية' },
    { icon: Sparkles, text: 'المحاكي الذكي' },
    { icon: FileText, text: 'تنظيم الوثائق' },
  ]

  const premiumFeatures = [
    ...goldFeatures,
    { icon: Camera, text: 'التقاط صورة جواز' },
    { icon: Globe, text: 'ترجمة معتمدة' },
    { icon: Shield, text: 'تأمين السفر' },
    { icon: Users, text: 'حجز موعد مع وكيل' },
    { icon: FileText, text: 'مولد الطعون' },
  ]

  if (success) {
    return (
      <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-24 h-24 bg-neon-purple/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Crown className="text-neon-purple" size={48} />
            </motion.div>
            
            <h2 className="text-3xl font-bold mb-2">🎉 مبروك!</h2>
            <p className="text-white/60 mb-6">
              أنت الآن مشترك {selectedTier === 'gold' ? 'ذهبي' : 'بريميوم'}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 mb-6"
            >
              <h3 className="font-bold mb-4">ماذا الآن؟</h3>
              <div className="space-y-3 text-right">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-neon-cyan/20 rounded-full flex items-center justify-center">
                    <Check className="text-neon-cyan" size={16} />
                  </span>
                  <span>استفد من جميع خدمات الباقة</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-neon-cyan/20 rounded-full flex items-center justify-center">
                    <Check className="text-neon-cyan" size={16} />
                  </span>
                  <span>احصل على تقييم مفصل</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-neon-cyan/20 rounded-full flex items-center justify-center">
                    <Check className="text-neon-cyan" size={16} />
                  </span>
                  <span>تواصل مع الوكلاء المعتمدين</span>
                </div>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSuccess(false)
                setActiveNav('home')
              }}
              className="neon-button w-full"
            >
              العودة للرئيسية
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">ترقية العضوية</h2>
          <p className="text-white/60 text-sm">اختر الباقة المناسبة لك</p>
        </motion.div>

        <div className="flex gap-3 mb-6">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedTier('gold')}
            className={cn(
              'flex-1 p-4 rounded-xl border transition-all',
              selectedTier === 'gold'
                ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                : 'bg-white/5 border-white/10 text-white/60'
            )}
          >
            <Star className={cn('mx-auto mb-2', selectedTier === 'gold' && 'text-yellow-400')} size={24} />
            <p className="font-bold">ذهبي</p>
            <p className="text-xs opacity-70">5,000 DZD/شهر</p>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedTier('premium')}
            className={cn(
              'flex-1 p-4 rounded-xl border transition-all',
              selectedTier === 'premium'
                ? 'bg-neon-purple/20 border-neon-purple/50 text-neon-purple'
                : 'bg-white/5 border-white/10 text-white/60'
            )}
          >
            <Crown className={cn('mx-auto mb-2', selectedTier === 'premium' && 'text-neon-purple')} size={24} />
            <p className="font-bold">بريميوم</p>
            <p className="text-xs opacity-70">15,000 DZD/شهر</p>
          </motion.button>
        </div>

        <motion.div
          key={selectedTier}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-4 mb-6"
        >
          <h3 className="font-bold mb-4">
            مميزات {selectedTier === 'gold' ? 'الباقة الذهبية' : 'الباقة البرميومية'}
          </h3>
          <div className="space-y-3">
            {(selectedTier === 'gold' ? goldFeatures : premiumFeatures).map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="p-1.5 bg-neon-cyan/20 rounded-lg">
                  <feature.icon className="text-neon-cyan" size={14} />
                </div>
                <span className="text-sm">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 mb-6"
        >
          <h3 className="font-bold mb-4">مدة الاشتراك</h3>
          <div className="flex gap-3">
            {[1, 3, 6, 12].map((m) => (
              <motion.button
                key={m}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDuration(m)}
                className={cn(
                  'flex-1 py-3 rounded-xl text-sm font-medium transition-all',
                  duration === m
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                    : 'bg-white/5 text-white/60'
                )}
              >
                {m === 1 ? 'شهر' : `${m} أشهر`}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/70">السعر الشهري</span>
            <span className="font-bold">
              {(selectedTier === 'gold' ? 5000 : 15000).toLocaleString()} DZD
            </span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/70">المدة</span>
            <span className="font-bold">
              {duration} {duration === 1 ? 'شهر' : 'أشهر'}
            </span>
          </div>
          <div className="border-t border-white/10 pt-4 flex items-center justify-between">
            <span className="font-bold">الإجمالي</span>
            <span className="text-2xl font-bold text-neon-cyan">
              {((selectedTier === 'gold' ? 5000 : 15000) * duration).toLocaleString()} DZD
            </span>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-4 mb-6 border-red-500/50"
          >
            <p className="text-red-400 text-sm text-center">{error}</p>
          </motion.div>
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleUpgrade}
          disabled={isProcessing}
          className="neon-button w-full flex items-center justify-center gap-2 mb-4"
        >
          {isProcessing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              جارٍ الترقية...
            </>
          ) : (
            <>
              <CreditCard size={18} />
              ترقية الآن
            </>
          )}
        </motion.button>

        <p className="text-xs text-white/50 text-center mb-6">
          الدفع يتم عبر CCP أو BaridiMob. سيتم تفعيل اشتراكك فور تأكيد الدفع.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-4"
        >
          <h4 className="font-bold mb-2">💡 نصيحة</h4>
          <p className="text-sm text-white/70">
            اشترك لمدة أطول للحصول على خصم يصل إلى 20%. كما يمكنك إلغاء الاشتراك في أي وقت.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => useVisaStore.getState().setActiveNav('home')}
          className="w-full py-3 text-white/60 text-sm mt-4"
        >
          العودة للرئيسية
        </motion.button>
      </div>
    </div>
  )
}

export default UpgradePage
