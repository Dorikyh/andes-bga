// api/get.js
import { requireAuth } from "./_auth.js";

const OWNER = process.env.REPO_OWNER;
const REPO = process.env.REPO_NAME;
const BRANCH = process.env.REPO_BRANCH || "main";
const GITHUB_TOKEN = process.env.GITHUB_BOT_TOKEN;

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  const path = req.query.path;
  if (!path) return res.status(400).json({ error: "missing path" });

  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`;
  const r = await fetch(url, { headers: { Authorization: `token ${GITHUB_TOKEN}`, "User-Agent": "andes-admin" }});
  if (r.status === 404) return res.status(404).json({ error: "not found" });
  const data = await r.json();
  const content = Buffer.from(data.content, "base64").toString("utf8");
  res.json({ path: data.path, sha: data.sha, content });
}
