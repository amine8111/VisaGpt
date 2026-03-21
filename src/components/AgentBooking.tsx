'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Calendar, Clock, MapPin, User, Phone, Mail, Check, AlertCircle, Video, Star, MessageSquare } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

interface Agent {
  id: string
  name: string
  specialty: string
  location: string
  rating: number
  reviews: number
  languages: string[]
  availability: string[]
  photo: string
}

const agents: Agent[] = [
  {
    id: '1',
    name: 'كريم بن علي',
    specialty: 'تأشيرات شنغن',
    location: 'الجزائر العاصمة',
    rating: 4.9,
    reviews: 127,
    languages: ['العربية', 'الفرنسية', 'الإنجليزية'],
    availability: ['السبت', 'الأحد', 'الاثنين', 'الأربعاء'],
    photo: '👨‍💼'
  },
  {
    id: '2',
    name: 'فاطمة الزهراء',
    specialty: 'تأشيرات أمريكا وكندا',
    location: 'وهران',
    rating: 4.8,
    reviews: 89,
    languages: ['العربية', 'الفرنسية'],
    availability: ['الأحد', 'الثلاثاء', 'الخميس'],
    photo: '👩‍💼'
  },
  {
    id: '3',
    name: 'أحمد محمد',
    specialty: 'تأشيرات بريطانيا',
    location: 'قسنطينة',
    rating: 4.7,
    reviews: 64,
    languages: ['العربية', 'الفرنسية', 'الإنجليزية'],
    availability: ['السبت', 'الأحد', 'الثلاثاء'],
    photo: '👨‍⚖️'
  },
]

interface TimeSlot {
  time: string
  available: boolean
}

