'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, BellRing, X, Check, AlertCircle, 
  Calendar, Clock, MessageSquare, Sparkles,
  Settings, Volume2, VolumeX, Trash2
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { cn } from '@/lib/utils'

export interface Notification {
  id: string
  type: 'slot' | 'reminder' | 'success' | 'tip' | 'update'
  title: string
  titleAr: string
  titleFr: string
  message: string
  messageAr: string
  messageFr: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  expiresAt?: Date
}

const defaultNotifications: Notification[] = [
  {
    id: 'welcome',
    type: 'tip',
    title: 'Welcome to VisaGPT!',
    titleAr: 'مرحباً بك في VisaGPT!',
    titleFr: 'Bienvenue sur VisaGPT!',
    message: 'Start your free visa assessment to see your approval chances.',
    messageAr: 'ابدأ تقييم التأشيرة المجاني لرؤية فرص موافقتك.',
    messageFr: 'Commencez votre évaluation gratuite pour voir vos chances.',
    timestamp: new Date(),
    read: false,
  },
  {
    id: 'tip-daily',
    type: 'tip',
    title: 'Daily Visa Tip',
    titleAr: 'نصيحة يومية عن التأشيرة',
    titleFr: 'Conseil Visa du Jour',
    message: 'Did you know? Algeria has one of the highest Schengen rejection rates. Use our AI to improve your profile!',
    messageAr: 'هل تعلم؟ الجزائر لديها أحد أعلى معدلات رفض شنغن. استخدم الذكاء الاصطناعي لتحسين ملفك!',
    messageFr: 'Le saviez-vous? L\'Algérie a l\'un des taux de refus Schengen les plus élevés!',
    timestamp: new Date(Date.now() - 86400000),
    read: true,
  },
]

