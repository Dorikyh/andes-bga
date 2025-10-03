// api/save.js
import { requireAuth, verifyTokenFromReq } from "./_auth.js";
import yaml from "js-yaml";

const OWNER = process.env.REPO_OWNER;
const REPO = process.env.REPO_NAME;
const BRANCH = process.env.REPO_BRANCH || "main";
const GITHUB_TOKEN = process.env.GITHUB_BOT_TOKEN;
const COMMITTER = {
  name: process.env.COMMITTER_NAME || "andes-bot",
  email: process.env.COMMITTER_EMAIL || "bot@example.com"
};

async function getFileSha(path) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`;
  const r = await fetch(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      "User-Agent": "andes-admin"
    }
  });
  if (r.status === 200) {
    const d = await r.json();
    return d.sha;
  }
  return null;
}

export default async function handler(req, res) {
  // auth (requireAuth responde 401 si no está)
  const payload = requireAuth(req, res);
  if (!payload) return;

  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  try {
    const { slug, frontmatter, body } = req.body;
    if (!slug || !frontmatter) return res.status(400).json({ ok: false, error: "missing fields" });

    // Normalizar/limpiar frontmatter básico
    const fm = { ...frontmatter };

    // Evitar valores undefined en YAML (js-yaml maneja null bien)
    // Asegúrate que coords esté como objeto si existe
    if (fm.coords && typeof fm.coords.lat === "string") {
      fm.coords.lat = Number(fm.coords.lat);
    }
    if (fm.coords && typeof fm.coords.lng === "string") {
      fm.coords.lng = Number(fm.coords.lng);
    }

    // Generar YAML frontmatter
    const yamlFm = yaml.dump(fm, { lineWidth: -1, noRefs: true });

    const md = `---\n${yamlFm}---\n\n${body || ""}`;
    const b64 = Buffer.from(md, "utf8").toString("base64");

    const path = `src/content/actividades/${slug}.md`;
    const sha = await getFileSha(path);

    // Usuario que hizo el cambio (desde token JWT)
    const who = (payload && payload.user) ? payload.user : "unknown";

    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}`;

    const payloadBody = {
      message: sha ? `Update actividad ${slug} by ${who}` : `Create actividad ${slug} by ${who}`,
      content: b64,
      branch: BRANCH,
      committer: COMMITTER
    };
    if (sha) payloadBody.sha = sha;

    const r = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "User-Agent": "andes-admin",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payloadBody)
    });

    const data = await r.json();
    if (!r.ok) {
      console.error("GitHub save error:", data);
      return res.status(500).json({ ok: false, error: data });
    }

    return res.json({ ok: true, commit: data.commit, path });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
}
