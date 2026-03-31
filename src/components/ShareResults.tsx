'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Share2, Download, Copy, Check, DownloadCloud,
  MessageCircle, Twitter, Facebook, Instagram,
  Trophy, Target, TrendingUp, Star, Award, 
  BarChart3, Users, Globe, ChevronRight
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { cn } from '@/lib/utils'

interface ShareData {
  visaType: string
  visaCountry: string
  countryFlag: string
  approvalScore: number
  strengths: string[]
  improvements: string[]
  rank: string
  totalAssessed: number
  userName?: string
}

const sampleShareData: ShareData = {
  visaType: 'Schengen',
  visaCountry: 'France',
  countryFlag: '🇫🇷',
  approvalScore: 78,
  strengths: ['Stable employment', 'Good bank balance', 'Strong ties to Algeria'],
  improvements: ['Build travel history', 'Get travel insurance early'],
  rank: 'Top 35%',
  totalAssessed: 15420,
}

export function ShareResults() {
  const { t, language } = useLanguage()
  const [copied, setCopied] = useState(false)
  const [shareData] = useState<ShareData>(sampleShareData)

  const generateShareText = () => {
    if (language === 'ar') {
      return `🏆 تحقق من درجة تأشيرتي!\n\n${shareData.countryFlag} تأشيرة ${shareData.visaType} لـ ${shareData.visaCountry}\n\n📊 الدرجة: ${shareData.approvalScore}%\n🏅 التصنيف: ${shareData.rank}\n\n🔑 نقاط القوة:\n${shareData.strengths.map(s => `• ${s}`).join('\n')}\n\n🤖 باستخدام VisaGPT - مساعد الذكاء الاصطناعي للتأشيرات\n\n#تأشيرة #الجزائر #VisaGPT`
    }
    if (language === 'fr') {
      return `🏆 Vérifiez mon score de visa!\n\n${shareData.countryFlag} Visa ${shareData.visaType} pour ${shareData.visaCountry}\n\n📊 Score: ${shareData.approvalScore}%\n🏅 Classement: ${shareData.rank}\n\n🔑 Points forts:\n${shareData.strengths.map(s => `• ${s}`).join('\n')}\n\n🤖 Avec VisaGPT - Assistant IA pour visas\n\n#Visa #Algérie #VisaGPT`
    }
    return `🏆 Check my visa score!\n\n${shareData.countryFlag} ${shareData.visaType} Visa for ${shareData.visaCountry}\n\n📊 Score: ${shareData.approvalScore}%\n🏅 Rank: ${shareData.rank}\n\n🔑 Strengths:\n${shareData.strengths.map(s => `• ${s}`).join('\n')}\n\n🤖 Using VisaGPT - AI Visa Assistant\n\n#Visa #Algeria #VisaGPT`
  }

  const generateImageText = () => {
    return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 VISA GPT RESULTS 🏆
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${shareData.countryFlag} ${shareData.visaType} VISA
${shareData.visaCountry.toUpperCase()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 APPROVAL SCORE
   ${shareData.approvalScore}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏅 YOUR RANK
   ${shareData.rank}
   
📈 TOP ${shareData.totalAssessed.toLocaleString()} ASSESSED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STRENGTHS:
${shareData.strengths.map(s => `✓ ${s}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AI RECOMMENDATIONS:
${shareData.improvements.map(i => `→ ${i}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 VisaGPT - Smart Visa Assistant
   visagpt.app

#VisaGPT #${shareData.visaCountry.replace(' ', '')} #Visa #Algeria
`
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generateShareText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadImage = () => {
    const text = generateImageText()
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 800
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      ctx.fillStyle = '#0A051A'
      ctx.fillRect(0, 0, 600, 800)
      
      ctx.fillStyle = '#00E5FF'
      ctx.font = 'bold 28px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('🏆 VISA GPT RESULTS 🏆', 300, 60)
      
      ctx.font = 'bold 48px Arial'
      ctx.fillText(shareData.countryFlag, 300, 120)
      
      ctx.font = 'bold 24px Arial'
      ctx.fillStyle = '#FFFFFF'
      ctx.fillText(`${shareData.visaType} VISA`, 300, 170)
      ctx.fillText(shareData.visaCountry.toUpperCase(), 300, 200)
      
      ctx.fillStyle = '#00E5FF'
      ctx.font = 'bold 14px Arial'
      ctx.fillText('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 300, 250)
      
      ctx.font = 'bold 18px Arial'
      ctx.fillStyle = '#FFFFFF'
      ctx.fillText('APPROVAL SCORE', 300, 290)
      
      ctx.font = 'bold 72px Arial'
      ctx.fillStyle = '#00E5FF'
      ctx.fillText(`${shareData.approvalScore}%`, 300, 370)
      
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 14px Arial'
      ctx.fillText('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 300, 420)
      
      ctx.font = 'bold 20px Arial'
      ctx.fillText(`🏅 RANK: ${shareData.rank}`, 300, 460)
      
      ctx.font = '14px Arial'
      ctx.fillText(`Top ${shareData.totalAssessed.toLocaleString()} assessed`, 300, 490)
      
      ctx.fillStyle = '#00E5FF'
      ctx.font = 'bold 16px Arial'
      ctx.fillText('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 300, 540)
      
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 14px Arial'
      ctx.textAlign = 'left'
      let y = 575
      ctx.fillText('STRENGTHS:', 100, y)
      y += 25
      shareData.strengths.forEach(s => {
        ctx.fillText(`✓ ${s}`, 100, y)
        y += 22
      })
      
      ctx.fillStyle = '#00E5FF'
      ctx.font = 'bold 14px Arial'
      ctx.fillText('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 300, y + 20)
      
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 14px Arial'
      ctx.textAlign = 'left'
      y += 50
      ctx.fillText('AI RECOMMENDATIONS:', 100, y)
      y += 25
      shareData.improvements.forEach(i => {
        ctx.fillText(`→ ${i}`, 100, y)
        y += 22
      })
      
      ctx.fillStyle = '#FF007A'
      ctx.font = 'bold 12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 300, y + 40)
      ctx.fillText('🤖 VisaGPT - Smart Visa Assistant', 300, y + 65)
      ctx.fillText('visagpt.app', 300, y + 85)
    }
    
    const link = document.createElement('a')
    link.download = 'visagpt-results.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'VisaGPT Results',
          text: generateShareText(),
        })
      } catch (err) {
        handleCopy()
      }
    } else {
      handleCopy()
    }
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 mb-4">
            <Share2 className="text-neon-cyan" size={20} />
            <span className="text-neon-cyan text-sm font-medium">
              {language === 'ar' ? 'شارك نتائجك' : language === 'fr' ? 'Partagez vos résultats' : 'Share Your Results'}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">
              {language === 'ar' ? 'مشاركة الإنجازات' : language === 'fr' ? 'Partager les Réussites' : 'Share Achievements'}
            </span>
          </h1>
          <p className="text-white/60">
            {language === 'ar' 
              ? 'شارك درجة تأشيرتك مع أصدقائك' 
              : language === 'fr' 
              ? 'Partagez votre score de visa avec vos amis' 
              : 'Share your visa score with friends'}
          </p>
        </motion.div>

        {/* Result Card Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card-elevated p-6 mb-6"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 mb-4">
              <Trophy className="text-amber-400" size={40} />
            </div>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-4xl">{shareData.countryFlag}</span>
              <div>
                <h3 className="font-bold text-lg">{shareData.visaType} Visa</h3>
                <p className="text-white/50">{shareData.visaCountry}</p>
              </div>
            </div>
          </div>

          {/* Score Display */}
          <div className="bg-black/30 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-around">
              <div className="text-center">
                <p className="text-4xl font-black text-neon-cyan">{shareData.approvalScore}%</p>
                <p className="text-xs text-white/50 mt-1">{language === 'ar' ? 'درجة الموافقة' : language === 'fr' ? 'Score' : 'Approval Score'}</p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <p className="text-xl font-bold text-amber-400">{shareData.rank}</p>
                <p className="text-xs text-white/50 mt-1">{language === 'ar' ? 'التصنيف' : language === 'fr' ? 'Rang' : 'Rank'}</p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <p className="text-xl font-bold text-neon-purple">{shareData.totalAssessed.toLocaleString()}</p>
                <p className="text-xs text-white/50 mt-1">{language === 'ar' ? 'تم التقييم' : language === 'fr' ? 'Évalué' : 'Assessed'}</p>
              </div>
            </div>
          </div>

          {/* Strengths */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-white/50 mb-2">
              {language === 'ar' ? 'نقاط القوة' : language === 'fr' ? 'Points forts' : 'Strengths'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {shareData.strengths.map((s, i) => (
                <span key={i} className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          {/* Improvements */}
          <div>
            <h4 className="text-sm font-medium text-white/50 mb-2">
              {language === 'ar' ? 'التوصيات' : language === 'fr' ? 'Recommandations' : 'Recommendations'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {shareData.improvements.map((i, idx) => (
                <span key={idx} className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full">
                  → {i}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Share Options */}
        <div className="space-y-3 mb-6">
          <h3 className="font-bold text-sm text-white/50">
            {language === 'ar' ? 'مشاركة عبر' : language === 'fr' ? 'Partager via' : 'Share via'}
          </h3>

          <button
            onClick={handleShare}
            className="w-full glass-card-hover p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <Share2 className="text-green-400" size={24} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">{language === 'ar' ? 'مشاركة مباشرة' : language === 'fr' ? 'Partager directement' : 'Direct Share'}</p>
              <p className="text-xs text-white/50">{language === 'ar' ? 'استخدم قائمة المشاركة' : language === 'fr' ? 'Utiliser le menu de partage' : 'Use share menu'}</p>
            </div>
            <ChevronRight className="text-white/30" size={20} />
          </button>

          <button
            onClick={handleCopy}
            className="w-full glass-card-hover p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-neon-cyan/20 flex items-center justify-center">
              {copied ? <Check className="text-neon-cyan" size={24} /> : <Copy className="text-neon-cyan" size={24} />}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">
                {copied 
                  ? (language === 'ar' ? 'تم النسخ!' : language === 'fr' ? 'Copié!' : 'Copied!')
                  : (language === 'ar' ? 'نسخ النص' : language === 'fr' ? 'Copier le texte' : 'Copy Text')
                }
              </p>
              <p className="text-xs text-white/50">{language === 'ar' ? 'انسخ للنشر في أي مكان' : language === 'fr' ? 'Copier pour publier n\'importe où' : 'Copy to paste anywhere'}</p>
            </div>
            <ChevronRight className="text-white/30" size={20} />
          </button>

          <button
            onClick={handleDownloadImage}
            className="w-full glass-card-hover p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-neon-purple/20 flex items-center justify-center">
              <DownloadCloud className="text-neon-purple" size={24} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">
                {language === 'ar' ? 'تحميل صورة' : language === 'fr' ? 'Télécharger image' : 'Download Image'}
              </p>
              <p className="text-xs text-white/50">{language === 'ar' ? 'صورة جاهزة للمشاركة' : language === 'fr' ? 'Image prête à partager' : 'Shareable image'}</p>
            </div>
            <ChevronRight className="text-white/30" size={20} />
          </button>
        </div>

        {/* Social Media */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button className="glass-card p-4 flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <MessageCircle className="text-blue-400" size={20} />
            </div>
            <span className="text-xs">WhatsApp</span>
          </button>
          <button className="glass-card p-4 flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center">
              <Twitter className="text-sky-400" size={20} />
            </div>
            <span className="text-xs">Twitter</span>
          </button>
          <button className="glass-card p-4 flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Instagram className="text-pink-400" size={20} />
            </div>
            <span className="text-xs">Instagram</span>
          </button>
        </div>

        {/* Stats to Share */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-ai p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="text-neon-cyan" size={18} />
            <span className="font-bold text-sm">
              {language === 'ar' ? 'إحصائيات المجتمع' : language === 'fr' ? 'Stats Communautaires' : 'Community Stats'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-neon-cyan">15,420</p>
              <p className="text-xs text-white/50">{language === 'ar' ? 'تم التقييم' : language === 'fr' ? 'Évalué' : 'Assessed'}</p>
            </div>
            <div>
              <p className="text-xl font-bold text-emerald-400">78%</p>
              <p className="text-xs text-white/50">{language === 'ar' ? 'متوسط الدرجة' : language === 'fr' ? 'Score moyen' : 'Avg Score'}</p>
            </div>
            <div>
              <p className="text-xl font-bold text-amber-400">2,890</p>
              <p className="text-xs text-white/50">{language === 'ar' ? 'موافق عليهم' : language === 'fr' ? 'Approuvés' : 'Approved'}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ShareResults
