import express, { Express } from "express";
import connectDB from './config/db';
import testRoutes from './routes/testRoutes';
import postRoutes from "./routes/postRoutes"
import authRoutes from './routes/authRoutes';
import postRoleRoutes from "./routes/postRoleRoutes"
import postDetailRoutes from "./routes/postDetailRoutes"
import mediaTypeRoutes from "./routes/mediaTypeRoutes"
import morgan from 'morgan';
import helmet from "helmet";
import cors from "cors";
import setupSwagger from './config/swagger';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes'
import cloudRouter from './routes/cloudRoutes'
import hpp from 'hpp';

dotenv.config();

const port = process.env.PORT || 3000;

// const app = express();
const app: Express = express();

// Database connection
connectDB();

// Middleware
app.use(hpp());
app.use(morgan('common'));
app.use(helmet());
app.use(cors({origin: true, credentials: true}));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');  // Prevent caching
  res.setHeader('Pragma', 'no-cache');         // HTTP/1.0 cache control
  res.setHeader('Expires', '0');               // Set expiry to 0 to force a fresh request
  next();
});

// Setup Swagger UI
setupSwagger(app);

// Routes
app.use('/api', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/v1',postRoutes,postRoleRoutes,postDetailRoutes,mediaTypeRoutes);
app.use('/api/users', userRoutes)
app.use('/api/cloud', cloudRouter)

// Server
app.listen(port, () => {
  console.log('Server running on http://localhost:'+port);
  console.log('Swagger UI available at http://localhost:'+port+'/api-docs');
});
