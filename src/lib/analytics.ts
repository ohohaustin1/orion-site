/**
 * Frontend Analytics SDK — pushEvent → dataLayer (PR 1 step 6)
 *
 * Validates against src/lib/event-contract.ts (which mirrors the server
 * contract) and pushes to GTM's window.dataLayer. GTM tags then fan out
 * to GA4 / Meta Pixel / etc.
 *
 * The GTM container itself (GTM-TG3PRS2P) is injected by index.html
 * (PR 1 step 7); analytics.ts only assumes window.dataLayer exists.
 *
 * On contract failure (unknown event, missing required field) we POST
 * to /api/sdk/log-error so Strategy / Cowork can audit drift between
 * call sites and the contract.
 */

import {
  isValidEvent,
  validateEvent,
  gaEventFor,
  metaEventFor,
  type EventName,
  type EventPayload,
} from './event-contract';
import { DIAG_URL } from './api-base';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export interface PushEventOptions {
  lead_id?: string;
  user_public_id?: string;
  /**
   * Suppresses the /api/sdk/log-error round-trip on validation failure.
   * Use when you're calling pushEvent in a tight loop or test.
   */
  silent?: boolean;
}

/**
 * RFC 4122 v4 UUID with widely-supported fallback. crypto.randomUUID
 * is available in modern browsers and via secure contexts.
 */
function genEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Math.random fallback — uniqueness is per-tab so collision risk is
  // negligible for analytics. Format mimics UUID for downstream parsers
  // that may type-check.
  const r = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).slice(1);
  return `${r()}${r()}-${r()}-4${r().slice(1)}-${r()}-${r()}${r()}${r()}`;
}

function reportContractError(reason: string, eventName: string, payload?: EventPayload) {
  // Best-effort beacon; never throws. Don't await.
  try {
    const body = JSON.stringify({
      source: 'analytics.pushEvent',
      reason,
      event: eventName,
      payload,
      ts: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
    });
    // navigator.sendBeacon survives page-unload; fetch is the fallback
    // in non-browser / SSR contexts.
    const url = `${DIAG_URL}/api/sdk/log-error`;
    if (
      typeof navigator !== 'undefined' &&
      typeof navigator.sendBeacon === 'function'
    ) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else if (typeof fetch === 'function') {
      // fire-and-forget
      void fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // swallow — analytics must never throw into product code
  }
}

/**
 * pushEvent — validates against contract → pushes to dataLayer → returns event_id.
 *
 * Returns null if the event is invalid (unknown name OR missing required
 * fields). Non-throwing by design; analytics failures must never crash
 * the calling component.
 *
 * @example
 *   pushEvent('report_unlocked', {
 *     lead_stage: 'qualified',
 *     report_type: 'austin_v2',
 *   }, { lead_id: 's_abc123' });
 */
export function pushEvent(
  eventName: string,
  payload: EventPayload = {},
  opts: PushEventOptions = {}
): string | null {
  const v = validateEvent(eventName, payload);
  if (!v.ok) {
    // eslint-disable-next-line no-console
    console.warn('[analytics] pushEvent rejected:', v.error);
    if (!opts.silent) reportContractError(v.error || 'invalid', eventName, payload);
    return null;
  }

  const event_id = genEventId();
  const name = eventName as EventName;
  const ga = gaEventFor(name, payload);
  const meta = metaEventFor(name, payload);

  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    const frame: Record<string, unknown> = {
      // GTM trigger key — internal name (custom GTM triggers fire on this)
      event: eventName,
      event_id,
      ga_event: ga,
      meta_event: meta,
      ...payload,
    };
    if (opts.lead_id) frame.lead_id = opts.lead_id;
    if (opts.user_public_id) frame.user_public_id = opts.user_public_id;
    window.dataLayer.push(frame);
  }

  return event_id;
}

/**
 * Convenience: page_view with the most common defaults.
 * Components / route guards can call this at mount time.
 */
export function pushPageView(routeName: string, pageType: string): string | null {
  return pushEvent('page_view', {
    route_name: routeName,
    page_type: pageType,
  });
}
