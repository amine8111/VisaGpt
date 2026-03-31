'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ChevronRight, ChevronLeft, User, Briefcase, Plane, Target, Check, AlertTriangle, Shield, Home, Car, Users } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { countries } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

function StepsHeader() {
  const { currentStep, setCurrentStep, userProfile, updateProfile, setActiveNav, setIsAnalyzing, runAssessment } = useVisaStore()
  const { t, dir } = useLanguage()

  const steps = [
    { id: 0, label: t('personalInfo'), icon: User },
    { id: 1, label: t('workFinance'), icon: Briefcase },
    { id: 2, label: t('travelHistory'), icon: Plane },
    { id: 3, label: t('nextTrip'), icon: Target },
  ]

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsAnalyzing(true)
      try {
        await runAssessment()
      } catch (error) {
        console.error('Assessment error:', error)
      }
      setActiveNav('results')
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      setActiveNav('home')
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrev} className="p-2 glass-card-hover">
          {dir === 'rtl' ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
        <h2 className="text-lg font-bold">{steps[currentStep].label}</h2>
        <div className="w-10" />
      </div>

      <div className="progress-bar mb-2">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / 4) * 100}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-white/50">
        {steps.map((step, index) => (
          <span key={step.id} className={index <= currentStep ? 'text-neon-cyan' : ''}>
            {index + 1}
          </span>
        ))}
      </div>
    </>
  )
}

export function MultiStepForm() {
  const { currentStep, setCurrentStep, setActiveNav, setIsAnalyzing, runAssessment } = useVisaStore()
  const { t, dir } = useLanguage()

  const steps = [
    { id: 0, label: t('personalInfo'), icon: User },
    { id: 1, label: t('workFinance'), icon: Briefcase },
    { id: 2, label: t('travelHistory'), icon: Plane },
    { id: 3, label: t('nextTrip'), icon: Target },
  ]

  const purposesOfVisit = [
    { value: 'tourism', label: t('tourism') },
    { value: 'family', label: t('familyVisit') },
    { value: 'business', label: t('business') },
    { value: 'medical', label: t('medical') },
    { value: 'study', label: t('study') },
  ]

  const durations = [
    { value: t('lessThanWeek'), days: 5 },
    { value: t('oneToTwoWeeks'), days: 10 },
    { value: t('oneToThreeMonths'), days: 60 },
    { value: t('threeToSixMonths'), days: 120 },
    { value: t('moreThanSixMonths'), days: 180 },
  ]

  const highValueStamps = ['USA', 'UK', 'Canada', 'Japan', 'Australia', 'New Zealand', 'UAE', 'Turkey']

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsAnalyzing(true)
      try {
        await runAssessment()
      } catch (error) {
        console.error('Assessment error:', error)
      }
      setActiveNav('results')
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepOne t={t} dir={dir} />
      case 1: return <StepTwo t={t} dir={dir} />
      case 2: return <StepThree t={t} dir={dir} />
      case 3: return <StepFour t={t} dir={dir} purposesOfVisit={purposesOfVisit} durations={durations} highValueStamps={highValueStamps} />
      default: return null
    }
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <StepsHeader />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: dir === 'rtl' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <button onClick={handleNext} className="neon-button w-full text-lg">
            {currentStep < 3 ? t('next') : t('startAnalysis')}
          </button>
        </motion.div>
      </div>
    </div>
  )
}

