'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { MapPin, Phone, Mail, Globe, ExternalLink } from 'lucide-react'
import { useLanguage } from './LanguageProvider'

interface EmbassyData {
  countryCode: string
  address: string
  phone: string
  email: string
  website: string
  hoursAr: string
  hoursEn: string
}

const embassiesData: EmbassyData[] = [
  { countryCode: 'FR', address: 'شارع محمد خميستي، الجزائر', phone: '+213 21 69 12 12', email: 'ambafrance@ambafrance-dz.org', website: 'https://dz.ambafrance.org', hoursAr: 'الأحد - الخميس 8:00 - 16:00', hoursEn: 'Sun - Thu 8:00 - 16:00' },
  { countryCode: 'DE', address: 'شارع هواري بومدين، الجزائر', phone: '+213 21 60 40 00', email: 'info@algerien.diplo.de', website: 'https://algerien.diplo.dz', hoursAr: 'الأحد - الخميس 8:00 - 16:00', hoursEn: 'Sun - Thu 8:00 - 16:00' },
  { countryCode: 'ES', address: 'شارع ديليجاسيون، الجزائر', phone: '+213 21 60 53 33', email: 'emb.algeria@maec.es', website: 'https://www.exteriores.gob.es/embajadas/argel', hoursAr: 'الأحد - الخميس 9:00 - 14:00', hoursEn: 'Sun - Thu 9:00 - 14:00' },
  { countryCode: 'UK', address: 'شارع هوفن، الجزائر', phone: '+213 21 23 00 00', email: 'enquiries.algiers@fco.gov.uk', website: 'https://www.gov.uk/world/algeria', hoursAr: 'الأحد - الخميس 8:00 - 16:00', hoursEn: 'Sun - Thu 8:00 - 16:00' },
  { countryCode: 'US', address: 'شارع باب الوادي، الجزائر', phone: '+213 21 60 95 55', email: 'ACSAlgiers@state.gov', website: 'https://dz.usembassy.gov', hoursAr: 'الأحد - الخميس 8:00 - 17:00', hoursEn: 'Sun - Thu 8:00 - 17:00' },
  { countryCode: 'CA', address: 'شارع ميزون بلانش، الجزائر', phone: '+213 21 68 74 00', email: 'algiers@international.gc.ca', website: 'https://www.canada.ca/algeria', hoursAr: 'الأحد - الخميس 8:00 - 16:00', hoursEn: 'Sun - Thu 8:00 - 16:00' },
  { countryCode: 'IT', address: 'شارع أنفال، الجزائر', phone: '+213 21 47 00 00', email: 'ambasciata.algiers@esteri.it', website: 'https://ambalgiers.esteri.it', hoursAr: 'الأحد - الخميس 8:30 - 15:30', hoursEn: 'Sun - Thu 8:30 - 15:30' },
  { countryCode: 'TR', address: 'شارع القمر، الجزائر', phone: '+213 21 54 54 54', email: 'algiers@emb.mfa.gov.tr', website: 'https://algiers.be.mfa.gov.tr', hoursAr: 'الأحد - الخميس 9:00 - 17:00', hoursEn: 'Sun - Thu 9:00 - 17:00' },
]

