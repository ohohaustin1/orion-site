/**
 * CN-PROXY-VERCEL-EDGE-001 — Vercel Edge Function reverse proxy
 *
 * 目的：CN client 直連 orion-hub.zeabur.app 慢/不可達（itdog 4.8s avg、max 10s+）
 *       透過 Vercel Edge（Asia 節點）做 server-to-server hop 跳過 GFW
 *
 * 路由：orion01.com/api/proxy/<path>?<query>
 *       → server-side fetch https://orion-hub.zeabur.app/<path>?<query>
 *       → stream response back to client（保留 status、headers、body）
 *
 * 範圍：API only（fetch 呼叫）。HTML page navigation 不走此 proxy
 *       （HTML 內含相對路徑、跨域 rewrite 複雜、out of scope）
 *
 * Streaming：response.body 是 ReadableStream、Vercel Edge 原生支援、
 *            SSE / chat token-by-token 應該透傳
 */

export const config = {
  runtime: 'edge',
};

const UPSTREAM_HOST = 'orion-hub.zeabur.app';
const UPSTREAM_BASE = `https://${UPSTREAM_HOST}`;

// 從 client 進來的 headers 中、不該往上游帶的（會搞亂 vhost / 編碼）
const HOP_HEADERS = new Set([
  'host',
  'connection',
  'keep-alive',
  'content-length',  // fetch 會自動算
  'transfer-encoding',
  'upgrade',
  'proxy-authorization',
  'proxy-authenticate',
  'te',
  'trailers',
  'x-vercel-id',
  'x-vercel-cache',
  'x-forwarded-for',
  'x-forwarded-proto',
  'x-real-ip',
]);

function filterRequestHeaders(headers: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of headers.entries()) {
    if (!HOP_HEADERS.has(k.toLowerCase())) out[k] = v;
  }
  // 強制覆寫 host = upstream（讓 zeabur vhost 路由正確）
  out['host'] = UPSTREAM_HOST;
  return out;
}

function filterResponseHeaders(headers: Headers): Headers {
  const out = new Headers();
  for (const [k, v] of headers.entries()) {
    const lk = k.toLowerCase();
    // upstream cookies / specific hop headers 不轉
    if (lk === 'connection' || lk === 'keep-alive' || lk === 'transfer-encoding') continue;
    out.set(k, v);
  }
  // CORS（前端是 orion01.com、走 same-origin 不需 CORS、但保險加上 *）
  out.set('Access-Control-Allow-Origin', '*');
  out.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  out.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  // 標識 proxy 路徑、debug 用
  out.set('X-Orion-Proxy', 'vercel-edge');
  return out;
}

export default async function handler(request: Request) {
  // OPTIONS preflight 直接回
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: filterResponseHeaders(new Headers()),
    });
  }

  const url = new URL(request.url);

  // Vercel 不支援 [...path].ts catch-all（Next.js only）、改 vercel.json rewrite：
  //   /api/proxy/:path* → /api/proxy?upstream=:path*
  // 從 query 讀 upstream path、保留其他 query params 透傳給上游。
  const upstreamPath = url.searchParams.get('upstream') || '';
  const upstreamQuery = new URLSearchParams();
  url.searchParams.forEach((v, k) => { if (k !== 'upstream') upstreamQuery.append(k, v); });
  const upstreamQueryStr = upstreamQuery.toString() ? `?${upstreamQuery.toString()}` : '';
  const cleanPath = upstreamPath ? `/${upstreamPath}` : '/';
  const targetUrl = `${UPSTREAM_BASE}${cleanPath}${upstreamQueryStr}`;

  const proxyHeaders = filterRequestHeaders(request.headers);

  // 建構上游 request
  const init: RequestInit = {
    method: request.method,
    headers: proxyHeaders,
    redirect: 'manual',  // 讓 client 看到 redirect、不在 edge 自動跟
  };

  // GET / HEAD 不能有 body
  if (!['GET', 'HEAD'].includes(request.method)) {
    init.body = request.body;
    // @ts-expect-error — Cloudflare/Vercel Edge 需要 duplex='half' 才能 stream body
    init.duplex = 'half';
  }

  try {
    const upstreamResponse = await fetch(targetUrl, init);
    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: filterResponseHeaders(upstreamResponse.headers),
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: 'Proxy upstream fetch failed',
        targetUrl,
        detail: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json', 'X-Orion-Proxy': 'vercel-edge-error' },
      }
    );
  }
}
