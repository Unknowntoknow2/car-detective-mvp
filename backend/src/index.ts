/**
 * Enterprise Express.js Backend for Vehicle Valuation System
 * Production-ready with security, monitoring, and scalability features
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { authMiddleware } from './middleware/auth';
import { validateApiKey } from './middleware/apiKey';

// Route imports
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import valuationRoutes from './routes/valuation';
import vehicleRoutes from './routes/vehicle';
import marketRoutes from './routes/market';
import adminRoutes from './routes/admin';

// Swagger documentation
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();

// Trust proxy for accurate IP addresses behind reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? config.cors.allowedOrigins 
    : true,
  credentials: true,
  optionsSuccessStatus: 200
}));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// API-specific rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    error: 'API rate limit exceeded',
    retryAfter: 900
  }
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Swagger documentation setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Car Detective API',
      version: '1.0.0',
      description: 'Enterprise vehicle valuation and market analysis API',
      contact: {
        name: 'API Support',
        url: 'https://cardetective.com/support',
        email: 'api-support@cardetective.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.cardetective.com' 
          : `http://localhost:${config.port}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts']
};

const specs = swaggerJsdoc(swaggerOptions);

// API Documentation
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Car Detective API Documentation'
  }));
}

// Health check endpoint (no auth required)
app.use('/health', healthRoutes);

// API routes with versioning
const apiV1 = express.Router();

// Public routes (API key required)
apiV1.use('/auth', validateApiKey, authRoutes);

// Protected routes (JWT required)
apiV1.use('/valuations', validateApiKey, authMiddleware, apiLimiter, valuationRoutes);
apiV1.use('/vehicles', validateApiKey, authMiddleware, vehicleRoutes);
apiV1.use('/market', validateApiKey, authMiddleware, marketRoutes);

// Admin routes (admin role required)
apiV1.use('/admin', validateApiKey, authMiddleware, adminRoutes);

app.use('/api/v1', apiV1);

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Car Detective API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    documentation: process.env.NODE_ENV !== 'production' ? '/api/docs' : undefined
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Car Detective API Server',
    version: '1.0.0',
    status: 'running',
    api: '/api',
    health: '/health',
    documentation: process.env.NODE_ENV !== 'production' ? '/api/docs' : undefined
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

const PORT = config.port || 3000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
  logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle server errors
server.on('error', (error: any) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

export default app;