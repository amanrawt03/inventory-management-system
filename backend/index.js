import {} from 'dotenv/config';
import bodyParser from 'body-parser';
import express from "express";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import inventoryRoute from "./routes/inventoryRoutes.js";
import categoryRoute from "./routes/categoryRoutes.js";
import customerRoute from "./routes/customerRoutes.js";
import supplierRoute from "./routes/supplierRoutes.js";
import itemRoute from "./routes/itemsRoutes.js";
import transactionRoute from "./routes/transactionRoutes.js";
import graphRoute from './routes/graphRoutes.js';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' })); // For JSON payloads
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Define your routes
app.use("/api/auth", authRoute);
app.use("/api/inventory", inventoryRoute);
app.use("/api/category", categoryRoute);
app.use("/api/customer", customerRoute);
app.use("/api/supplier", supplierRoute);
app.use("/api/product", itemRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/graph", graphRoute);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});