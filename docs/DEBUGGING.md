# Debugging Guide

## Overview

This guide provides comprehensive debugging information for the NatureVital e-commerce platform, including common issues, debugging tools, and troubleshooting procedures.

## Development Environment Setup

### Debug Mode Configuration

**Environment Variables:**
```env
NODE_ENV=development
DEBUG=express:*,paypal:*,cart:*
LOG_LEVEL=debug
VERBOSE_LOGGING=true
```

**Enable Debug Logging:**
```typescript
// server/index.ts
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}
```

### Browser Developer Tools

**React DevTools:**
- Install React Developer Tools extension
- Components tab shows component tree and props
- Profiler tab for performance analysis

**Console Debugging:**
```javascript
// Enable verbose logging in browser
localStorage.setItem('debug', 'naturevital:*');

// Monitor state changes
window.store = useCartStore.getState();
```

---

## Common Issues and Solutions

### 1. Authentication Issues

#### Problem: User not staying logged in
**Symptoms:**
- User gets logged out on page refresh
- Session appears to expire immediately
- `useAuth` returns null user

**Debugging Steps:**
```typescript
// Check session configuration
console.log('Session config:', {
  secret: process.env.SESSION_SECRET ? '[HIDDEN]' : 'MISSING',
  store: req.sessionStore.constructor.name,
  cookie: req.session.cookie,
});

// Check session in request
app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Session data:', req.session);
  console.log('User ID:', req.session.userId);
  next();
});
```

**Common Causes & Solutions:**
- **Missing SESSION_SECRET**: Set in environment variables
- **Cookie settings**: Ensure `secure: false` in development
- **CORS issues**: Configure credentials properly
- **Database store**: Verify PostgreSQL connection

**Fix:**
```typescript
// server/index.ts - Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-key',
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

---

### 2. PayPal Integration Issues

#### Problem: PayPal button not loading
**Symptoms:**
- PayPal button doesn't appear
- Console errors about PayPal SDK
- Payment flow doesn't start

**Debugging Steps:**
```typescript
// Check PayPal configuration
console.log('PayPal Config:', {
  clientId: process.env.PAYPAL_CLIENT_ID ? '[SET]' : 'MISSING',
  clientSecret: process.env.PAYPAL_CLIENT_SECRET ? '[SET]' : 'MISSING',
  environment: process.env.NODE_ENV,
});

// Monitor PayPal SDK loading
useEffect(() => {
  console.log('PayPal SDK loading...');
  
  const script = document.createElement('script');
  script.src = process.env.NODE_ENV === 'production'
    ? 'https://www.paypal.com/web-sdk/v6/core'
    : 'https://www.sandbox.paypal.com/web-sdk/v6/core';
    
  script.onload = () => console.log('PayPal SDK loaded successfully');
  script.onerror = () => console.error('PayPal SDK failed to load');
  
  document.body.appendChild(script);
}, []);
```

**Common Solutions:**
- Verify PayPal credentials in environment
- Check network connectivity to PayPal servers
- Ensure correct environment (sandbox vs production)
- Clear browser cache and cookies

---

#### Problem: PayPal order creation fails
**Debugging:**
```typescript
// server/paypal.ts - Enhanced error logging
export async function createPaypalOrder(req: Request, res: Response) {
  try {
    const { amount, currency, intent } = req.body;
    
    console.log('Creating PayPal order:', { amount, currency, intent });
    
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
    
    console.log('PayPal order request:', JSON.stringify(orderRequest, null, 2));
    
    const { body, ...httpResponse } = await ordersController.createOrder(orderRequest);
    
    console.log('PayPal response status:', httpResponse.statusCode);
    console.log('PayPal response body:', String(body));
    
    const jsonResponse = JSON.parse(String(body));
    res.status(httpResponse.statusCode).json(jsonResponse);
  } catch (error) {
    console.error('PayPal order creation failed:', {
      error: error.message,
      stack: error.stack,
      request: req.body,
    });
    res.status(500).json({ error: 'Failed to create order' });
  }
}
```

---

### 3. Cart State Issues

#### Problem: Cart items disappearing
**Symptoms:**
- Items added to cart don't persist
- Cart shows different counts in different components
- Cart state resets unexpectedly

**Debugging Steps:**
```typescript
// Monitor cart state changes
const useCartDebug = () => {
  const cart = useCartStore();
  
  useEffect(() => {
    console.log('Cart state changed:', {
      items: cart.items,
      totalItems: cart.getTotalItems(),
      totalPrice: cart.getTotalPrice(),
      isOpen: cart.isOpen,
    });
  }, [cart.items, cart.isOpen]);
  
  return cart;
};

