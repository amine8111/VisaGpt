'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Hotel, Star, MapPin, Users, Calendar, Search, ExternalLink, Shield } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { useLanguage } from './LanguageProvider'

interface HotelData {
  id: string
  nameAr: string
  nameEn: string
  locationAr: string
  locationEn: string
  rating: number
  price: number
  amenitiesAr: string[]
  amenitiesEn: string[]
}

const mockHotelsData: HotelData[] = [
  { id: '1', nameAr: 'جراند فندق باريس', nameEn: 'Grand Hotel Paris', locationAr: 'باريس, فرنسا', locationEn: 'Paris, France', rating: 5, price: 250, amenitiesAr: ['واي فاي', 'مسبح', 'صالة رياضية'], amenitiesEn: ['WiFi', 'Pool', 'Gym'] },
  { id: '2', nameAr: 'فندق بونابرت', nameEn: 'Hotel Bonaparte', locationAr: 'باريس, فرنسا', locationEn: 'Paris, France', rating: 4, price: 150, amenitiesAr: ['واي فاي', 'فطور', 'موقف'], amenitiesEn: ['WiFi', 'Breakfast', 'Parking'] },
  { id: '3', nameAr: 'إيبيس باريس سنتر', nameEn: 'Ibis Paris Center', locationAr: 'باريس, فرنسا', locationEn: 'Paris, France', rating: 3, price: 80, amenitiesAr: ['واي فاي', 'استقبال'], amenitiesEn: ['WiFi', 'Reception'] },
  { id: '4', nameAr: 'فندق برلين لوكس', nameEn: 'Hotel Berlin Lux', locationAr: 'برلين, ألمانيا', locationEn: 'Berlin, Germany', rating: 5, price: 200, amenitiesAr: ['واي فاي', 'سبا', 'مطعم'], amenitiesEn: ['WiFi', 'Spa', 'Restaurant'] },
  { id: '5', nameAr: 'بنسيون برلين', nameEn: 'Pension Berlin', locationAr: 'برلين, ألمانيا', locationEn: 'Berlin, Germany', rating: 3, price: 60, amenitiesAr: ['واي فاي'], amenitiesEn: ['WiFi'] },
  { id: '6', nameAr: 'فندق مدريد رويال', nameEn: 'Madrid Royal Hotel', locationAr: 'مدريد, إسبانيا', locationEn: 'Madrid, Spain', rating: 4, price: 180, amenitiesAr: ['واي فاي', 'مسبح', 'موقف'], amenitiesEn: ['WiFi', 'Pool', 'Parking'] },
]

const countries = [
  { code: 'FR', nameAr: 'فرنسا', nameEn: 'France', flag: '🇫🇷' },
  { code: 'DE', nameAr: 'ألمانيا', nameEn: 'Germany', flag: '🇩🇪' },
  { code: 'ES', nameAr: 'إسبانيا', nameEn: 'Spain', flag: '🇪🇸' },
  { code: 'IT', nameAr: 'إيطاليا', nameEn: 'Italy', flag: '🇮🇹' },
  { code: 'UK', nameAr: 'المملكة المتحدة', nameEn: 'United Kingdom', flag: '🇬🇧' },
]

const getCountryName = (c: typeof countries[0], lang: string) =>
  lang === 'ar' ? c.nameAr : c.nameEn

export function HotelBooking() {
  const { t, language } = useLanguage()
  const { membership } = useVisaStore()
  const [selectedCountry, setSelectedCountry] = useState('FR')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2')
  const [selectedHotel, setSelectedHotel] = useState<any>(null)

  const isPremium = membership?.tier === 'premium'

  const filteredHotels = mockHotelsData.filter(h => 
    (language === 'ar' ? h.locationAr : h.locationEn).toLowerCase().includes(
      getCountryName(countries.find(c => c.code === selectedCountry)!, language).toLowerCase()
    )
  )

  const getHotelName = (h: any) => language === 'ar' ? h.nameAr : h.nameEn
  const getHotelLocation = (h: any) => language === 'ar' ? h.locationAr : h.locationEn
  const getAmenities = (h: any) => language === 'ar' ? h.amenitiesAr : h.amenitiesEn

  if (!isPremium) {
    return (
      <div className="glass-card p-6 text-center">
        <Hotel size={40} className="text-neon-cyan mx-auto mb-3" />
        <h3 className="font-bold mb-2">{t('hotelBooking')}</h3>
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
          <h2 className="text-2xl font-bold mb-2 gradient-text">{t('hotelBooking')}</h2>
          <p className="text-white/60 text-sm">{t('hotelBookingDesc')}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="glass-card p-4 mb-6 space-y-4"
        >
          <div>
            <label className="text-xs text-white/50 mb-1 block">{t('country')}</label>
            <select 
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="input-field text-sm w-full"
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {getCountryName(c, language)}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/50 mb-1 block">{t('checkIn')}</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="input-field text-sm w-full"
              />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">{t('checkOut')}</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="input-field text-sm w-full"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-white/50 mb-1 block">{t('guests')}</label>
            <input
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              min="1"
              className="input-field text-sm w-full"
            />
          </div>

          <button className="w-full neon-button flex items-center justify-center gap-2">
            <Search size={18} />
            {t('search')}
          </button>
        </motion.div>

        <div className="space-y-3">
          {filteredHotels.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedHotel(hotel)}
              className="glass-card p-4 cursor-pointer hover:border-neon-cyan/50 transition-colors"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 rounded-xl flex items-center justify-center">
                  <Hotel size={24} className="text-neon-cyan" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold">{getHotelName(hotel)}</h4>
                      <p className="text-sm text-white/60 flex items-center gap-1">
                        <MapPin size={12} /> {getHotelLocation(hotel)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-neon-magenta">${hotel.price}</p>
                      <p className="text-xs text-white/40">{t('perNight')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: hotel.rating }).map((_, i) => (
                      <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredHotels.length === 0 && (
          <div className="glass-card p-6 text-center">
            <Hotel size={32} className="text-white/40 mx-auto mb-2" />
            <p className="text-white/60">{t('noHotelsFound')}</p>
          </div>
        )}

        {selectedHotel && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedHotel(null)}
          >
            <div className="glass-card p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-2">{getHotelName(selectedHotel)}</h3>
              <p className="text-sm text-white/60 mb-4">{getHotelLocation(selectedHotel)}</p>
              
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: selectedHotel.rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <div className="space-y-2 mb-4">
                {getAmenities(selectedHotel).map((amenity: string, i: number) => (
                  <p key={i} className="text-sm text-white/70">✓ {amenity}</p>
                ))}
              </div>

              <div className="p-4 bg-neon-cyan/10 rounded-xl mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">{t('pricePerNight')}</span>
                  <span className="text-2xl font-bold text-neon-magenta">${selectedHotel.price}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedHotel(null)}
                  className="flex-1 py-3 glass-card-hover rounded-xl"
                >
                  {t('cancel')}
                </button>
                <button 
                  onClick={() => {
                    alert(t('redirectToBooking'))
                    setSelectedHotel(null)
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
