import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import inventoryRoute from "./routes/inventoryRoutes.js";
import categoryRoute from "./routes/categoryRoutes.js";
import customerRoute from "./routes/customerRoutes.js";
import supplierRoute from "./routes/supplierRoutes.js";
import itemRoute from "./routes/itemsRoutes.js";
import transactionRoute from "./routes/transactionRoutes.js";
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
app.use("/api/category", categoryRoute);
app.use("/api/customer", customerRoute);
app.use("/api/supplier", supplierRoute);
app.use("/api/product", itemRoute);
app.use("/api/transaction", transactionRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

