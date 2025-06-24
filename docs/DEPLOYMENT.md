# Deployment Guide

## Overview

NatureVital supports multiple deployment environments, each optimized for different use cases and hosting providers. This guide covers deployment to Replit, Netlify, and other cloud platforms.

## Deployment Options

### 1. Replit Deployment (Recommended for Development)

**Advantages:**
- Integrated development environment
- Automatic builds and deployments
- Built-in PostgreSQL database
- Zero configuration setup

**Setup Instructions:**
1. Environment is already configured in `.replit` file
2. Set environment variables in Replit Secrets:
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `SESSION_SECRET`
3. Deploy using the Deploy button in Replit interface

**Build Process:**
```bash
npm run build    # Builds both frontend and backend
npm run start    # Starts production server
```

---

### 2. Netlify Deployment (Recommended for Production)

**Advantages:**
- Serverless functions for API endpoints
- Global CDN for fast static asset delivery
- Automatic HTTPS and custom domains
- Built-in form handling and authentication

#### Prerequisites
- Netlify account
- PostgreSQL database (Neon, PlanetScale, or similar)
- PayPal Business account

#### Setup Instructions

**1. Environment Variables**
Set these in Netlify dashboard → Site settings → Environment variables:
```env
DATABASE_URL=postgresql://username:password@host:port/database
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
SESSION_SECRET=your_session_secret_key
NODE_ENV=production
```

**2. Deploy via Git**
```bash
# Connect repository to Netlify
git remote add netlify your-netlify-git-url

# Deploy
git push netlify main
```

**3. Deploy via CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build and deploy
npm run build:netlify
netlify deploy --prod
```

#### Netlify Configuration

**netlify.toml** (already configured):
- Build command: `npm run build:netlify`
- Publish directory: `dist/public`
- Functions directory: `netlify/functions`
- Redirects for SPA routing and API proxying

**Serverless Functions:**
- `/api/products` → `netlify/functions/products.ts`
- `/api/categories` → `netlify/functions/categories.ts`
- `/api/auth/register` → `netlify/functions/auth-register.ts`
- `/api/auth/login` → `netlify/functions/auth-login.ts`
- `/api/paypal/setup` → `netlify/functions/paypal-setup.ts`
- `/api/paypal/order` → `netlify/functions/paypal-order.ts`

---

### 3. Vercel Deployment

**Advantages:**
- Excellent performance for React applications
- Serverless functions with automatic scaling
- Built-in analytics and monitoring

#### Setup Instructions

**1. Install Vercel CLI**
```bash
npm install -g vercel
```

**2. Create vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/public/**/*",
      "use": "@vercel/static"
    },
    {
      "src": "server/**/*.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/public/$1"
    }
  ],
  "env": {
    "DATABASE_URL": "@database-url",
    "PAYPAL_CLIENT_ID": "@paypal-client-id",
    "PAYPAL_CLIENT_SECRET": "@paypal-client-secret",
    "SESSION_SECRET": "@session-secret"
  }
}
```

**3. Deploy**
```bash
# Build application
npm run build

# Deploy to Vercel
vercel --prod
```

---

### 4. AWS Deployment

#### Option A: AWS Amplify (Recommended)

**1. Install Amplify CLI**
```bash
npm install -g @aws-amplify/cli
amplify configure
```

**2. Initialize Amplify**
```bash
amplify init
amplify add hosting
amplify add function
```

**3. Deploy**
```bash
amplify publish
```

#### Option B: AWS Lambda + CloudFront

**1. Install Serverless Framework**
```bash
npm install -g serverless
```

**2. Create serverless.yml**
```yaml
service: naturevital-api

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  environment:
    DATABASE_URL: ${env:DATABASE_URL}
    PAYPAL_CLIENT_ID: ${env:PAYPAL_CLIENT_ID}
    PAYPAL_CLIENT_SECRET: ${env:PAYPAL_CLIENT_SECRET}

functions:
  api:
    handler: dist/index.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true

plugins:
  - serverless-offline
  - serverless-webpack
```

**3. Deploy**
```bash
npm run build
serverless deploy
```

---

### 5. Digital Ocean App Platform

**1. Create app.yaml**
```yaml
name: naturevital
services:
- name: web
  source_dir: /
  github:
    repo: your-username/naturevital
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  routes:
  - path: /
  envs:
  - key: DATABASE_URL
    scope: RUN_TIME
    type: SECRET
  - key: PAYPAL_CLIENT_ID
    scope: RUN_TIME
    type: SECRET
  - key: PAYPAL_CLIENT_SECRET
    scope: RUN_TIME
    type: SECRET
  - key: SESSION_SECRET
    scope: RUN_TIME
    type: SECRET
```

