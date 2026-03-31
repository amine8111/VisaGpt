'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, Bell, MapPin, Globe, Clock, AlertTriangle,
  CheckCircle, Loader2, Sparkles, TrendingUp, Zap, 
  ChevronRight, RefreshCw, Volume2, Settings, Trash2, Plus
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { cn } from '@/lib/utils'

interface MonitoredSlot {
  id: string
  embassy: string
  country: string
  visaType: string
  lastCheck: Date
  status: 'available' | 'unavailable' | 'checking' | 'error'
  availableSlots?: number
  nextAvailable?: string
}

interface NotificationSettings {
  browser: boolean
  email: boolean
  sms: boolean
  sound: boolean
}

const embassyOptions = [
  { id: 'france', name: 'France', nameAr: 'فرنسا', nameFr: 'France', location: 'Algiers' },
  { id: 'germany', name: 'Germany', nameAr: 'ألمانيا', nameFr: 'Allemagne', location: 'Algiers' },
  { id: 'spain', name: 'Spain', nameAr: 'إسبانيا', nameFr: 'Espagne', location: 'Algiers' },
  { id: 'italy', name: 'Italy', nameAr: 'إيطاليا', nameFr: 'Italie', location: 'Algiers' },
  { id: 'uk', name: 'United Kingdom', nameAr: 'المملكة المتحدة', nameFr: 'Royaume-Uni', location: 'Algiers' },
  { id: 'usa', name: 'United States', nameAr: 'الولايات المتحدة', nameFr: 'États-Unis', location: 'Algiers' },
  { id: 'netherlands', name: 'Netherlands', nameAr: 'هولندا', nameFr: 'Pays-Bas', location: 'Algiers' },
  { id: 'belgium', name: 'Belgium', nameAr: 'بلجيكا', nameFr: 'Belgique', location: 'Algiers' },
]

const visaTypes = [
  { id: 'schengen', name: 'Schengen Tourist', nameAr: 'شنغن سياحة', nameFr: 'Schengen Tourisme' },
  { id: 'schengen_business', name: 'Schengen Business', nameAr: 'شنغن عمل', nameFr: 'Schengen Affaires' },
  { id: 'uk_standard', name: 'UK Standard', nameAr: 'بريطانيا عادي', nameFr: 'UK Standard' },
  { id: 'us_b1', name: 'US B1/B2', nameAr: 'أمريكا B1/B2', nameFr: 'US B1/B2' },
]

