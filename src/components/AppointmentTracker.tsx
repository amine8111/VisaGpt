'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Calendar, MapPin, Clock, Bell, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

export function AppointmentTracker() {
  const { bookAppointment, membership, isLoading } = useVisaStore()
  const { t, language } = useLanguage()
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const visaCenters = [
    { city: language === 'ar' ? 'الجزائر' : language === 'fr' ? 'Alger' : 'Algiers', name: 'TLSContact Alger', status: language === 'ar' ? 'متاح' : 'Available', nextDate: '2026-04-15', statusKey: 'available' },
    { city: language === 'ar' ? 'وهران' : language === 'fr' ? 'Oran' : 'Oran', name: 'TLSContact Oran', status: language === 'ar' ? 'غير متاح' : 'Unavailable', nextDate: '2026-05-01', statusKey: 'unavailable' },
    { city: language === 'ar' ? 'قسنطينة' : language === 'fr' ? 'Constantine' : 'Constantine', name: 'TLSContact Constantine', status: language === 'ar' ? 'متاح' : 'Available', nextDate: '2026-04-20', statusKey: 'available' },
    { city: language === 'ar' ? 'عنابة' : language === 'fr' ? 'Annaba' : 'Annaba', name: 'VFS Global Annaba', status: language === 'ar' ? 'قريباً' : 'Soon', nextDate: '2026-04-25', statusKey: 'soon' },
  ]

  const handleBook = async (centerCity: string) => {
    if (!membership?.isActive) {
      setError(t('activeSubscriptionRequired'))
      return
    }
    
    setError(null)
    setBookingId(centerCity)
    
    try {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const dateStr = tomorrow.toISOString().split('T')[0]
      
      await bookAppointment({
        visaType: 'tourist',
        appointmentDate: dateStr,
        appointmentTime: '09:00',
        destination: centerCity,
      })
    } catch (err: any) {
      setError(err.response?.data?.message || t('bookingFailed'))
    } finally {
      setBookingId(null)
    }
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">{t('appointmentRadar')}</h2>
          <p className="text-white/60 text-sm">{t('appointmentRadarDesc')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neon-cyan/20 rounded-lg">
                <Bell className="text-neon-cyan" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium">{t('instantNotifications')}</p>
                <p className="text-xs text-white/50">{t('instantNotificationsDesc')}</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="neon-button py-2 px-4 text-sm"
            >
              {t('enable')}
            </motion.button>
          </div>
        </motion.div>

        <div className="space-y-4">
          {visaCenters.map((center, index) => (
            <motion.div
              key={center.city}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="glass-card p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <MapPin className="text-neon-magenta" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">{center.city}</h3>
                    <p className="text-sm text-white/60">{center.name}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  center.statusKey === 'available'
                    ? 'bg-green-500/20 text-green-400'
                    : center.statusKey === 'unavailable'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {center.status}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{t('date')}: {center.nextDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{t('availableSoon')}</span>
                </div>
              </div>

              {error && bookingId === null && (
                <p className="text-xs text-red-400 mt-2">{error}</p>
              )}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBook(center.city)}
                disabled={isLoading || bookingId === center.city}
                className={cn(
                  'w-full mt-4 py-3 rounded-xl text-sm font-medium transition-all',
                  center.statusKey === 'available'
                    ? 'glass-card-hover'
                    : 'bg-white/5 text-white/40 cursor-not-allowed'
                )}
              >
                {bookingId === center.city ? (
                  <Loader2 size={16} className="animate-spin mx-auto" />
                ) : center.statusKey === 'available' ? (
                  t('bookAppointment')
                ) : (
                  t('unavailable')
                )}
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 glass-card p-6"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="text-neon-cyan" size={20} />
            {t('importantNote')}
          </h3>
          <p className="text-sm text-white/60 leading-relaxed">
            {t('appointmentsDisclaimer')}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
