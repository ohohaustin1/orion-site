import { useEffect, useRef } from 'react';
import type { CaseVisual } from '../../data/cases';

interface CaseMediaProps {
  visual: CaseVisual;
  className: string;
  loading?: 'eager' | 'lazy';
  preload?: 'auto' | 'metadata' | 'none';
}

export default function CaseMedia({ visual, className, loading = 'lazy', preload = 'metadata' }: CaseMediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !visual.videoMp4) return;

    const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const requestPlayback = () => {
      const currentVideo = videoRef.current;
      if (!currentVideo || shouldReduceMotion) return;

      currentVideo.muted = true;
      currentVideo.defaultMuted = true;
      currentVideo.playsInline = true;
      void currentVideo.play().catch(() => undefined);
    };
    const requestVisiblePlayback = () => {
      if (document.visibilityState === 'visible') {
        requestPlayback();
      }
    };

    const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            requestPlayback();
          }
        },
        { threshold: 0.18 },
    );

    observer.observe(video);
    requestPlayback();
    document.addEventListener('visibilitychange', requestVisiblePlayback);
    window.addEventListener('focus', requestPlayback);
    window.addEventListener('pageshow', requestPlayback);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', requestVisiblePlayback);
      window.removeEventListener('focus', requestPlayback);
      window.removeEventListener('pageshow', requestPlayback);
    };
  }, [visual.videoMp4, visual.videoWebm]);

  if (!visual.videoMp4) {
    return <img className={className} src={visual.src} alt={visual.alt} loading={loading} />;
  }

  const requestLoadedPlayback = (video: HTMLVideoElement) => {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    void video.play().catch(() => undefined);
  };

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload={preload}
      poster={visual.src}
      aria-hidden="true"
      tabIndex={-1}
      onLoadedData={(event) => requestLoadedPlayback(event.currentTarget)}
      onCanPlay={(event) => requestLoadedPlayback(event.currentTarget)}
    >
      {visual.videoWebm && <source src={visual.videoWebm} type="video/webm" />}
      <source src={visual.videoMp4} type="video/mp4" />
    </video>
  );
}
