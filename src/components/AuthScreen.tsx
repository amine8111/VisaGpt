'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight, ArrowLeft, Shield, Zap, Award, Globe } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { useLanguage } from './LanguageProvider'
import { cn } from '@/lib/utils'

export function AuthScreen() {
  const router = useRouter()
  const { language, setLanguage, t, dir } = useLanguage()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { login, register, isLoading } = useVisaStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError(t('passwordMismatch'))
      return
    }
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields')
      return
    }
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password)
        router.push('/')
      } else {
        if (!formData.name) {
          setError(t('fullName') + ' is required')
          return
        }
        await register({
          email: formData.email,
          password: formData.password,
          fullName: formData.name,
          phone: formData.phone || '0000000000',
        })
        setSuccess(t('registrationSuccess') || 'Account created successfully! Redirecting...')
        setTimeout(() => { router.push('/') }, 1000)
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      const errorMsg = err?.message || 'Connection error. Please try again.'
      setError(errorMsg)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative z-10">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-magenta/10 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block"
          >
            <Sparkles className="text-neon-magenta mx-auto mb-2" size={48} />
          </motion.div>
          <h1 className="text-4xl font-bold gradient-text mb-2">VisaAI DZ</h1>
          <p className="text-white/60 text-lg">{t('appTagline')}</p>
        </div>

        {/* Credentials Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-5 rounded-2xl border border-neon-cyan/30 bg-gradient-to-r from-neon-cyan/10 via-neon-magenta/5 to-neon-purple/10"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                <Award className="text-neon-cyan" size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">10+ Years</p>
                <p className="text-xs text-white/60">VFS Global</p>
              </div>
            </div>
            <div className="w-px h-10 bg-white/20 hidden md:block" />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Globe className="text-yellow-400" size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">North Africa</p>
                <p className="text-xs text-white/60">Regional Management</p>
              </div>
            </div>
            <div className="w-px h-10 bg-white/20 hidden md:block" />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center">
                <Shield className="text-neon-purple" size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">5 Years</p>
                <p className="text-xs text-white/60">BLS Partner DZ & MA</p>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-white/70 mt-4 italic">
            "Built by visa experts who processed 100,000+ applications"
          </p>
        </motion.div>

        {/* App Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Shield, title: language === 'ar' ? 'ذكاء اصطناعي' : language === 'fr' ? 'IA Avancée' : 'AI-Powered', desc: language === 'ar' ? 'تقييم ذكي للتأشيرات' : language === 'fr' ? 'Évaluation intelligente' : 'Smart visa assessment' },
            { icon: Globe, title: language === 'ar' ? 'كل الدول' : language === 'fr' ? 'Tous pays' : 'All Countries', desc: language === 'ar' ? 'شنغن، بريطانيا، أمريكا، كندا' : 'Schengen, UK, USA, Canada' },
            { icon: Zap, title: language === 'ar' ? 'نتائج فورية' : language === 'fr' ? 'Résultats instantanés' : 'Instant Results', desc: language === 'ar' ? 'احصل على نتيجتك فوراً' : 'Get your score in seconds' },
            { icon: Award, title: language === 'ar' ? 'خبرة 15 عاماً' : language === 'fr' ? '15 ans expertise' : '15 Years Expertise', desc: language === 'ar' ? 'معرفة مباشرة من VFS & BLS' : 'Direct knowledge from VFS & BLS' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-4 text-center"
            >
              <feature.icon className="text-neon-cyan mx-auto mb-2" size={24} />
              <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-white/50">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Language Switch */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setLanguage('en')}
            className={cn(
              'px-4 py-2 rounded-full text-sm transition-all',
              language === 'en' ? 'bg-neon-cyan text-black font-medium' : 'bg-white/10 text-white/60'
            )}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('ar')}
            className={cn(
              'px-4 py-2 rounded-full text-sm transition-all',
              language === 'ar' ? 'bg-neon-cyan text-black font-medium' : 'bg-white/10 text-white/60'
            )}
          >
            العربية
          </button>
          <button
            onClick={() => setLanguage('fr')}
            className={cn(
              'px-4 py-2 rounded-full text-sm transition-all',
              language === 'fr' ? 'bg-neon-cyan text-black font-medium' : 'bg-white/10 text-white/60'
            )}
          >
            Français
          </button>
        </div>

        {/* Toggle */}
        <div className="flex bg-white/5 rounded-xl p-1 mb-6 max-w-md mx-auto">
          <button
            onClick={() => { setIsLogin(true); setError(null); setSuccess(null); }}
            className={cn(
              'flex-1 py-3 rounded-lg text-sm font-medium transition-all',
              isLogin ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-white/60'
            )}
          >
            {t('login')}
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(null); setSuccess(null); }}
            className={cn(
              'flex-1 py-3 rounded-lg text-sm font-medium transition-all',
              !isLogin ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-white/60'
            )}
          >
            {t('register')}
          </button>
        </div>

        {/* Form */}
        <motion.form
          key={isLogin ? 'login' : 'register'}
          initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleSubmit}
          className="glass-card p-6 space-y-4 max-w-md mx-auto"
        >
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm text-white/70 mb-2">{t('fullName')}</label>
                <div className="relative">
                  <User size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field pr-10"
                    placeholder={language === 'ar' ? 'أحمد بن علي' : language === 'fr' ? 'Ahmed Benali' : 'Ahmed Benali'}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">{t('phone')}</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field pr-4"
                    placeholder="0555123456"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm text-white/70 mb-2">{t('email')}</label>
            <div className="relative">
              <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field pr-10"
                placeholder="ahmed@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-2">{t('password')}</label>
            <div className="relative">
              <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field pr-10"
                placeholder={language === 'ar' ? '6 أحرف على الأقل' : language === 'fr' ? 'Minimum 6 caractères' : 'Minimum 6 characters'}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm text-white/70 mb-2">{t('confirmPassword')}</label>
              <div className="relative">
                <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="input-field pr-10"
                  placeholder={language === 'ar' ? 'إعادة إدخال كلمة المرور' : language === 'fr' ? 'Confirmer le mot de passe' : 'Re-enter password'}
                  required
                  minLength={6}
                />
              </div>
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-neon-cyan" />
                <span className="text-white/60">{t('rememberMe')}</span>
              </label>
              <button type="button" className="text-neon-cyan hover:underline">
                {t('forgotPassword')}
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm text-center">
              {success}
            </div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            whileTap={{ scale: 0.98 }}
            className="neon-button w-full py-4 flex items-center justify-center gap-2 mt-6"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <>
                {isLogin ? t('login') : t('createAccount')}
                {dir === 'rtl' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Demo Account */}
        <div className="mt-6 text-center max-w-md mx-auto">
          <p className="text-white/40 text-sm mb-2">{language === 'ar' ? 'حساب تجريبي:' : language === 'fr' ? 'Compte démo:' : 'Demo Account:'}</p>
          <p className="text-white/60 text-xs">Email: demo@visagpt.dz</p>
          <p className="text-white/60 text-xs">{language === 'ar' ? 'كلمة المرور:' : language === 'fr' ? 'Mot de passe:' : 'Password:'} demo123</p>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-white/40 text-xs"
        >
          <div className="flex items-center gap-2">
            <Shield size={14} />
            <span>{language === 'ar' ? 'بياناتك آمنة' : language === 'fr' ? 'Données sécurisées' : 'Your data is secure'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={14} />
            <span>{language === 'ar' ? 'نتائج فورية' : language === 'fr' ? 'Résultats instantanés' : 'Instant results'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={14} />
            <span>{language === 'ar' ? 'دعم احترافي' : language === 'fr' ? 'Support expert' : 'Expert support'}</span>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-white/40 text-xs mt-8">
          {language === 'ar' ? 'بالضغط على تسجيل، أنت توافق على شروط الخدمة وسياسة الخصوصية' : language === 'fr' ? "En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité" : 'By signing up, you agree to our Terms of Service and Privacy Policy'}
        </p>
      </motion.div>
    </div>
  )
}
