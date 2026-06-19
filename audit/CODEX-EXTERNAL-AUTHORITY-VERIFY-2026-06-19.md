# CODEX External Authority Pack Verify - 2026-06-19

## Conclusion

Status: implemented locally and L3 verified. Production verification pending until push/deploy.

This patch adds a crawlable official citation kit so external platforms and AI answer engines can cite a single consistent source for ORION AI.

## What Changed

- Added `/ai-citation-kit`.
- Added official facts:
  - Brand: ORION AI / ORION AI 獵戶座智鑑
  - Founder: Austin 許燿宸
  - Category: 企業 AI 自動化公司
  - Contact: LINE ID `apig1202`, email `ohohaustin1@gmail.com`
- Added paste-ready profile copy for:
  - LinkedIn company profile
  - Founder profile
  - YouTube / podcast description
  - Google Business / company description
- Added citation links to the best existing official pages.
- Added WebPage / Organization / FAQPage JSON-LD for the citation kit.
- Linked the page from homepage SEO cluster and footer AI search column.
- Added `/ai-citation-kit` to prerender routes and sitemap.
- Added the citation kit to `llms.txt`.

## Local Verification

### L1

- `npm run lint`: PASS

### L2

- `npm run build`: PASS
- `dist/ai-citation-kit/index.html`: generated.
- `dist/home/index.html`: contains `/ai-citation-kit`.
- `dist/llms.txt`: contains `/ai-citation-kit`.
- `dist/sitemap.xml`: contains `/ai-citation-kit`.

Build warning:

- Existing large JS chunks remain over 500 kB. Build passed. This is a future performance optimization item.

### L3 Browser

Preview URL: `http://127.0.0.1:4176/ai-citation-kit`

Checked with system Chrome:

- Desktop: 1440 x 1200
- Mobile: 390 x 844

Assertions:

- Status 200 / cache 304 after first load: PASS
- Page title: PASS
- H1 visible: PASS
- JSON-LD count >= 2: PASS
- Paste cards count = 4: PASS
- Official source links count = 4: PASS
- LinkedIn text visible: PASS
- YouTube text visible: PASS
- Google Business text visible: PASS
- Austin text visible: PASS
- Email visible: PASS
- LINE visible: PASS
- Horizontal overflow: 0 px on desktop and mobile: PASS

Screenshots:

- `audit/CODEX-EXTERNAL-AUTHORITY-VERIFY-2026-06-19/ai-citation-kit-desktop.png`
- `audit/CODEX-EXTERNAL-AUTHORITY-VERIFY-2026-06-19/ai-citation-kit-mobile.png`

## Third-party Limit

I did not create or edit LinkedIn, YouTube, Google Business, or other external accounts. Those require the owner's authenticated account and should not be fabricated. The website now provides the official copy that can be pasted into those platforms consistently.

## Next Best External Moves

1. Create or update LinkedIn company page using the provided company copy.
2. Create or update Austin 許燿宸 LinkedIn profile using the founder copy.
3. Add ORION AI description to YouTube channel/about pages and video descriptions.
4. Add the same company description and contact details to Google Business if applicable.
5. Link those external profiles back to:
   - `https://orion01.com/ai-citation-kit`
   - `https://orion01.com/founder-austin-xu-yaochen`
   - `https://orion01.com/enterprise-ai-automation`
