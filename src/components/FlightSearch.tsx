'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Plane, Search, ArrowRight, Clock, Shield } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { useLanguage } from './LanguageProvider'

interface FlightData {
  id: string
  airline: string
  toAr: string
  toEn: string
  departure: string
  arrival: string
  duration: string
  price: number
  stops: number
}

const mockFlightsData: FlightData[] = [
  { id: '1', airline: 'Air France', toAr: 'باريس', toEn: 'Paris', departure: '08:00', arrival: '12:30', duration: '2h 30m', price: 350, stops: 0 },
  { id: '2', airline: 'Air Algeria', toAr: 'باريس', toEn: 'Paris', departure: '10:00', arrival: '14:45', duration: '2h 45m', price: 280, stops: 0 },
  { id: '3', airline: 'Lufthansa', toAr: 'برلين', toEn: 'Berlin', departure: '14:00', arrival: '20:30', duration: '4h 30m', price: 420, stops: 1 },
  { id: '4', airline: 'Iberia', toAr: 'مدريد', toEn: 'Madrid', departure: '06:30', arrival: '09:00', duration: '1h 30m', price: 250, stops: 0 },
  { id: '5', airline: 'British Airways', toAr: 'لندن', toEn: 'London', departure: '11:00', arrival: '16:00', duration: '3h 00m', price: 480, stops: 0 },
  { id: '6', airline: 'ITA Airways', toAr: 'روما', toEn: 'Rome', departure: '16:30', arrival: '20:00', duration: '1h 30m', price: 320, stops: 0 },
] as any

const countries = [
  { code: 'FR', nameAr: 'فرنسا', nameEn: 'France', cityAr: 'باريس', cityEn: 'Paris', flag: '🇫🇷' },
  { code: 'DE', nameAr: 'ألمانيا', nameEn: 'Germany', cityAr: 'برلين', cityEn: 'Berlin', flag: '🇩🇪' },
  { code: 'ES', nameAr: 'إسبانيا', nameEn: 'Spain', cityAr: 'مدريد', cityEn: 'Madrid', flag: '🇪🇸' },
  { code: 'IT', nameAr: 'إيطاليا', nameEn: 'Italy', cityAr: 'روما', cityEn: 'Rome', flag: '🇮🇹' },
  { code: 'UK', nameAr: 'المملكة المتحدة', nameEn: 'United Kingdom', cityAr: 'لندن', cityEn: 'London', flag: '🇬🇧' },
]

const getCountryCity = (c: typeof countries[0], lang: string) =>
  lang === 'ar' ? c.cityAr : c.cityEn
const getFlightDestination = (f: any, lang: string) =>
  lang === 'ar' ? f.toAr : f.toEn

export function FlightSearch() {
  const { t, language } = useLanguage()
  const { membership } = useVisaStore()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('FR')
  const [departure, setDeparture] = useState('')
  const [passengers, setPassengers] = useState('1')
  const [selectedFlight, setSelectedFlight] = useState<any>(null)

  const isPremium = membership?.tier === 'premium'

  const destination = countries.find(c => c.code === to)
  const filteredFlights = mockFlightsData.filter(f => 
    (language === 'ar' ? f.toAr : f.toEn).toLowerCase().includes(getCountryCity(destination!, language).toLowerCase())
  )

  if (!isPremium) {
    return (
      <div className="glass-card p-6 text-center">
        <Plane size={40} className="text-neon-cyan mx-auto mb-3" />
        <h3 className="font-bold mb-2">{t('flightSearch')}</h3>
        <p className="text-white/60 text-sm mb-4">{t('premiumOnly')}</p>
        <button className="neon-button px-6 py-2 rounded-xl text-sm">
          {t('upgradeNow')}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h2 className="text-2xl font-bold mb-2 gradient-text">{t('flightSearch')}</h2>
          <p className="text-white/60 text-sm">{t('flightSearchDesc')}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="glass-card p-4 mb-6 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/50 mb-1 block">{t('from')}</label>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="input-field text-sm w-full"
              />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">{t('to')}</label>
              <select 
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="input-field text-sm w-full"
              >
                {countries.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {getCountryCity(c, language)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/50 mb-1 block">{t('departureDate')}</label>
              <input
                type="date"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                className="input-field text-sm w-full"
              />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">{t('passengers')}</label>
              <input
                type="number"
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                min="1"
                className="input-field text-sm w-full"
              />
            </div>
          </div>

          <button className="w-full neon-button flex items-center justify-center gap-2">
            <Search size={18} />
            {t('searchFlights')}
          </button>
        </motion.div>

        <div className="space-y-3">
          {filteredFlights.map((flight, index) => (
            <motion.div
              key={flight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedFlight(flight)}
              className="glass-card p-4 cursor-pointer hover:border-neon-cyan/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{flight.airline}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-bold">{flight.departure}</span>
                    <ArrowRight size={14} className="text-white/40" />
                    <span className="text-lg font-bold">{flight.arrival}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={12} className="text-white/40" />
                    <span className="text-xs text-white/60">{flight.duration}</span>
                    {flight.stops > 0 && (
                      <span className="text-xs text-yellow-400">({flight.stops} {t('stops')})</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-neon-magenta">${flight.price}</p>
                  <p className="text-xs text-white/40">{t('perTraveler')}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredFlights.length === 0 && (
          <div className="glass-card p-6 text-center">
            <Plane size={32} className="text-white/40 mx-auto mb-2" />
            <p className="text-white/60">{t('noFlightsFound')}</p>
          </div>
        )}

        {selectedFlight && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedFlight(null)}
          >
            <div className="glass-card p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-2">{selectedFlight.airline}</h3>
               
              <div className="flex items-center justify-center gap-4 py-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedFlight.departure}</p>
                  <p className="text-xs text-white/40">{language === 'ar' ? 'الجزائر' : 'Algiers'}</p>
                </div>
                <div className="flex-1 flex items-center justify-center gap-2">
                  <div className="h-px flex-1 bg-white/20"></div>
                  <Plane size={16} className="text-neon-cyan" />
                  <div className="h-px flex-1 bg-white/20"></div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedFlight.arrival}</p>
                  <p className="text-xs text-white/40">{getFlightDestination(selectedFlight, language)}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">{t('duration')}</span>
                  <span>{selectedFlight.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">{t('stops')}</span>
                  <span>{selectedFlight.stops === 0 ? t('direct') : `${selectedFlight.stops} ${t('stop')}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">{t('passengers')}</span>
                  <span>{passengers}</span>
                </div>
              </div>

              <div className="p-4 bg-neon-cyan/10 rounded-xl mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">{t('total')}</span>
                  <span className="text-2xl font-bold text-neon-magenta">${selectedFlight.price * parseInt(passengers)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedFlight(null)}
                  className="flex-1 py-3 glass-card-hover rounded-xl"
                >
                  {t('cancel')}
                </button>
                <button 
                  onClick={() => {
                    alert(t('redirectToBooking'))
                    setSelectedFlight(null)
                  }}
                  className="flex-1 neon-button rounded-xl"
                >
                  {t('bookNow')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
