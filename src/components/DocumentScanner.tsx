'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Scan, CheckCircle, AlertTriangle, XCircle, Upload, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckResult {
  name: string
  status: 'pass' | 'warning' | 'fail'
  message: string
}

interface DocumentCheck {
  id: string
  name: string
  checks: CheckResult[]
  overallScore: number
}

const mockResults: DocumentCheck[] = [
  {
    id: 'passport',
    name: 'جواز السفر',
    overallScore: 95,
    checks: [
      { name: 'صلاحية جواز السفر', status: 'pass', message: 'صالحة حتى 2028' },
      { name: 'صفحة البيانات واضحة', status: 'pass', message: 'جميع البيانات مقروءة' },
      { name: 'صورة الجواز', status: 'pass', message: 'صالحة للاستخدام' },
    ],
  },
  {
    id: 'bank',
    name: 'كشف الحساب البنكي',
    overallScore: 72,
    checks: [
      { name: 'الحد الأدنى للرصيد', status: 'warning', message: 'الرصيد 180,000 دج - يُنصح بـ 200,000 دج' },
      { name: 'مدة الكشوف', status: 'pass', message: '6 أشهر كاملة' },
      { name: 'حركات غير عادية', status: 'fail', message: 'إيداع كبير 800,000 دج قد يُعتبر مشبوه' },
    ],
  },
  {
    id: 'employment',
    name: 'شهادة العمل',
    overallScore: 88,
    checks: [
      { name: 'بياناتEmployer', status: 'pass', message: 'الاسم والعنوان صحيحان' },
      { name: 'التاريخ', status: 'pass', message: 'موقعة حديثاً' },
      { name: 'الختم', status: 'warning', message: 'الختم غير واضح - يُنصح بإعادة التوقيع' },
    ],
  },
]

export function DocumentScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [activeTab, setActiveTab] = useState<'results' | 'upload'>('results')

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
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">فاحص الوثائق</h2>
          <p className="text-white/60 text-sm">تحقق من امتثال وثائقك للمتطلبات</p>
        </motion.div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('results')}
            className={cn(
              'flex-1 py-3 rounded-xl font-medium transition-all',
              activeTab === 'results' ? 'neon-button' : 'glass-card-hover'
            )}
          >
            النتائج
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={cn(
              'flex-1 py-3 rounded-xl font-medium transition-all',
              activeTab === 'upload' ? 'neon-button' : 'glass-card-hover'
            )}
          >
            رفع وثيقة
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
              <p className="font-medium mb-2">التقط صورة أو ارفع ملف</p>
              <p className="text-sm text-white/50 mb-4">PNG, JPG, PDF - حتى 10MB</p>
              <div className="flex gap-3 justify-center">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="neon-button flex items-center gap-2"
                >
                  <Camera size={18} />
                  كاميرا
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="glass-card-hover py-2 px-4 flex items-center gap-2"
                >
                  <Upload size={18} />
                  رفع
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
                  جارٍ الفحص...
                </>
              ) : (
                <>
                  <Scan size={18} />
                  بدء الفحص
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
                <p className="text-sm text-white/60 mb-2">النتيجة الإجمالية</p>
                <div className="text-6xl font-bold gradient-text">85%</div>
                <p className="text-white/60 mt-2">وثائقك شبه جاهزة!</p>
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
                فحص جميع الوثائق
              </motion.button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
