'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, Clock, AlertTriangle, CheckCircle, Plus,
  Trash2, Bell, BellOff, ChevronRight, FileText,
  Globe, CreditCard, AlertCircle, Timer
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { cn } from '@/lib/utils'

interface Reminder {
  id: string
  type: 'passport_expiry' | 'visa_expiry' | 'appointment' | 'renewal' | 'custom'
  title: string
  titleAr: string
  titleFr: string
  description: string
  descriptionAr: string
  descriptionFr: string
  date: string
  dateAr: string
  dateFr: string
  country?: string
  countryFlag?: string
  notifyDays: number[]
  enabled: boolean
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}

const defaultReminders: Reminder[] = [
  {
    id: 'rem-1',
    type: 'passport_expiry',
    title: 'Passport Expiry Warning',
    titleAr: 'تحذير انتهاء جواز السفر',
    titleFr: 'Avertissement expiration passeport',
    description: 'Your passport expires soon',
    descriptionAr: 'جواز سفرك ينتهي قريباً',
    descriptionFr: 'Votre passeport expire bientôt',
    date: new Date(Date.now() + 180 * 86400000).toISOString(),
    dateAr: new Date(Date.now() + 180 * 86400000).toLocaleDateString('ar-DZ'),
    dateFr: new Date(Date.now() + 180 * 86400000).toLocaleDateString('fr-FR'),
    countryFlag: '🇩🇿',
    notifyDays: [180, 90, 30, 7],
    enabled: true,
    priority: 'high',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rem-2',
    type: 'visa_expiry',
    title: 'Previous Visa Reminder',
    titleAr: 'تذكير التأشيرة السابقة',
    titleFr: 'Rappel visa précédent',
    description: 'Schengen visa from last trip',
    descriptionAr: 'تأشيرة شنغن من الرحلة الماضية',
    descriptionFr: 'Visa Schengen du dernier voyage',
    date: new Date(Date.now() + 90 * 86400000).toISOString(),
    dateAr: new Date(Date.now() + 90 * 86400000).toLocaleDateString('ar-DZ'),
    dateFr: new Date(Date.now() + 90 * 86400000).toLocaleDateString('fr-FR'),
    countryFlag: '🇫🇷',
    notifyDays: [30, 7, 3],
    enabled: true,
    priority: 'medium',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rem-3',
    type: 'custom',
    title: 'Start Visa Application',
    titleAr: 'بدء طلب التأشيرة',
    titleFr: 'Commencer demande de visa',
    description: 'Begin France Schengen application',
    descriptionAr: 'بدء طلب شنغن فرنسا',
    descriptionFr: 'Commencer demande Schengen France',
    date: new Date(Date.now() + 60 * 86400000).toISOString(),
    dateAr: new Date(Date.now() + 60 * 86400000).toLocaleDateString('ar-DZ'),
    dateFr: new Date(Date.now() + 60 * 86400000).toLocaleDateString('fr-FR'),
    countryFlag: '🇫🇷',
    notifyDays: [7, 3, 1],
    enabled: true,
    priority: 'high',
    createdAt: new Date().toISOString(),
  },
]

