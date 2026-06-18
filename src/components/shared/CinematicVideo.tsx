import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface CinematicVideoProps {
  src: string;
  className?: string;
  label?: string;
  overlay?: boolean;
}

export default function CinematicVideo({
  src,
  className = '',
  label = 'ORION AI 營運工作流視覺影片',
  overlay = true,
}: CinematicVideoProps) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [failed, setFailed] = useState(false);
  const poster = src.replace('/videos/', '/videos/posters/').replace(/\.[a-z0-9]+$/i, '.jpg');

  useEffect(() => {
    const video = videoRef.current;
    if (!video || failed) return;

    const requestPlayback = () => {
      const currentVideo = videoRef.current;
      if (!currentVideo || failed) return;

      currentVideo.muted = true;
      currentVideo.defaultMuted = true;
      currentVideo.playsInline = true;

      if (reduceMotion) {
        currentVideo.pause();
        return;
      }

      void currentVideo.play().catch(() => undefined);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestPlayback();
      }
    };

    requestPlayback();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', requestPlayback);
    window.addEventListener('pageshow', requestPlayback);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', requestPlayback);
      window.removeEventListener('pageshow', requestPlayback);
    };
  }, [failed, reduceMotion]);

  return (
    <div className={`cinematic-video ${className} ${failed ? 'is-fallback' : ''}`} aria-label={label}>
      {!failed && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => {
            const currentVideo = videoRef.current;
            if (!currentVideo || reduceMotion) return;

            currentVideo.muted = true;
            currentVideo.defaultMuted = true;
            currentVideo.playsInline = true;
            void currentVideo.play().catch(() => undefined);
          }}
          onError={() => setFailed(true)}
        />
      )}
      {failed && (
        <div className="cinematic-video-fallback">
          <span>ORION AI</span>
          <small>影片載入中</small>
        </div>
      )}
      {overlay && <span className="cinematic-video-overlay" aria-hidden="true" />}
    </div>
  );
}
