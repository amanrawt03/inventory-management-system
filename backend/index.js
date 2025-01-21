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
import notificationRoute from './routes/notificationRoutes.js';
import cors from 'cors';
import http from 'http';
import { Server } from "socket.io";
import './cronJobs/scheduleStockUpdate.js';
import './cronJobs/cleanInventory.js';
import { setupSubscription } from './config/subscriberConfig.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
      origin:'*',
      methods:['GET', 'POST', 'PUT', 'PATCH']
    }
  });

  app.set('io',io);
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' })); // For JSON payloads
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

setupSubscription(io)
// Socket
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
  
    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

// Routes
app.use("/api/auth", authRoute);
app.use("/api/inventory", inventoryRoute);
app.use("/api/category", categoryRoute);
app.use("/api/customer", customerRoute);
app.use("/api/supplier", supplierRoute);
app.use("/api/product", itemRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/graph", graphRoute);
app.use("/api/notify", notificationRoute);

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