function StepOne({ t, dir }: { t: (key: string) => string, dir: 'rtl' | 'ltr' }) {
  const { userProfile, updateProfile } = useVisaStore()

  const maritalStatuses = [
    { value: 'single', label: t('single'), emoji: '👤' },
    { value: 'married', label: t('married'), emoji: '💍' },
    { value: 'divorced', label: t('divorced'), emoji: '💔' },
    { value: 'widowed', label: t('widowed'), emoji: '🕯️' },
  ]

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm text-white/70 mb-2">{t('age')} *</label>
        <input
          type="number"
          min="18"
          max="80"
          value={userProfile.age || ''}
          onChange={(e) => updateProfile({ age: parseInt(e.target.value) || null })}
          placeholder="30"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-2">{t('maritalStatus')} *</label>
        <div className="grid grid-cols-2 gap-2">
          {maritalStatuses.map((status) => (
            <button
              key={status.value}
              onClick={() => updateProfile({ maritalStatus: status.value as any })}
              className={cn(
                'p-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
                dir === 'rtl' ? '' : '',
                userProfile.maritalStatus === status.value
                  ? 'bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan'
                  : 'glass-card-hover text-white/70'
              )}
            >
              <span>{status.emoji}</span>
              <span>{status.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-2">{t('children')}</label>
        <input
          type="number"
          min="0"
          max="10"
          value={userProfile.children}
          onChange={(e) => updateProfile({ children: parseInt(e.target.value) || 0 })}
          className="input-field"
        />
      </div>

      <div className="glass-card p-4 space-y-3">
        <h3 className="font-medium text-sm flex items-center gap-2">
          <Home size={16} className="text-neon-cyan" />
          {t('tiesCategory')}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">{t('hasProperty')}</span>
          <button
            onClick={() => updateProfile({ hasProperty: !userProfile.hasProperty })}
            className={cn(
              'w-12 h-6 rounded-full transition-all',
              userProfile.hasProperty ? 'bg-neon-cyan' : 'bg-white/20'
            )}
          >
            <div className={cn(
              'w-5 h-5 rounded-full bg-white transition-all',
              userProfile.hasProperty ? (dir === 'rtl' ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0.5'
            )} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">{t('hasVehicle')}</span>
          <button
            onClick={() => updateProfile({ hasVehicle: !userProfile.hasVehicle })}
            className={cn(
              'w-12 h-6 rounded-full transition-all',
              userProfile.hasVehicle ? 'bg-neon-cyan' : 'bg-white/20'
            )}
          >
            <div className={cn(
              'w-5 h-5 rounded-full bg-white transition-all',
              userProfile.hasVehicle ? (dir === 'rtl' ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0.5'
            )} />
          </button>
        </div>
      </div>
    </div>
  )
}

function StepTwo({ t, dir }: { t: (key: string) => string, dir: 'rtl' | 'ltr' }) {
  const { userProfile, updateProfile } = useVisaStore()

  const employmentTypes = [
    { value: 'cdi', label: t('cdi'), emoji: '✅', color: 'green' },
    { value: 'cdd', label: t('cdd'), emoji: '📄', color: 'yellow' },
    { value: 'self-employed', label: t('selfEmployed'), emoji: '💼', color: 'purple' },
    { value: 'unemployed', label: t('unemployed'), emoji: '⚠️', color: 'red' },
    { value: 'student', label: t('student'), emoji: '🎓', color: 'blue' },
    { value: 'retired', label: t('retired'), emoji: '🏖️', color: 'gray' },
  ]

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm text-white/70 mb-2">{t('employmentType')} *</label>
        <div className="grid grid-cols-2 gap-2">
          {employmentTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => updateProfile({ employmentType: type.value as any })}
              className={cn(
                'p-3 rounded-xl text-sm font-medium transition-all',
                dir === 'rtl' ? 'text-right' : 'text-left',
                userProfile.employmentType === type.value
                  ? 'bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan'
                  : 'glass-card-hover text-white/70'
              )}
            >
              <div className="flex items-center gap-2">
                <span>{type.emoji}</span>
                <span>{type.label}</span>
              </div>
            </button>
          ))}
        </div>
        {userProfile.employmentType === 'unemployed' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm"
          >
            <AlertTriangle size={16} />
            <span>{t('noJobRefusal')}</span>
          </motion.div>
        )}
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-2">{t('profession')}</label>
        <input
          type="text"
          value={userProfile.profession}
          onChange={(e) => updateProfile({ profession: e.target.value })}
          placeholder="Software Engineer"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-2">{t('yearsEmployed')}</label>
        <input
          type="number"
          min="0"
          max="40"
          value={userProfile.yearsEmployed}
          onChange={(e) => updateProfile({ yearsEmployed: parseInt(e.target.value) || 0 })}
          className="input-field"
        />
      </div>

      <div className="glass-card p-4 space-y-4">
        <h3 className="font-medium text-sm flex items-center gap-2">
          <Shield size={16} className="text-neon-magenta" />
          {t('financeCategory')}
        </h3>
        
        <div>
          <label className="block text-xs text-white/50 mb-1">{t('monthlyIncome')} ({t('da')})</label>
          <input
            type="number"
            value={userProfile.monthlyIncome || ''}
            onChange={(e) => updateProfile({ monthlyIncome: parseInt(e.target.value) || null })}
            placeholder="80000"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-xs text-white/50 mb-1">{t('bankBalance')} ({t('da')})</label>
          <input
            type="number"
            value={userProfile.bankBalance || ''}
            onChange={(e) => updateProfile({ bankBalance: parseInt(e.target.value) || null })}
            placeholder="500000"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-xs text-white/50 mb-1">{t('avgMonthlyBalance')} ({t('da')})</label>
          <input
            type="number"
            value={userProfile.averageMonthlyBalance || ''}
            onChange={(e) => updateProfile({ averageMonthlyBalance: parseInt(e.target.value) || null })}
            placeholder="450000"
            className="input-field"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="cnas"
            checked={userProfile.hasCNAS}
            onChange={(e) => updateProfile({ hasCNAS: e.target.checked })}
            className="w-4 h-4 accent-neon-cyan"
          />
          <label htmlFor="cnas" className="text-sm text-white/70">{t('hasCNAS')}</label>
        </div>
      </div>

      <div className="glass-card p-4">
        <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
          <Users size={16} className="text-neon-purple" />
          {t('hasSponsor')}?
        </h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-white/60">{t('yes')}</span>
          <button
            onClick={() => updateProfile({ hasSponsor: !userProfile.hasSponsor })}
            className={cn(
              'w-12 h-6 rounded-full transition-all',
              userProfile.hasSponsor ? 'bg-neon-cyan' : 'bg-white/20'
            )}
          >
            <div className={cn(
              'w-5 h-5 rounded-full bg-white transition-all',
              userProfile.hasSponsor ? (dir === 'rtl' ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0.5'
            )} />
          </button>
        </div>
        {userProfile.hasSponsor && (
          <div>
            <label className="block text-xs text-white/50 mb-1">{t('sponsorIncome')} ({t('da')})</label>
            <input
              type="number"
              value={userProfile.sponsorIncome || ''}
              onChange={(e) => updateProfile({ sponsorIncome: parseInt(e.target.value) || null })}
              placeholder="150000"
              className="input-field"
            />
          </div>
        )}
      </div>
    </div>
  )
}

function StepThree({ t, dir }: { t: (key: string) => string, dir: 'rtl' | 'ltr' }) {
  const { userProfile, updateProfile } = useVisaStore()

  return (
    <div className="space-y-5">
      <div className="glass-card p-4 border-red-500/30">
        <h3 className="font-medium text-sm mb-3 flex items-center gap-2 text-red-400">
          <AlertTriangle size={16} />
          {t('critical')}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-2">{t('schengenCount')}</label>
            <input
              type="number"
              min="0"
              max="20"
              value={userProfile.schengenCount}
              onChange={(e) => {
                const count = parseInt(e.target.value) || 0
                updateProfile({ 
                  schengenCount: count
                })
              }}
              className="input-field"
              placeholder="0"
            />
            <p className="text-xs text-white/40 mt-1">{t('noSchengen')}</p>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-2">{t('visaRefusals')}</label>
            <input
              type="number"
              min="0"
              max="10"
              value={userProfile.visaRefusals}
              onChange={(e) => updateProfile({ visaRefusals: parseInt(e.target.value) || 0 })}
              className="input-field"
              placeholder="0"
            />
            {userProfile.visaRefusals > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 p-2 bg-red-500/20 rounded-lg text-xs text-red-400"
              >
                {t('pastRefusals')}. {t('waitBeforeReapply')}
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="overstay"
              checked={userProfile.overstayHistory}
              onChange={(e) => updateProfile({ overstayHistory: e.target.checked })}
              className="w-4 h-4 accent-red-500"
            />
            <label htmlFor="overstay" className="text-sm text-red-400">
              {t('overstayHistory')}
            </label>
          </div>
          {userProfile.overstayHistory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-500/20 rounded-xl text-sm text-red-400"
            >
              <AlertTriangle size={14} className="inline ml-1" />
              {t('banRisk')}
            </motion.div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-2">{t('travelCategory')}:</label>
        <div className="grid grid-cols-2 gap-2">
          {['USA', 'UK', 'Canada', 'Japan', 'Australia', 'New Zealand', 'UAE', 'Turkey'].map((stamp) => (
            <button
              key={stamp}
              onClick={() => {
                const stamps = userProfile.previousStamps.includes(stamp)
                  ? userProfile.previousStamps.filter((s) => s !== stamp)
                  : [...userProfile.previousStamps, stamp]
                updateProfile({ previousStamps: stamps })
              }}
              className={cn(
                'p-3 rounded-xl text-sm font-medium transition-all',
                userProfile.previousStamps.includes(stamp)
                  ? 'bg-neon-magenta/20 border-2 border-neon-magenta text-neon-magenta'
                  : 'glass-card-hover text-white/70'
              )}
            >
              {stamp}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepFour({ t, dir, purposesOfVisit, durations, highValueStamps }: { 
  t: (key: string) => string, 
  dir: 'rtl' | 'ltr',
  purposesOfVisit: { value: string, label: string }[],
  durations: { value: string, days: number }[],
  highValueStamps: string[]
}) {
  const { userProfile, updateProfile } = useVisaStore()

  const entryTypes = [
    { value: 'single', label: t('singleEntry') || 'Single Entry', emoji: '1️⃣' },
    { value: 'multiple', label: t('multipleEntry') || 'Multiple Entry', emoji: '♾️' },
  ]

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm text-white/70 mb-2">{t('targetCountry')} *</label>
        <select
          value={userProfile.targetCountry}
          onChange={(e) => updateProfile({ targetCountry: e.target.value })}
          className="input-field"
        >
          <option value="">{t('required')}</option>
          {countries.map((c) => (
            <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-2">{t('purposeOfVisit')} *</label>
        <div className="grid grid-cols-2 gap-2">
          {purposesOfVisit.map((p) => (
            <button
              key={p.value}
              onClick={() => updateProfile({ purposeOfVisit: p.value })}
              className={cn(
                'p-3 rounded-xl text-sm font-medium transition-all',
                userProfile.purposeOfVisit === p.value
                  ? 'bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan'
                  : 'glass-card-hover text-white/70'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-2">{t('entryType') || 'Entry Type'}</label>
        <div className="grid grid-cols-2 gap-2">
          {entryTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => updateProfile({ entryType: type.value as 'single' | 'multiple' })}
              className={cn(
                'p-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
                userProfile.entryType === type.value
                  ? 'bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan'
                  : 'glass-card-hover text-white/70'
              )}
            >
              <span>{type.emoji}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/70 mb-2">{t('plannedTravelDate') || 'Planned Travel Date'}</label>
          <input
            type="date"
            value={userProfile.plannedTravelDate || ''}
            onChange={(e) => updateProfile({ plannedTravelDate: e.target.value })}
            className="input-field"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label className="block text-sm text-white/70 mb-2">{t('plannedReturnDate') || 'Planned Return Date'}</label>
          <input
            type="date"
            value={userProfile.plannedReturnDate || ''}
            onChange={(e) => updateProfile({ plannedReturnDate: e.target.value })}
            className="input-field"
            min={userProfile.plannedTravelDate || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-2">{t('durationOfStay')}</label>
        <select
          value={userProfile.durationOfStay}
          onChange={(e) => updateProfile({ durationOfStay: e.target.value })}
          className="input-field"
        >
          <option value="">{t('optional')}</option>
          {durations.map((d) => (
            <option key={d.value} value={d.value}>{d.value}</option>
          ))}
        </select>
      </div>

      <div className="glass-card p-4 space-y-3">
        <h3 className="font-medium text-sm">{t('documentsCategory')}</h3>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">{t('hasBookings')}</span>
          <button
            onClick={() => updateProfile({ hasBookings: !userProfile.hasBookings })}
            className={cn(
              'w-12 h-6 rounded-full transition-all',
              userProfile.hasBookings ? 'bg-neon-cyan' : 'bg-white/20'
            )}
          >
            <div className={cn(
              'w-5 h-5 rounded-full bg-white transition-all',
              userProfile.hasBookings ? (dir === 'rtl' ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0.5'
            )} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">{t('hasInvitationLetter')}</span>
          <button
            onClick={() => updateProfile({ hasInvitationLetter: !userProfile.hasInvitationLetter })}
            className={cn(
              'w-12 h-6 rounded-full transition-all',
              userProfile.hasInvitationLetter ? 'bg-neon-cyan' : 'bg-white/20'
            )}
          >
            <div className={cn(
              'w-5 h-5 rounded-full bg-white transition-all',
              userProfile.hasInvitationLetter ? (dir === 'rtl' ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0.5'
            )} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">{t('hasInsurance')}</span>
          <button
            onClick={() => updateProfile({ hasInsurance: !userProfile.hasInsurance })}
            className={cn(
              'w-12 h-6 rounded-full transition-all',
              userProfile.hasInsurance ? 'bg-neon-cyan' : 'bg-white/20'
            )}
          >
            <div className={cn(
              'w-5 h-5 rounded-full bg-white transition-all',
              userProfile.hasInsurance ? (dir === 'rtl' ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0.5'
            )} />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/30"
      >
        <p className="text-xs text-yellow-400">
          {t('advice')}
        </p>
      </motion.div>
    </div>
  )
}
