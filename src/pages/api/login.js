import { signToken, checkCredentials } from "./_auth.js";
export const prerender = false;

export async function POST({ request }) {
  try {
    const { user, pass } = await request.json();

    if (!checkCredentials(user, pass)) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid credentials" }), { status: 401 });
    }

    const token = signToken({ user });

    const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
    const secure = isProd ? "Secure; " : "";

    const headers = new Headers();
    headers.append("Set-Cookie", `token=${token}; HttpOnly; ${secure}Path=/; SameSite=Lax; Max-Age=28800`);

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ ok: false, error: "server error" }), { status: 500 });
  }
}
