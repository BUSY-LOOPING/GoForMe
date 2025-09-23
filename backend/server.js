import app from './app.js';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import redisClient from './config/redis.js';
import fs from 'fs';

dotenv.config(); 

const PORT = process.env.PORT || 5000;

async function createDirectories() {
  const directories = [
    './uploads',
    './uploads/runner_images',
    './logs'
  ];

  for (const dir of directories) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Directory created: ${dir}`);
      }
    } catch (error) {
      console.error(`Failed to create directory ${dir}:`, error);
    }
  }
}

async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Unable to connect to database:', error);
    throw error;
  }
}

async function connectRedis() {
  return new Promise((resolve, reject) => {
    redisClient.on('connect', () => {
      console.log('Redis client connected successfully');
    });

    redisClient.on('ready', () => {
      console.log('Redis client ready to use');
      resolve();
    });

    redisClient.on('error', (error) => {
      console.error('Redis connection error:', error);
      reject(error);
    });
  });
}

async function startServer() {
  try {
    console.log('Starting server initialization...');

    await createDirectories();

    await connectDatabase();

    // await connectRedis();

    const server = app.listen(PORT, (error) => {
      if (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
      }
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });

    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('HTTP server closed');

        sequelize.close().then(() => {
          console.log('Database connection closed');
        }).catch(err => {
          console.error('Error closing database:', err);
        });

        redisClient.quit().then(() => {
          console.log('Redis connection closed');
        }).catch(err => {
          console.error('Error closing Redis:', err);
        });

        console.log('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('HTTP server closed');

        sequelize.close().then(() => {
          console.log('Database connection closed');
        }).catch(err => {
          console.error('Error closing database:', err);
        });

        redisClient.quit().then(() => {
          console.log('Redis connection closed');
        }).catch(err => {
          console.error('Error closing Redis:', err);
        });

        console.log('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();
