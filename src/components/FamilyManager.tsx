'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Users, Plus, User, CheckCircle, AlertCircle, Trash2, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  { id: '1', name: 'أحمد بن علي', relation: 'زوج', dob: '1985-05-15', passport: 'AB123456', readiness: 85, documentsComplete: 4, totalDocuments: 6 },
  { id: '2', name: 'فاطمة بنت محمد', relation: 'زوجة', dob: '1988-09-22', passport: 'FM789012', readiness: 72, documentsComplete: 3, totalDocuments: 6 },
  { id: '3', name: 'ياسين', relation: 'ابن', dob: '2015-03-10', passport: 'YA345678', readiness: 90, documentsComplete: 5, totalDocuments: 5 },
  { id: '4', name: 'مريم', relation: 'ابنة', dob: '2018-07-28', passport: 'MR901234', readiness: 88, documentsComplete: 5, totalDocuments: 5 },
]

export function FamilyManager() {
  const [members, setMembers] = useState(familyMembers)

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
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">طلبات العائلة</h2>
          <p className="text-white/60 text-sm">إدارة طلبات متعددة في مكان واحد</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">متوسط جاهزية العائلة</p>
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
              <span>الوثائق المكتملة</span>
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
                      {member.relation}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 mb-3">جواز: {member.passport}</p>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/50">الوثائق</span>
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
                  مشاركة
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
          إضافة فرد جديد
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
              <h4 className="font-medium">الوثائق المشتركة</h4>
              <p className="text-xs text-white/50">حجز الفندق، تأمين السفر</p>
            </div>
            <CheckCircle size={20} className="text-green-400 mr-auto" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
