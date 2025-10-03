import { verifyTokenFromReq } from "./_auth.js";
export default function handler(req, res) {
  const p = verifyTokenFromReq(req);
  if (!p) { res.statusCode = 401; return res.end("Unauthorized"); }
  res.statusCode = 200;
  res.setHeader("Content-Type","application/json");
  res.end(JSON.stringify({ ok: true, user: p.user }));
}
