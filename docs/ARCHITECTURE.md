# NatureVital Architecture Documentation

## System Architecture Overview

NatureVital follows a modern full-stack architecture with clear separation of concerns, scalable design patterns, and production-ready infrastructure.

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client (SPA)  │────│  Express API    │────│   PostgreSQL    │
│   React + Vite  │    │   Node.js TS    │    │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐             │
         └──────────────│  PayPal API     │─────────────┘
                        │  Integration    │
                        └─────────────────┘
```

## Frontend Architecture

### Component Hierarchy
```
App.tsx
├── Router (wouter)
├── AuthProvider
├── CartProvider
└── Pages/
    ├── Home
    │   ├── Header
    │   ├── HeroSection
    │   ├── CategoryGrid
    │   ├── FeaturedProducts
    │   └── Footer
    ├── Products
    │   ├── Header
    │   ├── SearchFilters
    │   ├── CategoryCards
    │   ├── ProductGrid
    │   └── BottomNavigation
    ├── ProductDetail
    ├── Cart
    ├── Checkout
    └── Account
```

### State Management Strategy

#### 1. Client State (Zustand)
```typescript
// Authentication Store
interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

// Cart Store
interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}
```

#### 2. Server State (TanStack Query)
```typescript
// Product queries
const useProducts = () => useQuery({
  queryKey: ['/api/products'],
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Cart mutations
const useAddToCart = () => useMutation({
  mutationFn: (item: CartItem) => apiRequest('/api/cart', {
    method: 'POST',
    body: JSON.stringify(item),
  }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
  },
});
```

### Data Flow Architecture

```
User Interaction
       ↓
React Component
       ↓
Event Handler
       ↓
Store Update (Zustand) / API Call (TanStack Query)
       ↓
State Change
       ↓
Component Re-render
       ↓
UI Update
```

## Backend Architecture

### Express.js Application Structure

```typescript
// Server Entry Point (server/index.ts)
const app = express();

// Middleware Stack
app.use(cors());
app.use(express.json());
app.use(session());
app.use(passport.initialize());
app.use(passport.session());

// Route Registration
await registerRoutes(app);

// Error Handling
app.use(errorHandler);
```

### API Layer Design

#### Route Handler Pattern
```typescript
// GET /api/products
app.get('/api/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let products: Product[];
    if (category) {
      products = await storage.getProductsByCategory(category);
    } else if (search) {
      products = await storage.searchProducts(search);
    } else {
      products = await storage.getProducts();
    }
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});
```

### Data Access Layer

#### Storage Interface Pattern
```typescript
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  
  // Cart
  getCartItems(userId: number): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(userId: number): Promise<Order[]>;
}
```

#### Memory Storage Implementation
```typescript
export class MemStorage implements IStorage {
  private users = new Map<number, User>();
  private products = new Map<number, Product>();
  private cartItems = new Map<number, CartItem>();
  
  constructor() {
    this.seedData(); // Initialize with sample data
  }
  
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    const allProducts = Array.from(this.products.values());
    return allProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  }
}
```

## Database Architecture

### Schema Design

#### Core Entities
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  image_url VARCHAR(500),
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  paypal_order_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Relationships
```
users (1) ────── (many) orders
  │
  └── (many) cart_items ────── (1) products
                                │
categories (1) ────── (many) products
                                │
orders (1) ────── (many) order_items ────── (1) products
```

### Drizzle ORM Configuration

```typescript
// Database schema definition
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Type inference
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
```

## Payment Integration Architecture

### PayPal Integration Flow

```
Client Request
       ↓
POST /api/paypal/order
       ↓
PayPal SDK createOrder()
       ↓
Return Order ID to Client
       ↓
PayPal Checkout UI
       ↓
User Approves Payment
       ↓
POST /api/paypal/order/:id/capture
       ↓
PayPal SDK captureOrder()
       ↓
Update Database
       ↓
