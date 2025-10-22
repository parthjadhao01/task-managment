import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

dotenv.config();
connectDB();

// routes import
import authRoutes from "./routes/auth.routes.js";
import workspaceRoutes from "./routes/workspace.routes.js"
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import memberRoutes from "./routes/member.routes.js";

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Project Management API Docs"
}));

app.use("/auth", authRoutes);
app.use("/workspace",workspaceRoutes)
app.use("/project",projectRoutes)
app.use("/task",taskRoutes)
app.use("/member",memberRoutes)

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    message: "API is running",
    documentation: "http://localhost:8000/api-docs"
  });
});

app.listen(8000, () => {
  console.log("Server listening on port 8000");
  console.log("API Documentation available at http://localhost:8000/api-docs");
});