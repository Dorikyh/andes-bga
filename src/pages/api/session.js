import { verifyTokenFromReq } from "./_auth.js";

export const prerender = false;

export async function GET({ request }) {
  const p = verifyTokenFromReq(request);
  if (!p) {
    return new Response("Unauthorized", { status: 401 });
  }
  return new Response(JSON.stringify({ ok: true, user: p.user }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
