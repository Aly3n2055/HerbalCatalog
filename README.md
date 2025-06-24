# NatureVital E-commerce Platform

A modern, full-stack e-commerce platform for premium natural health products, built with React, Express.js, and PayPal integration.

## Quick Start

```bash
# Clone and install dependencies
npm install

# Copy environment configuration
cp .env.example .env
# Edit .env with your PayPal credentials and database URL

# Start development server
npm run dev
```

Visit `http://localhost:5000` to see the application.

## Features

### 🛍️ E-commerce Core
- Product catalog with search and filtering
- Shopping cart with persistent state
- Secure PayPal payment processing
- User authentication and profiles
- Order management and history

### 📱 Modern UX/UI
- Mobile-first responsive design
- Progressive Web App (PWA) capabilities
- Touch-optimized interfaces
- Glass morphism and smooth animations
- Dark mode support ready

### 🔧 Technical Excellence
- TypeScript throughout the stack
- React 18 with modern hooks
- Express.js with session-based auth
- TanStack Query for server state
- Zustand for client state
- Tailwind CSS + Shadcn/ui components

## Deployment Options

### Replit (Integrated Development)
Ready to deploy with the Deploy button - includes database and environment setup.

### Netlify (Recommended for Production)
```bash
npm run build:netlify
netlify deploy --prod
```

### Other Platforms
- **Vercel**: Optimized for React applications
- **AWS**: Enterprise-grade scalability
- **Digital Ocean**: Simple VPS deployment

See [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.

## Project Structure

```
├── client/                 # React frontend
│   ├── src/components/     # UI components
│   ├── src/pages/          # Route components
│   └── src/lib/            # Utilities and stores
├── server/                 # Express backend
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Data layer
│   └── paypal.ts           # Payment integration
├── netlify/functions/      # Serverless functions
├── shared/                 # Shared types
├── docs/                   # Documentation
└── public/                 # Static assets
```

## API Endpoints

### Products
- `GET /api/products` - List products (supports ?category, ?search, ?featured)
- `GET /api/products/:id` - Get single product

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Current user

### Shopping Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update quantity
- `DELETE /api/cart/:id` - Remove item

### PayPal Integration
- `GET /api/paypal/setup` - Get client token
- `POST /api/paypal/order` - Create order
- `POST /api/paypal/order/:id/capture` - Capture payment

## Environment Variables

```env
DATABASE_URL=postgresql://user:pass@host:port/db
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
SESSION_SECRET=your_secure_random_key
NODE_ENV=development
```

## Documentation

- **[Architecture Guide](docs/ARCHITECTURE.md)** - System design and patterns
- **[Component Documentation](docs/COMPONENTS.md)** - UI component reference
- **[API Reference](docs/API.md)** - Complete endpoint documentation
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Multi-platform deployment
- **[Debugging Guide](docs/DEBUGGING.md)** - Troubleshooting and tools
- **[Workflow Documentation](docs/WORKFLOWS.md)** - Business processes
- **[Inner Workings](docs/INNER_WORKINGS.md)** - Deep technical details
- **[Changelog](docs/CHANGELOG.md)** - Version history

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** with custom design system
- **Shadcn/ui** components
- **Zustand** for state management
- **TanStack Query** for server state
- **Wouter** for routing

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for database operations
- **bcrypt** for password hashing
- **Express Sessions** for authentication
- **PayPal SDK** for payment processing

### Database
- **PostgreSQL** (production)
- **In-memory storage** (development)

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- HTTP-only session cookies
- CSRF protection
- Input validation with Zod schemas
- XSS prevention
- HTTPS enforcement (production)

## Performance Optimization

- Code splitting with React.lazy()
- Image lazy loading
- Service worker caching
- TanStack Query with smart caching
- Bundle optimization with Vite
- CDN delivery (Netlify/Vercel)

## Mobile Support

- Touch-friendly 44px minimum button sizes
- iOS Safari optimization
- PWA installation prompts
- Offline functionality
- Responsive breakpoints
- Safe area support for notched devices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- Check the [Troubleshooting Guide](docs/DEBUGGING.md)
- Review [API Documentation](docs/API.md)
- Consult [Architecture Documentation](docs/ARCHITECTURE.md)

---

Built with ❤️ for the natural health community