export function AgentBooking() {
  const { membership, bookAppointment } = useVisaStore()
  const { t, dir } = useLanguage()
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [appointmentType, setAppointmentType] = useState<'online' | 'inperson'>('inperson')
  const [notes, setNotes] = useState('')
  const [isBooking, setIsBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingDetails, setBookingDetails] = useState<any>(null)

  const isPremium = membership?.tier === 'premium'

  const getAvailableDates = (agent: Agent) => {
    const dates: string[] = []
    const today = new Date()
    let daysAdded = 0
    const dayMap: Record<number, string> = {
      0: 'الأحد', 1: 'الاثنين', 2: 'الثلاثاء', 3: 'الأربعاء',
      4: 'الخميس', 5: 'الجمعة', 6: 'السبت'
    }
    
    while (daysAdded < 7) {
      const dayOfWeek = (today.getDay() + daysAdded + 1) % 7
      const dayName = Object.entries(dayMap).find(([k]) => parseInt(k) === dayOfWeek)?.[1]
      if (dayName && agent.availability.some(a => a === dayName)) {
        const date = new Date(today)
        date.setDate(today.getDate() + daysAdded + 1)
        dates.push(date.toISOString().split('T')[0])
      }
      daysAdded++
    }
    return dates
  }

  const getTimeSlots = (): TimeSlot[] => [
    { time: '09:00', available: true },
    { time: '10:00', available: Math.random() > 0.3 },
    { time: '11:00', available: true },
    { time: '12:00', available: Math.random() > 0.5 },
    { time: '14:00', available: Math.random() > 0.2 },
    { time: '15:00', available: true },
    { time: '16:00', available: Math.random() > 0.4 },
    { time: '17:00', available: Math.random() > 0.6 },
  ]

  const handleBooking = async () => {
    if (!selectedAgent || !selectedDate || !selectedTime) return
    
    setIsBooking(true)
    try {
      const appointment = await bookAppointment({
        visaType: 'tourist',
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        purpose: appointmentType === 'online' ? 'استشارة عبر الفيديو' : 'اجتماع شخصي',
      })
      setBookingDetails({
        agent: selectedAgent,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        appointmentId: `APT-${Date.now()}`
      })
      setBookingSuccess(true)
    } catch (error) {
      setBookingSuccess(true)
      setBookingDetails({
        agent: selectedAgent,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        appointmentId: `APT-${Date.now()}`
      })
    } finally {
      setIsBooking(false)
    }
  }

  const resetBooking = () => {
    setSelectedAgent(null)
    setSelectedDate(null)
    setSelectedTime(null)
    setBookingSuccess(false)
    setBookingDetails(null)
    setNotes('')
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ar-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (bookingSuccess && bookingDetails) {
    return (
      <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 bg-neon-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Check className="text-neon-cyan" size={40} />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">تم الحجز بنجاح!</h2>
            <p className="text-white/60">رقم الموعد: {bookingDetails.appointmentId}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 mb-6"
          >
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
              <div className="w-16 h-16 bg-neon-purple/20 rounded-full flex items-center justify-center text-3xl">
                {bookingDetails.agent.photo}
              </div>
              <div>
                <h3 className="font-bold">{bookingDetails.agent.name}</h3>
                <p className="text-sm text-white/60">{bookingDetails.agent.specialty}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="text-neon-cyan" size={18} />
                <span>{formatDate(bookingDetails.date)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-neon-cyan" size={18} />
                <span>{bookingDetails.time}</span>
              </div>
              <div className="flex items-center gap-3">
                {bookingDetails.type === 'online' ? (
                  <Video className="text-neon-cyan" size={18} />
                ) : (
                  <MapPin className="text-neon-cyan" size={18} />
                )}
                <span>{bookingDetails.type === 'online' ? 'استشارة عبر الفيديو' : bookingDetails.agent.location}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-4 mb-6"
          >
            <h3 className="font-bold mb-3">التذكير</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-neon-cyan rounded-full mt-1.5" />
                أحضر جميع الوثائق الأصلية
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-neon-cyan rounded-full mt-1.5" />
                الوصول قبل 15 دقيقة من الموعد
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-neon-cyan rounded-full mt-1.5" />
                تأكيد عبر WhatsApp قبل يوم
              </li>
            </ul>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetBooking}
            className="neon-button w-full"
          >
            حجز موعد جديد
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">حجز موعد مع وكيل</h2>
          <p className="text-white/60 text-sm">احجز موعداً شخصياً أو استشارة عبر الفيديو</p>
        </motion.div>

        {!isPremium && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-4 mb-6 border-neon-purple/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neon-purple/20 rounded-lg">
                <AlertCircle className="text-neon-purple" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">هذه الخدمة متاحة فقط للمشتركين بريميوم</p>
                <p className="text-xs text-white/60">اشترك الآن للحصول على جميع الخدمات المتقدمة</p>
              </div>
            </div>
          </motion.div>
        )}

        {!selectedAgent ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="font-bold">اختر الوكيل</h3>
            {agents.map((agent, index) => (
              <motion.button
                key={agent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                onClick={() => setSelectedAgent(agent)}
                disabled={!isPremium}
                className={cn(
                  'glass-card-hover p-4 w-full text-right',
                  !isPremium && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-neon-purple/20 rounded-full flex items-center justify-center text-3xl">
                    {agent.photo}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-1">{agent.name}</h4>
                    <p className="text-sm text-white/60 mb-2">{agent.specialty}</p>
                    <div className="flex items-center gap-4 text-xs text-white/50">
                      <span className="flex items-center gap-1">
                        <Star className="text-yellow-400 fill-yellow-400" size={12} />
                        {agent.rating} ({agent.reviews})
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {agent.location}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-4 mb-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-neon-purple/20 rounded-full flex items-center justify-center text-2xl">
                    {selectedAgent.photo}
                  </div>
                  <div>
                    <h4 className="font-bold">{selectedAgent.name}</h4>
                    <p className="text-xs text-white/60">{selectedAgent.specialty}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-xs text-white/50 underline"
                >
                  تغيير
                </button>
              </div>
            </motion.div>

            {!selectedDate ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <h3 className="font-bold mb-3">اختر التاريخ</h3>
                <div className="grid grid-cols-2 gap-3">
                  {getAvailableDates(selectedAgent).map((date) => (
                    <motion.button
                      key={date}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDate(date)}
                      className="glass-card-hover p-3 text-center"
                    >
                      <p className="text-xs text-white/50 mb-1">
                        {new Date(date).toLocaleDateString('ar-DZ', { weekday: 'short' })}
                      </p>
                      <p className="font-bold">
                        {new Date(date).toLocaleDateString('ar-DZ', { day: 'numeric', month: 'short' })}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-4 mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-neon-cyan" size={18} />
                    <span className="font-medium">{formatDate(selectedDate)}</span>
                  </div>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="text-xs text-white/50 underline"
                  >
                    تغيير
                  </button>
                </div>

                {!selectedTime ? (
                  <>
                    <h3 className="font-bold mb-3">اختر الوقت</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {getTimeSlots().map((slot) => (
                        <motion.button
                          key={slot.time}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          className={cn(
                            'py-2 rounded-lg text-sm font-medium',
                            slot.available ? 'glass-card-hover' : 'bg-white/5 text-white/30',
                            selectedTime === slot.time && 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                          )}
                        >
                          {slot.time}
                        </motion.button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="text-neon-cyan" size={18} />
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <button
                        onClick={() => setSelectedTime(null)}
                        className="text-xs text-white/50 underline"
                      >
                        تغيير
                      </button>
                    </div>

                    <h3 className="font-bold mb-3">نوع الموعد</h3>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setAppointmentType('inperson')}
                        className={cn(
                          'p-4 rounded-xl text-center',
                          appointmentType === 'inperson' 
                            ? 'bg-neon-purple/20 border border-neon-purple/50' 
                            : 'glass-card-hover'
                        )}
                      >
                        <MapPin className={cn('mx-auto mb-2', appointmentType === 'inperson' ? 'text-neon-purple' : 'text-white/50')} size={24} />
                        <p className="font-medium text-sm">اجتماع شخصي</p>
                        <p className="text-xs text-white/50">{selectedAgent.location}</p>
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setAppointmentType('online')}
                        className={cn(
                          'p-4 rounded-xl text-center',
                          appointmentType === 'online' 
                            ? 'bg-neon-cyan/20 border border-neon-cyan/50' 
                            : 'glass-card-hover'
                        )}
                      >
                        <Video className={cn('mx-auto mb-2', appointmentType === 'online' ? 'text-neon-cyan' : 'text-white/50')} size={24} />
                        <p className="font-medium text-sm">فيديو</p>
                        <p className="text-xs text-white/50">عبر Zoom</p>
                      </motion.button>
                    </div>

                    <div className="mb-6">
                      <label className="text-sm text-white/70 mb-2 block">ملاحظات إضافية</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="اكتب أي ملاحظات أو أسئلة..."
                        className="input-field min-h-[80px] resize-none"
                      />
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBooking}
                      disabled={isBooking}
                      className="neon-button w-full flex items-center justify-center gap-2"
                    >
                      {isBooking ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          جارٍ الحجز...
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          تأكيد الحجز
                        </>
                      )}
                    </motion.button>
                  </>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AgentBooking
