'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, TrendingUp, Trophy, Globe, Clock,
  CheckCircle, Star, Zap, Award, Target, 
  BarChart3, PieChart, Activity, ArrowUp, ArrowDown
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { cn } from '@/lib/utils'

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalAssessments: number
  avgApprovalScore: number
  totalApproved: number
  monthlyGrowth: number
  topCountries: { country: string; flag: string; count: number }[]
  successRate: number
  testimonials: { name: string; text: string; country: string; flag: string }[]
}

const statsData: DashboardStats = {
  totalUsers: 24580,
  activeUsers: 8934,
  totalAssessments: 15420,
  avgApprovalScore: 72,
  totalApproved: 2890,
  monthlyGrowth: 23.5,
  topCountries: [
    { country: 'France', flag: '🇫🇷', count: 4230 },
    { country: 'UK', flag: '🇬🇧', count: 2890 },
    { country: 'Turkey', flag: '🇹🇷', count: 2340 },
    { country: 'USA', flag: '🇺🇸', count: 1980 },
    { country: 'Germany', flag: '🇩🇪', count: 1560 },
  ],
  successRate: 78,
  testimonials: [
    { name: 'Ahmed B.', text: 'Got my France visa after 2 rejections!', country: 'France', flag: '🇫🇷' },
    { name: 'Fatima M.', text: 'The AI analysis helped me understand my weak points.', country: 'UK', flag: '🇬🇧' },
    { name: 'Karim D.', text: 'E-visa to Turkey was super easy with VisaGPT!', country: 'Turkey', flag: '🇹🇷' },
  ]
}

