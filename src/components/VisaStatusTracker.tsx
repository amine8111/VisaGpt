'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Search, CheckCircle, Clock, XCircle, Plane, AlertCircle } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { useLanguage } from './LanguageProvider'

interface Application {
  id: string
  country: string
  visaType: string
  submittedDate: string
  status: 'pending' | 'processing' | 'approved' | 'rejected'
  embassy: string
}

const mockApplications: Application[] = [
  { id: '1', country: 'France', visaType: 'Tourist', submittedDate: '2026-03-01', status: 'processing', embassy: 'Paris' },
  { id: '2', country: 'Germany', visaType: 'Business', submittedDate: '2026-02-15', status: 'approved', embassy: 'Berlin' },
]

const countries = [
  { code: 'FR', name: 'France', nameAr: 'فرنسا', nameFr: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', nameAr: 'ألمانيا', nameFr: 'Allemagne', flag: '🇩🇪' },
  { code: 'ES', name: 'Spain', nameAr: 'إسبانيا', nameFr: 'Espagne', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', nameAr: 'إيطاليا', nameFr: 'Italie', flag: '🇮🇹' },
  { code: 'UK', name: 'UK', nameAr: 'المملكة المتحدة', nameFr: 'Royaume-Uni', flag: '🇬🇧' },
  { code: 'US', name: 'USA', nameAr: 'الولايات المتحدة', nameFr: 'États-Unis', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', nameAr: 'كندا', nameFr: 'Canada', flag: '🇨🇦' },
]

const visaTypes = [
  { code: 'tourist', name: 'Tourist', nameAr: 'سياحة', nameFr: 'Tourisme' },
  { code: 'business', name: 'Business', nameAr: 'عمل', nameFr: 'Affaires' },
  { code: 'student', name: 'Student', nameAr: 'دراسة', nameFr: 'Études' },
  { code: 'work', name: 'Work', nameAr: 'عمل', nameFr: 'Travail' },
]

export function VisaStatusTracker() {
  const { membership } = useVisaStore()
  const { t, language } = useLanguage()
  const [applications, setApplications] = useState<Application[]>(mockApplications)
  const [searchId, setSearchId] = useState('')
  const [newApp, setNewApp] = useState({ country: 'FR', visaType: 'tourist', embassy: '' })
  const [showAdd, setShowAdd] = useState(false)

  const isPremium = membership?.tier === 'gold' || membership?.tier === 'premium'

  const getLocalizedCountry = (code: string) => {
    const country = countries.find(c => c.code === code)
    if (!country) return code
    if (language === 'ar') return country.nameAr
    if (language === 'fr') return country.nameFr
    return country.name
  }

  const getLocalizedVisaType = (code: string) => {
    const visa = visaTypes.find(v => v.code === code)
    if (!visa) return code
    if (language === 'ar') return visa.nameAr
    if (language === 'fr') return visa.nameFr
    return visa.name
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="text-green-400" />
      case 'rejected': return <XCircle className="text-red-400" />
      case 'processing': return <Clock className="text-yellow-400" />
      default: return <Clock className="text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return t('approved')
      case 'rejected': return t('rejected')
      case 'processing': return t('processingStatus')
      default: return t('pending')
    }
  }

  const handleAddApplication = () => {
    const app: Application = {
      id: Date.now().toString(),
      country: getLocalizedCountry(newApp.country),
      visaType: getLocalizedVisaType(newApp.visaType),
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      embassy: newApp.embassy || t('notSpecified'),
    }
    setApplications([app, ...applications])
    setShowAdd(false)
    setNewApp({ country: 'FR', visaType: 'tourist', embassy: '' })
  }

  if (!isPremium) {
    return (
      <div className="glass-card p-6 text-center">
        <AlertCircle size={40} className="text-neon-cyan mx-auto mb-3" />
        <h3 className="font-bold mb-2">{t('visaStatusTracker')}</h3>
        <p className="text-white/60 text-sm mb-4">{t('goldPremiumOnly')}</p>
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
          <h2 className="text-2xl font-bold mb-2 gradient-text">{t('visaStatusTracker')}</h2>
          <p className="text-white/60 text-sm">{t('visaStatusTrackerDesc')}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="glass-card p-4 mb-6"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder={t('searchByApplicationId')}
              className="input-field flex-1 text-sm"
            />
            <button 
              onClick={() => setShowAdd(!showAdd)}
              className="neon-button px-4 py-2 rounded-xl text-sm"
            >
              + {t('new')}
            </button>
          </div>
        </motion.div>

        {showAdd && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }}
            className="glass-card p-4 mb-6"
          >
            <h3 className="font-bold mb-4">{t('addNewApplication')}</h3>
            <div className="space-y-3">
              <select
                value={newApp.country}
                onChange={(e) => setNewApp({ ...newApp, country: e.target.value })}
                className="input-field text-sm w-full"
              >
                {countries.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {language === 'ar' ? c.nameAr : language === 'fr' ? c.nameFr : c.name}</option>
                ))}
              </select>
              <select
                value={newApp.visaType}
                onChange={(e) => setNewApp({ ...newApp, visaType: e.target.value })}
                className="input-field text-sm w-full"
              >
                {visaTypes.map(v => (
                  <option key={v.code} value={v.code}>{language === 'ar' ? v.nameAr : language === 'fr' ? v.nameFr : v.name}</option>
                ))}
              </select>
              <input
                type="text"
                value={newApp.embassy}
                onChange={(e) => setNewApp({ ...newApp, embassy: e.target.value })}
                placeholder={t('consulateEmbassyName')}
                className="input-field text-sm w-full"
              />
              <button onClick={handleAddApplication} className="w-full neon-button py-2 rounded-xl text-sm">
                {t('addApplication')}
              </button>
            </div>
          </motion.div>
        )}

        <div className="space-y-3">
          {applications
            .filter(a => !searchId || a.id.includes(searchId))
            .map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold">{app.country}</h4>
                  <p className="text-sm text-white/60">{app.visaType}</p>
                  <p className="text-xs text-white/40 mt-1">{t('submissionDate')}: {app.submittedDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(app.status)}
                  <span className={`text-sm ${
                    app.status === 'approved' ? 'text-green-400' :
                    app.status === 'rejected' ? 'text-red-400' :
                    app.status === 'processing' ? 'text-yellow-400' : 'text-gray-400'
                  }`}>
                    {getStatusText(app.status)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Plane size={12} />
                <span>{app.embassy}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {applications.length === 0 && (
          <div className="glass-card p-6 text-center">
            <AlertCircle size={32} className="text-white/40 mx-auto mb-2" />
            <p className="text-white/60">{t('noApplications')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
