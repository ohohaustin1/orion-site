# CODEX Mobile Video Strategy Verify

Date: 2026-06-19
Repo: orion-site
Target: mobile-specific video strategy for ORION01 official site

## Changes

- Hero mobile now uses a dedicated vertical video: `/videos/mobile/orion-hero-command-mobile-9x16.mp4`.
- Hero command frame mobile now uses a dedicated 4:5 video: `/videos/mobile/orion-command-frame-mobile-4x5.mp4`.
- Case sections keep autoplay behavior on mobile.
- Lower-priority large cinematic backgrounds use poster-only mode on mobile.
- Case media and cinematic media support mobile focal points through CSS variables.

## Verification

- `npm run lint`: PASS.
- `npm run build`: PASS.
- Local dist server: `http://127.0.0.1:4178/home/` returned 200.
- L3 Chrome CDP mobile probe:
  - `/home/`: 2 cinematic videos, 4 poster-only large backgrounds, 9 case videos, overflowX 0.
  - `/cases/`: 1 cinematic video, 1 poster-only background, 3 case videos, overflowX 0.
  - `/about/`: 1 cinematic video, 2 poster-only backgrounds, overflowX 0.
  - `/insights/`: 1 cinematic video, 1 poster-only background, overflowX 0.
  - `/team/`: 1 cinematic video, 1 poster-only background, overflowX 0.
  - `/resources/`: 1 cinematic video, 1 poster-only background, overflowX 0.
- L4 production verify:
  - `https://orion01.com/home/`: deployed bundle hash matched `43dbbef` build.
  - Production `/home/`: 2 cinematic videos, 4 poster-only large backgrounds, 9 case videos, overflowX 0.
  - Production `/cases/`: 1 cinematic video, 1 poster-only background, case videos autoplay, overflowX 0.
  - Production `/about/`, `/insights/`, `/team/`, `/resources/`: each keeps 1 primary cinematic video and downgrades secondary large media to poster-only on mobile.

## Evidence Files

- `dom-probe.json`
- `mobile-pages-video-probe.json`
- `mobile-home-hero.png`
- `mobile-home-cases.png`
- `desktop-home-hero.png`
- `production-mobile-pages-video-probe.json`
- `production-mobile-home-hero.png`
- `production-mobile-home-cases.png`
