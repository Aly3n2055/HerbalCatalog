# NatureVital Documentation Index

## Quick Start

For new developers joining the project:

1. **[README](./README.md)** - Project overview and setup instructions
2. **[Architecture Overview](./ARCHITECTURE.md)** - System design and patterns
3. **[API Documentation](./API.md)** - Complete REST API reference
4. **[Debugging Guide](./DEBUGGING.md)** - Troubleshooting and development tools

## Core Documentation

### System Architecture
- **[Architecture](./ARCHITECTURE.md)** - High-level system design, data flow, and component relationships
- **[Components](./COMPONENTS.md)** - Detailed component documentation with props, state, and usage patterns
- **[Workflows](./WORKFLOWS.md)** - Step-by-step process flows for user journeys and system operations

### Development
- **[API Reference](./API.md)** - Complete REST API documentation with examples
- **[Debugging Guide](./DEBUGGING.md)** - Common issues, performance monitoring, and debugging tools
- **[Environment Setup](./README.md#installation)** - Development environment configuration

## Feature Documentation

### User Management
- Authentication system with session-based security
- User registration and profile management
- Password hashing with bcrypt (12 salt rounds)

### Product Catalog
- Dynamic product browsing with category filtering
- Full-text search across name and description
- Featured products system with admin controls

### Shopping Cart
- Persistent cart state with Zustand store
- Real-time synchronization with server
- localStorage backup for offline scenarios

### Payment Processing
- PayPal integration with production credentials
- Secure order creation and payment capture
- Error handling and retry mechanisms

### Progressive Web App
- Service worker for offline functionality
- App installation prompts for mobile devices
- Push notification infrastructure (ready)

## Technical Reference

### Frontend Architecture
```
React 18 + TypeScript + Vite
├── State Management: Zustand + TanStack Query
├── Routing: Wouter (lightweight)
├── UI Framework: Shadcn/ui + Tailwind CSS
├── Payment: PayPal SDK Integration
└── PWA: Service Worker + Manifest
```

### Backend Architecture
```
Express.js + TypeScript + Node.js
├── Authentication: Session-based with Passport
├── Database: PostgreSQL + Drizzle ORM (dev: in-memory)
├── Payment: PayPal REST API
├── Security: bcrypt + CORS + Session store
└── Development: Vite integration with HMR
```

### Database Schema
- **Users**: Authentication and profile data
- **Products**: Catalog with categories and ratings
- **Categories**: Product organization with slug-based routing
- **Cart Items**: User shopping cart persistence
- **Orders**: Transaction history with PayPal integration
- **Order Items**: Line items for each order
- **Distributor Leads**: Business partnership applications

## Deployment Information

### Development Environment
- **Local Setup**: `npm run dev` starts both frontend and backend
- **Hot Reload**: Vite provides instant feedback for code changes
- **Database**: In-memory storage with realistic seed data
- **PayPal**: Sandbox environment for testing

### Production Environment (Replit)
- **Build Process**: `npm run build` creates optimized bundles
- **Server**: Express serves both API and static files
- **Database**: Neon PostgreSQL with connection pooling
- **PayPal**: Production API with live credentials
- **SSL**: Automatic HTTPS termination
- **Monitoring**: Built-in logging and health checks

## Code Organization

### Directory Structure
```
project/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and stores
│   │   └── App.tsx         # Main application
├── server/                 # Express backend
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API endpoint definitions
│   ├── storage.ts          # Data access layer
│   ├── paypal.ts           # Payment integration
│   └── auth.ts             # Authentication setup
├── shared/                 # Shared TypeScript types
│   └── schema.ts           # Database schema and validation
├── docs/                   # Comprehensive documentation
└── public/                 # Static assets and PWA files
```

### Code Quality Standards
- **TypeScript**: Strict mode enabled for all files
- **ESLint**: Code quality and consistency checks
- **Prettier**: Automatic code formatting
- **Validation**: Zod schemas for runtime type checking

## Development Workflows

### Adding New Features
1. Update shared schema if database changes needed
2. Implement backend API endpoints in `server/routes.ts`
3. Add storage layer methods in `server/storage.ts`
4. Create/update React components in `client/src/`
5. Add routing configuration if needed
6. Test functionality across all devices
7. Update documentation

### Testing Checklist
- [ ] User authentication (login/register/logout)
- [ ] Product browsing and search functionality
- [ ] Cart operations (add/remove/update quantities)
- [ ] PayPal payment flow (sandbox and production)
- [ ] Mobile responsiveness (iOS/Android)
- [ ] Offline functionality (PWA features)
- [ ] Error handling (network issues, validation)
- [ ] Performance (loading times, memory usage)

## Troubleshooting Quick Reference

### Common Issues
1. **Authentication Problems**: Check session configuration and database connectivity
2. **PayPal Errors**: Verify API credentials and network connectivity
3. **Cart State Issues**: Examine Zustand store and localStorage persistence
4. **Database Errors**: Validate connection string and query syntax
5. **Build Failures**: Clear node_modules and verify dependencies

### Debug Tools
- **React DevTools**: Component tree and state inspection
- **Network Tab**: API call monitoring and error analysis
- **Console Logging**: Structured logging throughout application
- **Performance Monitor**: Memory usage and rendering optimization

## Security Considerations

### Authentication Security
- Session-based authentication with HTTP-only cookies
- Password hashing with bcrypt (12 salt rounds)
- CSRF protection enabled for state-changing operations
- Secure cookie settings (httpOnly, secure in production)

### Data Protection
- Input validation using Zod schemas
- SQL injection prevention through parameterized queries
- XSS protection via React's built-in escaping
- HTTPS enforcement in production environment

### Payment Security
- PayPal handles all sensitive payment data
- No credit card information stored locally
- Secure API communication with PayPal servers
- Order verification before fulfillment

## Performance Optimization

### Frontend Optimizations
- Code splitting with React.lazy()
- Image lazy loading for product catalog
- TanStack Query caching for API responses
- Zustand for efficient state management
- Service worker for offline caching

### Backend Optimizations
- Response compression with gzip
- Database query optimization
- Session store externalization
- Static asset caching headers
- Connection pooling for database

## Contributing Guidelines

### Code Style
- Use TypeScript strictly (no `any` types)
- Follow React best practices (hooks, functional components)
- Implement proper error boundaries
- Write descriptive commit messages
- Add JSDoc comments for complex functions

### Documentation Requirements
- Update API docs for new endpoints
- Add component documentation for new UI elements
- Include workflow documentation for new features
- Update architecture docs for system changes

## Support and Maintenance

### Regular Maintenance Tasks
- Update dependencies monthly
- Monitor security vulnerabilities
- Review and optimize database queries
- Analyze performance metrics
- Update documentation for changes

### Monitoring and Alerting
- Application health checks at `/api/health`
- Error logging and tracking
- Performance monitoring dashboards
- PayPal webhook verification
- Database connection monitoring

---

This documentation system provides comprehensive coverage of the NatureVital e-commerce platform, enabling effective development, debugging, and maintenance operations.