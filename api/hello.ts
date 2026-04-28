/* Sanity check: simplest possible Edge Function、確認 Vercel 能 detect
   訪 /api/hello → expect '{"ok":true,"runtime":"edge"}'
   有 response = api/ folder dispatch 正常、proxy 失敗是 [...path].ts 的問題
   無 response = api/ folder 根本沒 detect、需 functions config */
export const config = { runtime: 'edge' };

export default function handler() {
  return new Response(
    JSON.stringify({ ok: true, runtime: 'edge', from: 'api/hello.ts' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Orion-Sanity': 'edge-hello',
      },
    }
  );
}
