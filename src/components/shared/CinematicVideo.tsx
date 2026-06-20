import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';

type MobileVideoMode = 'video' | 'poster';

interface CinematicVideoProps {
  src: string;
  className?: string;
  label?: string;
  overlay?: boolean;
  posterSrc?: string;
  mobileSrc?: string;
  mobilePosterSrc?: string;
  mobileMode?: MobileVideoMode;
  objectPosition?: string;
  mobileObjectPosition?: string;
}

const MOBILE_VIDEO_QUERY = '(max-width: 768px)';
const LAZY_VIDEO_ROOT_MARGIN = '360px';

function derivePoster(src: string) {
  return src.replace('/videos/', '/videos/posters/').replace(/\.[a-z0-9]+$/i, '.jpg');
}

function getInitialMobileViewport() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(MOBILE_VIDEO_QUERY).matches
  );
}

function useMobileVideoViewport() {
  const [isMobile, setIsMobile] = useState(getInitialMobileViewport);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;

    const mediaQuery = window.matchMedia(MOBILE_VIDEO_QUERY);
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

export default function CinematicVideo({
  src,
  className = '',
  label = 'ORION AI cinematic business system video',
  overlay = true,
  posterSrc,
  mobileSrc,
  mobilePosterSrc,
  mobileMode = 'video',
  objectPosition = 'center center',
  mobileObjectPosition,
}: CinematicVideoProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useMobileVideoViewport();
  const frameRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isOnScreenRef = useRef(false);
  const [failed, setFailed] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const activeSrc = isMobile && mobileSrc ? mobileSrc : src;
  const poster = isMobile
    ? mobilePosterSrc || posterSrc || derivePoster(activeSrc)
    : posterSrc || derivePoster(activeSrc);
  const posterOnly = isMobile && mobileMode === 'poster';
  const frameStyle = {
    '--video-position': objectPosition,
    '--video-mobile-position': mobileObjectPosition || objectPosition,
  } as CSSProperties;

  useEffect(() => {
    setFailed(false);
    setShouldLoadVideo(false);
    isOnScreenRef.current = false;
  }, [activeSrc, posterOnly]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || failed || posterOnly) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      isOnScreenRef.current = true;
      setShouldLoadVideo(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isOnScreen = Boolean(entry?.isIntersecting);
        isOnScreenRef.current = isOnScreen;
        if (isOnScreen) {
          setShouldLoadVideo(true);
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0, rootMargin: LAZY_VIDEO_ROOT_MARGIN },
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, [activeSrc, failed, posterOnly]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || failed || posterOnly || !shouldLoadVideo) return undefined;

    // Only play while the video is actually in the viewport. The ref tracks the
    // latest intersection state so visibility/focus handlers never resume an
    // offscreen video.
    const requestPlayback = () => {
      const currentVideo = videoRef.current;
      if (!currentVideo || failed || !currentVideo.currentSrc) return;

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

    video.load();
    requestPlayback();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', requestPlayback);
    window.addEventListener('pageshow', requestPlayback);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', requestPlayback);
      window.removeEventListener('pageshow', requestPlayback);
    };
  }, [activeSrc, failed, posterOnly, reduceMotion, shouldLoadVideo]);

  return (
    <div
      ref={frameRef}
      className={`cinematic-video ${className} ${failed ? 'is-fallback' : ''}`}
      aria-label={label}
      style={frameStyle}
    >
      {!failed && posterOnly && (
        <img className="cinematic-video-poster" src={poster} alt="" loading="lazy" aria-hidden="true" />
      )}
      {!failed && !posterOnly && (
        <video
          ref={videoRef}
          src={shouldLoadVideo ? activeSrc : undefined}
          data-src={activeSrc}
          poster={poster}
          autoPlay={!reduceMotion}
          muted
          loop
          playsInline
          preload={shouldLoadVideo ? 'metadata' : 'none'}
          onCanPlay={() => {
            const currentVideo = videoRef.current;
            // Only start once ready AND on-screen; respect reduced-motion.
            if (!currentVideo || reduceMotion || !isOnScreenRef.current || !currentVideo.currentSrc) return;

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
          <small>影片暫時無法載入，內容仍可正常閱讀。</small>
        </div>
      )}
      {overlay && <span className="cinematic-video-overlay" aria-hidden="true" />}
    </div>
  );
}