// Check localStorage persistence
const checkCartPersistence = () => {
  const stored = localStorage.getItem('cart-storage');
  console.log('Stored cart:', stored ? JSON.parse(stored) : 'None');
};
```

**Common Solutions:**
- Verify Zustand store configuration
- Check localStorage quota and permissions
- Ensure cart state is properly serialized
- Verify cart item IDs are unique

---

### 4. Database Connection Issues

#### Problem: Database queries failing
**Debugging Steps:**
```typescript
// Test database connection
const testDatabaseConnection = async () => {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL configured:', !!process.env.DATABASE_URL);
    
    // Test basic query
    const result = await storage.getProducts();
    console.log('Database test successful:', result.length, 'products found');
    
    return true;
  } catch (error) {
    console.error('Database connection failed:', {
      error: error.message,
      code: error.code,
      stack: error.stack,
    });
    return false;
  }
};

// Monitor query performance
const logSlowQueries = (threshold = 1000) => {
  const originalQuery = storage.getProducts;
  
  storage.getProducts = async (...args) => {
    const start = Date.now();
    const result = await originalQuery.call(storage, ...args);
    const duration = Date.now() - start;
    
    if (duration > threshold) {
      console.warn(`Slow query detected: getProducts took ${duration}ms`);
    }
    
    return result;
  };
};
```

---

### 5. React Query Issues

#### Problem: Data not updating or caching issues
**Debugging Steps:**
```typescript
// React Query DevTools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <>
      {/* Your app components */}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}

// Monitor query states
const useProductsDebug = () => {
  const query = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => fetch('/api/products').then(res => res.json()),
  });
  
  useEffect(() => {
    console.log('Products query state:', {
      status: query.status,
      isLoading: query.isLoading,
      isError: query.isError,
      error: query.error,
      data: query.data?.length,
      lastUpdated: query.dataUpdatedAt,
    });
  }, [query]);
  
  return query;
};

// Force cache invalidation
const invalidateAllQueries = () => {
  queryClient.invalidateQueries();
  console.log('All queries invalidated');
};
```

---

## Performance Debugging

### Frontend Performance

#### Component Re-render Analysis
```typescript
// Track component renders
const useRenderCount = (componentName: string) => {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    console.log(`${componentName} rendered ${renderCount.current} times`);
  });
  
  return renderCount.current;
};

// Usage in components
const ProductCard = ({ product }) => {
  const renderCount = useRenderCount('ProductCard');
  
  // Component implementation
};
```

#### Memory Leak Detection
```typescript
// Monitor memory usage
const trackMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = performance.memory;
    console.log('Memory usage:', {
      used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB',
    });
  }
};

// Track at intervals
setInterval(trackMemoryUsage, 10000);
```

### Backend Performance

#### Request Timing
```typescript
// Middleware for request timing
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
  });
  
  next();
});
```

#### Memory Monitoring
```typescript
// Monitor Node.js memory usage
const logMemoryUsage = () => {
  const usage = process.memoryUsage();
  console.log('Memory usage:', {
    rss: Math.round(usage.rss / 1024 / 1024) + ' MB',
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + ' MB',
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + ' MB',
    external: Math.round(usage.external / 1024 / 1024) + ' MB',
  });
};

setInterval(logMemoryUsage, 30000);
```

---

## Error Tracking and Logging

### Structured Logging
```typescript
// Enhanced logging utility
class Logger {
  private static instance: Logger;
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  private log(level: string, message: string, meta: any = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta,
    };
    
    console.log(JSON.stringify(logEntry));
  }
  
  info(message: string, meta?: any) {
    this.log('info', message, meta);
  }
  
  warn(message: string, meta?: any) {
    this.log('warn', message, meta);
  }
  
  error(message: string, error?: Error, meta?: any) {
    this.log('error', message, {
      error: error?.message,
      stack: error?.stack,
      ...meta,
    });
  }
}

