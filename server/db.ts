
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";

// Optimized connection pool configuration
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("DATABASE_URL not found, using in-memory storage");
}

// Enhanced pool configuration for better performance
const pool = connectionString ? new Pool({
  connectionString,
  max: 5, // Reduced from 10 for better resource management
  idleTimeoutMillis: 30000, // 30 seconds
  connectionTimeoutMillis: 8000, // 8 seconds (reduced from 10)
  maxUses: 1000, // Limit connection reuse
  allowExitOnIdle: true,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  statement_timeout: 15000, // 15 second query timeout
  query_timeout: 15000,
  application_name: 'naturevital_app',
}) : null;

// Enhanced error handling and logging
if (pool) {
  pool.on('error', (err) => {
    console.error('Database pool error:', err.message);
  });

  pool.on('connect', () => {
    console.log('Database client connected');
  });

  pool.on('acquire', () => {
    console.log('Database client acquired from pool');
  });

  pool.on('release', () => {
    console.log('Database client released back to pool');
  });
}

export const db = connectionString 
  ? drizzle(pool!, { schema, logger: process.env.NODE_ENV === 'development' })
  : null;

// Health check function
export const checkDbHealth = async () => {
  if (!db || !pool) return false;
  
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  if (pool) {
    console.log('Closing database pool...');
    await pool.end();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  if (pool) {
    console.log('Closing database pool...');
    await pool.end();
  }
  process.exit(0);
});