export function VisaDeadlineReminders() {
  const { t, language } = useLanguage()
  const [reminders, setReminders] = useState<Reminder[]>(defaultReminders)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    type: 'custom',
    title: '',
    titleAr: '',
    titleFr: '',
    description: '',
    descriptionAr: '',
    descriptionFr: '',
    date: '',
    notifyDays: [7, 3, 1],
    enabled: true,
    priority: 'medium',
  })

  useEffect(() => {
    const saved = localStorage.getItem('visagpt_reminders')
    if (saved) {
      setReminders(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('visagpt_reminders', JSON.stringify(reminders))
  }, [reminders])

  const getTitle = (r: Reminder) => {
    if (language === 'ar') return r.titleAr || r.title
    if (language === 'fr') return r.titleFr || r.title
    return r.title
  }

  const getDescription = (r: Reminder) => {
    if (language === 'ar') return r.descriptionAr || r.description
    if (language === 'fr') return r.descriptionFr || r.description
    return r.description
  }

  const getDate = (r: Reminder) => {
    if (language === 'ar') return r.dateAr || new Date(r.date).toLocaleDateString('ar-DZ')
    if (language === 'fr') return r.dateFr || new Date(r.date).toLocaleDateString('fr-FR')
    return new Date(r.date).toLocaleDateString()
  }

  const getDaysUntil = (date: string) => {
    const now = new Date()
    const target = new Date(date)
    const diff = target.getTime() - now.getTime()
    const days = Math.ceil(diff / 86400000)
    return days
  }

  const getUrgencyColor = (days: number) => {
    if (days < 0) return 'text-red-400'
    if (days <= 7) return 'text-red-400'
    if (days <= 30) return 'text-amber-400'
    return 'text-emerald-400'
  }

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ))
  }

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id))
  }

  const addReminder = () => {
    if (!newReminder.date || !newReminder.title) return

    const reminder: Reminder = {
      id: `rem-${Date.now()}`,
      type: newReminder.type || 'custom',
      title: newReminder.title,
      titleAr: newReminder.titleAr || newReminder.title,
      titleFr: newReminder.titleFr || newReminder.title,
      description: newReminder.description || '',
      descriptionAr: newReminder.descriptionAr || newReminder.description || '',
      descriptionFr: newReminder.descriptionFr || newReminder.description || '',
      date: new Date(newReminder.date!).toISOString(),
      dateAr: new Date(newReminder.date!).toLocaleDateString('ar-DZ'),
      dateFr: new Date(newReminder.date!).toLocaleDateString('fr-FR'),
      countryFlag: newReminder.countryFlag,
      notifyDays: newReminder.notifyDays || [7, 3, 1],
      enabled: true,
      priority: newReminder.priority as Reminder['priority'] || 'medium',
      createdAt: new Date().toISOString(),
    }

    setReminders(prev => [...prev, reminder])
    setShowAddForm(false)
    setNewReminder({
      type: 'custom',
      title: '',
      titleAr: '',
      titleFr: '',
      description: '',
      descriptionAr: '',
      descriptionFr: '',
      date: '',
      notifyDays: [7, 3, 1],
      enabled: true,
      priority: 'medium',
    })
  }

  const getReminderIcon = (type: Reminder['type']) => {
    switch (type) {
      case 'passport_expiry': return FileText
      case 'visa_expiry': return Globe
      case 'appointment': return Calendar
      case 'renewal': return Clock
      default: return Bell
    }
  }

  const sortedReminders = [...reminders].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const upcomingReminders = sortedReminders.filter(r => r.enabled && getDaysUntil(r.date) >= 0)
  const pastReminders = sortedReminders.filter(r => !r.enabled || getDaysUntil(r.date) < 0)

  const stats = {
    total: reminders.length,
    active: reminders.filter(r => r.enabled).length,
    urgent: reminders.filter(r => r.enabled && getDaysUntil(r.date) <= 7).length,
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
            <Timer className="text-amber-400" size={20} />
            <span className="text-amber-400 text-sm font-medium">
              {language === 'ar' ? 'تذكيرات مهمة' : language === 'fr' ? 'Rappels Importants' : 'Important Reminders'}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">
              {language === 'ar' ? 'المواعيد والتذكيرات' : language === 'fr' ? 'Dates et Rappels' : 'Deadlines & Reminders'}
            </span>
          </h1>
          <p className="text-white/60">
            {language === 'ar' 
              ? 'لا تفوت أي موعد مهم للتأشيرة' 
              : language === 'fr' 
              ? 'Ne manquez aucun rendez-vous visa important' 
              : 'Never miss an important visa deadline'}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="glass-card p-4 text-center">
            <Bell className="mx-auto mb-2 text-neon-cyan" size={20} />
            <p className="text-xl font-bold">{stats.total}</p>
            <p className="text-xs text-white/50">{language === 'ar' ? 'الإجمالي' : language === 'fr' ? 'Total' : 'Total'}</p>
          </div>
          <div className="glass-card p-4 text-center">
            <CheckCircle className="mx-auto mb-2 text-emerald-400" size={20} />
            <p className="text-xl font-bold">{stats.active}</p>
            <p className="text-xs text-white/50">{language === 'ar' ? 'نشط' : language === 'fr' ? 'Actif' : 'Active'}</p>
          </div>
          <div className="glass-card p-4 text-center">
            <AlertTriangle className="mx-auto mb-2 text-red-400" size={20} />
            <p className="text-xl font-bold">{stats.urgent}</p>
            <p className="text-xs text-white/50">{language === 'ar' ? 'عاجل' : language === 'fr' ? 'Urgent' : 'Urgent'}</p>
          </div>
        </motion.div>

        {/* Upcoming Reminders */}
        <div className="mb-6">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Clock size={18} className="text-neon-cyan" />
            {language === 'ar' ? 'المقررة القادمة' : language === 'fr' ? 'À Venir' : 'Upcoming'}
          </h3>
          
          <div className="space-y-3">
            {upcomingReminders.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <Calendar className="mx-auto mb-3 text-white/20" size={48} />
                <p className="text-white/50">
                  {language === 'ar' ? 'لا توجد تذكيرات' : language === 'fr' ? 'Aucun rappel' : 'No reminders'}
                </p>
              </div>
            ) : (
              upcomingReminders.map((reminder) => {
                const Icon = getReminderIcon(reminder.type)
                const daysUntil = getDaysUntil(reminder.date)
                
                return (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      'glass-card-hover p-4',
                      daysUntil <= 7 && 'border-red-500/30 bg-red-500/5'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        reminder.priority === 'high' && 'bg-red-500/20',
                        reminder.priority === 'medium' && 'bg-amber-500/20',
                        reminder.priority === 'low' && 'bg-neon-cyan/20'
                      )}>
                        <Icon size={24} className={
                          reminder.priority === 'high' ? 'text-red-400' :
                          reminder.priority === 'medium' ? 'text-amber-400' : 'text-neon-cyan'
                        } />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              {reminder.countryFlag && <span>{reminder.countryFlag}</span>}
                              {getTitle(reminder)}
                            </h4>
                            <p className="text-sm text-white/50">{getDescription(reminder)}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className={cn('text-lg font-bold', getUrgencyColor(daysUntil))}>
                              {daysUntil === 0 
                                ? (language === 'ar' ? 'اليوم!' : language === 'fr' ? "Aujourd'hui!" : 'Today!')
                                : daysUntil < 0
                                ? (language === 'ar' ? 'منتهي' : language === 'fr' ? 'Expiré' : 'Expired')
                                : `${daysUntil}d`
                              }
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 text-xs text-white/50">
                            <Calendar size={12} />
                            <span>{getDate(reminder)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleReminder(reminder.id)}
                              className={cn(
                                'p-2 rounded-full transition-colors',
                                reminder.enabled ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-white/10 text-white/30'
                              )}
                            >
                              {reminder.enabled ? <Bell size={16} /> : <BellOff size={16} />}
                            </button>
                            <button
                              onClick={() => deleteReminder(reminder.id)}
                              className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>

        {/* Past/Disabled Reminders */}
        {pastReminders.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold mb-3 text-white/50 flex items-center gap-2">
              <Clock size={18} />
              {language === 'ar' ? 'السابقة' : language === 'fr' ? 'Passées' : 'Past'}
            </h3>
            
            <div className="space-y-2">
              {pastReminders.slice(0, 3).map((reminder) => {
                const daysUntil = getDaysUntil(reminder.date)
                return (
                  <div
                    key={reminder.id}
                    className="glass-card p-3 opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {reminder.countryFlag && <span>{reminder.countryFlag}</span>}
                        <span className="text-sm">{getTitle(reminder)}</span>
                      </div>
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="p-1 text-white/30 hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Add Reminder Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full neon-button flex items-center justify-center gap-2 mb-4"
        >
          <Plus size={20} />
          {language === 'ar' ? 'إضافة تذكير' : language === 'fr' ? 'Ajouter un rappel' : 'Add Reminder'}
        </motion.button>

        {/* Add Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="glass-card-elevated p-4 mb-4"
          >
            <h4 className="font-bold mb-4">
              {language === 'ar' ? 'تذكير جديد' : language === 'fr' ? 'Nouveau Rappel' : 'New Reminder'}
            </h4>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/70 mb-1 block">
                  {language === 'ar' ? 'العنوان' : language === 'fr' ? 'Titre' : 'Title'}
                </label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                  className="input-field"
                  placeholder={language === 'ar' ? 'مثال: موعد السفارة' : language === 'fr' ? 'Ex: Rendez-vous ambassade' : 'e.g., Embassy Appointment'}
                />
              </div>

              <div>
                <label className="text-sm text-white/70 mb-1 block">
                  {language === 'ar' ? 'التاريخ' : language === 'fr' ? 'Date' : 'Date'}
                </label>
                <input
                  type="date"
                  value={newReminder.date}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, date: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm text-white/70 mb-1 block">
                  {language === 'ar' ? 'الأولوية' : language === 'fr' ? 'Priorité' : 'Priority'}
                </label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setNewReminder(prev => ({ ...prev, priority: p }))}
                      className={cn(
                        'flex-1 py-2 rounded-lg text-sm transition-colors',
                        newReminder.priority === p && p === 'low' && 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50',
                        newReminder.priority === p && p === 'medium' && 'bg-amber-400/20 text-amber-400 border border-amber-400/50',
                        newReminder.priority === p && p === 'high' && 'bg-red-500/20 text-red-400 border border-red-500/50',
                        newReminder.priority !== p && 'bg-white/10 text-white/50'
                      )}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="btn-secondary flex-1"
                >
                  {language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  onClick={addReminder}
                  disabled={!newReminder.title || !newReminder.date}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {language === 'ar' ? 'إضافة' : language === 'fr' ? 'Ajouter' : 'Add'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Calendar Integration Note */}
        <div className="glass-card p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-neon-purple flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium">
                {language === 'ar' ? 'مزامنة التقويم' : language === 'fr' ? 'Synchronisation Calendrier' : 'Calendar Sync'}
              </p>
              <p className="text-xs text-white/50 mt-1">
                {language === 'ar' 
                  ? 'ستتم مزامنة التذكيرات مع تقويم جهازك تلقائياً'
                  : language === 'fr'
                  ? 'Les rappels seront automatiquement synchronisés avec le calendrier de votre appareil'
                  : 'Reminders will automatically sync with your device calendar'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisaDeadlineReminders
