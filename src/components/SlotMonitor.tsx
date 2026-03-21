'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Calendar, Bell, MapPin, Clock, CheckCircle, AlertCircle,
  RefreshCw, Settings, BellRing, Volume2, Smartphone, Globe,
  Loader2, Star, Filter, ChevronDown, Power, PowerOff, Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'
import { useVisaStore } from '@/store/visaStore'

interface Slot {
  id: string
  date: string
  time: string
  location: string
  available: boolean
  embassy: string
}

interface MonitorConfig {
  id: string
  embassy: string
  location: string
  visaType: string
  dateFrom: string
  dateTo: string
  notifications: {
    push: boolean
    email: boolean
    whatsapp: boolean
  }
  active: boolean
}

const locations = [
  { id: 'algiers', name: 'الجزائر العاصمة', nameEn: 'Algiers' },
  { id: 'oran', name: 'وهران', nameEn: 'Oran' },
  { id: 'annaba', name: 'عنابة', nameEn: 'Annaba' },
  { id: 'constantine', name: 'قسنطينة', nameEn: 'Constantine' },
]

const embassies = [
  { id: 'france', name: 'فرنسا', nameEn: 'France', flag: '🇫🇷' },
  { id: 'germany', name: 'ألمانيا', nameEn: 'Germany', flag: '🇩🇪' },
  { id: 'spain', name: 'إسبانيا', nameEn: 'Spain', flag: '🇪🇸' },
  { id: 'italy', name: 'إيطاليا', nameEn: 'Italy', flag: '🇮🇹' },
  { id: 'netherlands', name: 'هولندا', nameEn: 'Netherlands', flag: '🇳🇱' },
  { id: 'belgium', name: 'بلجيكا', nameEn: 'Belgium', flag: '🇧🇪' },
  { id: 'uk', name: 'بريطانيا', nameEn: 'United Kingdom', flag: '🇬🇧' },
  { id: 'usa', name: 'أمريكا', nameEn: 'United States', flag: '🇺🇸' },
]

const visaTypes = [
  { id: 'tourist', name: 'سياحة', nameEn: 'Tourist' },
  { id: 'business', name: 'عمل', nameEn: 'Business' },
  { id: 'student', name: 'دراسة', nameEn: 'Student' },
  { id: 'family', name: 'عائلة', nameEn: 'Family' },
]

