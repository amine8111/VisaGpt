'use client';

import { useEffect, useRef, useState } from 'react';
import { Upload, Download, Image } from 'lucide-react';
import PassportPhotoProcessor from './PassportPhotoProcessor';
import { savePassportPhoto } from '@/lib/passportPhotoStore';
import { useVisaStore } from '@/store/visaStore';
import { useLanguage } from './LanguageProvider';

interface PhotoPreview {
  id: string;
  url: string;
  accepted: boolean | null;
}

interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function computeCropFromOverlay(
  videoEl: HTMLVideoElement,
  overlayEl: HTMLElement,
  isMirrored: boolean = true
): CropRect {
  const videoRect = videoEl.getBoundingClientRect();
  const overlayRect = overlayEl.getBoundingClientRect();

  const srcW = videoEl.videoWidth;
  const srcH = videoEl.videoHeight;
  const boxW = videoRect.width;
  const boxH = videoRect.height;

  if (!srcW || !srcH || !boxW || !boxH) {
    return { x: 0, y: 0, width: srcW, height: srcH };
  }

  const scale = Math.max(boxW / srcW, boxH / srcH);
  const renderedW = srcW * scale;
  const renderedH = srcH * scale;
  const extraX = (renderedW - boxW) / 2;
  const extraY = (renderedH - boxH) / 2;

  const relX = overlayRect.left - videoRect.left;
  const relY = overlayRect.top - videoRect.top;
  const relW = overlayRect.width;
  const relH = overlayRect.height;

  let x = (relX + extraX) / scale;
  const y = (relY + extraY) / scale;
  const width = relW / scale;
  const height = relH / scale;

  if (isMirrored) {
    x = srcW - (x + width);
  }

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const cx = clamp(x, 0, srcW - 1);
  const cy = clamp(y, 0, srcH - 1);
  const cw = clamp(width, 1, srcW - cx);
  const ch = clamp(height, 1, srcH - cy);

  return { x: cx, y: cy, width: cw, height: ch };
}