Return Success Response
```

### PayPal Service Implementation

```typescript
// PayPal client configuration
const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: PAYPAL_CLIENT_ID,
    oAuthClientSecret: PAYPAL_CLIENT_SECRET,
  },
  environment: process.env.NODE_ENV === "production" 
    ? Environment.Production 
    : Environment.Sandbox,
});

// Order creation
export async function createPaypalOrder(req: Request, res: Response) {
  const { amount, currency, intent } = req.body;
  
  const orderRequest = {
    body: {
      intent: intent,
      purchaseUnits: [{
        amount: {
          currencyCode: currency,
          value: amount,
        },
      }],
    },
    prefer: "return=minimal",
  };
  
  const { body } = await ordersController.createOrder(orderRequest);
  res.json(JSON.parse(String(body)));
}
```

## Security Architecture

### Authentication & Authorization

#### Session-based Authentication
```typescript
// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new PostgreSQLStore({
    conString: process.env.DATABASE_URL,
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));
```

#### Password Security
```typescript
// Password hashing with bcrypt
const saltRounds = 12;
const passwordHash = await bcrypt.hash(password, saltRounds);

// Password verification
const isValid = await bcrypt.compare(password, user.passwordHash);
```

### Input Validation

#### Zod Schema Validation
```typescript
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
});

// Route validation
app.post('/api/users', async (req, res) => {
  const validatedData = createUserSchema.parse(req.body);
  const user = await storage.createUser(validatedData);
  res.json(user);
});
```

## Performance Architecture

### Frontend Optimizations

#### Code Splitting
```typescript
// Lazy loading for routes
const Products = lazy(() => import('@/pages/products'));
const ProductDetail = lazy(() => import('@/pages/product-detail'));

// Suspense boundaries
<Suspense fallback={<LoadingSpinner />}>
  <Route path="/products" component={Products} />
</Suspense>
```

#### State Management Optimization
```typescript
// Selective subscriptions
const user = useAuthStore(state => state.user);
const isLoading = useAuthStore(state => state.isLoading);

// Query optimization
const { data: products } = useQuery({
  queryKey: ['/api/products', category, search],
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
});
```

### Backend Optimizations

#### Response Caching
```typescript
// API response caching
app.get('/api/products', cache('5 minutes'), async (req, res) => {
  const products = await storage.getProducts();
  res.json(products);
});
```

#### Database Query Optimization
```typescript
// Efficient product queries with joins
const productsWithCategories = await db
  .select()
  .from(products)
  .leftJoin(categories, eq(products.categoryId, categories.id))
  .where(eq(products.featured, true))
  .limit(10);
```

## Deployment Architecture

### Development Environment
```
Local Machine
├── Node.js Development Server (port 5000)
├── Vite Dev Server (HMR)
├── PostgreSQL Database
└── PayPal Sandbox
```

### Production Environment (Replit)
```
Replit Container
├── Express Production Server
├── Built Static Assets
├── Neon PostgreSQL Database
├── PayPal Production API
└── SSL Termination
```

### Build Process
```bash
# Frontend build
vite build → dist/public/

# Backend build  
tsc → dist/server/

# Combined deployment
npm run start → serves both
```

## Monitoring & Debugging

### Error Handling Strategy
```typescript
// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error:', err);
  
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});
```

### Logging Architecture
```typescript
// Structured logging
const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta }));
  },
  error: (message: string, error?: Error) => {
    console.error(JSON.stringify({ 
      level: 'error', 
      message, 
      stack: error?.stack 
    }));
  },
};
```

## Scalability Considerations

### Horizontal Scaling
- Stateless server design
- Session store externalization
- Database connection pooling
- CDN for static assets

### Vertical Scaling
- Memory-efficient data structures
- Query optimization
- Caching strategies
- Asset compression

### Future Enhancements
- Redis for caching
- Database read replicas
- Microservices architecture
- Container orchestration

---

This architecture supports the current requirements while providing a foundation for future growth and enhancement.