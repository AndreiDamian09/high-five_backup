import express from "express"
import passport from "passport";
import { register, login, me, logout, oauthCallback } from "./controllers/auth_controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const authRouter = express.Router()

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", requireAuth, me);
authRouter.post("/logout", logout);

// ─── Google OAuth ─────────────────────────────────────────────────────────────
authRouter.get("/google", passport.authenticate("google", { session: false, scope: ["profile", "email"] }));
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_ORIGIN || "http://localhost:5173"}/login?error=google_failed` }),
  oauthCallback
);

// ─── LinkedIn OAuth ───────────────────────────────────────────────────────────
authRouter.get("/linkedin", passport.authenticate("linkedin", { session: false }));
authRouter.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", { session: false, failureRedirect: `${process.env.FRONTEND_ORIGIN || "http://localhost:5173"}/login?error=linkedin_failed` }),
  oauthCallback
);

export default authRouter