# NatureVital E-commerce Platform Documentation

## Overview

NatureVital is a modern, full-stack e-commerce platform specialized in premium natural health products including supplements, herbal teas, essential oils, and skincare products. Built with React, Express.js, and PostgreSQL, featuring PayPal integration and mobile-first responsive design.

## Quick Start

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL database
- PayPal Business Account (for payment processing)

### Installation
```bash
# Clone and install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Configure DATABASE_URL, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET

# Start development server
npm run dev
```

### Environment Variables
```env
DATABASE_URL=postgresql://username:password@localhost:5432/naturevital
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
NODE_ENV=development
```

## Architecture Overview

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Payment**: PayPal REST API
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: Zustand + TanStack Query

### Project Structure
```
project/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Route components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and stores
│   │   └── App.tsx       # Main app component
├── server/               # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── paypal.ts         # PayPal integration
│   ├── storage.ts        # Data layer
│   └── vite.ts           # Vite SSR setup
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema and types
├── docs/                 # Documentation
└── public/               # Static assets
```

## Core Features

### 1. User Management
- Registration and authentication
- Session-based auth with secure cookies
- User profiles and preferences
- Role-based access control

### 2. Product Catalog
- Dynamic product browsing
- Category-based filtering
- Search functionality
- Featured products system
- Stock management

### 3. Shopping Cart
- Persistent cart state
- Real-time quantity updates
- Mobile-optimized drawer interface
- Local storage backup

### 4. Payment Processing
- PayPal integration
- Secure checkout flow
- Order tracking
- Transaction history

### 5. Progressive Web App
- Service worker for offline functionality
- Install prompts
- Mobile app-like experience
- Push notifications ready

## API Documentation

### Authentication Endpoints
```
POST /api/auth/login      # User login
POST /api/auth/register   # User registration
POST /api/auth/logout     # User logout
GET  /api/auth/me         # Get current user
```

### Product Endpoints
```
GET  /api/products              # Get all products
GET  /api/products?category=X   # Get products by category
GET  /api/products?search=X     # Search products
GET  /api/products/:id          # Get single product
```

### Cart Endpoints
```
GET    /api/cart                # Get cart items
POST   /api/cart                # Add to cart
PUT    /api/cart/:id            # Update cart item
DELETE /api/cart/:id            # Remove from cart
DELETE /api/cart                # Clear cart
```

### Payment Endpoints
```
GET  /api/paypal/setup          # Get PayPal client token
POST /api/paypal/order          # Create PayPal order
POST /api/paypal/order/:id/capture  # Capture payment
```

## Development Guide

### Component Architecture
Components follow a hierarchical structure:
- **Pages**: Top-level route components
- **Layouts**: Shared layout components (Header, Navigation)
- **Features**: Business logic components (Cart, Checkout)
- **UI**: Reusable interface components (Button, Card)

### State Management
- **Zustand**: Client-side state (auth, cart)
- **TanStack Query**: Server state and caching
- **React Context**: Theme and global UI state

### Styling Guidelines
- Mobile-first responsive design
- Tailwind CSS utility classes
- Custom CSS variables for theming
- Shadcn/ui component library

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Husky for pre-commit hooks

## Deployment

### Production Build
```bash
npm run build    # Build frontend and backend
npm run start    # Start production server
```

### Environment Setup
- Set NODE_ENV=production
- Configure production database
- Set PayPal production credentials
- Configure domain and SSL

### Replit Deployment
The app is configured for Replit deployment:
- Automatic builds on push
- Environment variable management
- Database provisioning
- SSL termination

## Troubleshooting

### Common Issues
1. **Database Connection**: Verify DATABASE_URL format
2. **PayPal Errors**: Check API credentials and environment
3. **Build Failures**: Clear node_modules and reinstall
4. **TypeScript Errors**: Run type checking with `npm run type-check`

### Debug Mode
Enable detailed logging:
```env
NODE_ENV=development
DEBUG=express:*
```

### Performance Monitoring
- Client-side: React DevTools
- Server-side: Express logging
- Database: Query performance logs

## Contributing

### Development Workflow
1. Create feature branch
2. Make changes with tests
3. Run quality checks
4. Submit pull request
5. Deploy after review

### Code Standards
- Use TypeScript strictly
- Follow React best practices
- Write descriptive commit messages
- Add documentation for new features

## Support

For technical support:
- Check troubleshooting guide
- Review error logs
- Contact development team
- Submit GitHub issues

---

Last updated: June 2025
Version: 1.0.0