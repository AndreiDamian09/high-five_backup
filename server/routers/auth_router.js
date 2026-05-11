import express from "express"
import { register, login, me, logout } from "./controllers/auth_controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const authRouter =express.Router()


authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", requireAuth, me);
authRouter.post("/logout", logout);

export default authRouter