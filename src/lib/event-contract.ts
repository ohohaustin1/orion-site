/**
 * Event Contract — Frontend (PR 1 step 6)
 *
 * TypeScript mirror of orion-hub/lib/event-contract.js.
 * Both must stay in lock-step: same 7 events, same required fields,
 * same GA4 / Meta mapping rules.
 *
 * Used by src/lib/analytics.ts (pushEvent) — events that don't validate
 * here are dropped before they reach the GTM dataLayer.
 */

export type EventName =
  | 'page_view'
  | 'chat_initiated'
  | 'chat_completed'
  | 'report_unlocked'
  | 'oauth_completed'
  | 'refine_clicked'
  | 'contact_engineer';

export interface EventPayload {
  [key: string]: unknown;
}

interface StaticEventDef {
  required: string[];
  ga: string;
  meta: string | null;
}

interface DynamicEventDef {
  required: string[];
  gaForPayload: (payload: EventPayload) => string;
  metaForPayload: (payload: EventPayload) => string | null;
}

type EventDef = StaticEventDef | DynamicEventDef;

export const EVENTS: Record<EventName, EventDef> = {
  page_view: {
    required: ['route_name', 'page_type'],
    ga: 'page_view',
    meta: 'PageView',
  },
  chat_initiated: {
    required: ['flow_name', 'entry_point'],
    ga: 'chat_initiated',
    meta: null,
  },
  chat_completed: {
    required: ['flow_name', 'completion_reason'],
    ga: 'chat_completed',
    meta: null,
  },
  report_unlocked: {
    required: ['lead_stage', 'report_type'],
    ga: 'generate_lead',
    meta: 'Lead',
  },
  oauth_completed: {
    required: ['method', 'auth_result'],
    gaForPayload: (p) => {
      const r = String((p && p.auth_result) || '');
      return r === 'sign_up' || r === 'register' ? 'sign_up' : 'login';
    },
    metaForPayload: (p) => {
      const r = String((p && p.auth_result) || '');
      return r === 'sign_up' || r === 'register' ? 'CompleteRegistration' : null;
    },
  },
  refine_clicked: {
    required: ['surface'],
    ga: 'refine_clicked',
    meta: null,
  },
  contact_engineer: {
    required: ['contact_channel', 'lead_stage'],
    ga: 'working_lead',
    meta: 'Contact',
  },
};

export function isValidEvent(name: string): name is EventName {
  return Object.prototype.hasOwnProperty.call(EVENTS, name);
}

export function validateEvent(
  name: string,
  payload: EventPayload | undefined
): { ok: boolean; error?: string } {
  if (!isValidEvent(name)) {
    return { ok: false, error: `Unknown event: ${name}` };
  }
  const def = EVENTS[name];
  const p = payload || {};
  const missing = def.required.filter((k) => p[k] == null || p[k] === '');
  if (missing.length > 0) {
    return {
      ok: false,
      error: `Missing required fields for ${name}: ${missing.join(', ')}`,
    };
  }
  return { ok: true };
}

export function gaEventFor(name: EventName, payload: EventPayload): string {
  const def = EVENTS[name];
  if ('gaForPayload' in def) return def.gaForPayload(payload);
  return def.ga;
}

export function metaEventFor(name: EventName, payload: EventPayload): string | null {
  const def = EVENTS[name];
  if ('metaForPayload' in def) return def.metaForPayload(payload);
  return def.meta;
}
