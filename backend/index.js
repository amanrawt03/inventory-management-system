import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import inventoryRoute from "./routes/inventoryRoutes.js";
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(
  cors(
    {
    origin: "http://localhost:5173",
    credentials: true,
  }
)
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/inventory", inventoryRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

