import jwt from "jsonwebtoken";
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// Cargar usuarios desde la variable de entorno
const USERS_RAW = process.env.USERS;

function getUsers() {
  return USERS_RAW.split(",")
    .map(s => {
      const [user, pass] = s.split(":");
      if (!user) return null;
      return { user: user.trim(), pass: (pass || "").trim() };
    })
    .filter(Boolean);
}

export function checkCredentials(user, pass) {
  const users = getUsers();
  console.log("Login attempt:", { user, pass });
  console.log("Available users:", users);
  return users.some(u => u.user === user && u.pass === pass);
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
}

export function verifyTokenFromReq(req) {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/(?:^|; )token=([^;]+)/);
  const token = match ? match[1] : null;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// 🔒 Nueva función para usar en tus endpoints
export function requireAuth(req) {
  const user = verifyTokenFromReq(req);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
