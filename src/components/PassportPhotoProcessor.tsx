'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Check, X, Image } from 'lucide-react'
import { useLanguage } from './LanguageProvider'

let removeBackground: any = null

if (typeof window !== 'undefined') {
  import('@imgly/background-removal').then((mod) => {
    removeBackground = mod.removeBackground
  }).catch(() => {
    removeBackground = null
  })
}

interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

type Rect = { x: number; y: number; width: number; height: number };

function getAlphaBounds(ctx: CanvasRenderingContext2D, w: number, h: number, alphaThreshold = 10, step = 2): Rect {
  const img = ctx.getImageData(0, 0, w, h).data
  let minX = w, minY = h, maxX = -1, maxY = -1
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const a = img[(y * w + x) * 4 + 3]
      if (a > alphaThreshold) {
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0 || maxY < 0) return { x: 0, y: 0, width: w, height: h }
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 }
}

function inflateRect(r: Rect, w: number, h: number, padFrac = 0.08): Rect {
  const padX = Math.round(r.width * padFrac)
  const padY = Math.round(r.height * padFrac)
  const x = Math.max(0, r.x - padX)
  const y = Math.max(0, r.y - padY)
  const right = Math.min(w, r.x + r.width + padX)
  const bottom = Math.min(h, r.y + r.height + padY)
  return { x, y, width: right - x, height: bottom - y }
}

function refineCutout(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const img = ctx.getImageData(0, 0, w, h)
  const d = img.data

  const a0 = 25
  const a1 = 210

  for (let i = 0; i < d.length; i += 4) {
    const a = d[i + 3]

    if (a <= a0) {
      d[i] = 255; d[i + 1] = 255; d[i + 2] = 255; d[i + 3] = 0
      continue
    }

    const na = Math.max(0, Math.min(255, Math.round(((a - a0) * 255) / (a1 - a0))))
    d[i + 3] = na

    const alpha = Math.max(na / 255, 1e-3)
    d[i] = Math.max(0, Math.min(255, Math.round((d[i] - (1 - alpha) * 255) / alpha)))
    d[i + 1] = Math.max(0, Math.min(255, Math.round((d[i + 1] - (1 - alpha) * 255) / alpha)))
    d[i + 2] = Math.max(0, Math.min(255, Math.round((d[i + 2] - (1 - alpha) * 255) / alpha)))
  }

  ctx.putImageData(img, 0, 0)
}

interface PassportPhotoProcessorProps {
  sourceImage: string
  cropRect?: CropRect | null
  onComplete?: (processedImage: string) => void
  onCancel?: () => void
}

