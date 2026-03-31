'use client';

import React, { useState, useEffect, useRef, cloneElement, isValidElement } from 'react';

export function CameraDebugWrapper({ children }: { children: React.ReactElement }) {
  const videoElementRef = useRef<HTMLVideoElement>(null);
  
  const [debugInfo, setDebugInfo] = useState<{
    width: number;
    height: number;
    readyState: number;
    hasStream: boolean;
    videoElement: string;
  }>({
    width: 0,
    height: 0,
    readyState: -1,
    hasStream: false,
    videoElement: 'not found'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const videos = document.querySelectorAll('video');
      console.log('[DebugWrapper] Found videos:', videos.length);
      
      if (videos.length > 0) {
        const video = videos[0] as HTMLVideoElement;
        const rect = video.getBoundingClientRect();
        setDebugInfo({
          width: rect.width,
          height: rect.height,
          readyState: video.readyState,
          hasStream: !!video.srcObject,
          videoElement: `FOUND (${videos.length} videos)`
        });
      } else {
        setDebugInfo(prev => ({
          ...prev,
          width: 0,
          height: 0,
          videoElement: `NOT FOUND (0 videos)`
        }));
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const child = isValidElement(children) 
    ? cloneElement(children, { videoRef: videoElementRef } as React.Attributes)
    : children;

  return (
    <div style={{ position: 'relative' }}>
      {child}
      <div
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.95)',
          color: 'white',
          padding: '15px',
          zIndex: 999999,
          fontFamily: 'monospace',
          fontSize: '12px',
          borderRadius: '8px',
          border: '2px solid #ff4444',
          minWidth: '200px'
        }}
      >
        <h4 style={{ margin: '0 0 10px 0', color: '#ff4444' }}>🔴 Video Debugger</h4>
        <div>Videos in DOM: {debugInfo.videoElement}</div>
        <div>Width: <span style={{ color: debugInfo.width > 0 ? '#44ff44' : '#ff4444', fontWeight: 'bold' }}>{debugInfo.width.toFixed(1)}px</span></div>
        <div>Height: <span style={{ color: debugInfo.height > 0 ? '#44ff44' : '#ff4444', fontWeight: 'bold' }}>{debugInfo.height.toFixed(1)}px</span></div>
        <div>Ready State: {debugInfo.readyState}/4</div>
        <div>Has Stream: {debugInfo.hasStream ? '✅' : '❌'}</div>
      </div>
    </div>
  );
}