**2. Deploy via CLI**
```bash
doctl apps create --spec app.yaml
```

---

## Database Setup for Production

### Option 1: Neon (Recommended)

**Features:**
- Serverless PostgreSQL
- Automatic scaling
- Built-in connection pooling

**Setup:**
1. Create account at neon.tech
2. Create new project
3. Copy connection string to `DATABASE_URL`

### Option 2: PlanetScale

**Features:**
- MySQL-compatible
- Branch-based development
- Built-in schema migrations

**Setup:**
1. Create account at planetscale.com
2. Create database
3. Configure connection string

### Option 3: Railway

**Features:**
- Simple PostgreSQL setup
- Automatic backups
- Built-in monitoring

**Setup:**
1. Create account at railway.app
2. Add PostgreSQL service
3. Copy connection variables

---

## Environment Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# PayPal Integration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Session Security
SESSION_SECRET=your_random_secret_key_min_32_chars

# Application
NODE_ENV=production
PORT=5000
```

### Optional Environment Variables

```env
# Logging
LOG_LEVEL=info
DEBUG=false

# Cache
CACHE_TTL=300

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

---

## Build and Optimization

### Production Build Process

```bash
# Install dependencies
npm ci --production=false

# Build frontend (Vite)
npm run build:frontend
# Outputs to: dist/public/

# Build backend (TypeScript)
npm run build:backend
# Outputs to: dist/

# Start production server
npm start
```

### Build Optimizations

**Frontend Optimizations:**
- Code splitting with dynamic imports
- Tree shaking for unused code elimination
- Asset optimization (images, fonts)
- Gzip compression
- Service worker for caching

**Backend Optimizations:**
- TypeScript compilation
- Dead code elimination
- Environment-specific configurations
- Database connection pooling

---

## Performance Monitoring

### Recommended Monitoring Tools

**Application Performance:**
- Vercel Analytics (for Vercel deployments)
- Netlify Analytics (for Netlify deployments)
- New Relic (universal)
- DataDog (enterprise)

**Error Tracking:**
- Sentry (recommended)
- LogRocket (session replay)
- Bugsnag (error monitoring)

**Database Monitoring:**
- Built-in database provider dashboards
- PgHero (PostgreSQL)
- Query performance insights

### Health Check Endpoints

```typescript
// Add to your deployment
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
  });
});
```

---

## Security Configuration

### Production Security Checklist

- [ ] Environment variables properly configured
- [ ] HTTPS enabled (automatic on most platforms)
- [ ] CORS configured for production domains
- [ ] Rate limiting enabled
- [ ] SQL injection protection (using parameterized queries)
- [ ] XSS protection headers
- [ ] Session security (httpOnly, secure, sameSite)
- [ ] PayPal webhook signature verification
- [ ] Database connection encryption

### Security Headers

```typescript
// Add security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  next();
});
```

---

## Rollback and Recovery

### Deployment Rollback

**Replit:**
- Use built-in version history
- Rollback via Replit dashboard

**Netlify:**
```bash
# List deployments
netlify api listSiteDeploys --data='{"site_id":"your-site-id"}'

# Restore previous deployment
netlify api restoreSiteDeploy --data='{"site_id":"your-site-id","deploy_id":"previous-deploy-id"}'
```

**Vercel:**
```bash
# List deployments
vercel list

# Promote previous deployment
vercel promote previous-deployment-url
```

### Database Backup

**Automated Backups:**
Most managed database providers offer automated backups.

**Manual Backup:**
```bash
# PostgreSQL backup
pg_dump $DATABASE_URL > backup.sql

# Restore from backup
psql $DATABASE_URL < backup.sql
```

---

## Cost Optimization

### Hosting Cost Comparison

| Platform | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| Replit | Limited compute | $10-50/month | Development/Prototyping |
| Netlify | 100GB/month | $19+/month | Static sites + Functions |
| Vercel | 100GB/month | $20+/month | React applications |
| AWS | 12 months free | Pay-as-you-go | Enterprise/Scale |
| Digital Ocean | $0 | $5+/month | Simple deployments |

### Cost Optimization Tips

1. **Choose appropriate instance sizes**
2. **Enable compression and caching**
3. **Optimize images and assets**
4. **Use CDN for static content**
5. **Monitor database connection limits**
6. **Implement proper error handling to avoid retry costs**

---

This deployment guide provides comprehensive instructions for deploying NatureVital to any major cloud platform, with specific optimizations for each environment.