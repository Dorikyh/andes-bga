// POST /api/chat-proxy/create
export async function POST({ request }: { request: Request }) {
  try {
    const bodyText = await request.text().catch(() => '{}');
    const target = 'https://window-truth.lumon.com.co/api/frontend/chats';

    const proxied = await fetch(target, {
      method: 'POST',
      headers: {
        'accept': 'application/json, text/plain, */*',
        'content-type': 'application/json',
        'origin': 'https://window-truth.lumon.com.co',
        'referer': 'https://window-truth.lumon.com.co/',
        'user-agent': request.headers.get('user-agent') ?? 'astro-proxy',
      },
      body: bodyText,
    });

    const text = await proxied.text();
    const contentType = proxied.headers.get('content-type') ?? 'application/json';
    return new Response(text, { status: proxied.status, headers: { 'content-type': contentType } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message ?? String(err) }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
