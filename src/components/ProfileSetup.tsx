'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Briefcase, DollarSign, CheckCircle, ArrowRight, ArrowLeft, User, Shield } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { useLanguage } from './LanguageProvider'
import { cn } from '@/lib/utils'

const steps = [
  { id: 'passport', icon: Shield, title: 'Passport Details', titleAr: 'بيانات جواز السفر', titleFr: 'Détails du Passeport' },
  { id: 'personal', icon: User, title: 'Personal Info', titleAr: 'المعلومات الشخصية', titleFr: 'Informations Personnelles' },
  { id: 'employment', icon: Briefcase, title: 'Employment', titleAr: 'العمل', titleFr: 'Emploi' },
  { id: 'financial', icon: DollarSign, title: 'Financial', titleAr: 'المالية', titleFr: 'Financier' },
]

export function ProfileSetup() {
  const { t, language, dir } = useLanguage()
  const { userProfile, updateProfile, setActiveNav } = useVisaStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Passport
    passportNumber: userProfile.passportNumber || '',
    passportIssueDate: userProfile.passportIssueDate || '',
    passportExpiryDate: userProfile.passportExpiryDate || '',
    passportIssuingAuthority: userProfile.passportIssuingAuthority || '',
    // Personal
    dateOfBirth: userProfile.dateOfBirth || '',
    placeOfBirth: userProfile.placeOfBirth || '',
    maritalStatus: userProfile.maritalStatus || '',
    children: userProfile.children || 0,
    // Employment
    employerName: userProfile.employerName || '',
    jobTitle: userProfile.jobTitle || '',
    employerAddress: userProfile.employerAddress || '',
    employerPhone: userProfile.employerPhone || '',
    employmentType: userProfile.employmentType || '',
    yearsEmployed: userProfile.yearsEmployed || 0,
    // Financial
    monthlyIncome: userProfile.monthlyIncome || '',
    bankBalance: userProfile.bankBalance || '',
    averageMonthlyBalance: userProfile.averageMonthlyBalance || '',
    hasCNAS: userProfile.hasCNAS || false,
    hasProperty: userProfile.hasProperty || false,
    hasVehicle: userProfile.hasVehicle || false,
  })

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSave = () => {
    updateProfile({
      ...formData,
      monthlyIncome: formData.monthlyIncome ? parseFloat(String(formData.monthlyIncome)) : null,
      bankBalance: formData.bankBalance ? parseFloat(String(formData.bankBalance)) : null,
      averageMonthlyBalance: formData.averageMonthlyBalance ? parseFloat(String(formData.averageMonthlyBalance)) : null,
      yearsEmployed: parseInt(String(formData.yearsEmployed)) || 0,
      children: parseInt(String(formData.children)) || 0,
      isProfileComplete: true,
    })
    setActiveNav('home')
  }

  const getTitle = (step: typeof steps[0]) => {
    if (language === 'ar') return step.titleAr
    if (language === 'fr') return step.titleFr
    return step.title
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Passport
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">{t('passportNumber') || 'Passport Number'}</label>
              <input
                type="text"
                value={formData.passportNumber}
                onChange={(e) => handleChange('passportNumber', e.target.value)}
                className="input-field"
                placeholder="AB1234567"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">{t('issueDate') || 'Issue Date'}</label>
                <input
                  type="date"
                  value={formData.passportIssueDate}
                  onChange={(e) => handleChange('passportIssueDate', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">{t('expiryDate') || 'Expiry Date'}</label>
                <input
                  type="date"
                  value={formData.passportExpiryDate}
                  onChange={(e) => handleChange('passportExpiryDate', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">{t('issuingAuthority') || 'Issuing Authority'}</label>
              <input
                type="text"
                value={formData.passportIssuingAuthority}
                onChange={(e) => handleChange('passportIssuingAuthority', e.target.value)}
                className="input-field"
                placeholder={language === 'ar' ? 'الجزائر' : language === 'fr' ? 'Algérie' : 'Algeria'}
              />
            </div>
          </div>
        )

      case 1: // Personal
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">{t('dateOfBirth') || 'Date of Birth'}</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">{t('placeOfBirth') || 'Place of Birth'}</label>
                <input
                  type="text"
                  value={formData.placeOfBirth}
                  onChange={(e) => handleChange('placeOfBirth', e.target.value)}
                  className="input-field"
                  placeholder={language === 'ar' ? 'الجزائر' : language === 'fr' ? 'Alger' : 'Algiers'}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">{t('maritalStatus') || 'Marital Status'}</label>
              <select
                value={formData.maritalStatus}
                onChange={(e) => handleChange('maritalStatus', e.target.value)}
                className="input-field"
              >
                <option value="">{language === 'ar' ? 'اختر...' : language === 'fr' ? 'Sélectionner...' : 'Select...'}</option>
                <option value="single">{language === 'ar' ? 'أعزب/عزباء' : language === 'fr' ? 'Célibataire' : 'Single'}</option>
                <option value="married">{language === 'ar' ? 'متزوج/ة' : language === 'fr' ? 'Marié(e)' : 'Married'}</option>
                <option value="divorced">{language === 'ar' ? 'مطلق/ة' : language === 'fr' ? 'Divorcé(e)' : 'Divorced'}</option>
                <option value="widowed">{language === 'ar' ? 'أرمل/ة' : language === 'fr' ? 'Veuf/Veuve' : 'Widowed'}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">{t('children') || 'Number of Children'}</label>
              <input
                type="number"
                min="0"
                value={formData.children}
                onChange={(e) => handleChange('children', e.target.value)}
                className="input-field"
                placeholder="0"
              />
            </div>
          </div>
        )

      case 2: // Employment
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">{t('employmentType') || 'Employment Type'}</label>
              <select
                value={formData.employmentType}
                onChange={(e) => handleChange('employmentType', e.target.value)}
                className="input-field"
              >
                <option value="">{language === 'ar' ? 'اختر...' : language === 'fr' ? 'Sélectionner...' : 'Select...'}</option>
                <option value="cdi">{language === 'ar' ? 'CDI (دائم)' : language === 'fr' ? 'CDI (permanent)' : 'CDI (Permanent)'}</option>
                <option value="cdd">{language === 'ar' ? 'CDD (مؤقت)' : language === 'fr' ? 'CDD (temporaire)' : 'CDD (Temporary)'}</option>
                <option value="self-employed">{language === 'ar' ? 'عمل حر' : language === 'fr' ? 'Travail indépendant' : 'Self-employed'}</option>
                <option value="student">{language === 'ar' ? 'طالب' : language === 'fr' ? 'Étudiant' : 'Student'}</option>
                <option value="unemployed">{language === 'ar' ? 'غير موظف' : language === 'fr' ? 'Sans emploi' : 'Unemployed'}</option>
                <option value="retired">{language === 'ar' ? 'متقاعد' : language === 'fr' ? 'Retraité' : 'Retired'}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">{t('employerName') || 'Employer Name'}</label>
              <input
                type="text"
                value={formData.employerName}
                onChange={(e) => handleChange('employerName', e.target.value)}
                className="input-field"
                placeholder={language === 'ar' ? 'اسم الشركة' : language === 'fr' ? 'Nom de l\'entreprise' : 'Company Name'}
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">{t('jobTitle') || 'Job Title'}</label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                className="input-field"
                placeholder={language === 'ar' ? 'المسمى الوظيفي' : language === 'fr' ? 'Intitulé du poste' : 'Job Title'}
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">{t('yearsEmployed') || 'Years Employed'}</label>
              <input
                type="number"
                min="0"
                value={formData.yearsEmployed}
                onChange={(e) => handleChange('yearsEmployed', e.target.value)}
                className="input-field"
                placeholder="0"
              />
            </div>
          </div>
        )

      case 3: // Financial
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">{t('monthlyIncome') || 'Monthly Income'} (DA)</label>
              <input
                type="number"
                min="0"
                value={formData.monthlyIncome}
                onChange={(e) => handleChange('monthlyIncome', e.target.value)}
                className="input-field"
                placeholder="50000"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">{t('bankBalance') || 'Current Bank Balance'} (DA)</label>
              <input
                type="number"
                min="0"
                value={formData.bankBalance}
                onChange={(e) => handleChange('bankBalance', e.target.value)}
                className="input-field"
                placeholder="500000"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">{t('avgMonthlyBalance') || 'Average Monthly Balance'} (DA)</label>
              <input
                type="number"
                min="0"
                value={formData.averageMonthlyBalance}
                onChange={(e) => handleChange('averageMonthlyBalance', e.target.value)}
                className="input-field"
                placeholder="400000"
              />
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasCNAS}
                  onChange={(e) => handleChange('hasCNAS', e.target.checked)}
                  className="w-5 h-5 rounded accent-neon-cyan"
                />
                <span className="text-white/70">{language === 'ar' ? 'لدي CNAS (التأمين الاجتماعي)' : language === 'fr' ? 'J\'ai CNAS (Assurance sociale)' : 'I have CNAS (Social Insurance)'}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasProperty}
                  onChange={(e) => handleChange('hasProperty', e.target.checked)}
                  className="w-5 h-5 rounded accent-neon-cyan"
                />
                <span className="text-white/70">{language === 'ar' ? 'لدي ملكية عقارية' : language === 'fr' ? 'Je possède une propriété' : 'I own property'}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasVehicle}
                  onChange={(e) => handleChange('hasVehicle', e.target.checked)}
                  className="w-5 h-5 rounded accent-neon-cyan"
                />
                <span className="text-white/70">{language === 'ar' ? 'لدي سيارة' : language === 'fr' ? 'Je possède une voiture' : 'I own a vehicle'}</span>
              </label>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold gradient-text mb-2">
            {language === 'ar' ? 'أكمل ملفك الشخصي' : language === 'fr' ? 'Complétez votre profil' : 'Complete Your Profile'}
          </h1>
          <p className="text-white/60 text-sm">
            {language === 'ar' ? 'هذا سيساعدنا في تقديم أفضل الخدمات لك' : language === 'fr' ? 'Cela nous aider à vous fournir le meilleur service' : 'This will help us provide you the best service'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/10" />
          <div 
            className="absolute top-4 left-0 h-0.5 bg-neon-cyan transition-all duration-300"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((step, index) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                index <= currentStep ? 'bg-neon-cyan text-black' : 'bg-white/10 text-white/40'
              )}>
                {index < currentStep ? (
                  <CheckCircle size={20} />
                ) : (
                  <step.icon size={20} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Step Title */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold">{getTitle(steps[currentStep])}</h2>
          <p className="text-sm text-white/50">
            {language === 'ar' ? `الخطوة ${currentStep + 1} من ${steps.length}` : language === 'fr' ? `Étape ${currentStep + 1} sur ${steps.length}` : `Step ${currentStep + 1} of ${steps.length}`}
          </p>
        </div>

        {/* Form */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 mb-6"
        >
          {renderStep()}
        </motion.div>

        {/* Navigation */}
        <div className="flex gap-4">
          {currentStep > 0 && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleBack}
              className="flex-1 py-4 glass-card flex items-center justify-center gap-2"
            >
              {dir === 'rtl' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
              {language === 'ar' ? 'السابق' : language === 'fr' ? 'Précédent' : 'Back'}
            </motion.button>
          )}
          {currentStep < steps.length - 1 ? (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="flex-1 py-4 neon-button flex items-center justify-center gap-2"
            >
              {language === 'ar' ? 'التالي' : language === 'fr' ? 'Suivant' : 'Next'}
              {dir === 'rtl' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex-1 py-4 neon-button flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              {language === 'ar' ? 'حفظ وإكمال' : language === 'fr' ? 'Sauvegarder et terminer' : 'Save & Complete'}
            </motion.button>
          )}
        </div>

        {/* Skip for now */}
        <button
          onClick={() => {
            console.log('Skip clicked, setting profile complete')
            updateProfile({ isProfileComplete: true })
            console.log('Setting nav to home')
            setActiveNav('home')
            console.log('Nav should now be home')
          }}
          className="w-full mt-4 py-3 text-white/40 text-sm hover:text-white transition-colors"
        >
          {language === 'ar' ? 'تخطي حالياً' : language === 'fr' ? 'Passer pour l\'instant' : 'Skip for now'}
        </button>
      </div>
    </div>
  )
}
