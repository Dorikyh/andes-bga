import { requireAuth } from "./_auth.js";

const OWNER = process.env.REPO_OWNER;
const REPO = process.env.REPO_NAME;
const BRANCH = process.env.REPO_BRANCH || "master";
const GITHUB_TOKEN = process.env.GITHUB_BOT_TOKEN;

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/src/content/actividades?ref=${BRANCH}`;
  const r = await fetch(url, { headers: { Authorization: `token ${GITHUB_TOKEN}`, "User-Agent": "andes-admin" }});
  if (r.status === 404) { res.statusCode = 200; return res.end(JSON.stringify([])); }
  const data = await r.json();
  const list = (Array.isArray(data) ? data : []).map(f => ({ name: f.name, path: f.path, sha: f.sha }));
  res.setHeader("Content-Type","application/json");
  res.end(JSON.stringify(list));
}
