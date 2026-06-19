import { useEffect, useRef, type CSSProperties } from 'react';
import type { CaseVisual } from '../../data/cases';

interface CaseMediaProps {
  visual: CaseVisual;
  className: string;
  loading?: 'eager' | 'lazy';
  preload?: 'auto' | 'metadata' | 'none';
}

export default function CaseMedia({ visual, className, loading = 'lazy', preload = 'metadata' }: CaseMediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStyle = {
    '--case-video-position': visual.objectPosition || 'center center',
    '--case-video-mobile-position': visual.mobileObjectPosition || visual.objectPosition || 'center center',
  } as CSSProperties;
  // SSR-safe reduced-motion check; no rerender needed because case videos are
  // decorative and can fall back to the poster on first render.
  const reduceMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !visual.videoMp4) return;

    // SSR-safe: matchMedia only exists in the browser. Respect reduced-motion by
    // keeping the static poster (no autoplay) for those users.
    const shouldReduceMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      } else {
        videoRef.current?.pause();
      }
    };

    // SSR-safe: IntersectionObserver only exists in the browser. Case cards are
    // part of the sales proof, so we do not actively pause them offscreen; the
    // observer only nudges playback once the browser brings them near view.
    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            requestPlayback();
          }
        },
        { threshold: 0, rootMargin: '200px' },
      );
      observer.observe(video);
    } else {
      requestPlayback();
    }

    requestPlayback();
    document.addEventListener('visibilitychange', requestVisiblePlayback);
    window.addEventListener('focus', requestPlayback);
    window.addEventListener('pageshow', requestPlayback);

    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', requestVisiblePlayback);
      window.removeEventListener('focus', requestPlayback);
      window.removeEventListener('pageshow', requestPlayback);
    };
  }, [visual.videoMp4, visual.videoWebm]);

  if (!visual.videoMp4) {
    return <img className={className} src={visual.src} alt={visual.alt} loading={loading} style={mediaStyle} />;
  }

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay={!reduceMotion}
      muted
      loop
      playsInline
      preload={preload}
      poster={visual.src}
      aria-hidden="true"
      tabIndex={-1}
      style={mediaStyle}
      onLoadedData={(event) => requestLoadedPlayback(event.currentTarget, reduceMotion)}
      onCanPlay={(event) => requestLoadedPlayback(event.currentTarget, reduceMotion)}
    >
      {visual.videoWebm && <source src={visual.videoWebm} type="video/webm" />}
      <source src={visual.videoMp4} type="video/mp4" />
    </video>
  );
}

function requestLoadedPlayback(video: HTMLVideoElement, reduceMotion: boolean) {
  if (reduceMotion) return;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  void video.play().catch(() => undefined);
}
