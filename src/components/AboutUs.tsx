'use client'

import { motion } from 'framer-motion'
import { 
  Shield, Globe, Award, Users, CheckCircle, Star, 
  TrendingUp, Clock, MapPin, Phone, Mail, ChevronRight, X,
  Brain, FileCheck, Lock, Zap, Target, BadgeCheck,
  Building2, Briefcase, GraduationCap, Heart, Plane
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'

interface AboutUsProps {
  onClose: () => void
}

export function AboutUs({ onClose }: AboutUsProps) {
  const { language } = useLanguage()

  const stats = [
    { value: '100,000+', labelAr: 'طلب تأشيرة', labelEn: 'Visa Applications', labelFr: 'Demandes de Visa', icon: FileCheck, color: 'from-neon-cyan to-blue-500' },
    { value: '95%', labelAr: 'نسبة النجاح', labelEn: 'Success Rate', labelFr: 'Taux de Réussite', icon: Target, color: 'from-green-400 to-emerald-500' },
    { value: '15+', labelAr: 'سنة خبرة', labelEn: 'Years Experience', labelFr: 'Années d\'Expérience', icon: Award, color: 'from-yellow-400 to-orange-500' },
    { value: '10', labelAr: 'دولة تغطية', labelEn: 'Countries Covered', labelFr: 'Pays Couverts', icon: Globe, color: 'from-neon-magenta to-pink-500' },
  ]

  const advantages = [
    {
      icon: Brain,
      titleAr: 'ذكاء اصطناعي متقدم',
      titleEn: 'Advanced AI Technology',
      titleFr: 'Technologie IA Avancée',
      descAr: 'نستخدم أحدث تقنيات الذكاء الاصطناعي لتحليل ملفك وتحسين فرص القبول',
      descEn: 'We use cutting-edge AI to analyze your file and optimize acceptance chances',
      descFr: 'Nous utilisons l\'IA de pointe pour analyser votre dossier et optimiser les chances',
    },
    {
      icon: Building2,
      titleAr: 'خبرة مباشرة من مراكز التأشيرات',
      titleEn: 'Direct VFS/BLS Expertise',
      titleFr: 'Expertise VFS/BLS Directe',
      descAr: 'فرقنا عملت مباشرة في VFS Global و BLS - نعرف ما يطلبه الموظفون بالضبط',
      descEn: 'Our teams worked directly at VFS Global and BLS - we know exactly what officers look for',
      descFr: 'Nos équipes ont travaillé directement chez VFS Global et BLS - nous savons exactement ce que recherchent les officiers',
    },
    {
      icon: TrendingUp,
      titleAr: 'أعلى معدل قبول في شمال أفريقيا',
      titleEn: 'Highest Acceptance Rate in North Africa',
      titleFr: 'Plus Haut Taux d\'Acceptation en Afrique du Nord',
      descAr: '95% معدل نجاح - أكثر من 100,000 تأشيرة معتمدة',
      descEn: '95% success rate - over 100,000 visas approved',
      descFr: '95% de taux de réussite - plus de 100 000 visas approuvés',
    },
    {
      icon: Clock,
      titleAr: 'نتيجة خلال 24 ساعة',
      titleEn: 'Results Within 24 Hours',
      titleFr: 'Résultats en 24 Heures',
      descAr: 'تقييم فوري بالذكاء الاصطناعي + مراجعة خبّارة خلال 24 ساعة',
      descEn: 'Instant AI assessment + expert review within 24 hours',
      descFr: 'Évaluation IA instantanée + revue d\'expert en 24 heures',
    },
    {
      icon: Lock,
      titleAr: 'أمان وخصوصية تامة',
      titleEn: '100% Secure & Private',
      titleFr: '100% Sécurisé et Privé',
      descAr: 'جميع بياناتك مشفرة ومحمية - لا نشارك المعلومات مع أي طرف ثالث',
      descEn: 'All your data is encrypted and protected - we never share with third parties',
      descFr: 'Toutes vos données sont cryptées et protégées - nous ne partageons jamais avec des tiers',
    },
    {
      icon: Heart,
      titleAr: 'دعم عربي وفرنسي',
      titleEn: 'Arabic & French Support',
      titleFr: 'Support Arabe et Français',
      descAr: 'فريق دعم متعدد اللغات متاح على مدار الساعة',
      descEn: 'Multilingual support team available around the clock',
      descFr: 'Équipe multilingue disponible 24h/24',
    },
  ]

  const services = [
    { icon: FileCheck, nameAr: 'تقييم تأشيرة مجاني', nameEn: 'Free Visa Assessment', nameFr: 'Évaluation Visa Gratuite', free: true },
    { icon: Brain, nameAr: 'تحليل ذكي متقدم', nameEn: 'AI-Powered Analysis', nameFr: 'Analyse IA Avancée', free: false },
    { icon: Shield, nameAr: 'فحص الوثائق', nameEn: 'Document Inspection', nameFr: 'Inspection Documents', free: false },
    { icon: Globe, nameAr: 'ترجمة فورية', nameEn: 'Instant Translation', nameFr: 'Traduction Instantanée', free: false },
    { icon: Briefcase, nameAr: 'حجز فنادق وطيران', nameEn: 'Hotel & Flight Booking', nameFr: 'Réservation Hôtel & Vol', free: false },
    { icon: GraduationCap, nameAr: 'استمارة شنغن', nameEn: 'Schengen Form Filling', nameFr: 'Formulaire Schengen', free: false },
    { icon: FileCheck, nameAr: 'مولد الخطابات', nameEn: 'Letter Generator', nameFr: 'Générateur de Lettres', free: false },
    { icon: TrendingUp, nameAr: 'خطة التوفير القانوني', nameEn: 'Legal Savings Plan', nameFr: 'Plan d\'Épargne Légal', free: false },
  ]

  const testimonials = [
    { name: 'محمد ر.', location: 'Alger', flag: '🇩🇿', text: 'حصلت على تأشيرة فرنسا في 5 أيام فقط! التقييم الذكي كان دقيقاً 100%', rating: 5 },
    { name: 'ياسمين ب.', location: 'Oran', flag: '🇩🇿', text: 'الخدمة ممتازة - ساعدوني في تصحيح أخطاء في ملفي قبل التقديم', rating: 5 },
    { name: 'أحمد ك.', location: 'Constantine', flag: '🇩🇿', text: 'تم رفض طلبي مرة أخرى ولكن مع VisaGPT حصلت على القبول في المحاولة الثانية!', rating: 5 },
  ]

  const getLabel = (item: any) => language === 'ar' ? item.titleAr || item.labelAr : language === 'fr' ? (item.titleFr || item.labelFr) : (item.titleEn || item.labelEn)
  const getDesc = (item: any) => language === 'ar' ? item.descAr : language === 'fr' ? item.descFr : item.descEn

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-lg flex flex-col"
    >
      {/* Header with close button */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <h2 className="font-bold text-lg">
          {language === 'ar' ? 'من نحن' : language === 'fr' ? 'Qui Sommes-Nous' : 'About Us'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full glass-card hover:bg-white/20 transition-colors"
        >
          <X size={20} className="text-white/60" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-28">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block mb-4">
            <div className="absolute -inset-2 bg-gradient-to-r from-neon-magenta via-purple-500 to-neon-cyan rounded-full blur-xl opacity-40 animate-pulse" />
            <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-neon-magenta/20 via-purple-500/20 to-neon-cyan/20 flex items-center justify-center border border-white/20">
              <Shield className="text-neon-cyan" size={40} />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-neon-magenta via-purple-400 to-neon-cyan bg-clip-text text-transparent">
              {language === 'ar' ? 'من نحن' : language === 'fr' ? 'Qui Sommes-Nous' : 'About Us'}
            </span>
          </h1>
          <p className="text-white/60 text-sm">
            {language === 'ar' ? 'الرقم 1 في خدمات التأشيرات في شمال أفريقيا' : 
             language === 'fr' ? 'N°1 des services de visa en Afrique du Nord' : 
             '#1 Visa Services in North Africa'}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.labelEn}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="glass-card p-4 text-center relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
              <stat.icon className="mx-auto mb-2 text-white/60" size={24} />
              <div className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">{stat.value}</div>
              <div className="text-xs text-white/50 mt-1">
                {language === 'ar' ? stat.labelAr : language === 'fr' ? stat.labelFr : stat.labelEn}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Why Choose Us Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Star className="text-yellow-400" size={20} />
            {language === 'ar' ? 'لماذا نحن الخيار الأفضل؟' : language === 'fr' ? 'Pourquoi Nous Choisir?' : 'Why Choose Us?'}
          </h2>
          
          <div className="space-y-3">
            {advantages.map((adv, index) => (
              <motion.div
                key={adv.titleEn}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="glass-card p-4 flex gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-magenta/20 to-neon-cyan/20 flex items-center justify-center shrink-0">
                  <adv.icon className="text-neon-cyan" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">{getLabel(adv)}</h3>
                  <p className="text-xs text-white/50">{getDesc(adv)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Our Services */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="text-neon-cyan" size={20} />
            {language === 'ar' ? 'خدماتنا' : language === 'fr' ? 'Nos Services' : 'Our Services'}
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {services.map((service, index) => (
              <motion.div
                key={service.nameEn}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.03 }}
                className="glass-card p-3 relative"
              >
                {service.free && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded-full">
                    {language === 'ar' ? 'مجاني' : 'FREE'}
                  </span>
                )}
                <service.icon className="text-neon-magenta mb-2" size={20} />
                <h3 className="font-medium text-xs">{getLabel(service)}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Heart className="text-neon-magenta" size={20} />
            {language === 'ar' ? 'ماذا يقول عملاؤنا' : language === 'fr' ? 'Témoignages' : 'What Our Clients Say'}
          </h2>
          
          <div className="space-y-3">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="glass-card p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{t.flag}</span>
                    <div>
                      <p className="font-bold text-sm">{t.name}</p>
                      <p className="text-xs text-white/50">{t.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-white/70 italic">"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="text-yellow-400" size={20} />
            {language === 'ar' ? 'الشهادات والشراكات' : language === 'fr' ? 'Certifications' : 'Certifications & Partnerships'}
          </h2>
          
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: 'VFS Global', icon: '🏛️' },
              { name: 'BLS Partner', icon: '🤝' },
              { name: 'ISO 27001', icon: '🔒' },
              { name: 'Schengen Certified', icon: '🇪🇺' },
              { name: 'Data Protection', icon: '🛡️' },
              { name: 'AI Certified', icon: '🤖' },
            ].map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.05 }}
                className="glass-card p-3 text-center"
              >
                <div className="text-2xl mb-1">{cert.icon}</div>
                <p className="text-[10px] text-white/60">{cert.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact/CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="glass-card p-6 text-center bg-gradient-to-br from-neon-magenta/10 via-purple-500/10 to-neon-cyan/10 border border-neon-cyan/30"
        >
          <h2 className="text-xl font-bold mb-2">
            {language === 'ar' ? 'هل أنت مستعد للبدء؟' : language === 'fr' ? 'Prêt à Commencer?' : 'Ready to Start?'}
          </h2>
          <p className="text-sm text-white/60 mb-4">
            {language === 'ar' ? 'ابدأ تقييمك المجاني الآن واعرف فرصك الحقيقية' : 
             language === 'fr' ? 'Commencez votre évaluation gratuite maintenant' : 
             'Start your free assessment now and know your real chances'}
          </p>
          
          <div className="flex gap-3 justify-center mb-4">
            <a href="tel:+213555123456" className="flex items-center gap-2 px-4 py-2 glass-card-hover rounded-lg text-sm">
              <Phone size={16} className="text-green-400" />
              +213 555 123 456
            </a>
            <a href="mailto:contact@visagpt.dz" className="flex items-center gap-2 px-4 py-2 glass-card-hover rounded-lg text-sm">
              <Mail size={16} className="text-neon-cyan" />
              Email
            </a>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-xs text-white/40">
            <MapPin size={14} />
            {language === 'ar' ? 'الجزائر العاصمة، حسين داي' : 
             language === 'fr' ? 'Alger Centre, Hussein Dey' : 
             'Algiers, Hussein Dey'}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-6 flex justify-center gap-4 text-xs text-white/40"
        >
          <span className="flex items-center gap-1"><Lock size={12} /> {language === 'ar' ? 'محمي بـ SSL' : 'SSL Secured'}</span>
          <span className="flex items-center gap-1"><Shield size={12} /> {language === 'ar' ? 'خصوصيتك محمية' : 'Privacy Protected'}</span>
          <span className="flex items-center gap-1"><BadgeCheck size={12} /> {language === 'ar' ? 'مرخص رسمياً' : 'Licensed'}</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default AboutUs
