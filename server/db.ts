/**
 * Database Connection Configuration for NeonDB
 * 
 * This module configures the database connection using Drizzle ORM with NeonDB.
 * NeonDB is a serverless PostgreSQL database that provides:
 * - Automatic scaling and connection pooling
 * - Built-in read replicas for better performance
 * - Branching for development workflows
 * - Serverless architecture compatible with edge functions
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket for Node.js environments
neonConfig.webSocketConstructor = ws;

// Validate database URL
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}

console.log('[DATABASE] Connecting to NeonDB...');

// Create connection pool with optimized settings for serverless
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // Serverless optimization settings
  max: 1, // Single connection for serverless functions
  idleTimeoutMillis: 0, // Don't timeout idle connections
  connectionTimeoutMillis: 5000, // 5 second connection timeout
});

// Initialize Drizzle ORM with schema
export const db = drizzle({ 
  client: pool, 
  schema,
  logger: process.env.NODE_ENV === 'development'
});

console.log('[DATABASE] NeonDB connection configured successfully');