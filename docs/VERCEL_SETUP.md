# Vercel Deployment Setup Guide

## Overview

NatureVital is fully configured for Vercel deployment with serverless architecture, NeonDB integration, and optimized performance for global edge delivery.

## Prerequisites

- Vercel account (free tier available)
- NeonDB database (already configured)
- PayPal Business account
- Git repository

## Quick Deploy

### Option 1: Deploy Button (Recommended)
1. Visit your Vercel dashboard
2. Click "New Project"
3. Import from Git repository
4. Configure environment variables (see below)
5. Deploy!

### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# For production deployment
vercel --prod
```

## Environment Variables

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

### Required Variables
```env
DATABASE_URL=postgresql://user:pass@host:port/database
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
SESSION_SECRET=your_secure_random_32_char_key
NODE_ENV=production
```

### Optional Variables
```env
VERCEL_URL=your-project.vercel.app
NEXT_PUBLIC_VERCEL_URL=your-project.vercel.app
```

## Vercel Configuration

The project includes `vercel.json` with optimized settings:

### Build Configuration
- **Frontend**: Static site generation with Vite
- **Backend**: Serverless functions with Node.js runtime
- **Database**: NeonDB serverless PostgreSQL
- **CDN**: Global edge network for static assets

### Route Configuration
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/public/$1"
    }
  ]
}
```

### Performance Optimizations
- Function bundling with external packages
- 30-second function timeout for complex operations
- Security headers for all routes
- CORS configuration for API endpoints

## Database Setup

### NeonDB Integration
The application is pre-configured with NeonDB:
- Serverless PostgreSQL with automatic scaling
- Connection pooling optimized for serverless functions
- Global edge network for low latency
- Automatic backups and point-in-time recovery

### Initialize Database
```bash
# Apply database schema
npm run db:push

# Seed with sample data
npm run db:seed
```

## Build Process

### Local Testing
```bash
# Test Vercel build locally
vercel dev

# Build for production
npm run build:vercel
```

### Production Build
Vercel automatically:
1. Installs dependencies with `npm ci`
2. Builds frontend with `vite build`
3. Bundles serverless functions
4. Optimizes static assets
5. Deploys to global edge network

## Performance Features

### Automatic Optimizations
- **Image Optimization**: WebP conversion and resizing
- **Code Splitting**: Automatic bundle optimization
- **Edge Caching**: Global CDN with smart caching
- **Compression**: Gzip and Brotli compression
- **HTTP/2**: Modern protocol support

### Serverless Benefits
- **Zero Cold Starts**: Optimized function initialization
- **Auto Scaling**: Handles traffic spikes automatically
- **Global Distribution**: Functions run close to users
- **Cost Optimization**: Pay only for actual usage

## Custom Domain Setup

### Add Custom Domain
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your domain (e.g., naturevital.com)
3. Configure DNS records:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.61
   ```

### SSL Configuration
- Automatic SSL certificates via Let's Encrypt
- HTTP to HTTPS redirects
- TLS 1.3 support
- Perfect Forward Secrecy

## Monitoring and Analytics

### Built-in Vercel Analytics
- Real-time performance metrics
- Core Web Vitals tracking
- Function execution analytics
- Error rate monitoring

### Custom Analytics Integration
```typescript
// Add to your pages for detailed tracking
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      {/* Your app components */}
      <Analytics />
    </>
  );
}
```

### Speed Insights
```typescript
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <>
      {/* Your app components */}
      <SpeedInsights />
    </>
  );
}
```

## Security Configuration

### Automatic Security Features
- DDoS protection
- Edge network security
- Automatic HTTPS
- Security headers
- Request filtering

### Custom Security Headers
Already configured in `vercel.json`:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

## Environment-Specific Configuration

### Development
```bash
# Local development with Vercel
vercel dev --port 3000
```

### Preview Deployments
- Automatic preview for every Git push
- Unique URLs for testing
- Environment variable inheritance
- Branch-specific configurations

### Production
- Automatic deployment from main branch
- Custom domain mapping
- Performance monitoring
- Error tracking

## Troubleshooting

### Common Issues

**Build Failures**
```bash
# Check build logs in Vercel dashboard
# Verify all dependencies are in package.json
# Test build locally: npm run build
```

**Database Connection Issues**
```bash
# Verify DATABASE_URL in environment variables
# Check NeonDB dashboard for connection limits
# Test connection locally with tsx scripts/test-db.ts
```

**Function Timeouts**
```json
// Increase timeout in vercel.json
{
  "functions": {
    "server/index.ts": {
      "maxDuration": 60
    }
  }
}
```

**Environment Variables**
- Check spelling and case sensitivity
- Redeploy after adding new variables
- Use Vercel CLI to verify: `vercel env ls`

### Debug Mode
Enable detailed logging:
```typescript
// In server/index.ts
if (process.env.NODE_ENV === 'development') {
  console.log('Vercel environment:', {
    region: process.env.VERCEL_REGION,
    url: process.env.VERCEL_URL,
    env: process.env.NODE_ENV
  });
}
```

## Cost Optimization

### Vercel Pricing
- **Hobby**: Free (100GB bandwidth, 6,000 function calls/day)
- **Pro**: $20/month (1TB bandwidth, unlimited functions)
- **Team**: $99/month (team features, advanced analytics)

### Usage Optimization
- Efficient database queries to reduce function execution time
- Image optimization to reduce bandwidth
- Static asset caching to minimize function calls
- Connection pooling for database efficiency

## Team Collaboration

### Git Integration
- Automatic deployments from Git
- Branch-based preview deployments
- Pull request integration
- Commit-based rollbacks

### Team Management
- Role-based access control
- Project sharing and permissions
- Collaborative environment management
- Deployment notifications

## Advanced Features

### Edge Functions (Beta)
```typescript
// edge-functions/geo.ts
export default function handler(request: Request) {
  const country = request.headers.get('x-vercel-ip-country');
  return new Response(`Hello from ${country}!`);
}
```

### Incremental Static Regeneration
```typescript
// For dynamic content with static optimization
export const revalidate = 60; // Revalidate every 60 seconds
```

### API Rate Limiting
```typescript
// Implement rate limiting for API routes
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});
```

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Status Page](https://vercel-status.com/)

Your NatureVital application is now optimized for global deployment on Vercel's edge network with enterprise-grade performance and security!