import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "locations_by_device.json");

async function ensureFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "{}", "utf8");
  }
}

function pickFirstIp(xff) {
  if (!xff) return null;
  return xff.split(",")[0].trim();
}

function nowISO() {
  return new Date().toISOString();
}

function getDeviceId(headers, body) {
  if (headers["x-limit-d"]) return headers["x-limit-d"];
  if (body?.topic) {
    const parts = body.topic.split("/");
    return parts[parts.length - 1];
  }
  return `dev-${Date.now()}-${Math.floor(Math.random()*10000)}`;
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Forwarded-For, X-Limit-U, X-Limit-D",
    },
  });
}

export async function POST({ request }) {
  await ensureFile();
  const headersObj = {};
  for (const [k, v] of request.headers) headersObj[k.toLowerCase()] = v;
  const body = await request.json().catch(() => ({}));
  const ip = pickFirstIp(headersObj["x-forwarded-for"]) || headersObj["x-real-ip"] || null;
  const device = getDeviceId(headersObj, body);
  const user = headersObj["x-limit-u"] || null;
  const lat = body.lat ?? body.latitude;
  const lon = body.lon ?? body.longitude;

  if (lat == null || lon == null) {
    return new Response(JSON.stringify({ ok: false, error: "missing lat/lon" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  const entry = {
    id: `${Date.now()}-${Math.floor(Math.random()*100000)}`,
    device,
    user,
    ip,
    topic: body.topic ?? null,
    ssid: body.SSID ?? null,
    bssid: body.BSSID ?? null,
    lat: Number(lat),
    lon: Number(lon),
    alt: body.alt ?? null,
    acc: body.acc ?? null,
    vel: body.vel ?? null,
    batt: body.batt ?? null,
    created_at: body.created_at ?? body.tst ?? Math.floor(Date.now()/1000),
    received_at: nowISO(),
    raw: body,
    headers: headersObj,
  };

  // Upsert
  const raw = await fs.readFile(DATA_FILE, "utf8");
  let obj = {};
  try { obj = JSON.parse(raw); } catch { obj = {}; }
  obj[device] = entry;
  await fs.writeFile(DATA_FILE, JSON.stringify(obj, null, 2), "utf8");

  return new Response(JSON.stringify({ ok: true, entry }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}

export async function GET({ request }) {
  await ensureFile();
  const url = new URL(request.url);
  const deviceQuery = url.searchParams.get("device");
  const raw = await fs.readFile(DATA_FILE, "utf8");
  let obj = {};
  try { obj = JSON.parse(raw); } catch { obj = {}; }

  if (deviceQuery) {
    return new Response(JSON.stringify({ ok: true, data: obj[deviceQuery] ?? null }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  // Última ubicación por cada dispositivo
  const arr = Object.values(obj);
  return new Response(JSON.stringify({ ok: true, data: arr }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}
