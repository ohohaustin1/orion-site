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
  const rootRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [inView, setInView] = useState(false);
  const [pausedByUser, setPausedByUser] = useState(false);
  const shouldPlay = !reduceMotion && inView && !pausedByUser && !failed;
  const poster = src.replace('/videos/', '/videos/posters/').replace(/\.[a-z0-9]+$/i, '.jpg');

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { rootMargin: '240px 0px', threshold: 0.12 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlay) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [shouldPlay]);

  return (
    <div ref={rootRef} className={`cinematic-video ${className} ${failed ? 'is-fallback' : ''}`} aria-label={label}>
      {!failed && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
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
      {!failed && (
        <button
          className="cinematic-video-control"
          type="button"
          onClick={() => setPausedByUser((value) => !value)}
          aria-label={pausedByUser ? '播放背景影片' : '暫停背景影片'}
        >
          {pausedByUser ? '播放' : '暫停'}
        </button>
      )}
    </div>
  );
}