export function SlotMonitor() {
  const { t, dir, language } = useLanguage()
  const { membership } = useVisaStore()
  const [configs, setConfigs] = useState<MonitorConfig[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newConfig, setNewConfig] = useState({
    embassy: 'france',
    location: 'algiers',
    visaType: 'tourist',
    dateFrom: '',
    dateTo: '',
    notifications: { push: true, email: false, whatsapp: true }
  })
  const [isScanning, setIsScanning] = useState(false)
  const [lastScan, setLastScan] = useState<Date | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])
  const [alertShown, setAlertShown] = useState(false)

  const isPremium = membership?.tier === 'premium'

  useEffect(() => {
    const savedConfigs = localStorage.getItem('slotMonitorConfigs')
    if (savedConfigs) {
      setConfigs(JSON.parse(savedConfigs))
    }
  }, [])

  useEffect(() => {
    if (configs.length > 0 && configs.some(c => c.active)) {
      startMonitoring()
    }
    return () => stopMonitoring()
  }, [configs])

  const saveConfigs = (newConfigs: MonitorConfig[]) => {
    setConfigs(newConfigs)
    localStorage.setItem('slotMonitorConfigs', JSON.stringify(newConfigs))
  }

  const startMonitoring = () => {
    setIsScanning(true)
    simulateScanning()
  }

  const stopMonitoring = () => {
    setIsScanning(false)
  }

  const simulateScanning = () => {
    if (!isScanning) return
    
    setTimeout(() => {
      if (isScanning) {
        setLastScan(new Date())
        
        const randomSlots: Slot[] = []
        if (Math.random() > 0.7) {
          const daysToAdd = Math.floor(Math.random() * 30) + 1
          const date = new Date()
          date.setDate(date.getDate() + daysToAdd)
          
          randomSlots.push({
            id: `slot-${Date.now()}`,
            date: date.toISOString().split('T')[0],
            time: `${8 + Math.floor(Math.random() * 8)}:00`,
            location: locations[Math.floor(Math.random() * locations.length)].name,
            available: true,
            embassy: embassies[Math.floor(Math.random() * embassies.length)].name
          })
        }
        
        if (randomSlots.length > 0) {
          setSlots(randomSlots)
          if (Notification.permission === 'granted') {
            new Notification('🎉 موعد متاح!', {
              body: 'تم العثور على موعد جديد! احجز الآن.',
              icon: '/icon.png'
            })
          }
        }
        
        simulateScanning()
      }
    }, 30000 + Math.random() * 60000)
  }

  const toggleConfig = (id: string) => {
    const updated = configs.map(c => 
      c.id === id ? { ...c, active: !c.active } : c
    )
    saveConfigs(updated)
  }

  const deleteConfig = (id: string) => {
    const updated = configs.filter(c => c.id !== id)
    saveConfigs(updated)
  }

  const addConfig = () => {
    if (!newConfig.dateFrom || !newConfig.dateTo) return
    
    const config: MonitorConfig = {
      id: `config-${Date.now()}`,
      embassy: newConfig.embassy,
      location: newConfig.location,
      visaType: newConfig.visaType,
      dateFrom: newConfig.dateFrom,
      dateTo: newConfig.dateTo,
      notifications: newConfig.notifications,
      active: true
    }
    
    saveConfigs([...configs, config])
    setShowAddModal(false)
    setNewConfig({
      embassy: 'france',
      location: 'algiers',
      visaType: 'tourist',
      dateFrom: '',
      dateTo: '',
      notifications: { push: true, email: false, whatsapp: true }
    })
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        new Notification('تم تفعيل الإشعارات!', {
          body: 'سنخبرك فوراً عند توفر موعد.',
        })
      }
    }
  }

  if (!isPremium) {
    return (
      <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold mb-2 gradient-text">متابعة مواعيد السفارات</h2>
            <p className="text-white/60 text-sm">احصل على إشعار فور توفر موعد</p>
          </motion.div>

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
          <h2 className="text-2xl font-bold mb-2 gradient-text">متابعة مواعيد السفارات</h2>
          <p className="text-white/60 text-sm">نراقب المواعيد ونخبرك فور توفرها</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-3 h-3 rounded-full',
                isScanning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
              )} />
              <span className="text-sm font-medium">
                {isScanning ? 'المراقبة نشطة' : 'المراقبة متوقفة'}
              </span>
            </div>
            
            {lastScan && (
              <span className="text-xs text-white/50">
                آخر فحص: {lastScan.toLocaleTimeString()}
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={isScanning ? stopMonitoring : startMonitoring}
              className={cn(
                'flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2',
                isScanning 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50' 
                  : 'neon-button'
              )}
            >
              {isScanning ? (
                <>
                  <PowerOff size={18} />
                  إيقاف
                </>
              ) : (
                <>
                  <Power size={18} />
                  بدء المراقبة
                </>
              )}
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={requestNotificationPermission}
              className="px-4 py-3 rounded-xl glass-card-hover flex items-center justify-center"
              title="تفعيل الإشعارات"
            >
              <BellRing size={18} className="text-neon-cyan" />
            </motion.button>
          </div>
        </motion.div>

        {slots.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="glass-card border-2 border-green-500/50 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
                  <Bell className="text-green-400" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-green-400">🎉 موعد متاح!</h3>
                  <p className="text-xs text-white/60">لقد تم العثور على موعد. احجز الآن!</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {slots.map((slot) => (
                  <div key={slot.id} className="bg-black/20 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">{slot.date}</p>
                        <p className="text-xs text-white/60">{slot.time} - {slot.location}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                        متاح
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSlots([])}
                className="w-full mt-3 py-2 rounded-lg bg-white/10 text-sm"
              >
                إغلاق
              </motion.button>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4 flex items-center justify-between"
        >
          <h3 className="font-bold">المتابعة ({configs.length})</h3>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-neon-cyan/20 text-neon-cyan text-sm flex items-center gap-2"
          >
            <RefreshCw size={16} />
            إضافة
          </motion.button>
        </motion.div>

        {configs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-8 text-center"
          >
            <Calendar className="mx-auto mb-4 text-white/30" size={48} />
            <h3 className="font-bold mb-2">لا توجد متابعة</h3>
            <p className="text-sm text-white/60 mb-4">
              أضف سفارة لمتابعتها
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="neon-button px-6 py-3"
            >
              إضافة متابعة
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {configs.map((config) => {
              const embassy = embassies.find(e => e.id === config.embassy)
              const location = locations.find(l => l.id === config.location)
              
              return (
                <motion.div
                  key={config.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{embassy?.flag}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold">{embassy?.name}</h4>
                        {config.active && isScanning && (
                          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-white/60">
                        {location?.name} • {visaTypes.find(v => v.id === config.visaType)?.name}
                      </p>
                      <p className="text-xs text-white/50 mt-1">
                        {config.dateFrom} - {config.dateTo}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {config.notifications.push && (
                          <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs">
                            <Smartphone size={12} className="inline mr-1" />
                            Push
                          </span>
                        )}
                        {config.notifications.whatsapp && (
                          <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs">
                            WhatsApp
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleConfig(config.id)}
                        className={cn(
                          'p-2 rounded-lg',
                          config.active 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-white/10 text-white/40'
                        )}
                      >
                        <Power size={18} />
                      </motion.button>
                      
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteConfig(config.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="glass-card w-full max-w-md p-6 rounded-t-2xl sm:rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-bold text-lg mb-4">إضافة متابعة جديدة</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">السفارة</label>
                  <select
                    value={newConfig.embassy}
                    onChange={(e) => setNewConfig({ ...newConfig, embassy: e.target.value })}
                    className="input-field"
                  >
                    {embassies.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.flag} {e.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-white/70 mb-2 block">الموقع</label>
                  <select
                    value={newConfig.location}
                    onChange={(e) => setNewConfig({ ...newConfig, location: e.target.value })}
                    className="input-field"
                  >
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-white/70 mb-2 block">نوع التأشيرة</label>
                  <select
                    value={newConfig.visaType}
                    onChange={(e) => setNewConfig({ ...newConfig, visaType: e.target.value })}
                    className="input-field"
                  >
                    {visaTypes.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-white/70 mb-2 block">من تاريخ</label>
                    <input
                      type="date"
                      value={newConfig.dateFrom}
                      onChange={(e) => setNewConfig({ ...newConfig, dateFrom: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/70 mb-2 block">إلى تاريخ</label>
                    <input
                      type="date"
                      value={newConfig.dateTo}
                      onChange={(e) => setNewConfig({ ...newConfig, dateTo: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-white/70 mb-2 block">نوع الإشعارات</label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newConfig.notifications.push}
                        onChange={(e) => setNewConfig({
                          ...newConfig,
                          notifications: { ...newConfig.notifications, push: e.target.checked }
                        })}
                        className="w-4 h-4"
                      />
                      <Smartphone size={16} />
                      Push
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newConfig.notifications.whatsapp}
                        onChange={(e) => setNewConfig({
                          ...newConfig,
                          notifications: { ...newConfig.notifications, whatsapp: e.target.checked }
                        })}
                        className="w-4 h-4"
                      />
                      WhatsApp
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl glass-card-hover"
                >
                  إلغاء
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={addConfig}
                  disabled={!newConfig.dateFrom || !newConfig.dateTo}
                  className="flex-1 py-3 rounded-xl neon-button disabled:opacity-50"
                >
                  إضافة
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 glass-card p-4"
        >
          <h4 className="font-bold mb-3 flex items-center gap-2">
            <AlertCircle size={16} className="text-yellow-400" />
            معلومات مهمة
          </h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-neon-cyan rounded-full mt-1.5 flex-shrink-0" />
              المواعيد تنفد بسرعة - كن مستعداً
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-neon-cyan rounded-full mt-1.5 flex-shrink-0" />
              تفعيل الإشعارات يضمن عدم فقدان فرصة
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-neon-cyan rounded-full mt-1.5 flex-shrink-0" />
              الفحص كل 30-60 ثانية
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

export default SlotMonitor
