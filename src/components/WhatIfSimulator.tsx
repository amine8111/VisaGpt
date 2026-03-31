'use client'

import { motion } from 'framer-motion'
import { useState, useMemo, useCallback } from 'react'
import { useVisaStore } from '@/store/visaStore'
import { assessVisa } from '@/lib/ai'
import { getScoreColor, getScoreLabel, cn } from '@/lib/utils'
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Info, Briefcase } from 'lucide-react'
import { useLanguage } from './LanguageProvider'

const LABELS = {
  header: { ar: 'محاكي ماذا لو', en: 'What-If Simulator', fr: 'Simulateur Et si' },
  headerDesc: { ar: 'عدّل القيم لترى تأثيرها على نتيجتك', en: 'Adjust values to see how they affect your score', fr: 'Ajustez les valeurs pour voir leur impact' },
  simulatedApproval: { ar: 'احتمال الموافقة المحاكى', en: 'Simulated Approval Chance', fr: 'Chance approuvée simulée' },
  original: { ar: 'الأصلي', en: 'Original', fr: 'Original' },
  simulated: { ar: 'المحاكى', en: 'Simulated', fr: 'Simulé' },
  betterChances: { ar: 'فرص أفضل!', en: 'Better chances!', fr: 'Meilleures chances!' },
  lowerChances: { ar: 'فرص أقل', en: 'Lower chances', fr: 'Chances réduites' },
  noChange: { ar: 'لا تغيير', en: 'No change', fr: 'Pas de changement' },
  adjustValues: { ar: 'عدّل القيم', en: 'Adjust Values', fr: 'Ajuster les valeurs' },
  bankBalance: { ar: 'الرصيد البنكي', en: 'Bank Balance', fr: 'Solde bancaire' },
  monthlyIncome: { ar: 'الدخل الشهري', en: 'Monthly Income', fr: 'Revenu mensuel' },
  schengenVisas: { ar: 'تأشيرات شنغن', en: 'Schengen Visas', fr: 'Visas Schengen' },
  ownProperty: { ar: 'يملك عقار', en: 'Owns Property', fr: 'Propriétaire' },
  employmentType: { ar: 'نوع العمل', en: 'Employment Type', fr: "Type d'emploi" },
  scoreBreakdown: { ar: 'تفصيل النتيجة', en: 'Score Breakdown', fr: 'Détail du score' },
  keyInsights: { ar: 'رؤى مهمة', en: 'Key Insights', fr: 'Insights clés' },
  applyChanges: { ar: 'تطبيق التغييرات', en: 'Apply Changes', fr: 'Appliquer les changements' },
  changesApplied: { ar: 'تم تطبيق التغييرات بنجاح!', en: 'Changes applied successfully!', fr: 'Changements appliqués!' },
}