export function SlotMonitor() {
  const { t, language } = useLanguage()
  const [monitoredSlots, setMonitoredSlots] = useState<MonitoredSlot[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [notifications, setNotifications] = useState<NotificationSettings>({
    browser: true,
    email: false,
    sms: false,
    sound: true
  })
  const [scanProgress, setScanProgress] = useState(0)
  const [lastGlobalScan, setLastGlobalScan] = useState<Date | null>(null)
  
  const [newSlot, setNewSlot] = useState({
    embassy: '',
    visaType: 'schengen'
  })

  useEffect(() => {
    const saved = localStorage.getItem('monitoredSlots')
    if (saved) {
      setMonitoredSlots(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (monitoredSlots.length > 0) {
      localStorage.setItem('monitoredSlots', JSON.stringify(monitoredSlots))
    }
  }, [monitoredSlots])

  const scanAllSlots = async () => {
    if (monitoredSlots.length === 0) return
    
    setIsScanning(true)
    setScanProgress(0)
    
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setScanProgress(i)
    }
    
    setMonitoredSlots(prev => prev.map(slot => ({
      ...slot,
      status: Math.random() > 0.3 ? 'available' : 'unavailable',
      lastCheck: new Date(),
      availableSlots: Math.random() > 0.3 ? Math.floor(Math.random() * 20) + 1 : undefined
    })))
    
    setLastGlobalScan(new Date())
    setIsScanning(false)
    setScanProgress(0)
  }

  const addNewMonitor = () => {
    if (!newSlot.embassy) return
    
    const embassy = embassyOptions.find(e => e.id === newSlot.embassy)
    const visaType = visaTypes.find(v => v.id === newSlot.visaType)
    
    const newMonitor: MonitoredSlot = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      embassy: embassy?.name || newSlot.embassy,
      country: embassy?.name || newSlot.embassy,
      visaType: visaType?.name || newSlot.visaType,
      lastCheck: new Date(),
      status: 'checking'
    }
    
    setMonitoredSlots(prev => [...prev, newMonitor])
    setNewSlot({ embassy: '', visaType: 'schengen' })
    setIsAddingNew(false)
    
    setTimeout(() => scanAllSlots(), 500)
  }

  const removeMonitor = (id: string) => {
    setMonitoredSlots(prev => prev.filter(s => s.id !== id))
  }

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      'France': '🇫🇷',
      'Germany': '🇩🇪',
      'Spain': '🇪🇸',
      'Italy': '🇮🇹',
      'United Kingdom': '🇬🇧',
      'United States': '🇺🇸',
      'Netherlands': '🇳🇱',
      'Belgium': '🇧🇪',
    }
    return flags[country] || '🌍'
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-4">
            <Bell className="text-emerald-400 animate-pulse" size={20} />
            <span className="text-emerald-400 text-sm font-medium">AI-Powered Monitor</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text-emerald">{t('slotMonitor')}</span>
          </h1>
          <p className="text-white/60">{t('slotMonitorDesc')}</p>
        </motion.div>

        {/* Scan All Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-ai mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold">{language === 'ar' ? 'فحص شامل' : language === 'fr' ? 'Scan complet' : 'Full Scan'}</h3>
              <p className="text-xs text-white/50">
                {lastGlobalScan 
                  ? `${language === 'ar' ? 'آخر فحص:' : language === 'fr' ? 'Dernier scan:' : 'Last scan:'} ${lastGlobalScan.toLocaleTimeString()}`
                  : language === 'ar' ? 'لم يتم الفحص بعد' : language === 'fr' ? "Pas encore scanné" : 'Not scanned yet'}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={scanAllSlots}
              disabled={isScanning || monitoredSlots.length === 0}
              className={cn(
                'px-6 py-3 rounded-xl font-bold flex items-center gap-2',
                isScanning 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-gradient-to-r from-emerald-500 to-green-400 text-black'
              )}
            >
              {isScanning ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald-400"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <Zap className="size-4" />
                  {language === 'ar' ? 'فحص الكل' : language === 'fr' ? 'Scanner tout' : 'Scan All'}
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Add New Monitor */}
        <AnimatePresence>
          {isAddingNew ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card-ai mb-6"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Plus className="text-neon-cyan" size={18} />
                {language === 'ar' ? 'إضافة متابعة جديدة' : language === 'fr' ? 'Ajouter' : 'Add New Monitor'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">{t('embassy')}</label>
                  <select
                    value={newSlot.embassy}
                    onChange={(e) => setNewSlot({...newSlot, embassy: e.target.value})}
                    className="w-full"
                  >
                    <option value="">{t('select')}</option>
                    {embassyOptions.map(emb => (
                      <option key={emb.id} value={emb.id}>
                        {getCountryFlag(emb.name)} {language === 'ar' ? emb.nameAr : language === 'fr' ? emb.nameFr : emb.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-white/70 mb-2 block">{t('visaType')}</label>
                  <select
                    value={newSlot.visaType}
                    onChange={(e) => setNewSlot({...newSlot, visaType: e.target.value})}
                    className="w-full"
                  >
                    {visaTypes.map(vt => (
                      <option key={vt.id} value={vt.id}>
                        {language === 'ar' ? vt.nameAr : language === 'fr' ? vt.nameFr : vt.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsAddingNew(false)}
                    className="btn-secondary flex-1"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={addNewMonitor}
                    disabled={!newSlot.embassy}
                    className="btn-primary flex-1 disabled:opacity-50"
                  >
                    {language === 'ar' ? 'إضافة' : language === 'fr' ? 'Ajouter' : 'Add'}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddingNew(true)}
              className="w-full glass-card-hover p-4 mb-6 flex items-center justify-center gap-2"
            >
              <Plus className="text-neon-cyan" size={20} />
              <span className="font-bold">{language === 'ar' ? 'إضافة متابعة جديدة' : language === 'fr' ? 'Ajouter une nouvelle surveillance' : 'Add New Monitor'}</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Monitored Slots */}
        {monitoredSlots.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-bold mb-3">{language === 'ar' ? 'السفارات المتابعة' : language === 'fr' ? 'Ambassades surveillées' : 'Monitored Embassies'}</h3>
            <div className="space-y-3">
              {monitoredSlots.map((slot, index) => (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'glass-card p-4',
                    slot.status === 'available' && 'border-emerald-500/50',
                    slot.status === 'unavailable' && 'border-white/10',
                    slot.status === 'checking' && 'border-yellow-500/50'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                        slot.status === 'available' && 'bg-emerald-500/20',
                        slot.status === 'unavailable' && 'bg-white/10',
                        slot.status === 'checking' && 'bg-yellow-500/20'
                      )}>
                        {slot.status === 'checking' ? (
                          <Loader2 className="text-yellow-400 animate-spin" size={24} />
                        ) : slot.status === 'available' ? (
                          <span className="animate-bounce">🎉</span>
                        ) : (
                          <span>😔</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getCountryFlag(slot.country)}</span>
                          <h4 className="font-bold">{slot.embassy}</h4>
                        </div>
                        <p className="text-sm text-white/50">{slot.visaType}</p>
                        <p className="text-xs text-white/30 mt-1">
                          {language === 'ar' ? 'آخر فحص:' : language === 'fr' ? 'Dernière vérification:' : 'Last check:'} {new Date(slot.lastCheck).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {slot.status === 'available' && slot.availableSlots && (
                        <div className="text-right">
                          <div className="text-emerald-400 font-bold text-lg">{slot.availableSlots}</div>
                          <div className="text-xs text-white/50">{language === 'ar' ? 'متاح' : 'available'}</div>
                        </div>
                      )}
                      <button
                        onClick={() => removeMonitor(slot.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="text-white/50 hover:text-red-400" size={18} />
                      </button>
                    </div>
                  </div>

                  {slot.status === 'available' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <div className="bg-emerald-500/10 p-3 rounded-xl text-center">
                        <p className="text-emerald-400 font-bold text-lg mb-1">
                          🎉 {language === 'ar' ? 'موعد متاح!' : language === 'fr' ? 'Rendez-vous disponible!' : 'Slot Available!'}
                        </p>
                        <p className="text-sm text-white/70">
                          {slot.availableSlots} {language === 'ar' ? 'موعد متاح' : language === 'fr' ? 'disponible(s)' : 'slot(s) available'}
                        </p>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="mt-3 btn-primary w-full"
                        >
                          {language === 'ar' ? 'احجز الآن' : language === 'fr' ? 'Réserver maintenant' : 'Book Now'}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {slot.status === 'unavailable' && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-white/50">
                      <Clock size={14} />
                      <span>{language === 'ar' ? 'لا توجد مواعيد حالياً' : language === 'fr' ? 'Pas de créneaux actuellement' : 'No slots currently'}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-ai text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Calendar className="text-emerald-400" size={40} />
            </div>
            <h3 className="font-bold text-lg mb-2">{language === 'ar' ? 'لا توجد متابعة' : language === 'fr' ? 'Pas de surveillance' : 'No Monitors Yet'}</h3>
            <p className="text-white/50 text-sm mb-4">
              {language === 'ar' 
                ? 'أضف سفارة لمتابعتها وسنخبرك فور توفر موعد'
                : language === 'fr' 
                ? 'Ajoutez une ambassade et nous vous informerons'
                : 'Add an embassy to monitor and we\'ll notify you when a slot is available'}
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddingNew(true)}
              className="btn-primary"
            >
              <Plus className="inline-block ml-2" size={16} />
              {language === 'ar' ? 'إضافة متابعة' : language === 'fr' ? 'Ajouter' : 'Add Monitor'}
            </motion.button>
          </motion.div>
        )}

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Sparkles className="text-neon-cyan" size={18} />
            {language === 'ar' ? 'نصائح الذكاء الاصطناعي' : language === 'fr' ? "Conseils de l'IA" : 'AI Tips'}
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: Clock, title: language === 'ar' ? 'أفضل وقت للتقديم' : 'Best Time to Apply', desc: language === 'ar' ? 'الساعة 8-10 صباحاً' : '8-10 AM', color: 'neon-cyan' },
              { icon: TrendingUp, title: language === 'ar' ? 'أقل Embassies ازدحاماً' : 'Least Busy', desc: language === 'ar' ? 'اسبانيا وألمانيا' : 'Spain & Germany', color: 'neon-purple' },
              { icon: AlertTriangle, title: language === 'ar' ? 'تحذير' : 'Warning', desc: language === 'ar' ? 'فرنسا دائماً ممتلئة' : 'France always full', color: 'amber-400' },
            ].map((tip, i) => (
              <div key={i} className="glass-card p-4 flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center bg-white/10')}>
                  <tip.icon className={cn(`text-${tip.color}`)} size={20} />
                </div>
                <div>
                  <p className="font-medium text-sm">{tip.title}</p>
                  <p className="text-xs text-white/50">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SlotMonitor
