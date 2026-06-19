import { Helmet } from 'react-helmet-async';

const SITE = 'https://orion01.com';
const DEFAULT_OG_IMAGE = `${SITE}/brand/griffin-256.png`;

interface PageSEOProps {
  title: string;
  description: string;
  url?: string;
  ogImage?: string;
  noindex?: boolean;
  keywords?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export default function PageSEO({
  title,
  description,
  url,
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
  keywords,
  jsonLd,
}: PageSEOProps) {
  const fullUrl = url
    ? (url.startsWith('http') ? url : `${SITE}${url.startsWith('/') ? url : '/' + url}`)
    : SITE;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="ORION AI 獵戶座智鑑" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
