# NatureVital - E-commerce Platform

## Overview

NatureVital is a modern e-commerce platform specialized in premium natural health products. The application features a full-stack architecture with a React frontend, Express.js backend, and PostgreSQL database. It includes e-commerce functionality, user authentication, cart management, Stripe payment integration, and a distributor program system.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite for fast development and building
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom nature-themed color palette
- **State Management**: 
  - Zustand for client-side state (auth, cart)
  - TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **PWA Features**: Service worker, manifest, and install prompts for app-like experience

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Session-based with bcrypt password hashing
- **Payment Processing**: Stripe integration for secure transactions
- **Development**: TSX for TypeScript execution in development

### Database Architecture
- **Database**: PostgreSQL (configured via DATABASE_URL)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for type sharing between frontend and backend
- **Migrations**: Managed through `drizzle-kit` with output to `./migrations`

## Key Components

### User Management
- User registration and authentication system
- Role-based access (customer, distributor, admin)
- Profile management with personal information
- Stripe customer integration for payment processing

### Product Catalog
- Product management with categories, ratings, and reviews
- Featured products system
- Search and filtering capabilities
- Image management and external URL support for third-party retailers

### Shopping Cart & Orders
- Persistent cart state with Zustand
- Real-time cart updates and management
- Order processing with line items
- Integration with Stripe for payment processing

### Distributor Program
- Lead generation system for potential distributors
- Upline/downline relationship tracking
- Distributor ID management for referral programs

### Progressive Web App
- Offline functionality with service worker
- App installation prompts
- Mobile-optimized responsive design
- Touch-friendly interactions

## Data Flow

1. **Client Requests**: Frontend makes API calls through custom `apiRequest` utility
2. **Authentication**: Session-based auth with cookie storage
3. **Data Fetching**: TanStack Query manages server state with automatic caching
4. **State Updates**: Zustand stores handle client-side state (cart, auth)
5. **Database Operations**: Drizzle ORM provides type-safe database interactions
6. **Payment Processing**: Stripe handles secure payment transactions

## External Dependencies

### Payment Processing
- **Stripe**: Integrated for secure payment processing
- Environment variables required: `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLIC_KEY`

### Database
- **Neon/PostgreSQL**: Database hosting via `@neondatabase/serverless`
- Connection string required: `DATABASE_URL`

### UI Components
- **Radix UI**: Headless UI primitives for accessibility
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Replit Integration**: Configured for Replit deployment and development
- **Vite Plugins**: Runtime error overlay and cartographer for enhanced development

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle pushes schema changes via `npm run db:push`

### Environment Configuration
- **Development**: Uses TSX for hot reloading with `npm run dev`
- **Production**: Node.js serves bundled application with `npm run start`
- **Database**: PostgreSQL module configured in Replit environment

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16
- **Deployment**: Autoscale deployment target
- **Port Configuration**: Internal port 5000, external port 80

## Recent Changes

- **June 24, 2025**: Initial setup completed
- **June 24, 2025**: Replaced Stripe with PayPal integration
- **June 24, 2025**: Fixed startup errors and missing dependencies
- **June 24, 2025**: Application running successfully with PayPal payment system
- **June 24, 2025**: Enhanced UX/UI with modern mobile-first responsive design
- **June 24, 2025**: Created comprehensive project documentation including API, components, architecture, and debugging guides
- **June 24, 2025**: Added Netlify deployment configuration with serverless functions
- **June 24, 2025**: Created multi-platform deployment documentation and changelog
- **June 24, 2025**: Integrated NeonDB serverless PostgreSQL database
- **June 24, 2025**: Added Vercel deployment configuration and database seeding

## Current Status

- ✓ Application server running on port 5000
- ✓ NeonDB PostgreSQL database connected and seeded
- ✓ Product and category APIs functional
- ✓ User authentication system operational
- ✓ Cart management working
- ✓ PayPal integration configured for production environment
- ✓ Mobile-first responsive design with modern UX/UI
- ✓ Comprehensive documentation created for all systems
- ✓ Netlify deployment ready with serverless functions
- ✓ Vercel deployment configured with NeonDB integration
- ✓ Multi-platform deployment options configured
- ✓ Complete e-commerce platform ready for production deployment

## Changelog

Changelog:
- June 24, 2025. Initial setup and PayPal integration

## User Preferences

Preferred communication style: Simple, everyday language.