const countries = [
  { code: 'all', nameAr: 'جميع الدول', nameEn: 'All Countries', flag: '🌍' },
  { code: 'FR', nameAr: 'فرنسا', nameEn: 'France', flag: '🇫🇷' },
  { code: 'DE', nameAr: 'ألمانيا', nameEn: 'Germany', flag: '🇩🇪' },
  { code: 'ES', nameAr: 'إسبانيا', nameEn: 'Spain', flag: '🇪🇸' },
  { code: 'UK', nameAr: 'المملكة المتحدة', nameEn: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', nameAr: 'الولايات المتحدة', nameEn: 'United States', flag: '🇺🇸' },
  { code: 'CA', nameAr: 'كندا', nameEn: 'Canada', flag: '🇨🇦' },
  { code: 'IT', nameAr: 'إيطاليا', nameEn: 'Italy', flag: '🇮🇹' },
  { code: 'TR', nameAr: 'تركيا', nameEn: 'Turkey', flag: '🇹🇷' },
]

const getCountryName = (c: typeof countries[0], lang: string) =>
  lang === 'ar' ? c.nameAr : c.nameEn

export function EmbassyLocator() {
  const { t, language } = useLanguage()
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [selectedEmbassy, setSelectedEmbassy] = useState<EmbassyData | null>(null)

  const filteredEmbassies = selectedCountry === 'all' 
    ? embassiesData 
    : embassiesData.filter(e => e.countryCode === selectedCountry)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h2 className="text-2xl font-bold mb-2 gradient-text">{t('embassyLocations')}</h2>
          <p className="text-white/60 text-sm">{t('findEmbassy')}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="glass-card p-4 mb-6"
        >
          <label className="text-xs text-white/50 mb-2 block">{t('selectCountry')}</label>
          <select 
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="input-field text-sm w-full"
          >
            {countries.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {getCountryName(c, language)}</option>
            ))}
          </select>
        </motion.div>

        <div className="space-y-3">
            {filteredEmbassies.map((embassy, index) => {
              const country = countries.find(c => c.code === embassy.countryCode)
              return (
              <motion.div
                key={embassy.countryCode}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedEmbassy(embassy)}
                className="glass-card p-4 cursor-pointer hover:border-neon-cyan/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-neon-cyan/20 rounded-lg">
                    <MapPin size={20} className="text-neon-cyan" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">{country ? getCountryName(country, language) : embassy.countryCode}</h4>
                    <p className="text-sm text-white/60">{language === 'ar' ? 'الجزائر' : 'Algiers'}</p>
                    <p className="text-xs text-white/40 mt-1">{embassy.address}</p>
                  </div>
                </div>
              </motion.div>
            )})}
        </div>

        {filteredEmbassies.length === 0 && (
          <div className="glass-card p-6 text-center">
            <MapPin size={32} className="text-white/40 mx-auto mb-2" />
            <p className="text-white/60">{t('noEmbassiesFound')}</p>
          </div>
        )}

        {selectedEmbassy && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEmbassy(null)}
          >
            <div className="glass-card p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              {(() => {
                const country = countries.find(c => c.code === selectedEmbassy.countryCode)
                return (
              <>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="text-neon-cyan" />
                {country ? getCountryName(country, language) : selectedEmbassy.countryCode}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-white/40 mt-1" />
                  <div>
                    <p className="text-sm font-bold">{language === 'ar' ? 'الجزائر' : 'Algiers'}</p>
                    <p className="text-xs text-white/60">{selectedEmbassy.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-white/40" />
                  <a href={`tel:${selectedEmbassy.phone}`} className="text-sm text-neon-cyan">
                    {selectedEmbassy.phone}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-white/40" />
                  <a href={`mailto:${selectedEmbassy.email}`} className="text-sm text-neon-cyan">
                    {selectedEmbassy.email}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-white/40" />
                  <a href={selectedEmbassy.website} target="_blank" rel="noopener noreferrer" className="text-sm text-neon-cyan flex items-center gap-1">
                    {t('officialWebsite')}
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div className="p-3 bg-white/5 rounded-xl">
                  <p className="text-xs text-white/40">{t('openingHours')}</p>
                  <p className="text-sm">{language === 'ar' ? selectedEmbassy.hoursAr : selectedEmbassy.hoursEn}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button 
                  onClick={() => setSelectedEmbassy(null)}
                  className="flex-1 py-3 glass-card-hover rounded-xl"
                >
                  {t('close')}
                </button>
                <button 
                  onClick={() => {
                    window.open(selectedEmbassy.website, '_blank')
                  }}
                  className="flex-1 neon-button rounded-xl"
                >
                  {t('visitWebsite')}
                </button>
              </div>
              </>
              )})()}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
