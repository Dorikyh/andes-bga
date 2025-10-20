// GET  /api/chat-proxy/:id
// POST /api/chat-proxy/:id  (y POST /api/chat-proxy/:id?use_tools=true -> reenviado al path /messages?use_tools=true)
export async function GET({ params, request }: { params: { id: string }, request: Request }) {
  try {
    const id = params.id;
    const target = `https://window-truth.lumon.com.co/api/frontend/chats/${encodeURIComponent(id)}`;

    const proxied = await fetch(target, {
      method: 'GET',
      headers: {
        'accept': 'application/json, text/plain, */*',
        'referer': `https://window-truth.lumon.com.co/chats/${id}`,
        'user-agent': request.headers.get('user-agent') ?? 'astro-proxy',
      },
    });

    const text = await proxied.text();
    const contentType = proxied.headers.get('content-type') ?? 'application/json';
    return new Response(text, { status: proxied.status, headers: { 'content-type': contentType } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message ?? String(err) }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}

export async function POST({ params, request }: { params: { id: string }, request: Request }) {
  try {
    const id = params.id;
    const reqUrl = new URL(request.url);
    const qs = reqUrl.search; // preserva ?use_tools=true u otros
    const target = `https://window-truth.lumon.com.co/api/frontend/chats/${encodeURIComponent(id)}/messages${qs}`;

    const bodyText = await request.text().catch(() => '{}');

    const proxied = await fetch(target, {
      method: 'POST',
      headers: {
        'accept': 'application/json, text/plain, */*',
        'content-type': 'application/json',
        'origin': 'https://window-truth.lumon.com.co',
        'referer': `https://window-truth.lumon.com.co/chats/${id}`,
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
