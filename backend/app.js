import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
 
import { 
  userRoutes,
  authRoutes,
  serviceRoutes,
  orderRoutes,
  ticketRoutes,
  notificationRoutes,
  runnerRoutes,
  paymentRoutes 
} from './routes/index.js';

import { errorHandler } from './middlewares/index.js';
import './config/passport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getAllowedOrigins = () => {
  if (process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL) {
    return [process.env.FRONTEND_URL];
  }
  return [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:8080'
  ];
};

const allowedOrigins = getAllowedOrigins();
const app = express();

app.set('trust proxy', 1);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};
 
app.use(cors(corsOptions));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", 
        "'unsafe-hashes'",
        "https://cdn.tailwindcss.com", 
        "https://cdnjs.cloudflare.com",
        "https://js.stripe.com"
      ],
      scriptSrcAttr: [
        "'unsafe-inline'", 
        "'unsafe-hashes'" 
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", 
        "https://cdn.tailwindcss.com",
        "https://cdnjs.cloudflare.com"
      ],
      fontSrc: [
        "'self'",
        "https://cdnjs.cloudflare.com",
        "data:"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https:"
      ],
      connectSrc: [
        "'self'",
        "http://localhost:5000",
        "http://localhost:3000", 
        "https://api.stripe.com",
        "https://m.stripe.network", 
        "https://m.stripe.com" 
      ],
      frameSrc: [
        "'self'",
        "https://js.stripe.com", 
        "https://hooks.stripe.com" 
      ]
    }
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));


app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/runners', runnerRoutes);
app.use('/api/payments', paymentRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(/^\/api\/.*/, (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.path
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.json({
    message: 'GoForMe API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

app.use(errorHandler);
 
export default app;
