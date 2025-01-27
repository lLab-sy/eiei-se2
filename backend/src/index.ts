import express, { Express } from "express";
import connectDB from './config/db';
import testRoutes from './routes/testRoutes';
import setupSwagger from './config/swagger';
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;

// const app = express();
const app: Express = express();

// Database connection
connectDB();

// Middleware
app.use(express.json());

// Setup Swagger UI
setupSwagger(app);

// Routes
app.use('/api', testRoutes);

// Server
app.listen(port, () => {
  console.log('Server running on http://localhost:3000');
  console.log('Swagger UI available at http://localhost:3000/api-docs');
});
