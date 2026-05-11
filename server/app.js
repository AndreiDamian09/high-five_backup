import router from "./routers/index.js"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();


const corsOptions = {
  origin: [process.env.FRONTEND_ORIGIN || 'http://127.0.0.1:5500',
    'http://localhost:5174',
    'http://localhost:5173',
    "https://matching-sys.netlify.app"
  ],
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


app.use('/api',router.api)
app.use('/auth',router.auth)
app.use('/admin',router.admin)

export default app