const logger = Logger.getInstance();

// Usage throughout the application
logger.info('User logged in', { userId: user.id });
logger.error('PayPal order failed', error, { orderId, amount });
```

### Error Boundary for React
```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
    
    // Send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // sendErrorToService(error, errorInfo);
    }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.stack}</pre>
          </details>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

---

## Testing and Validation

### API Testing
```typescript
// Test API endpoints
const testAPIEndpoints = async () => {
  const endpoints = [
    { method: 'GET', url: '/api/products' },
    { method: 'GET', url: '/api/categories' },
    { method: 'GET', url: '/api/auth/me' },
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        credentials: 'include',
      });
      
      console.log(`${endpoint.method} ${endpoint.url}:`, {
        status: response.status,
        ok: response.ok,
        contentType: response.headers.get('content-type'),
      });
    } catch (error) {
      console.error(`${endpoint.method} ${endpoint.url} failed:`, error);
    }
  }
};
```

### Database Validation
```typescript
// Validate data integrity
const validateDataIntegrity = async () => {
  try {
    const products = await storage.getProducts();
    const categories = await storage.getCategories();
    
    // Check for orphaned products
    const orphanedProducts = products.filter(product => 
      !categories.find(cat => cat.id === product.categoryId)
    );
    
    if (orphanedProducts.length > 0) {
      console.warn('Orphaned products found:', orphanedProducts);
    }
    
    // Check for invalid prices
    const invalidPrices = products.filter(product => 
      isNaN(parseFloat(product.price)) || parseFloat(product.price) <= 0
    );
    
    if (invalidPrices.length > 0) {
      console.warn('Invalid prices found:', invalidPrices);
    }
    
    console.log('Data integrity check completed');
  } catch (error) {
    console.error('Data integrity check failed:', error);
  }
};
```

---

## Browser Debugging Tools

### Network Tab Analysis
1. Open DevTools → Network tab
2. Filter by XHR/Fetch to see API calls
3. Check request/response headers and timing
4. Look for failed requests (red status)

### Application Tab
1. Check Local Storage for cart data
2. Verify Session Storage for temporary data
3. Inspect Cookies for authentication
4. Check Service Worker status

### Performance Tab
1. Record performance profile
2. Analyze component render times
3. Check for memory leaks
4. Identify long tasks

---

## Production Debugging

### Log Analysis
```bash
# View application logs
repl logs --tail

# Filter for errors
repl logs | grep ERROR

# Search for specific patterns
repl logs | grep "PayPal\|payment\|order"
```

### Health Check Endpoint
```typescript
// Add health check endpoint
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
    checks: {},
  };
  
  // Database check
  try {
    await storage.getProducts();
    health.checks.database = 'ok';
  } catch (error) {
    health.checks.database = 'error';
    health.status = 'error';
  }
  
  // PayPal check
  try {
    await getClientToken();
    health.checks.paypal = 'ok';
  } catch (error) {
    health.checks.paypal = 'error';
  }
  
  res.status(health.status === 'ok' ? 200 : 503).json(health);
});
```

### Monitoring Metrics
```typescript
// Track key metrics
class Metrics {
  private static counters = new Map<string, number>();
  private static timers = new Map<string, number[]>();
  
  static increment(metric: string, value = 1) {
    const current = this.counters.get(metric) || 0;
    this.counters.set(metric, current + value);
  }
  
  static time(metric: string, duration: number) {
    const times = this.timers.get(metric) || [];
    times.push(duration);
    this.timers.set(metric, times);
  }
  
  static getReport() {
    const report = {
      counters: Object.fromEntries(this.counters),
      timers: {},
    };
    
    for (const [metric, times] of this.timers) {
      report.timers[metric] = {
        count: times.length,
        average: times.reduce((a, b) => a + b, 0) / times.length,
        min: Math.min(...times),
        max: Math.max(...times),
      };
    }
    
    return report;
  }
}

// Usage
Metrics.increment('api.products.requests');
Metrics.time('api.products.duration', responseTime);
```

---

This debugging guide provides comprehensive tools and techniques for identifying and resolving issues in the NatureVital e-commerce platform across all layers of the application stack.