export default function PassportPhotoProcessor({ sourceImage, cropRect, onComplete, onCancel }: PassportPhotoProcessorProps) {
  const { language } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastJobRef = useRef<string>('')
  const [processing, setProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [isProcessingModel, setIsProcessingModel] = useState(false)

  const getProcessing = () => language === 'ar' ? 'جاري المعالجة...' : language === 'fr' ? 'Traitement en cours...' : 'Processing...'
  const getNoFace = () => language === 'ar' ? 'لم يتم اكتشاف وجه' : language === 'fr' ? 'Visage non détecté' : 'No face detected'
  const getOriginal = () => language === 'ar' ? 'الصورة الأصلية' : language === 'fr' ? 'Photo originale' : 'Original'
  const getPassport = () => language === 'ar' ? 'صورة جواز' : language === 'fr' ? 'Photo passeport' : 'Passport Photo'
  const getBrightness = () => language === 'ar' ? 'السطوع' : language === 'fr' ? 'Luminosité' : 'Brightness'
  const getContrast = () => language === 'ar' ? 'التباين' : language === 'fr' ? 'Contraste' : 'Contrast'
  const getDownload = () => language === 'ar' ? 'تحميل' : language === 'fr' ? 'Télécharger' : 'Download'
  const getUse = () => language === 'ar' ? 'استخدام' : language === 'fr' ? 'Utiliser' : 'Use This'
  const getCancel = () => language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel'

  const processImage = async (img: HTMLImageElement, detectedFace: any = null) => {
    const jobKey = `${img.src.length}:${Date.now()}`
    if (lastJobRef.current === jobKey) {
      console.log('⏭️ Skipping duplicate processing')
      return
    }
    lastJobRef.current = jobKey
    
    try {
      setIsProcessingModel(true)
      setProcessing(true)
      console.log('🔄 Starting background removal...')
      
      const canvas = canvasRef.current
      if (!canvas) {
        console.error('Canvas not available')
        setProcessing(false)
        setIsProcessingModel(false)
        return
      }

      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) {
        console.error('Context not available')
        setProcessing(false)
        setIsProcessingModel(false)
        return
      }

      // Standard passport photo ratio: 35mm x 45mm (7:9 aspect ratio)
      const targetWidth = 665
      const targetHeight = 855
      canvas.width = targetWidth
      canvas.height = targetHeight

      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, targetWidth, targetHeight)

      const dataUrl = img.src
      
      try {
        console.log('📸 Downscaling and removing background...')
        
        const maxSide = 400
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)

        const resizeCanvas = document.createElement('canvas')
        resizeCanvas.width = w
        resizeCanvas.height = h
        const resizeCtx = resizeCanvas.getContext('2d', { willReadFrequently: true })
        if (!resizeCtx) throw new Error('Cannot create resize context')
        resizeCtx.drawImage(img, 0, 0, w, h)
        const resizedDataUrl = resizeCanvas.toDataURL('image/jpeg', 0.85)
        
        const imageBlob = await (await fetch(resizedDataUrl)).blob()
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Background removal timeout')), 180000)
        )
        
        const noBackgroundBlob = await Promise.race([
          (removeBackground as any)(imageBlob),
          timeoutPromise
        ])
        
        const noBackgroundUrl = URL.createObjectURL(noBackgroundBlob)

        const subjectImg = new window.Image()
        subjectImg.src = noBackgroundUrl
        await new Promise((resolve) => { subjectImg.onload = resolve })

        console.log('📸 Subject image loaded:', subjectImg.width, subjectImg.height)

        const srcCanvas = document.createElement('canvas')
        srcCanvas.width = subjectImg.width
        srcCanvas.height = subjectImg.height
        const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true })
        
        if (srcCtx) {
          srcCtx.drawImage(subjectImg, 0, 0)
          srcCtx.imageSmoothingEnabled = true
          srcCtx.imageSmoothingQuality = "high"
          
          refineCutout(srcCtx, srcCanvas.width, srcCanvas.height)
          
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = "high"
          
          let bounds = getAlphaBounds(srcCtx, subjectImg.width, subjectImg.height, 10, 2)
          bounds = inflateRect(bounds, subjectImg.width, subjectImg.height, 0.10)

          const desiredH = targetHeight * 0.78
          const finalScale = desiredH / bounds.height
          const dw = Math.round(bounds.width * finalScale)
          const dh = Math.round(bounds.height * finalScale)
          const dx = Math.round((targetWidth - dw) / 2)
          const bottomLine = targetHeight * 0.92
          const dy = Math.round(bottomLine - dh)

          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, targetWidth, targetHeight)
          ctx.drawImage(srcCanvas, bounds.x, bounds.y, bounds.width, bounds.height, dx, dy, dw, dh)
        } else {
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, targetWidth, targetHeight)
          const widthRatio = targetWidth / subjectImg.width
          const heightRatio = targetHeight / subjectImg.height
          const fitScale = Math.max(widthRatio, heightRatio) * 0.78
          const scaledWidth = subjectImg.width * fitScale
          const scaledHeight = subjectImg.height * fitScale
          const dx = (targetWidth - scaledWidth) / 2
          const dy = targetHeight - scaledHeight
          ctx.drawImage(subjectImg, dx, dy, scaledWidth, scaledHeight)
        }
        
        URL.revokeObjectURL(noBackgroundUrl)
        console.log('✅ Background removed successfully')
      } catch (bgError) {
        console.error('Background removal failed:', bgError)
        setError('Background removal failed. Please try again with better lighting.')
        setProcessing(false)
        setIsProcessingModel(false)
        return
      }

      ctx.fillStyle = '#00ff00'
      ctx.fillRect(0, 0, 10, 10)

      applyBrightnessContrast(ctx, canvas, brightness, contrast)

      const result = canvas.toDataURL('image/jpeg', 0.92)
      console.log('🟢 Debug pixel at (0,0) - result starts with:', result.substring(0, 30))
      setProcessedImage(result)
      setProcessing(false)
      setIsProcessingModel(false)
      console.log('✅ Photo processed, result length:', result.length)
    } catch (e) {
      console.error('Processing error:', e)
      setError('Failed to process photo')
      setProcessing(false)
      setIsProcessingModel(false)
    }
  }

  useEffect(() => {
    const loadImage = () => {
      const img = new window.Image()
      img.onload = () => processImage(img)
      img.onerror = () => {
        setError('Failed to load image')
        setProcessing(false)
      }
      img.src = sourceImage
    }

    loadImage()
  }, [sourceImage, cropRect])

  useEffect(() => {
    if (!processedImage) return

    const img = new window.Image()
    img.onload = () => processImage(img)
    img.src = sourceImage
  }, [brightness, contrast, cropRect])

  const downloadAndUse = () => {
    if (processedImage) {
      const link = document.createElement('a')
      link.href = processedImage
      link.download = `passport-photo-${Date.now()}.jpg`
      link.click()
      onComplete?.(processedImage)
    }
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h2 className="text-2xl font-bold mb-2 gradient-text">{getPassport()}</h2>
          <p className="text-white/60 text-sm">
            {language === 'ar' ? 'صورة احترافية لجواز السفر' 
             : language === 'fr' ? 'Photo passeport professionnelle'
             : 'Professional passport photo'}
          </p>
        </motion.div>

        {error && (
          <div className="glass-card p-4 mb-6 border-yellow-500/50">
            <p className="text-yellow-400 text-sm">{error}</p>
          </div>
        )}

        {processing && (
          <div className="glass-card p-4 mb-6 border-neon-cyan/50">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
              <p className="text-neon-cyan">{getProcessing()}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium mb-2 text-white/70">{getOriginal()}</h3>
            <div className="w-full" style={{ aspectRatio: '35/45' }}>
              <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden">
                <img src={sourceImage} alt="Original" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2 text-white/70">{getPassport()}</h3>
            <div className="w-full" style={{ aspectRatio: '35/45' }}>
              <div className="w-full h-full bg-white rounded-lg overflow-hidden">
                {processedImage ? (
                  <img src={processedImage} alt="Passport" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="text-gray-400" size={32} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {processedImage && !processing && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm text-white/70 mb-2">
                {getBrightness()}: {brightness}%
              </label>
              <input
                type="range"
                min="50"
                max="150"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-neon-cyan"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">
                {getContrast()}: {contrast}%
              </label>
              <input
                type="range"
                min="50"
                max="150"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full accent-neon-cyan"
              />
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {processedImage && !processing && (
          <div className="flex gap-3">
            <button
              onClick={downloadAndUse}
              className="flex-1 py-3 rounded-xl neon-button flex items-center justify-center gap-2"
            >
              <Download size={18} />
              {getDownload()}
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-3 rounded-xl glass-card flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function applyBrightnessContrast(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, brightness: number, contrast: number) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  const brightnessFactor = brightness / 100
  const contrastFactor = contrast / 100

  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      let value = data[i + j]
      value = (value - 128) * contrastFactor + 128
      value *= brightnessFactor
      data[i + j] = Math.max(0, Math.min(255, value))
    }
  }

  ctx.putImageData(imageData, 0, 0)
}