export function WhatIfSimulator() {
  const { userProfile, results, updateProfile } = useVisaStore()
  const { language } = useLanguage()

  const getLabel = (obj: { ar: string; en: string; fr: string }) => {
    if (language === 'ar') return obj.ar
    if (language === 'fr') return obj.fr
    return obj.en
  }
  
  const [bankBalance, setBankBalance] = useState(userProfile.bankBalance || 200000)
  const [monthlyIncome, setMonthlyIncome] = useState(userProfile.monthlyIncome || 50000)
  const [schengenCount, setSchengenCount] = useState(userProfile.schengenCount || 0)
  const [hasProperty, setHasProperty] = useState(userProfile.hasProperty || false)
  const [employmentType, setEmploymentType] = useState(userProfile.employmentType || 'cdi')

  const updateSimulatorValue = useCallback((field: string, value: any) => {
    switch (field) {
      case 'bankBalance':
        setBankBalance(value)
        break
      case 'monthlyIncome':
        setMonthlyIncome(value)
        break
      case 'schengenCount':
        setSchengenCount(value)
        break
      case 'hasProperty':
        setHasProperty(value)
        break
      case 'employmentType':
        setEmploymentType(value)
        break
    }
  }, [])

  const originalProfile = useMemo(() => ({
    age: userProfile.age || 30,
    nationality: 'Algeria',
    employmentType: (userProfile.employmentType as 'cdi' | 'cdd' | 'self-employed' | 'student' | 'unemployed' | 'retired') || 'cdi',
    monthlyIncome: userProfile.monthlyIncome || 50000,
    bankBalance: userProfile.bankBalance || 200000,
    averageMonthlyBalance: userProfile.bankBalance || 200000,
    yearsEmployed: userProfile.yearsEmployed || 0,
    maritalStatus: (userProfile.maritalStatus as 'single' | 'married' | 'divorced' | 'widowed') || 'single',
    children: userProfile.children || 0,
    hasProperty: userProfile.hasProperty || false,
    hasVehicle: userProfile.hasVehicle || false,
    schengenCount: userProfile.schengenCount || 0,
    previousStamps: userProfile.previousStamps || [],
    visaRefusals: userProfile.visaRefusals || 0,
    overstayHistory: userProfile.overstayHistory || false,
    hasCNAS: userProfile.hasCNAS || false,
    hasSponsor: userProfile.hasSponsor || false,
    sponsorIncome: userProfile.sponsorIncome || 0,
    targetCountry: userProfile.targetCountry || 'France',
    purposeOfVisit: userProfile.purposeOfVisit || 'tourism',
    durationOfStay: userProfile.durationOfStay || '1-2 weeks',
    entryType: (userProfile.entryType as 'single' | 'multiple') || 'single',
    plannedTravelDate: userProfile.plannedTravelDate || '',
    plannedReturnDate: userProfile.plannedReturnDate || '',
    hasBookings: userProfile.hasBookings || false,
    hasInsurance: userProfile.hasInsurance || false,
    hasInvitationLetter: userProfile.hasInvitationLetter || false,
  }), [userProfile])

  const simulatedProfile = useMemo(() => ({
    ...originalProfile,
    bankBalance,
    monthlyIncome,
    schengenCount,
    hasProperty,
    employmentType: employmentType as 'cdi' | 'cdd' | 'self-employed' | 'student' | 'unemployed' | 'retired',
  }), [originalProfile, bankBalance, monthlyIncome, schengenCount, hasProperty, employmentType])

  const originalAssessment = useMemo(() => assessVisa(originalProfile), [originalProfile])
  const originalScore = results?.mainScore || originalAssessment.mainScore
  const simulatedAssessment = useMemo(() => assessVisa(simulatedProfile), [simulatedProfile])
  const simulatedScore = simulatedAssessment.mainScore
  
  const scoreDiff = simulatedScore - originalScore
  
  const scoreColor = getScoreColor(simulatedScore)

  const hasChanges = bankBalance !== originalProfile.bankBalance || 
                     monthlyIncome !== originalProfile.monthlyIncome || 
                     schengenCount !== originalProfile.schengenCount || 
                     hasProperty !== originalProfile.hasProperty || 
                     employmentType !== originalProfile.employmentType

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">{getLabel(LABELS.header)}</h2>
          <p className="text-white/60 text-sm">{getLabel(LABELS.headerDesc)}</p>
        </motion.div>

        {/* Score Comparison */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-6 text-center relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at center, ${scoreColor} 0%, transparent 70%)`,
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <div className="relative z-10">
            <p className="text-white/60 text-sm mb-2">{getLabel(LABELS.simulatedApproval)}</p>
            <motion.div
              className="text-6xl font-bold mb-2"
              style={{
                color: scoreColor,
                textShadow: `0 0 40px ${scoreColor}`,
              }}
              key={simulatedScore}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {simulatedScore}%
            </motion.div>
            <p className="text-sm font-medium mb-4" style={{ color: scoreColor }}>
              {getScoreLabel(simulatedScore)}
            </p>
            
            {/* Score Comparison Bar */}
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="text-white/60">
                <span className="text-xs block">{getLabel(LABELS.original)}</span>
                <span className="font-bold">{originalScore}%</span>
              </div>
              <div className="flex-1 max-w-[200px] h-3 bg-white/10 rounded-full overflow-hidden relative">
                <motion.div 
                  className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta"
                  initial={{ width: 0 }}
                  animate={{ width: `${originalScore}%` }}
                />
                {hasChanges && (
                  <motion.div 
                    className="absolute top-0 h-full rounded-full bg-green-500"
                    initial={{ width: 0, left: 0 }}
                    animate={{ width: `${simulatedScore}%`, left: 0 }}
                    style={{ width: `${Math.min(originalScore, simulatedScore)}%` }}
                  />
                )}
              </div>
              <div className="text-white/60">
                <span className="text-xs block">{getLabel(LABELS.simulated)}</span>
                <span className="font-bold">{simulatedScore}%</span>
              </div>
            </div>
            
            <div className={cn(
              'mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border',
              scoreDiff > 0 && 'bg-green-500/20 text-green-400 border-green-500/30',
              scoreDiff < 0 && 'bg-red-500/20 text-red-400 border-red-500/30',
              scoreDiff === 0 && 'bg-white/10 text-white/60 border-white/20'
            )}>
              {scoreDiff > 0 ? (
                <>
                  <TrendingUp size={16} />
                  +{scoreDiff}% {getLabel(LABELS.betterChances)}
                </>
              ) : scoreDiff < 0 ? (
                <>
                  <TrendingDown size={16} />
                  {scoreDiff}% {getLabel(LABELS.lowerChances)}
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  {getLabel(LABELS.noChange)}
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Interactive Sliders */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5 mb-6 space-y-6"
        >
          <h3 className="font-bold flex items-center gap-2">
            <Info className="text-neon-cyan" size={18} />
            {getLabel(LABELS.adjustValues)}
          </h3>

          {/* Bank Balance Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-white/70">{getLabel(LABELS.bankBalance)} (DZD)</label>
              <div className="flex items-center gap-2">
                <span className="font-bold text-neon-cyan">{bankBalance.toLocaleString()}</span>
                {bankBalance !== originalProfile.bankBalance && (
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    bankBalance > originalProfile.bankBalance ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  )}>
                    {bankBalance > originalProfile.bankBalance ? '+' : ''}{(bankBalance - originalProfile.bankBalance).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={2000000}
              step={50000}
              value={bankBalance}
              onChange={(e) => updateSimulatorValue('bankBalance', parseInt(e.target.value))}
              className="slider-track w-full"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>0</span>
              <span>2,000,000 DZD</span>
            </div>
          </div>

          {/* Monthly Income Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-white/70">{getLabel(LABELS.monthlyIncome)} (DZD)</label>
              <div className="flex items-center gap-2">
                <span className="font-bold text-neon-cyan">{monthlyIncome.toLocaleString()}</span>
                {monthlyIncome !== originalProfile.monthlyIncome && (
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    monthlyIncome > originalProfile.monthlyIncome ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  )}>
                    {monthlyIncome > originalProfile.monthlyIncome ? '+' : ''}{(monthlyIncome - originalProfile.monthlyIncome).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={500000}
              step={10000}
              value={monthlyIncome}
              onChange={(e) => updateSimulatorValue('monthlyIncome', parseInt(e.target.value))}
              className="slider-track w-full"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>0</span>
              <span>500,000 DZD</span>
            </div>
          </div>

          {/* Schengen Count */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-white/70">{getLabel(LABELS.schengenVisas)}</label>
              <div className="flex items-center gap-2">
                <span className="font-bold text-neon-cyan">{schengenCount}</span>
                {schengenCount !== originalProfile.schengenCount && (
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    schengenCount > originalProfile.schengenCount ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  )}>
                    {schengenCount > originalProfile.schengenCount ? '+' : ''}{schengenCount - originalProfile.schengenCount}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((count) => (
                <button
                  key={count}
                  onClick={() => updateSimulatorValue('schengenCount', count)}
                  className={cn(
                    'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                    schengenCount === count
                      ? 'bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                  )}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Property Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-white/70">{getLabel(LABELS.ownProperty)}</label>
              <p className="text-xs text-white/40">{language === 'ar' ? '+20 نقطة إذا كنت تملك' : language === 'fr' ? '+20 points si possédé' : '+20 points if owned'}</p>
            </div>
            <div className="flex items-center gap-2">
              {hasProperty !== originalProfile.hasProperty && (
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  hasProperty ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                )}>
                  {hasProperty ? '+20 pts' : '-20 pts'}
                </span>
              )}
              <button
                onClick={() => updateSimulatorValue('hasProperty', !hasProperty)}
                className={cn(
                  'w-14 h-8 rounded-full transition-all relative',
                  hasProperty ? 'bg-neon-cyan' : 'bg-white/20'
                )}
              >
                <div className={cn(
                  'w-6 h-6 rounded-full bg-white transition-all absolute top-1',
                  hasProperty ? 'right-1' : 'left-1'
                )} />
              </button>
            </div>
          </div>

          {/* Employment Type */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-white/70">{getLabel(LABELS.employmentType)}</label>
              <span className="font-bold text-neon-cyan">{employmentType.toUpperCase()}</span>
            </div>
            <select
              value={employmentType}
              onChange={(e) => updateSimulatorValue('employmentType', e.target.value)}
              className="input-field"
            >
              <option value="cdi">CDI (Permanent) - Best</option>
              <option value="cdd">CDD (Fixed-term)</option>
              <option value="self-employed">Self-employed</option>
              <option value="student">Student</option>
              <option value="retired">Retired</option>
              <option value="unemployed">Unemployed - Worst</option>
            </select>
          </div>
        </motion.div>

        {/* Score Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5 mb-6"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Briefcase className="text-neon-magenta" size={18} />
            {getLabel(LABELS.scoreBreakdown)}
          </h3>
          
          <div className="space-y-3">
            {simulatedAssessment.factors.map((factor) => {
              const originalFactor = originalAssessment.factors.find(f => f.category === factor.category)
              const factorDiff = (originalFactor?.score || 0) - factor.score
              
              return (
                <div key={factor.category} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">{factor.category}</span>
                    <div className="flex items-center gap-2">
                      {hasChanges && factorDiff !== 0 && (
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded',
                          factorDiff > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                        )}>
                          {factorDiff > 0 ? '+' : ''}{factorDiff}
                        </span>
                      )}
                      <span className="font-bold" style={{ 
                        color: factor.score >= 70 ? '#22c55e' : factor.score >= 50 ? '#eab308' : '#ef4444' 
                      }}>
                        {factor.score}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ 
                        backgroundColor: factor.score >= 70 ? '#22c55e' : factor.score >= 50 ? '#eab308' : '#ef4444'
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${factor.score}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-5 mb-6 border-neon-purple/30"
        >
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <AlertTriangle className="text-neon-purple" size={18} />
            {getLabel(LABELS.keyInsights)}
          </h3>
          
          <div className="space-y-2">
            {simulatedAssessment.advice.slice(0, 3).map((advice, i) => (
              <div key={i} className={cn(
                'p-3 rounded-lg text-sm',
                advice.priority === 'critical' && 'bg-red-500/10 border border-red-500/30',
                advice.priority === 'high' && 'bg-orange-500/10 border border-orange-500/30',
                advice.priority === 'medium' && 'bg-yellow-500/10 border border-yellow-500/30',
              )}>
                <p className="font-medium text-white">{advice.title}</p>
                <p className="text-white/60 text-xs mt-1">{advice.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Apply Changes Button */}
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => {
                updateProfile({
                  bankBalance,
                  monthlyIncome,
                  schengenCount,
                  hasProperty,
                  employmentType
                })
              }}
              className="neon-button w-full"
            >
              {getLabel(LABELS.applyChanges)}
            </button>
          </motion.div>
        )}

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="p-4 bg-white/5 rounded-xl"
        >
          <p className="text-xs text-white/50 text-center">
            This is a simulation. Actual visa decisions depend on many factors including interview performance, document authenticity, and consular discretion.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
