import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

// routes import
import authRoutes from "./routes/auth.routes.js";
import workspaceRoutes from "./routes/workspace.routes.js"

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/workspace",workspaceRoutes)

app.listen(8000, () => {
  console.log("Server listening on port ");
});