export function NotificationCenter() {
  const { t, language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [pushEnabled, setPushEnabled] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('visagpt_notifications')
    if (saved) {
      const parsed = JSON.parse(saved)
      setNotifications(parsed.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) })))
    }
    
    const soundPref = localStorage.getItem('visagpt_sound')
    if (soundPref === 'false') setSoundEnabled(false)
    
    const pushPref = localStorage.getItem('visagpt_push')
    if (pushPref === 'true') setPushEnabled(true)
  }, [])

  useEffect(() => {
    localStorage.setItem('visagpt_notifications', JSON.stringify(notifications))
  }, [notifications])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const toggleSound = () => {
    const newValue = !soundEnabled
    setSoundEnabled(newValue)
    localStorage.setItem('visagpt_sound', String(newValue))
  }

  const togglePush = async () => {
    if (!pushEnabled) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          setPushEnabled(true)
          localStorage.setItem('visagpt_push', 'true')
          
          if (soundEnabled) {
            new Audio('/notification.mp3').play().catch(() => {})
          }
        }
      }
    } else {
      setPushEnabled(false)
      localStorage.setItem('visagpt_push', 'false')
    }
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'slot': return BellRing
      case 'reminder': return Calendar
      case 'success': return Check
      case 'tip': return Sparkles
      case 'update': return AlertCircle
      default: return Bell
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'slot': return 'text-emerald-400 bg-emerald-400/20'
      case 'reminder': return 'text-amber-400 bg-amber-400/20'
      case 'success': return 'text-neon-cyan bg-neon-cyan/20'
      case 'tip': return 'text-neon-purple bg-neon-purple/20'
      case 'update': return 'text-red-400 bg-red-400/20'
      default: return 'text-white/50 bg-white/10'
    }
  }

  const getTitle = (notification: Notification) => {
    if (language === 'ar') return notification.titleAr
    if (language === 'fr') return notification.titleFr
    return notification.title
  }

  const getMessage = (notification: Notification) => {
    if (language === 'ar') return notification.messageAr
    if (language === 'fr') return notification.messageFr
    return notification.message
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (hours < 1) return language === 'ar' ? 'الآن' : language === 'fr' ? 'À l\'instant' : 'Just now'
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`
    return date.toLocaleDateString()
  }

  return (
    <>
      {/* Bell Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: 'spring' }}
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 z-50 p-3 glass-card rounded-full group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Bell size={22} className="text-white group-hover:text-neon-cyan transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#0a051a] z-50 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Bell className="text-neon-cyan" size={20} />
                    {language === 'ar' ? 'الإشعارات' : language === 'fr' ? 'Notifications' : 'Notifications'}
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-neon-cyan hover:text-neon-cyan/80"
                  >
                    {language === 'ar' ? 'تحديد الكل كمقروء' : language === 'fr' ? 'Tout marquer lu' : 'Mark all read'}
                  </button>
                  <span className="text-white/20">|</span>
                  <button
                    onClick={clearAll}
                    className="text-xs text-red-400 hover:text-red-400/80 flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    {language === 'ar' ? 'مسح الكل' : language === 'fr' ? 'Tout effacer' : 'Clear all'}
                  </button>
                </div>
              </div>

              {/* Settings */}
              <div className="p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Settings size={16} className="text-white/50" />
                    <span className="text-sm text-white/70">
                      {language === 'ar' ? 'الإعدادات' : language === 'fr' ? 'Paramètres' : 'Settings'}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={toggleSound}
                      className={cn(
                        'p-2 rounded-full transition-colors',
                        soundEnabled ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-white/10 text-white/50'
                      )}
                    >
                      {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                    <button
                      onClick={togglePush}
                      className={cn(
                        'p-2 rounded-full transition-colors',
                        pushEnabled ? 'bg-emerald-400/20 text-emerald-400' : 'bg-white/10 text-white/50'
                      )}
                    >
                      {pushEnabled ? <BellRing size={16} /> : <Bell size={16} />}
                    </button>
                  </div>
                </div>
                {!pushEnabled && (
                  <p className="text-xs text-white/40 mt-2">
                    {language === 'ar' 
                      ? 'فعّل الإشعارات لتلقي تنبيهات فورية'
                      : language === 'fr'
                      ? 'Activez les notifications pour les alertes instantanées'
                      : 'Enable notifications for instant alerts'}
                  </p>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <Bell className="text-white/20 mb-4" size={48} />
                    <p className="text-white/50">
                      {language === 'ar' ? 'لا توجد إشعارات' : language === 'fr' ? 'Aucune notification' : 'No notifications'}
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type)
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          'p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer',
                          !notification.read && 'bg-neon-cyan/5'
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                            getNotificationColor(notification.type)
                          )}>
                            <Icon size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={cn(
                                'font-medium text-sm',
                                !notification.read && 'text-neon-cyan'
                              )}>
                                {getTitle(notification)}
                              </h4>
                              <span className="text-xs text-white/30 flex-shrink-0">
                                {formatTime(notification.timestamp)}
                              </span>
                            </div>
                            <p className="text-xs text-white/60 mt-1 line-clamp-2">
                              {getMessage(notification)}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                            className="p-1 hover:bg-white/10 rounded-full opacity-0 group-hover:opacity-100"
                          >
                            <X size={14} className="text-white/30" />
                          </button>
                        </div>
                        {!notification.read && (
                          <div className="absolute top-4 right-4 w-2 h-2 bg-neon-cyan rounded-full" />
                        )}
                      </motion.div>
                    )
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  useEffect(() => {
    const saved = localStorage.getItem('visagpt_notifications')
    if (saved) {
      setNotifications(JSON.parse(saved))
    }
  }, [])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    }
    
    setNotifications(prev => {
      const updated = [newNotification, ...prev]
      localStorage.setItem('visagpt_notifications', JSON.stringify(updated))
      return updated
    })
    
    if (Notification.permission === 'granted') {
      new Notification(getTitle(newNotification), {
        body: getMessage(newNotification),
        icon: '/icons/icon-512.svg',
        badge: '/icons/icon-512.svg',
      })
    }
  }

  const getTitle = (n: Notification) => {
    return n.title
  }

  const getMessage = (n: Notification) => {
    return n.message
  }

  return { notifications, addNotification }
}

export default NotificationCenter
