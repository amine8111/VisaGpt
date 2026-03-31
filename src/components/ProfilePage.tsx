'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { User, Mail, Phone, Calendar, MapPin, Briefcase, CreditCard, Shield, FileText, Camera, Edit2, LogOut, Crown, Star, Globe } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { useLanguage } from './LanguageProvider'
import { authAPI } from '@/services'
import { getPassportPhoto, PASSPORT_PHOTO_UPDATED_EVENT } from '@/lib/passportPhotoStore'

export function ProfilePage() {
  const { user, membership, userProfile, logout, setActiveNav } = useVisaStore()
  const { t, language } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  // Load passport photo from store on mount and when updated
  useEffect(() => {
    const loadPhoto = () => {
      const passportPhoto = userProfile?.passportPhoto || getPassportPhoto()
      if (passportPhoto) {
        setProfileImage(passportPhoto)
      }
    }
    
    loadPhoto()
    
    // Listen for photo updates
    window.addEventListener(PASSPORT_PHOTO_UPDATED_EVENT, loadPhoto)
    return () => window.removeEventListener(PASSPORT_PHOTO_UPDATED_EVENT, loadPhoto)
  }, [userProfile?.passportPhoto])
  
  const handleLogout = () => {
    logout()
    authAPI.logout()
    setActiveNav('landing')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const tier = membership?.tier || 'free'
  const tierColors = {
    free: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50' },
    gold: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50' },
    premium: { bg: 'bg-neon-purple/20', text: 'text-neon-purple', border: 'border-neon-purple/50' }
  }
  const colors = tierColors[tier as keyof typeof tierColors] || tierColors.free

  const profileSections = [
    {
      title: language === 'ar' ? 'المعلومات الشخصية' : language === 'fr' ? 'Informations Personnelles' : 'Personal Information',
      icon: User,
      fields: [
        { label: language === 'ar' ? 'الاسم الكامل' : language === 'fr' ? 'Nom Complet' : 'Full Name', value: userProfile?.fullName || user?.fullName || 'Not set', icon: User },
        { label: language === 'ar' ? 'البريد الإلكتروني' : language === 'fr' ? 'Email' : 'Email', value: user?.email || 'Not set', icon: Mail },
        { label: language === 'ar' ? 'رقم الهاتف' : language === 'fr' ? 'Téléphone' : 'Phone', value: userProfile?.phone || user?.phone || 'Not set', icon: Phone },
        { label: language === 'ar' ? 'تاريخ الميلاد' : language === 'fr' ? 'Date de Naissance' : 'Date of Birth', value: userProfile?.dateOfBirth || 'Not set', icon: Calendar },
        { label: language === 'ar' ? 'مكان الميلاد' : language === 'fr' ? 'Lieu de Naissance' : 'Place of Birth', value: userProfile?.placeOfBirth || 'Not set', icon: MapPin },
        { label: language === 'ar' ? 'الجنسية' : language === 'fr' ? 'Nationalité' : 'Nationality', value: userProfile?.nationality || 'Algeria', icon: Globe },
      ]
    },
    {
      title: language === 'ar' ? 'تفاصيل جواز السفر' : language === 'fr' ? 'Détails du Passeport' : 'Passport Details',
      icon: FileText,
      fields: [
        { label: language === 'ar' ? 'رقم الجواز' : language === 'fr' ? 'Numéro de Passeport' : 'Passport Number', value: userProfile?.passportNumber || 'Not set', icon: FileText },
        { label: language === 'ar' ? 'تاريخ الإصدار' : language === 'fr' ? 'Date d\'Émission' : 'Issue Date', value: userProfile?.passportIssueDate || 'Not set', icon: Calendar },
        { label: language === 'ar' ? 'تاريخ الانتهاء' : language === 'fr' ? 'Date d\'Expiration' : 'Expiry Date', value: userProfile?.passportExpiryDate || 'Not set', icon: Calendar },
        { label: language === 'ar' ? 'جهة الإصدار' : language === 'fr' ? 'Autorité' : 'Issuing Authority', value: userProfile?.passportIssuingAuthority || 'Not set', icon: Shield },
      ]
    },
    {
      title: language === 'ar' ? 'الحالة الاجتماعية والعائلة' : language === 'fr' ? 'Situation Familiale' : 'Marital & Family',
      icon: User,
      fields: [
        { label: language === 'ar' ? 'الحالة الاجتماعية' : language === 'fr' ? 'État Civil' : 'Marital Status', value: userProfile?.maritalStatus || 'Not set', icon: User },
        { label: language === 'ar' ? 'عدد الأطفال' : language === 'fr' ? 'Nombre d\'Enfants' : 'Children', value: userProfile?.children?.toString() || '0', icon: User },
      ]
    },
    {
      title: language === 'ar' ? 'معلومات العمل' : language === 'fr' ? 'Informations d\'Emploi' : 'Employment',
      icon: Briefcase,
      fields: [
        { label: language === 'ar' ? 'المهنة' : language === 'fr' ? 'Profession' : 'Profession', value: userProfile?.profession || 'Not set', icon: Briefcase },
        { label: language === 'ar' ? 'نوع العمل' : language === 'fr' ? 'Type d\'Emploi' : 'Employment Type', value: userProfile?.employmentType || 'Not set', icon: Briefcase },
        { label: language === 'ar' ? 'اسم صاحب العمل' : language === 'fr' ? 'Employeur' : 'Employer', value: userProfile?.employerName || 'Not set', icon: Briefcase },
        { label: language === 'ar' ? 'المسمى الوظيفي' : language === 'fr' ? 'Poste' : 'Job Title', value: userProfile?.jobTitle || 'Not set', icon: Briefcase },
        { label: language === 'ar' ? 'سنوات الخبرة' : language === 'fr' ? 'Années d\'Expérience' : 'Years Employed', value: userProfile?.yearsEmployed?.toString() || '0', icon: Calendar },
      ]
    },
    {
      title: language === 'ar' ? 'المعلومات المالية' : language === 'fr' ? 'Informations Financières' : 'Financial Information',
      icon: CreditCard,
      fields: [
        { label: language === 'ar' ? 'الدخل الشهري' : language === 'fr' ? 'Revenu Mensuel' : 'Monthly Income', value: userProfile?.monthlyIncome ? `${userProfile.monthlyIncome.toLocaleString()} DZD` : 'Not set', icon: CreditCard },
        { label: language === 'ar' ? 'الرصيد البنكي' : language === 'fr' ? 'Solde Bancaire' : 'Bank Balance', value: userProfile?.bankBalance ? `${userProfile.bankBalance.toLocaleString()} DZD` : 'Not set', icon: CreditCard },
        { label: language === 'ar' ? 'متوسط الرصيد' : language === 'fr' ? 'Solde Moyen' : 'Average Balance', value: userProfile?.averageMonthlyBalance ? `${userProfile.averageMonthlyBalance.toLocaleString()} DZD` : 'Not set', icon: CreditCard },
      ]
    },
    {
      title: language === 'ar' ? 'الممتلكات' : language === 'fr' ? 'Propriétés' : 'Assets',
      icon: Shield,
      fields: [
        { label: language === 'ar' ? 'التغطية الصحية' : language === 'fr' ? 'Couverture Santé' : 'Health Coverage', value: userProfile?.hasCNAS ? (language === 'ar' ? 'نعم' : 'Yes') : (language === 'ar' ? 'لا' : 'No'), icon: Shield },
        { label: language === 'ar' ? 'الملكية العقارية' : language === 'fr' ? 'Propriété Immobilière' : 'Has Property', value: userProfile?.hasProperty ? (language === 'ar' ? 'نعم' : 'Yes') : (language === 'ar' ? 'لا' : 'No'), icon: Shield },
        { label: language === 'ar' ? 'الملكية المركبة' : language === 'fr' ? 'Propriété Véhicule' : 'Has Vehicle', value: userProfile?.hasVehicle ? (language === 'ar' ? 'نعم' : 'Yes') : (language === 'ar' ? 'لا' : 'No'), icon: Shield },
      ]
    },
    {
      title: language === 'ar' ? 'السفر' : language === 'fr' ? 'Voyage' : 'Travel Details',
      icon: MapPin,
      fields: [
        { label: language === 'ar' ? 'البلد الهدف' : language === 'fr' ? 'Pays de Destination' : 'Target Country', value: userProfile?.targetCountry || 'Not set', icon: Globe },
        { label: language === 'ar' ? 'الغرض من الزيارة' : language === 'fr' ? 'Motif de Visite' : 'Purpose of Visit', value: userProfile?.purposeOfVisit || 'Not set', icon: FileText },
        { label: language === 'ar' ? 'مدة الإقامة' : language === 'fr' ? 'Durée du Séjour' : 'Duration of Stay', value: userProfile?.durationOfStay || 'Not set', icon: Calendar },
        { label: language === 'ar' ? 'نوع التأشيرة' : language === 'fr' ? 'Type de Visa' : 'Entry Type', value: userProfile?.entryType || 'Not set', icon: FileText },
        { label: language === 'ar' ? 'تاريخ السفر المخطط' : language === 'fr' ? 'Date de Voyage Prévue' : 'Planned Travel Date', value: userProfile?.plannedTravelDate || 'Not set', icon: Calendar },
        { label: language === 'ar' ? 'تاريخ العودة المخطط' : language === 'fr' ? 'Date de Retour Prévue' : 'Planned Return Date', value: userProfile?.plannedReturnDate || 'Not set', icon: Calendar },
      ]
    },
  ]

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6 text-center"
        >
          {/* Profile Image */}
          <div className="relative mx-auto w-24 h-24 mb-4">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-neon-cyan" />
            ) : (
              <div className={`w-full h-full rounded-full flex items-center justify-center ${colors.bg} border-2 ${colors.border}`}>
                <User size={40} className={colors.text} />
              </div>
            )}
            <label className="absolute bottom-0 right-0 p-2 bg-neon-cyan rounded-full cursor-pointer hover:bg-neon-cyan/80 transition-colors">
              <Camera size={16} className="text-black" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* Name */}
          <h2 className="text-xl font-bold mb-1">
            {user?.fullName || (language === 'ar' ? 'مستخدم' : 'User')}
          </h2>
          
          {/* Email */}
          <p className="text-white/60 text-sm mb-3">{user?.email}</p>

          {/* Membership Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg} border ${colors.border}`}>
            {tier === 'premium' && <Crown size={16} className={colors.text} />}
            {tier === 'gold' && <Star size={16} className={colors.text} />}
            {tier === 'free' && <Shield size={16} className={colors.text} />}
            <span className={`font-medium ${colors.text}`}>
              {tier === 'premium' ? 'Premium' : tier === 'gold' ? 'Gold' : 'Free'}
            </span>
          </div>

          {/* Member Since */}
          {user?.createdAt && (
            <p className="text-xs text-white/40 mt-3">
              {language === 'ar' ? 'عضو منذ' : language === 'fr' ? 'Membre depuis' : 'Member since'}: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <button
            onClick={() => setActiveNav('profile-setup')}
            className="glass-card-hover p-4 flex flex-col items-center gap-2"
          >
            <Edit2 size={20} className="text-neon-cyan" />
            <span className="text-xs">{language === 'ar' ? 'تعديل' : language === 'fr' ? 'Modifier' : 'Edit'}</span>
          </button>
          <button
            onClick={() => setActiveNav('upgrade')}
            className="glass-card-hover p-4 flex flex-col items-center gap-2"
          >
            <Crown size={20} className="text-neon-purple" />
            <span className="text-xs">{language === 'ar' ? 'ترقية' : language === 'fr' ? 'Upgrade' : 'Upgrade'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="glass-card-hover p-4 flex flex-col items-center gap-2"
          >
            <LogOut size={20} className="text-red-400" />
            <span className="text-xs text-red-400">{language === 'ar' ? 'خروج' : language === 'fr' ? 'Déconnexion' : 'Logout'}</span>
          </button>
        </motion.div>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + sectionIndex * 0.05 }}
            className="glass-card p-4 mb-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <section.icon size={18} className="text-neon-cyan" />
              <h3 className="font-bold text-sm">{section.title}</h3>
            </div>
            
            <div className="space-y-3">
              {section.fields.map((field) => (
                <div key={field.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <field.icon size={14} className="text-white/40" />
                    <span className="text-xs text-white/60">{field.label}</span>
                  </div>
                  <span className="text-sm font-medium truncate max-w-[180px]">
                    {field.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Passport Photo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-4 mb-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Camera size={18} className="text-neon-cyan" />
              {language === 'ar' ? 'صورة جواز السفر' : language === 'fr' ? 'Photo Passeport' : 'Passport Photo'}
            </h3>
            <button
              onClick={() => setActiveNav('photo')}
              className="text-xs text-neon-cyan hover:text-neon-cyan/80"
            >
              {language === 'ar' ? 'تحديث' : language === 'fr' ? 'Mettre à jour' : 'Update'}
            </button>
          </div>
          <div className="flex justify-center">
            {profileImage ? (
              <div className="w-32 h-40 rounded-lg overflow-hidden border-2 border-neon-cyan/50" style={{ aspectRatio: '35/45' }}>
                <img src={profileImage} alt="Passport Photo" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div 
                onClick={() => setActiveNav('photo')}
                className="w-32 h-40 rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-neon-cyan/50 transition-colors"
              >
                <Camera size={32} className="text-white/30 mb-2" />
                <p className="text-xs text-white/40">{language === 'ar' ? 'أضف صورة' : language === 'fr' ? 'Ajouter' : 'Add Photo'}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Account Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-4 mb-4"
        >
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <Shield size={18} className="text-neon-cyan" />
            {language === 'ar' ? 'إحصائيات الحساب' : language === 'fr' ? 'Statistiques du Compte' : 'Account Statistics'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-2xl font-bold text-neon-cyan">{userProfile?.visaRefusals || 0}</p>
              <p className="text-xs text-white/60">{language === 'ar' ? 'الرفض' : language === 'fr' ? 'Refus' : 'Refusals'}</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-2xl font-bold text-green-400">{userProfile?.schengenCount || 0}</p>
              <p className="text-xs text-white/60">{language === 'ar' ? 'تأشيرات شنغن' : language === 'fr' ? 'Visas Schengen' : 'Schengen Visas'}</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-2xl font-bold text-neon-purple">{userProfile?.previousStamps?.length || 0}</p>
              <p className="text-xs text-white/60">{language === 'ar' ? 'طوابع' : language === 'fr' ? 'Tampons' : 'Stamps'}</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-2xl font-bold text-yellow-400">{userProfile?.overstayHistory ? '1' : '0'}</p>
              <p className="text-xs text-white/60">{language === 'ar' ? 'تجاوز مدة' : language === 'fr' ? 'Dépassement' : 'Overstays'}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage
