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
  const isOnScreenRef = useRef(false);
  const [failed, setFailed] = useState(false);
  const poster = src.replace('/videos/', '/videos/posters/').replace(/\.[a-z0-9]+$/i, '.jpg');

  useEffect(() => {
    const video = videoRef.current;
    if (!video || failed) return;

    // Only play while the video is actually in the viewport. The ref tracks the
    // latest intersection state so visibility/focus handlers (and the JSX
    // onCanPlay handler) never resume an offscreen video.
    const requestPlayback = () => {
      const currentVideo = videoRef.current;
      if (!currentVideo || failed) return;

      currentVideo.muted = true;
      currentVideo.defaultMuted = true;
      currentVideo.playsInline = true;

      // Respect reduced-motion: keep the static poster, never autoplay.
      if (reduceMotion || !isOnScreenRef.current) {
        currentVideo.pause();
        return;
      }

      void currentVideo.play().catch(() => undefined);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestPlayback();
      } else {
        videoRef.current?.pause();
      }
    };

    // SSR-safe: IntersectionObserver only exists in the browser.
    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          isOnScreenRef.current = Boolean(entry?.isIntersecting);
          if (isOnScreenRef.current) {
            requestPlayback();
          } else {
            videoRef.current?.pause();
          }
        },
        { threshold: 0, rootMargin: '200px' },
      );
      observer.observe(video);
    } else {
      // No observer support: fall back to old behaviour (treat as on-screen).
      isOnScreenRef.current = true;
      requestPlayback();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', requestPlayback);
    window.addEventListener('pageshow', requestPlayback);

    return () => {
      observer?.disconnect();
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
          autoPlay={!reduceMotion}
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => {
            const currentVideo = videoRef.current;
            // Only start once ready AND on-screen; respect reduced-motion.
            if (!currentVideo || reduceMotion || !isOnScreenRef.current) return;

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