export function PhotoCapture() {
  const { t, language } = useLanguage()
  console.log('🚨 PHOTO CAPTURE RUNNING');

  const [cameraState, setCameraState] = useState<'IDLE' | 'STREAMING' | 'CAPTURED' | 'ERROR'>('IDLE');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  const [showProcessor, setShowProcessor] = useState(false);
  const [cropRect, setCropRect] = useState<CropRect | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (cameraState !== 'STREAMING') {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      return;
    }

    let cancelled = false;

    const startCamera = async () => {
      try {
        setCameraError(null);
        console.log('🎥 Requesting camera...');
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 1280, height: 720 },
          audio: false,
        });
        console.log('✅ Stream received:', stream.id);

        if (cancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            console.log('▶️ Video playing');
          };
        }
      } catch (err) {
        console.error('❌ Camera error:', err);
        setCameraError(err instanceof Error ? err.message : 'Camera error');
        setCameraState('ERROR');
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [cameraState]);

  const openCamera = () => setCameraState('STREAMING');
  
  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraState('IDLE');
    setCropRect(null);
  };

  const capturePhoto = async () => {
    console.log('📸 Capture clicked');
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const guide = guideRef.current;
    
    if (!video || !canvas) {
      console.error('Missing refs');
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('No canvas context');
      return;
    }

    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    console.log('Capturing:', w, h);
    
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(video, 0, 0, w, h);

    // Compute crop from guide overlay
    if (guide) {
      const crop = computeCropFromOverlay(video, guide, true);
      console.log('Crop rect:', crop);
      setCropRect(crop);
    }

    const url = canvas.toDataURL('image/jpeg', 0.9);
    console.log('Captured:', url.length);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    
    setCapturedImageUrl(url);
    setCameraState('CAPTURED');
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedImageUrl(event.target?.result as string);
      setCameraState('CAPTURED');
      setCropRect(null);
    };
    reader.readAsDataURL(file);
  };

  const handleProcessorComplete = (processed: string) => {
    const newPhoto: PhotoPreview = {
      id: Date.now().toString(),
      url: processed,
      accepted: null
    };
    setPhotos(prev => [...prev, newPhoto]);
    setShowProcessor(false);
    setCapturedImageUrl(null);
    setCameraState('IDLE');
    setCropRect(null);
    
    // Save to localStorage for form auto-fill
    savePassportPhoto(processed);
    
    // Also save to store
    useVisaStore.getState().updateProfile({ passportPhoto: processed });
  };

  const handleProcessorCancel = () => {
    setShowProcessor(false);
    setCapturedImageUrl(null);
    setCameraState('IDLE');
    setCropRect(null);
  };

  const handleDownload = (photo: PhotoPreview) => {
    const link = document.createElement('a');
    link.download = `passport-photo-${Date.now()}.jpg`;
    link.href = photo.url;
    link.click();
  };

  if (showProcessor && capturedImageUrl) {
    return (
      <PassportPhotoProcessor
        sourceImage={capturedImageUrl}
        cropRect={cropRect}
        onComplete={handleProcessorComplete}
        onCancel={handleProcessorCancel}
      />
    );
  }

  if (cameraState === 'STREAMING') {
    return (
      <div style={{ 
        position: 'fixed', 
        inset: 0, 
        background: '#0a051a', 
        zIndex: 99998,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2 style={{ color: 'white', marginBottom: 20 }}>{t('positionFace')}</h2>
        <p style={{ color: '#ffcc00', marginBottom: 15, fontSize: 14, textAlign: 'center', maxWidth: 400 }}>
          {t('schengenWallTip')}
        </p>
        
        <div style={{ 
          width: 480, 
          height: 640,
          border: '4px solid #0070f3',
          borderRadius: 12,
          overflow: 'hidden',
          background: '#000',
          position: 'relative'
        }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)'
            }}
          />
          <div 
            ref={guideRef}
            style={{
              position: 'absolute',
              top: '15%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60%',
              height: '70%',
              border: '3px dashed rgba(255,255,255,0.6)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }} 
          />
        </div>
        
        <div style={{ marginTop: 30, display: 'flex', gap: 20 }}>
          <button onClick={capturePhoto} style={{ padding: '15px 30px', fontSize: 16, background: '#28a745', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            📸 {t('capture')}
          </button>
          <button onClick={closeCamera} style={{ padding: '15px 30px', fontSize: 16, background: '#dc3545', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            ✕ {t('cancel')}
          </button>
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    );
  }

  if (cameraState === 'CAPTURED' && capturedImageUrl) {
    return (
      <div style={{ padding: 20, maxWidth: 800, margin: '0 auto', background: '#0a051a', minHeight: '100vh', color: 'white' }}>
        <h1>📷 {t('photoCaptured')}</h1>
        <img src={capturedImageUrl} alt="Captured" style={{ maxWidth: 300, border: '2px solid #0070f3', borderRadius: 8, marginTop: 20 }} />
        <div style={{ marginTop: 15 }}>
          <button onClick={openCamera} style={{ padding: '12px 24px', marginRight: 10, background: '#666', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            🔄 {t('retake')}
          </button>
          <button onClick={() => setShowProcessor(true)} style={{ padding: '12px 24px', background: '#28a745', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            <Image size={16} /> {t('processForPassport')}
          </button>
        </div>
        {photos.length > 0 && (
          <div style={{ marginTop: 30 }}>
            <h3>{t('yourPhotos')}</h3>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {photos.map(photo => (
                <div key={photo.id} style={{ textAlign: 'center' }}>
                  <img src={photo.url} alt="Processed" style={{ width: 150, height: 200, objectFit: 'cover', border: '1px solid #ccc', borderRadius: 4 }} />
                  <button onClick={() => handleDownload(photo)} style={{ marginTop: 10, padding: '8px 16px', background: '#0070f3', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Download size={14} /> {t('download')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto', background: '#0a051a', minHeight: '100vh', color: 'white' }}>
      <h1>📷 {t('passportPhoto')}</h1>
      
      {cameraError && (
        <p style={{ color: 'red', padding: 10, background: '#330000' }}>Error: {cameraError}</p>
      )}

      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 30 }}>
        <button onClick={openCamera} style={{ padding: '15px 30px', fontSize: 18, background: '#0070f3', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          📷 {t('openCamera')}
        </button>
        
        <label style={{ padding: '15px 30px', fontSize: 18, background: '#666', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Upload size={20} />
          {t('uploadPhoto')}
          <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
        </label>
      </div>

      {photos.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>{t('yourPhotos')}</h3>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {photos.map(photo => (
              <div key={photo.id} style={{ textAlign: 'center' }}>
                <img src={photo.url} alt="Processed" style={{ width: 150, height: 200, objectFit: 'cover', border: '1px solid #ccc', borderRadius: 4 }} />
                <button onClick={() => handleDownload(photo)} style={{ marginTop: 10, padding: '8px 16px', background: '#0070f3', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Download size={14} /> {t('download')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default PhotoCapture;
