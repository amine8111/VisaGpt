'use client';

import { useEffect, useRef, useState } from 'react';

type CameraState = 'IDLE' | 'STREAMING' | 'CAPTURED' | 'ERROR';

export default function TestCameraPage() {
  const [cameraState, setCameraState] = useState<CameraState>('IDLE');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  console.log('[TestCamera] Rendering, state:', cameraState);

  useEffect(() => {
    console.log('[TestCamera] useEffect fired, cameraState:', cameraState);

    if (cameraState !== 'STREAMING') return;

    let cancelled = false;

    const startCamera = async () => {
      console.log('[TestCamera] startCamera called');
      try {
        setCameraError(null);
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 1280, height: 720 },
          audio: false,
        });
        console.log('[TestCamera] Stream obtained:', stream.id);

        if (cancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            console.log('[TestCamera] Video metadata loaded, playing...');
            videoRef.current?.play();
          };
        } else {
          console.error('[TestCamera] videoRef.current is null!');
        }
      } catch (err) {
        console.error('[TestCamera] Camera error:', err);
        if (err instanceof Error) {
          setCameraError(err.message);
        }
        setCameraState('ERROR');
      }
    };

    startCamera();

    return () => {
      console.log('[TestCamera] Cleanup running');
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [cameraState]);

  const handleOpenCamera = () => {
    console.log('[TestCamera] Open camera clicked');
    setCameraState('STREAMING');
  };

  const handleCapture = () => {
    console.log('[TestCamera] Capture clicked');
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.drawImage(video, 0, 0);

    const url = canvas.toDataURL('image/jpeg', 0.9);
    console.log('[TestCamera] Captured image, length:', url.length);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    setImageUrl(url);
    setCameraState('CAPTURED');
  };

  const handleClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraState('IDLE');
    setImageUrl(null);
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto', background: '#0a051a', minHeight: '100vh', color: 'white' }}>
      <h1>📷 Camera Test Page</h1>
      <p>State: <strong>{cameraState}</strong></p>

      {cameraError && (
        <p style={{ color: 'red', padding: 10, background: '#330000' }}>Error: {cameraError}</p>
      )}

      {cameraState === 'IDLE' && (
        <button 
          onClick={handleOpenCamera} 
          style={{ padding: '15px 30px', fontSize: 18, cursor: 'pointer', background: '#0070f3', color: 'white', border: 'none', borderRadius: 8 }}
        >
          📷 Open Camera
        </button>
      )}

      {cameraState === 'STREAMING' && (
        <div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', maxWidth: 640, border: '2px solid #0070f3', borderRadius: 8 }}
          />
          <div style={{ marginTop: 15 }}>
            <button onClick={handleCapture} style={{ padding: '12px 24px', marginRight: 10, cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: 6 }}>
              📸 Capture
            </button>
            <button onClick={handleClose} style={{ padding: '12px 24px', cursor: 'pointer', background: '#dc3545', color: 'white', border: 'none', borderRadius: 6 }}>
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {cameraState === 'CAPTURED' && imageUrl && (
        <div>
          <h2>📸 Photo Captured!</h2>
          <img src={imageUrl} alt="Captured" style={{ maxWidth: 300, border: '2px solid #0070f3', borderRadius: 8 }} />
          <div style={{ marginTop: 15 }}>
            <button onClick={() => setCameraState('IDLE')} style={{ padding: '12px 24px', marginRight: 10, cursor: 'pointer', background: '#666', color: 'white', border: 'none', borderRadius: 6 }}>
              Done
            </button>
            <button onClick={handleOpenCamera} style={{ padding: '12px 24px', cursor: 'pointer', background: '#0070f3', color: 'white', border: 'none', borderRadius: 6 }}>
              🔄 Retake
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
