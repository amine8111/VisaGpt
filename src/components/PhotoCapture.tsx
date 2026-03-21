'use client'

import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Camera, Upload, RotateCcw, Check, X, Download, AlertCircle } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

interface PhotoPreview {
  id: string
  url: string
  accepted: boolean | null
}

export function PhotoCapture() {
  const { membership, user } = useVisaStore()
  const { t } = useLanguage()
  const [hasCamera, setHasCamera] = useState<boolean | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [photos, setPhotos] = useState<PhotoPreview[]>([])
  const [uploadedPhoto, setUploadedPhoto] = useState<PhotoPreview | null>(null)
  const [showGuidelines, setShowGuidelines] = useState(true)
  const [processing, setProcessing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    checkCameraAccess()
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const checkCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setHasCamera(true)
    } catch {
      setHasCamera(false)
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    setIsCapturing(true)
    
    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    
    setProcessing(true)
    setTimeout(() => {
      const newPhoto: PhotoPreview = {
        id: Date.now().toString(),
        url: dataUrl,
        accepted: null
      }
      setPhotos(prev => [...prev, newPhoto])
      setIsCapturing(false)
      setProcessing(false)
      setShowGuidelines(false)
    }, 1000)
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setProcessing(true)
      setTimeout(() => {
        setUploadedPhoto({
          id: 'uploaded',
          url: dataUrl,
          accepted: null
        })
        setProcessing(false)
        setShowGuidelines(false)
      }, 1000)
    }
    reader.readAsDataURL(file)
  }

  const acceptPhoto = (id: string) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, accepted: true } : p))
  }

  const rejectPhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id))
  }

  const downloadPhoto = (photo: PhotoPreview) => {
    const link = document.createElement('a')
    link.download = `passport-photo-${Date.now()}.jpg`
    link.href = photo.url
    link.click()
  }

  const isPremium = membership?.tier === 'premium'

  return (
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">التقاط صورة جواز</h2>
          <p className="text-white/60 text-sm">احصل على صورة احترافية متوافق مع متطلبات التأشيرة</p>
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

        {showGuidelines && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 mb-6"
          >
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Check className="text-neon-cyan" size={18} />
              إرشادات الصورة
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-cyan rounded-full" />
                خلفية بيضاء أو فاتحة
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-cyan rounded-full" />
                وجه واضح بدون نظارات شمس
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-cyan rounded-full" />
                إضاءة متساوية بدون ظلال
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-cyan rounded-full" />
                تعبير محايد (بدون ابتسامة)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-cyan rounded-full" />
                الأبعاد: 35mm × 45mm
              </li>
            </ul>
          </motion.div>
        )}

        {hasCamera && isPremium && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative glass-card overflow-hidden rounded-xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-[3/4] object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex justify-center gap-4">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={capturePhoto}
                    disabled={isCapturing}
                    className={cn(
                      'w-16 h-16 rounded-full flex items-center justify-center border-4',
                      isCapturing ? 'border-yellow-400 bg-yellow-400/20' : 'border-white bg-white/20',
                      isCapturing && 'animate-pulse'
                    )}
                  >
                    {processing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <Camera className="text-white" size={24} />
                    )}
                  </motion.button>
                </div>
              </div>

              <div className="absolute top-4 left-4 right-4">
                <div className="bg-black/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-white/80">ضع وجهك داخل الإطار</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <label className="glass-card-hover p-4 flex items-center justify-center gap-3 cursor-pointer rounded-xl">
            <Upload size={20} className="text-neon-cyan" />
            <span className="font-medium">رفع صورة من الجهاز</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </motion.div>

        {uploadedPhoto && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <h3 className="font-bold mb-3">الصورة المرفوعة</h3>
            <div className="glass-card p-4">
              <div className="relative aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden mb-4">
                <img
                  src={uploadedPhoto.url}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadPhoto(uploadedPhoto)}
                  className="flex-1 py-2 rounded-xl neon-button flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  تحميل
                </button>
                <button
                  onClick={() => setUploadedPhoto(null)}
                  className="px-4 py-2 rounded-xl glass-card-hover flex items-center justify-center"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-bold mb-3">الصور الملتقطة ({photos.length})</h3>
            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    'glass-card p-2',
                    photo.accepted === true && 'border-2 border-green-500'
                  )}
                >
                  <div className="relative aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden mb-2">
                    <img
                      src={photo.url}
                      alt="Captured"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadPhoto(photo)}
                      className="flex-1 py-1.5 rounded-lg bg-neon-cyan/20 text-neon-cyan text-xs flex items-center justify-center gap-1"
                    >
                      <Download size={12} />
                      تحميل
                    </button>
                    {photo.accepted === null && (
                      <>
                        <button
                          onClick={() => acceptPhoto(photo.id)}
                          className="p-1.5 rounded-lg bg-green-500/20 text-green-400"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => rejectPhoto(photo.id)}
                          className="p-1.5 rounded-lg bg-red-500/20 text-red-400"
                        >
                          <X size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {photos.length > 0 && photos.some(p => p.accepted) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl bg-neon-cyan/20 border border-neon-cyan/50 text-center"
          >
            <Check className="mx-auto mb-2 text-neon-cyan" size={24} />
            <p className="font-medium">تم اختيار صورة صالحة!</p>
            <p className="text-xs text-white/60 mt-1">يمكنك استخدامها لطلب التأشيرة</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default PhotoCapture
