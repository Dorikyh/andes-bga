import { requireAuth } from "./_auth.js";

export const prerender = false;

const OWNER = process.env.REPO_OWNER;
const REPO = process.env.REPO_NAME;
const BRANCH = process.env.REPO_BRANCH || "master";
const GITHUB_TOKEN = process.env.GITHUB_BOT_TOKEN;

export async function GET({ request }) {
  // auth obligatoria
  try {
    requireAuth(request);
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/src/content/actividades?ref=${BRANCH}`;

  const r = await fetch(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      "User-Agent": "andes-admin"
    }
  });

  if (r.status === 404) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  const data = await r.json();

  const list = Array.isArray(data)
    ? data.map(f => ({
        name: f.name,
        path: f.path,
        sha: f.sha
      }))
    : [];

  return new Response(JSON.stringify(list), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
