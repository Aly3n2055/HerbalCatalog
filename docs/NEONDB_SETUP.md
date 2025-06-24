# NeonDB Integration Guide

## Overview

NatureVital is configured to use NeonDB, a serverless PostgreSQL database that provides excellent performance and scalability for modern web applications.

## What is NeonDB?

NeonDB is a serverless PostgreSQL platform that offers:
- **Serverless Architecture**: Automatic scaling with zero maintenance
- **Branching**: Git-like workflow for database development
- **Connection Pooling**: Built-in connection management
- **Edge Network**: Global distribution for low latency
- **Point-in-time Recovery**: Comprehensive backup system

## Current Configuration

### Database Connection
The application is already configured with:
- **Connection Pool**: Optimized for serverless functions
- **Schema Management**: Using Drizzle ORM with TypeScript
- **Environment Variables**: Secure connection string management

### File Structure
```
server/
├── db.ts              # NeonDB connection configuration
├── storage.ts         # Database operations with Drizzle ORM
└── routes.ts          # API endpoints using database storage

shared/
└── schema.ts          # Database schema and type definitions

scripts/
└── seed.ts            # Database seeding script
```

## Database Schema

### Tables
- **users** - User authentication and profiles
- **products** - Product catalog with categories
- **categories** - Product organization
- **cart_items** - Shopping cart persistence
- **orders** - Order history and tracking
- **order_items** - Order line items
- **distributor_leads** - Business partnership applications

### Relationships
```sql
users (1:many) cart_items (many:1) products
users (1:many) orders (1:many) order_items (many:1) products
categories (1:many) products
```

## Database Operations

### Initialize Database Schema
```bash
# Push schema to database
npm run db:push
```

### Seed Sample Data
```bash
# Populate database with demo data
npm run db:seed
```

### Demo Account
After seeding, you can use:
- **Email**: demo@naturevital.com
- **Password**: demo123

## Development Workflow

### Local Development
1. Database connection is automatically established
2. Schema changes are reflected via Drizzle ORM
3. Seed data provides realistic testing environment

### Schema Changes
1. Update `shared/schema.ts`
2. Run `npm run db:push` to apply changes
3. Update storage operations in `server/storage.ts`

### Query Optimization
The database storage implementation includes:
- Indexed lookups for fast queries
- Efficient joins for related data
- Proper ordering and filtering
- Connection pooling for performance

## Production Considerations

### Connection Management
- Single connection per serverless function
- Automatic connection reuse
- Timeout optimization for edge functions
- Error handling and retries

### Performance Optimization
- Query result caching where appropriate
- Efficient database indexes
- Minimal connection overhead
- Optimized for serverless cold starts

### Security Features
- Environment variable protection
- Parameterized queries preventing SQL injection
- Connection encryption in transit
- Access control and authentication

## Monitoring and Maintenance

### NeonDB Dashboard
Access your database through the NeonDB console:
- Query performance monitoring
- Connection usage statistics
- Storage and bandwidth metrics
- Automated backup status

### Application Monitoring
- Database query logging in development
- Error tracking and alerting
- Performance metrics collection
- Connection pool monitoring

## Troubleshooting

### Common Issues

**Connection Timeout**
```typescript
// Increase timeout in server/db.ts
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000, // 10 seconds
});
```

**Schema Sync Issues**
```bash
# Reset and re-push schema
npm run db:push
npm run db:seed
```

**Performance Issues**
- Check query patterns in logs
- Review index usage
- Monitor connection pool metrics
- Optimize frequent queries

### Debug Mode
Enable detailed database logging:
```typescript
// In server/db.ts
export const db = drizzle({ 
  client: pool, 
  schema,
  logger: true // Enable query logging
});
```

## Migration from Development Storage

The application automatically detects the database environment:
- **With DATABASE_URL**: Uses NeonDB with full persistence
- **Without DATABASE_URL**: Falls back to in-memory storage

This allows seamless development and testing without database setup.

## Cost Optimization

### NeonDB Pricing
- **Free Tier**: 500MB storage, 1 compute hour
- **Pro Plan**: $19/month for production workloads
- **Scale Plan**: Custom pricing for enterprise

### Usage Optimization
- Connection pooling reduces costs
- Efficient queries minimize compute time
- Automatic scaling based on demand
- Storage optimization through data archiving

## Backup and Recovery

### Automatic Backups
NeonDB provides:
- Continuous backup to AWS S3
- Point-in-time recovery up to 7 days
- Automated retention policies
- Cross-region replication

### Manual Backup
```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Import backup
psql $DATABASE_URL < backup.sql
```

## Advanced Features

### Database Branching
NeonDB supports git-like branching:
- Create development branches
- Test schema changes safely
- Merge branches when ready
- Isolate feature development

### Read Replicas
Automatic read replicas for:
- Improved query performance
- Geographic distribution
- Load balancing
- High availability

Your NatureVital application is now running on a production-ready, serverless PostgreSQL database with enterprise-grade features and performance.