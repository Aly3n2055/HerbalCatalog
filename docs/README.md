
# NatureVital E-Commerce Platform

A modern, full-stack e-commerce platform for natural wellness products built with React, TypeScript, and Express.js. The platform features a responsive design optimized for both desktop and mobile experiences.

## 🌟 Features

### User Experience
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Progressive Web App (PWA)**: Installable app with offline capabilities
- **Touch-Optimized Interface**: Enhanced mobile interactions and feedback
- **Animated Loading States**: Smooth skeleton loading animations throughout

### E-Commerce Functionality
- **Product Catalog**: Browse and search natural wellness products
- **Smart Cart Management**: Persistent cart across sessions
- **Dual Payment System**: Integrated PayPal and credit card payments
- **User Authentication**: Secure registration and login system
- **Username Validation**: Real-time availability checking

### Business Features
- **Distributor Program**: Application system for business partners
- **Role-Based Access**: Customer and distributor user roles
- **Lead Management**: Capture and store distributor applications
- **Inventory Management**: Stock tracking and availability

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for responsive styling
- **Shadcn/UI** for consistent components
- **React Hook Form** with Zod validation
- **TanStack Query** for state management
- **Zustand** for client-side storage

### Backend Stack
- **Express.js** with TypeScript
- **Netlify Functions** for serverless deployment
- **NeonDB** (PostgreSQL) for production database
- **Better-SQLite3** for local development
- **bcryptjs** for password hashing
- **PayPal SDK** for payment processing

### Deployment & DevOps
- **Netlify** for frontend and functions hosting
- **Replit** for development environment
- **GitHub** for version control
- **Environment Variables** for secure configuration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (for production)

### Installation

1. **Clone the repository**
```bash
git clone [repository-url]
cd naturevital
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Database Setup**
```bash
# For local development (SQLite)
npm run seed

# For production (PostgreSQL/Neon)
# Database tables will be created automatically
```

5. **Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
naturevital/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and stores
│   │   └── services/      # API services
├── server/                # Express.js backend
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database operations
│   └── index.ts           # Server entry point
├── netlify/
│   └── functions/         # Serverless functions
├── shared/
│   └── schema.ts          # Shared TypeScript types
├── docs/                  # Project documentation
└── public/                # Static assets
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**
```bash
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

**Backend/Functions**
```bash
DATABASE_URL=your_neon_database_url
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_ENVIRONMENT=sandbox # or live
```

### Database Schema

The application uses the following main tables:
- `users` - User authentication and profiles
- `products` - Product catalog
- `cart_items` - Shopping cart persistence
- `orders` - Order history
- `distributor_leads` - Business partner applications

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run seed         # Seed database with sample data
npm run type-check   # Run TypeScript checks
```

### Code Quality

- **TypeScript**: Strict typing throughout
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

## 🚀 Deployment

### Netlify Deployment

1. **Connect Repository**
   - Link GitHub repository to Netlify
   - Set build settings: `npm run build`
   - Set publish directory: `dist`

2. **Environment Variables**
   - Add all required environment variables in Netlify dashboard
   - Include database URLs and PayPal credentials

3. **Function Configuration**
   - Netlify Functions automatically deploy from `/netlify/functions/`
   - Configure redirects in `netlify.toml`

### Database Setup (NeonDB)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project and database
3. Copy connection string to `DATABASE_URL`
4. Tables will be created automatically on first function call

## 🔐 Security

- **Password Hashing**: bcryptjs with salt rounds
- **Input Validation**: Zod schemas for all inputs
- **CORS Configuration**: Proper cross-origin settings
- **Environment Variables**: Secure credential storage
- **SQL Injection Prevention**: Parameterized queries

## 📱 Mobile Experience

- **Responsive Design**: Breakpoint-based layouts
- **Touch Interactions**: Optimized button sizes and gestures
- **Bottom Navigation**: Mobile-friendly navigation pattern
- **PWA Features**: App-like experience on mobile devices
- **Performance**: Optimized loading and animations

## 🎨 UI/UX Features

- **Design System**: Consistent component library
- **Dark/Light Mode**: Automatic theme detection
- **Loading States**: Skeleton animations for better perceived performance
- **Error Handling**: User-friendly error messages and recovery
- **Accessibility**: WCAG compliant components

## 📊 Performance

- **Code Splitting**: Lazy loading of route components
- **Image Optimization**: Responsive image loading
- **Caching**: Intelligent query caching with TanStack Query
- **Bundle Size**: Optimized build output
- **Server-Side Rendering**: Fast initial page loads

## 🧪 Testing

```bash
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Component Library](./docs/COMPONENTS.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check [Troubleshooting Guide](./docs/TROUBLESHOOTING.md)
- Create an issue on GitHub
- Contact the development team

## 🎯 Roadmap

### Upcoming Features
- [ ] Email notifications
- [ ] Advanced product filtering
- [ ] Wishlist functionality
- [ ] Order tracking
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Inventory alerts
- [ ] Customer reviews and ratings

### Performance Improvements
- [ ] Server-side rendering (SSR)
- [ ] Advanced caching strategies
- [ ] Image optimization pipeline
- [ ] Database query optimization

---

Built with ❤️ for natural wellness enthusiasts
