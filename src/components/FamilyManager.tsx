'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Users, Plus, User, CheckCircle, AlertCircle, Trash2, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

interface FamilyMember {
  id: string
  name: string
  relation: string
  dob: string
  passport: string
  readiness: number
  documentsComplete: number
  totalDocuments: number
}

const familyMembers: FamilyMember[] = [
  { id: '1', name: 'Ahmed Ben Ali', relation: 'husband', dob: '1985-05-15', passport: 'AB123456', readiness: 85, documentsComplete: 4, totalDocuments: 6 },
  { id: '2', name: 'Fatima Bent Mohamed', relation: 'wife', dob: '1988-09-22', passport: 'FM789012', readiness: 72, documentsComplete: 3, totalDocuments: 6 },
  { id: '3', name: 'Yassine', relation: 'son', dob: '2015-03-10', passport: 'YA345678', readiness: 90, documentsComplete: 5, totalDocuments: 5 },
  { id: '4', name: 'Mariem', relation: 'daughter', dob: '2018-07-28', passport: 'MR901234', readiness: 88, documentsComplete: 5, totalDocuments: 5 },
]

export function FamilyManager() {
  const { t, language } = useLanguage()
  const [members, setMembers] = useState(familyMembers)

  const getLocalizedRelation = (rel: string) => {
    const relations: Record<string, { ar: string; en: string; fr: string }> = {
      husband: { ar: 'زوج', en: 'Husband', fr: 'Mari' },
      wife: { ar: 'زوجة', en: 'Wife', fr: 'Épouse' },
      son: { ar: 'ابن', en: 'Son', fr: 'Fils' },
      daughter: { ar: 'ابنة', en: 'Daughter', fr: 'Fille' },
    }
    const relData = relations[rel]
    if (!relData) return rel
    if (language === 'ar') return relData.ar
    if (language === 'fr') return relData.fr
    return relData.en
  }

  const avgReadiness = Math.round(members.reduce((acc, m) => acc + m.readiness, 0) / members.length)

  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getReadinessBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/20'
    if (score >= 60) return 'bg-yellow-500/20'
    return 'bg-red-500/20'
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">{t('familyManager')}</h2>
          <p className="text-white/60 text-sm">{t('familyManagerDesc')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">{t('averageFamilyReadiness')}</p>
              <p className={cn('text-4xl font-bold mt-1', getReadinessColor(avgReadiness))}>
                {avgReadiness}%
              </p>
            </div>
            <div className="p-4 bg-neon-cyan/20 rounded-xl">
              <Users className="text-neon-cyan" size={32} />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>{t('completedDocuments')}</span>
              <span>{members.reduce((acc, m) => acc + m.documentsComplete, 0)} / {members.reduce((acc, m) => acc + m.totalDocuments, 0)}</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(members.reduce((acc, m) => acc + m.documentsComplete, 0) / members.reduce((acc, m) => acc + m.totalDocuments, 0)) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        <div className="space-y-3">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="glass-card p-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center">
                  <User className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold">{member.name}</h3>
                    <span className="text-xs text-white/50 px-2 py-1 bg-white/10 rounded-full">
                      {getLocalizedRelation(member.relation)}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 mb-3">{t('passportLabel')}: {member.passport}</p>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/50">{t('familyDocuments')}</span>
                        <span>{member.documentsComplete}/{member.totalDocuments}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-neon-cyan rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(member.documentsComplete / member.totalDocuments) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className={cn('px-3 py-1 rounded-full text-sm font-bold', getReadinessBg(member.readiness), getReadinessColor(member.readiness))}>
                      {member.readiness}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 rounded-xl glass-card-hover text-sm flex items-center justify-center gap-2">
                  <Share2 size={14} />
                  {t('share')}
                </button>
                <button className="py-2 px-4 rounded-xl glass-card-hover text-sm text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 glass-card-hover py-4 rounded-xl font-medium flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          {t('addNewMember')}
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 glass-card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <CheckCircle className="text-green-400" size={24} />
            </div>
            <div>
              <h4 className="font-medium">{t('commonDocuments')}</h4>
              <p className="text-xs text-white/50">{t('hotelBookingInsurance')}</p>
            </div>
            <CheckCircle size={20} className="text-green-400 mr-auto" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
