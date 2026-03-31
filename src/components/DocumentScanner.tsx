'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Scan, CheckCircle, AlertTriangle, XCircle, Upload, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

interface CheckResult {
  nameAr: string
  nameEn: string
  nameFr: string
  status: 'pass' | 'warning' | 'fail'
  messageAr: string
  messageEn: string
  messageFr: string
}

interface DocumentCheck {
  id: string
  nameAr: string
  nameEn: string
  nameFr: string
  checks: CheckResult[]
  overallScore: number
}

const mockResultsData: DocumentCheck[] = [
  {
    id: 'passport',
    nameAr: 'جواز السفر',
    nameEn: 'Passport',
    nameFr: 'Passeport',
    overallScore: 95,
    checks: [
      { nameAr: 'صلاحية جواز السفر', nameEn: 'Passport validity', nameFr: 'Validité du passeport', status: 'pass', messageAr: 'صالحة حتى 2028', messageEn: 'Valid until 2028', messageFr: 'Valide jusqu\'en 2028' },
      { nameAr: 'صفحة البيانات واضحة', nameEn: 'Data page clear', nameFr: 'Page de données claire', status: 'pass', messageAr: 'جميع البيانات مقروءة', messageEn: 'All data is readable', messageFr: 'Toutes les données sont lisibles' },
      { nameAr: 'صورة الجواز', nameEn: 'Passport photo', nameFr: 'Photo du passeport', status: 'pass', messageAr: 'صالحة للاستخدام', messageEn: 'Valid for use', messageFr: 'Valide pour utilisation' },
    ],
  },
  {
    id: 'bank',
    nameAr: 'كشف الحساب البنكي',
    nameEn: 'Bank Statement',
    nameFr: 'Relevé bancaire',
    overallScore: 72,
    checks: [
      { nameAr: 'الحد الأدنى للرصيد', nameEn: 'Minimum balance', nameFr: 'Solde minimum', status: 'warning', messageAr: 'الرصيد 180,000 دج - يُنصح بـ 200,000 دج', messageEn: 'Balance 180,000 DZD - recommended 200,000 DZD', messageFr: 'Solde 180 000 DZD - recommandé 200 000 DZD' },
      { nameAr: 'مدة الكشوف', nameEn: 'Statement period', nameFr: 'Période des relevés', status: 'pass', messageAr: '6 أشهر كاملة', messageEn: 'Full 6 months', messageFr: '6 mois complets' },
      { nameAr: 'حركات غير عادية', nameEn: 'Unusual transactions', nameFr: 'Transactions inhabituelles', status: 'fail', messageAr: 'إيداع كبير 800,000 دج قد يُعتبر مشبوه', messageEn: 'Large deposit 800,000 DZD may be considered suspicious', messageFr: 'Gros dépôt de 800 000 DZD peut être considéré suspect' },
    ],
  },
  {
    id: 'employment',
    nameAr: 'شهادة العمل',
    nameEn: 'Employment Certificate',
    nameFr: 'Attestation d\'emploi',
    overallScore: 88,
    checks: [
      { nameAr: 'بياناتEmployer', nameEn: 'Employer data', nameFr: 'Données employeur', status: 'pass', messageAr: 'الاسم والعنوان صحيحان', messageEn: 'Name and address correct', messageFr: 'Nom et adresse corrects' },
      { nameAr: 'التاريخ', nameEn: 'Date', nameFr: 'Date', status: 'pass', messageAr: 'موقعة حديثاً', messageEn: 'Recently signed', messageFr: 'Signé récemment' },
      { nameAr: 'الختم', nameEn: 'Stamp', nameFr: 'Cachet', status: 'warning', messageAr: 'الختم غير واضح - يُنصح بإعادة التوقيع', messageEn: 'Stamp unclear - recommend re-signing', messageFr: 'Cachet peu clair - recommandé de resigné' },
    ],
  },
]

export function DocumentScanner() {
  const { t, language } = useLanguage()
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [activeTab, setActiveTab] = useState<'results' | 'upload'>('results')

  const getLocalizedText = (item: { ar: string; en: string; fr: string }) => {
    if (language === 'ar') return item.ar
    if (language === 'fr') return item.fr
    return item.en
  }

  const mockResults = mockResultsData.map(doc => ({
    ...doc,
    name: getLocalizedText({ ar: doc.nameAr, en: doc.nameEn, fr: doc.nameFr }),
    checks: doc.checks.map(check => ({
      ...check,
      name: getLocalizedText({ ar: check.nameAr, en: check.nameEn, fr: check.nameFr }),
      message: getLocalizedText({ ar: check.messageAr, en: check.messageEn, fr: check.messageFr }),
    })),
  }))

  const handleScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      setScanComplete(true)
    }, 3000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle size={20} className="text-green-400" />
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-400" />
      case 'fail':
        return <XCircle size={20} className="text-red-400" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">{t('documentScanner')}</h2>
          <p className="text-white/60 text-sm">{t('documentScannerDesc')}</p>
        </motion.div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('results')}
            className={cn(
              'flex-1 py-3 rounded-xl font-medium transition-all',
              activeTab === 'results' ? 'neon-button' : 'glass-card-hover'
            )}
          >
            {t('results')}
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={cn(
              'flex-1 py-3 rounded-xl font-medium transition-all',
              activeTab === 'upload' ? 'neon-button' : 'glass-card-hover'
            )}
          >
            {t('uploadDocument')}
          </button>
        </div>

        {activeTab === 'upload' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="upload-zone p-8 text-center">
              <Camera className="mx-auto mb-4 text-neon-cyan" size={48} />
              <p className="font-medium mb-2">{t('takePictureOrUpload')}</p>
              <p className="text-sm text-white/50 mb-4">{t('fileFormats')}</p>
              <div className="flex gap-3 justify-center">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="neon-button flex items-center gap-2"
                >
                  <Camera size={18} />
                  {t('camera')}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="glass-card-hover py-2 px-4 flex items-center gap-2"
                >
                  <Upload size={18} />
                  {t('upload')}
                </motion.button>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleScan}
              disabled={isScanning}
              className="neon-button w-full flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  {t('scanning')}
                </>
              ) : (
                <>
                  <Scan size={18} />
                  {t('startScan')}
                </>
              )}
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {scanComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6 text-center mb-6"
              >
                <p className="text-sm text-white/60 mb-2">{t('overallResult')}</p>
                <div className="text-6xl font-bold gradient-text">85%</div>
                <p className="text-white/60 mt-2">{t('documentsAlmostReady')}</p>
              </motion.div>
            )}

            {mockResults.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">{doc.name}</h3>
                  <div className={cn('text-2xl font-bold', getScoreColor(doc.overallScore))}>
                    {doc.overallScore}%
                  </div>
                </div>
                <div className="space-y-3">
                  {doc.checks.map((check) => (
                    <div key={check.name} className="flex items-start gap-3">
                      {getStatusIcon(check.status)}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{check.name}</p>
                        <p className="text-xs text-white/50">{check.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {!scanComplete && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleScan}
                className="neon-button w-full flex items-center justify-center gap-2"
              >
                <Scan size={18} />
                {t('scanAllDocuments')}
              </motion.button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
