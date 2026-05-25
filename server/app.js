import router from "./routers/index.js"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import "./src/services/oauth.js";
import passport from "passport";

const app = express();

const corsOptions = {
  origin: [
    process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5500',
    "https://matching-sys.netlify.app"
  ],
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api', router.api)
app.use('/auth', router.auth)
app.use('/admin', router.admin)

export default app
