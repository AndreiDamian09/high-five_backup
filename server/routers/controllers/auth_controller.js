import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../models/index.cjs";

const { User, Candidate, Employer } = db;

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function setAuthCookie(res, token) {
  const isProd = process.env.COOKIE_SECURE === "true";
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: isProd,          // true pe https (Netlify+tunnel)
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export async function register(req, res) {
  try {
    const { email, password, role, name, company_name } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Email și parolă sunt necesare." });
    if (!["candidate", "employer"].includes(role)) {
      return res.status(400).json({ error: "Role invalid (candidate/employer)." });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ error: "Email deja folosit." });

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password_hash,
      role,
      is_active: true,
      is_verified: true,
    });

    // profil minim
    if (role === "candidate") {
      await Candidate.create({
        user_id: user.id,
        name: name || email.split("@")[0],
      });
    } else {
      await Employer.create({
        user_id: user.id,
        company_name: company_name || "Companie",
      });
    }

    const token = signToken({ sub: user.id, role: user.role });
    setAuthCookie(res, token);

    return res.status(201).json({ message: "Registered", user: { id: user.id, email: user.email, role: user.role } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Eroare server la register." });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email și parolă sunt necesare." });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Credențiale invalide." });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Credențiale invalide." });

    const token = signToken({ sub: user.id, role: user.role });
    setAuthCookie(res, token);

    return res.json({ message: "Logged in", user: { id: user.id, email: user.email, role: user.role } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Eroare server la login." });
  }
}

export async function me(req, res) {
  // req.user vine din middleware
  return res.json({ user: req.user });
}

export async function logout(req, res) {
  const isProd = process.env.COOKIE_SECURE === "true";
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
  return res.json({ message: "Logged out" });
}

// Apelat de Passport după autentificare OAuth reușită
// req.user este setat de Passport cu obiectul User din DB
export function oauthCallback(req, res) {
  const user = req.user;
  if (!user) {
    return res.redirect(
      `${process.env.FRONTEND_ORIGIN || "http://localhost:5173"}/login?error=oauth_failed`
    );
  }

  const token = signToken({ sub: user.id, role: user.role });
  setAuthCookie(res, token);

  // Redirect la pagina potrivită rolului
  const destination = user.role === "employer" ? "/requester" : "/contributor";
  return res.redirect(`${process.env.FRONTEND_ORIGIN || "http://localhost:5173"}${destination}`);
}
