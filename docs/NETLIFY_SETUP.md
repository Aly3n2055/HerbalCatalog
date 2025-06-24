# Netlify Deployment Setup Guide

## Quick Start

1. **Prepare Your Repository**
   ```bash
   git add .
   git commit -m "Add Netlify deployment configuration"
   git push origin main
   ```

2. **Deploy to Netlify**
   - Visit [netlify.com](https://netlify.com) and sign up/login
   - Click "New site from Git"
   - Connect your repository
   - Configure build settings (auto-detected from netlify.toml)
   - Set environment variables (see below)
   - Deploy!

## Environment Variables

Set these in Netlify Dashboard → Site settings → Environment variables:

```env
DATABASE_URL=postgresql://user:pass@host:port/database
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
SESSION_SECRET=your_random_secret_32_chars_min
NODE_ENV=production
```

## Database Setup

### Option 1: Neon (Recommended)
1. Visit [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string to `DATABASE_URL`

### Option 2: PlanetScale
1. Visit [planetscale.com](https://planetscale.com)
2. Create database
3. Get connection string

### Option 3: Railway
1. Visit [railway.app](https://railway.app)
2. Add PostgreSQL service
3. Copy connection variables

## Netlify Functions

The following serverless functions are automatically deployed:

- **Products API**: `/.netlify/functions/products`
- **Categories API**: `/.netlify/functions/categories`
- **Authentication**: `/.netlify/functions/auth-register`, `/.netlify/functions/auth-login`
- **PayPal Integration**: `/.netlify/functions/paypal-setup`, `/.netlify/functions/paypal-order`
- **Distributor Leads**: `/.netlify/functions/distributor-leads`

## Build Configuration

**netlify.toml** automatically configures:
- Build command: `npm run build:netlify`
- Publish directory: `dist/public`
- Functions directory: `netlify/functions`
- Redirects for SPA routing and API proxying

## Local Development

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Start local development server
npm run dev:netlify
```

## Deployment Commands

```bash
# Deploy to production
npm run deploy:netlify

# Or deploy preview
netlify deploy
```

## Custom Domain Setup

1. In Netlify Dashboard → Domain settings
2. Add custom domain
3. Configure DNS records:
   ```
   CNAME www your-site.netlify.app
   A @ 75.2.60.5
   ```

## Performance Optimization

**Automatic Optimizations:**
- Asset compression and minification
- Global CDN distribution
- HTTP/2 and Brotli compression
- Image optimization
- Prerendering for SEO

**Cache Headers:**
- Static assets: 1 year cache
- API responses: 5-10 minutes cache
- HTML: No cache (for SPA routing)

## Monitoring and Analytics

**Built-in Features:**
- Real-time deployment logs
- Function execution logs
- Bandwidth and request analytics
- Performance monitoring

**Recommended Additions:**
- Sentry for error tracking
- Google Analytics for user analytics
- LogRocket for session replay

## Troubleshooting

**Common Issues:**

1. **Function Timeout**
   - Default: 10 seconds
   - Increase in netlify.toml if needed
   ```toml
   [functions]
   timeout = 30
   ```

2. **Environment Variables Not Working**
   - Check spelling and case sensitivity
   - Restart deployment after adding variables
   - Verify in function logs

3. **Build Failures**
   - Check build logs in Netlify dashboard
   - Verify all dependencies are in package.json
   - Test build locally: `npm run build:netlify`

4. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database service status
   - Test connection from function logs

## Security Features

**Automatic Security:**
- HTTPS with automatic certificates
- DDoS protection
- Security headers
- Access control

**Configuration:**
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

## Cost Estimation

**Free Tier Includes:**
- 100GB bandwidth/month
- 125,000 function calls/month
- 300 build minutes/month

**Paid Plans:**
- Pro: $19/month (400GB bandwidth, unlimited functions)
- Business: $99/month (1TB bandwidth, advanced features)

## Support Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Community Forum](https://answers.netlify.com/)
- [Status Page](https://www.netlifystatus.com/)

Your NatureVital application is now ready for production deployment on Netlify with serverless architecture!