export function QuickStatsDashboard() {
  const { t, language } = useLanguage()
  const [stats, setStats] = useState<DashboardStats>(statsData)
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    assessments: 0,
    approved: 0,
  })

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps
    
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedStats({
        users: Math.round(stats.totalUsers * eased),
        assessments: Math.round(stats.totalAssessments * eased),
        approved: Math.round(stats.totalApproved * eased),
      })
      
      if (step >= steps) clearInterval(timer)
    }, interval)
    
    return () => clearInterval(timer)
  }, [stats])

  const statCards = [
    {
      label: language === 'ar' ? 'المستخدمين' : language === 'fr' ? 'Utilisateurs' : 'Total Users',
      value: animatedStats.users.toLocaleString(),
      icon: Users,
      color: 'neon-cyan',
      change: '+12%',
      trend: 'up',
    },
    {
      label: language === 'ar' ? 'التقييمات' : language === 'fr' ? 'Évaluations' : 'Assessments',
      value: animatedStats.assessments.toLocaleString(),
      icon: BarChart3,
      color: 'neon-purple',
      change: '+18%',
      trend: 'up',
    },
    {
      label: language === 'ar' ? 'الموافق عليهم' : language === 'fr' ? 'Approuvés' : 'Approved',
      value: animatedStats.approved.toLocaleString(),
      icon: Trophy,
      color: 'emerald-400',
      change: '+24%',
      trend: 'up',
    },
    {
      label: language === 'ar' ? 'معدل النجاح' : language === 'fr' ? 'Taux de réussite' : 'Success Rate',
      value: `${stats.successRate}%`,
      icon: Target,
      color: 'amber-400',
      change: '+5%',
      trend: 'up',
    },
  ]

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
            <Activity className="text-amber-400" size={20} />
            <span className="text-amber-400 text-sm font-medium">
              {language === 'ar' ? 'المجتمع' : language === 'fr' ? 'Communauté' : 'Community'}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">
              {language === 'ar' ? 'إحصائيات' : language === 'fr' ? 'Statistiques' : 'Stats Dashboard'}
            </span>
          </h1>
          <p className="text-white/60">
            {language === 'ar' 
              ? `${animatedStats.users.toLocaleString()} جزائري يستخدمون VisaGPT` 
              : language === 'fr' 
              ? `${animatedStats.users.toLocaleString()} Algériens utilisent VisaGPT`
              : `${animatedStats.users.toLocaleString()} Algerians using VisaGPT`
            }
          </p>
        </motion.div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
                timeRange === range 
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                  : 'bg-white/5 text-white/50'
              )}
            >
              {range === 'week' && (language === 'ar' ? 'أسبوع' : language === 'fr' ? 'Semaine' : 'Week')}
              {range === 'month' && (language === 'ar' ? 'شهر' : language === 'fr' ? 'Mois' : 'Month')}
              {range === 'year' && (language === 'ar' ? 'سنة' : language === 'fr' ? 'An' : 'Year')}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    stat.color === 'neon-cyan' && 'bg-neon-cyan/20',
                    stat.color === 'neon-purple' && 'bg-neon-purple/20',
                    stat.color === 'emerald-400' && 'bg-emerald-400/20',
                    stat.color === 'amber-400' && 'bg-amber-400/20',
                  )}>
                    <Icon 
                      size={16} 
                      className={
                        stat.color === 'neon-cyan' ? 'text-neon-cyan' :
                        stat.color === 'neon-purple' ? 'text-neon-purple' :
                        stat.color === 'emerald-400' ? 'text-emerald-400' :
                        'text-amber-400'
                      } 
                    />
                  </div>
                  <span className="text-xs text-white/50">{stat.label}</span>
                </div>
                <p className="text-2xl font-black mb-1">{stat.value}</p>
                <div className="flex items-center gap-1">
                  {stat.trend === 'up' ? (
                    <ArrowUp size={12} className="text-emerald-400" />
                  ) : (
                    <ArrowDown size={12} className="text-red-400" />
                  )}
                  <span className={cn(
                    'text-xs font-medium',
                    stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                  )}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-white/30">
                    {language === 'ar' ? 'هذا الشهر' : language === 'fr' ? 'ce mois' : 'this month'}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Top Countries */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-4 mb-6"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Globe className="text-neon-cyan" size={18} />
            {language === 'ar' ? 'أكثر الوجهات شعبية' : language === 'fr' ? 'Destinations Populaires' : 'Top Destinations'}
          </h3>
          <div className="space-y-3">
            {stats.topCountries.map((country, index) => (
              <div key={country.country} className="flex items-center gap-3">
                <span className="text-lg w-8">{country.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{country.country}</span>
                    <span className="text-xs text-white/50">{country.count.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(country.count / stats.topCountries[0].count) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Success Rate Ring */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6 mb-6"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <PieChart className="text-neon-purple" size={18} />
            {language === 'ar' ? 'معدل النجاح الإجمالي' : language === 'fr' ? 'Taux de Réussite Global' : 'Overall Success Rate'}
          </h3>
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={440}
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ strokeDashoffset: 440 - (440 * stats.successRate / 100) }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00E5FF" />
                    <stop offset="100%" stopColor="#FF007A" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">{stats.successRate}%</span>
                <span className="text-xs text-white/50">
                  {language === 'ar' ? 'نسبة النجاح' : language === 'fr' ? 'Taux de réussite' : 'Success Rate'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Star className="text-amber-400" size={18} />
            {language === 'ar' ? 'شهادات' : language === 'fr' ? 'Témoignages' : 'Testimonials'}
          </h3>
          <div className="space-y-3">
            {stats.testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                    <span className="text-lg">{testimonial.flag}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{testimonial.name}</span>
                      <CheckCircle size={14} className="text-emerald-400" />
                    </div>
                    <p className="text-sm text-white/70">{testimonial.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-ai p-6 text-center"
        >
          <Award className="mx-auto mb-3 text-neon-cyan" size={40} />
          <h3 className="font-bold text-lg mb-2">
            {language === 'ar' ? 'انضم للمجتمع الآن!' : language === 'fr' ? 'Rejoignez la communauté!' : 'Join the Community!'}
          </h3>
          <p className="text-sm text-white/60 mb-4">
            {language === 'ar' 
              ? 'ابدأ تقييمك المجاني وكن جزءاً من أكثر من 24,000 جزائري'
              : language === 'fr'
              ? 'Commencez votre évaluation gratuite et rejoignez plus de 24 000 Algériens'
              : 'Start your free assessment and join 24,000+ Algerians'
            }
          </p>
          <button className="neon-button px-8 py-3">
            {language === 'ar' ? 'ابدأ الآن' : language === 'fr' ? 'Commencer' : 'Get Started'}
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default QuickStatsDashboard
