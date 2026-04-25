import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE = 'https://orion01.com';
const DEFAULT_OG_IMAGE = `${SITE}/brand/griffin-256.png`;

interface PageSEOProps {
  title: string;
  description: string;
  /** 完整 URL 或開頭為 / 的路徑 */
  url?: string;
  ogImage?: string;
  /** 是否在 robots 避免索引（預設 false） */
  noindex?: boolean;
}

export default function PageSEO({
  title,
  description,
  url,
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
}: PageSEOProps) {
  const fullUrl = url
    ? (url.startsWith('http') ? url : `${SITE}${url.startsWith('/') ? url : '/' + url}`)
    : SITE;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={fullUrl} />
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="ORION 獵戶座智鑑" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
