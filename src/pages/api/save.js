import { requireAuth } from "./_auth.js";
import yaml from "js-yaml";
import fs from "node:fs/promises";
import path from "node:path";

const OWNER = process.env.REPO_OWNER;
const REPO = process.env.REPO_NAME;
const BRANCH = process.env.REPO_BRANCH || "main";
const GITHUB_TOKEN = process.env.GITHUB_BOT_TOKEN;

const COMMITTER = {
  name: process.env.COMMITTER_NAME || "andes-bot",
  email: process.env.COMMITTER_EMAIL || "bot@example.com"
};

async function getFileSha(remotePath) {
  if (!GITHUB_TOKEN) return null;
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(remotePath)}?ref=${BRANCH}`;
  const r = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "User-Agent": "andes-admin"
    }
  });
  if (r.status === 200) {
    const d = await r.json();
    return d.sha;
  }
  return null;
}

export async function POST({ request }) {
  try {
    requireAuth(request);
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { slug, frontmatter, body: contentBody } = body;

  if (!slug || !frontmatter) {
    return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), {
      status: 400
    });
  }

  // asegurar strings válidas, sin null
  const fm = {
    title: frontmatter.title || "",
    start: frontmatter.start || "",
    end: frontmatter.end || "",
    location: frontmatter.location || "",
    coords: frontmatter.coords,
    image: frontmatter.image || "",
    published: !!frontmatter.published,
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    excerpt: frontmatter.excerpt || ""
  };

  const yamlFm = yaml.dump(fm, { lineWidth: -1, noRefs: true });
  const md = `---\n${yamlFm}---\n\n${contentBody || ""}`;

  const localPath = path.join(process.cwd(), "src/content/actividades", `${slug}.md`);

  if (!GITHUB_TOKEN) {
    await fs.writeFile(localPath, md, "utf8");
    console.log("💾 Local save:", localPath);
    return new Response(JSON.stringify({ ok: true, local: true, path: localPath }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  const remotePath = `src/content/actividades/${slug}.md`;
  const sha = await getFileSha(remotePath);
  const b64 = Buffer.from(md).toString("base64");

  const payloadBody = {
    message: sha ? `Update ${slug}` : `Create ${slug}`,
    content: b64,
    branch: BRANCH,
    committer: COMMITTER
  };
  if (sha) payloadBody.sha = sha;

  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(remotePath)}`;
  const r = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "User-Agent": "andes-admin",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payloadBody)
  });

  const data = await r.json();
  if (!r.ok) {
    console.error("GitHub error:", data);
    return new Response(JSON.stringify({ ok: false, error: data }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true, commit: data.commit }), {
    headers: { "Content-Type": "application/json" }
  });
}
