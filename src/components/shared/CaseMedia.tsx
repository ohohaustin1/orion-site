import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { CaseVisual } from '../../data/cases';

type MobileMediaMode = 'video' | 'poster';

interface CaseMediaProps {
  visual: CaseVisual;
  className: string;
  loading?: 'eager' | 'lazy';
  preload?: 'auto' | 'metadata' | 'none';
  mobileMode?: MobileMediaMode;
}

const MOBILE_MEDIA_QUERY = '(max-width: 768px)';
const LAZY_MEDIA_ROOT_MARGIN = '320px';

function getInitialMobileViewport() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(MOBILE_MEDIA_QUERY).matches
  );
}

function useMobileMediaViewport() {
  const [isMobile, setIsMobile] = useState(getInitialMobileViewport);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;

    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const update = () => setIsMobile(mediaQuery.matches);
    update();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', update);
      return () => mediaQuery.removeEventListener('change', update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  return isMobile;
}

export default function CaseMedia({
  visual,
  className,
  loading = 'lazy',
  preload = 'metadata',
  mobileMode = 'video',
}: CaseMediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isMobile = useMobileMediaViewport();
  const posterOnly = isMobile && mobileMode === 'poster';
  const preferredVideoSrc = visual.videoWebm || visual.videoMp4 || '';
  const [activeVideoSrc, setActiveVideoSrc] = useState(preferredVideoSrc);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
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
    setActiveVideoSrc(preferredVideoSrc);
    setShouldLoadVideo(false);
    setVideoFailed(false);
  }, [preferredVideoSrc, posterOnly]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !visual.videoMp4 || posterOnly || videoFailed) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoadVideo(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: LAZY_MEDIA_ROOT_MARGIN },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [posterOnly, videoFailed, visual.videoMp4]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !visual.videoMp4 || posterOnly || videoFailed || !shouldLoadVideo || !activeVideoSrc) return;

    // SSR-safe: matchMedia only exists in the browser. Respect reduced-motion by
    // keeping the static poster (no autoplay) for those users.
    const shouldReduceMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const requestPlayback = () => {
      const currentVideo = videoRef.current;
      if (!currentVideo || shouldReduceMotion || !currentVideo.currentSrc) return;

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

    video.load();
    requestPlayback();
    document.addEventListener('visibilitychange', requestVisiblePlayback);
    window.addEventListener('focus', requestPlayback);
    window.addEventListener('pageshow', requestPlayback);

    return () => {
      document.removeEventListener('visibilitychange', requestVisiblePlayback);
      window.removeEventListener('focus', requestPlayback);
      window.removeEventListener('pageshow', requestPlayback);
    };
  }, [activeVideoSrc, posterOnly, shouldLoadVideo, videoFailed, visual.videoMp4]);

  if (!visual.videoMp4 || posterOnly || videoFailed) {
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
      preload={shouldLoadVideo ? preload : 'none'}
      poster={visual.src}
      aria-hidden="true"
      tabIndex={-1}
      style={mediaStyle}
      onLoadedData={(event) => requestLoadedPlayback(event.currentTarget, reduceMotion)}
      onCanPlay={(event) => requestLoadedPlayback(event.currentTarget, reduceMotion)}
      src={shouldLoadVideo ? activeVideoSrc : undefined}
      data-src={activeVideoSrc}
      onError={() => {
        if (activeVideoSrc !== visual.videoMp4 && visual.videoMp4) {
          setActiveVideoSrc(visual.videoMp4);
          return;
        }
        setVideoFailed(true);
      }}
    >
      你的瀏覽器不支援影片播放。
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
