# Workflow Documentation

## Overview

This document outlines the key workflows and processes in the NatureVital e-commerce platform, providing step-by-step breakdowns of user journeys, system processes, and business operations.

## User Workflows

### 1. User Registration and Authentication

#### Registration Flow
```
User visits /account → 
Clicks "Register" → 
Fills registration form → 
Client validates input → 
POST /api/auth/register → 
Server validates data → 
Hash password (bcrypt) → 
Save to database → 
Create session → 
Return user data → 
Redirect to home
```

**Implementation Details:**
```typescript
// Client-side validation (React Hook Form + Zod)
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

// Server-side processing
1. Validate request body against schema
2. Check if email already exists
3. Hash password with bcrypt (salt rounds: 12)
4. Insert user record
5. Create session (req.session.userId = user.id)
6. Return sanitized user data (no password)
```

#### Login Flow
```
User visits /account → 
Enters credentials → 
Client validates format → 
POST /api/auth/login → 
Server finds user by email → 
Verify password (bcrypt.compare) → 
Create session → 
Return user data → 
Update auth state → 
Redirect to previous page
```

### 2. Product Discovery and Search

#### Browse Products Flow
```
User visits /products → 
Load categories (GET /api/categories) → 
Load products (GET /api/products) → 
Display in responsive grid → 
User filters by category → 
Update URL (?category=supplements) → 
Fetch filtered products → 
Update display
```

#### Search Flow
```
User types in search box → 
Debounced input (300ms) → 
Update search query state → 
GET /api/products?search=query → 
Server performs full-text search → 
Return matching products → 
Update product grid → 
Show result count
```

**Search Implementation:**
```typescript
// Client-side debounced search
const [searchQuery, setSearchQuery] = useState("");
const debouncedSearch = useDebounce(searchQuery, 300);

const { data: products } = useQuery({
  queryKey: ['/api/products', { search: debouncedSearch }],
  enabled: !!debouncedSearch,
});

// Server-side search logic
async searchProducts(query: string): Promise<Product[]> {
  const lowercaseQuery = query.toLowerCase();
  return Array.from(this.products.values()).filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.shortDescription.toLowerCase().includes(lowercaseQuery)
  );
}
```

### 3. Shopping Cart Management

#### Add to Cart Flow
```
User clicks "Add to Cart" → 
Check authentication → 
If not logged in: show login prompt → 
If logged in: 
  Get current cart state → 
  Check if item exists → 
  If exists: increment quantity → 
  If new: add with quantity 1 → 
  Update local state (Zustand) → 
  POST /api/cart → 
  Show success feedback → 
  Update cart badge
```

**Implementation Details:**
```typescript
// Client-side cart operations (Zustand store)
addItem: (product: Product, quantity = 1) => {
  const existingItem = get().items.find(item => item.product.id === product.id);
  
  if (existingItem) {
    // Update existing item
    set(state => ({
      items: state.items.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    }));
  } else {
    // Add new item
    const newItem: CartItem = {
      id: Date.now(), // Temporary ID for optimistic updates
      product,
      quantity,
    };
    
    set(state => ({
      items: [...state.items, newItem]
    }));
  }
  
  // Sync with server
  apiRequest('/api/cart', {
    method: 'POST',
    body: JSON.stringify({ productId: product.id, quantity }),
  });
},
```

#### Cart Persistence Strategy
```
Local State (Zustand) ←→ Server State (API)
        ↓
  localStorage backup
```

**Sync Logic:**
1. Optimistic updates to local state
2. API call to sync with server
3. Rollback on error
4. localStorage backup for offline scenarios

### 4. Checkout and Payment Process

#### Checkout Workflow
```
User clicks "Checkout" → 
Verify authentication → 
Navigate to /checkout → 
Display order summary → 
Initialize PayPal SDK → 
User clicks "Pay with PayPal" → 
Create PayPal order → 
PayPal popup/redirect → 
User approves payment → 
Capture payment → 
Create order record → 
Clear cart → 
Show confirmation → 
Send confirmation email
```

**PayPal Integration Steps:**

1. **SDK Initialization:**
```typescript
// Load PayPal SDK
const script = document.createElement('script');
script.src = `https://www.paypal.com/web-sdk/v6/core`;
script.onload = () => initPayPal();
document.body.appendChild(script);
```

2. **Order Creation:**
```typescript
// Client requests order creation
const orderData = await fetch('/api/paypal/order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: totalAmount,
    currency: 'USD',
    intent: 'CAPTURE'
  }),
});
```

3. **Payment Capture:**
```typescript
// After user approval
const captureData = await fetch(`/api/paypal/order/${orderId}/capture`, {
  method: 'POST',
});
```

### 5. Order Management

#### Order Creation Process
```
Payment successful → 
Extract order details → 
Begin database transaction → 
Create order record → 
Create order items → 
Update product inventory → 
Clear user's cart → 
Commit transaction → 
Generate order confirmation → 
Update user interface
```

**Database Operations:**
```typescript
async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
  // In production, this would be wrapped in a database transaction
  const newOrder: Order = {
    id: this.currentOrderId++,
    ...order,
    createdAt: new Date(),
  };
  
  this.orders.set(newOrder.id, newOrder);
  
  // Create order items
  for (const item of items) {
    const orderItem: OrderItem = {
      id: this.currentOrderItemId++,
      orderId: newOrder.id,
      ...item,
    };
    this.orderItems.set(orderItem.id, orderItem);
  }
  
  return newOrder;
}
```

## System Workflows

### 1. Application Bootstrap

#### Server Startup Sequence
```
1. Load environment variables
2. Initialize Express app
3. Configure middleware:
   - JSON parsing
   - CORS setup
   - Session management
   - Authentication (Passport)
4. Register API routes
5. Setup Vite (development) or static serving (production)
6. Start HTTP server
7. Log startup confirmation
```

#### Client Initialization
```
1. Load React application
2. Initialize TanStack Query client
3. Setup Zustand stores
4. Initialize authentication state
5. Setup router (Wouter)
6. Render application tree
7. Register service worker (PWA)
```

### 2. API Request Lifecycle

#### Request Processing Flow
```
Client Request → 
CORS Check → 
Body Parsing → 
Session Validation → 
Route Matching → 
Authentication Check → 
Business Logic → 
Database Operation → 
Response Formatting → 
Error Handling → 
Client Response
```

**Middleware Stack:**
```typescript
1. express.json() - Parse JSON bodies
2. express.urlencoded() - Parse form data
3. cors() - Enable cross-origin requests
4. session() - Session management
5. passport.initialize() - Authentication setup
6. passport.session() - Session deserialization
7. Custom route handlers
8. Global error handler
```

### 3. State Management Flow

#### Client State Updates
```
User Action → 
Component Event Handler → 
Zustand Store Update → 
React State Change → 
Component Re-render → 
UI Update
```

#### Server State Synchronization
```
Component Mount → 
TanStack Query Hook → 
Check Cache → 
If Stale: API Request → 
Update Cache → 
Trigger Re-render → 
Display Data
```

**Cache Invalidation Strategy:**
```typescript
// After successful mutation
onSuccess: () => {
  // Invalidate related queries
  queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
  queryClient.invalidateQueries({ queryKey: ['/api/products'] });
  
  // Or update cache directly for immediate UI updates
  queryClient.setQueryData(['/api/cart'], newCartData);
}
```

## Business Workflows

### 1. Inventory Management

#### Stock Updates
```
Product Added → 
Set Initial Stock → 
Order Placed → 
Decrement Stock → 
Low Stock Alert → 
Restock → 
Update Stock Level
```

### 2. Distributor Onboarding

#### Lead Processing
```
User Submits Application → 
Validate Required Fields → 
Store Lead Data → 
Send Confirmation Email → 
Internal Review Process → 
Approve/Reject Decision → 
Notify Applicant → 
If Approved: Setup Account
```

**Lead Data Structure:**
```typescript
interface DistributorLead {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experience: string;
  motivation: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}
```

### 3. Payment Processing

#### Transaction Lifecycle
```
Cart Total Calculated → 
PayPal Order Created → 
User Redirected to PayPal → 
Payment Authorized → 
Return to Merchant → 
Payment Captured → 
Order Confirmed → 
Fulfillment Process
```

**Error Handling:**
- Payment declined: Show user-friendly message, keep cart intact
- Network error: Retry mechanism, temporary order hold
- Server error: Log for investigation, notify user

## Development Workflows

### 1. Feature Development

#### Development Process
```
1. Create feature branch
2. Update shared schema if needed
3. Implement backend API endpoints
4. Add storage layer methods
5. Create/update React components
6. Add routing if needed
7. Test functionality
8. Update documentation
9. Submit pull request
```

### 2. Deployment Workflow

#### Replit Deployment
```
Code Push → 
Automatic Detection → 
Install Dependencies → 
Build Frontend (Vite) → 
Build Backend (TypeScript) → 
Database Migration → 
Health Check → 
Live Deployment
```

### 3. Testing Workflow

#### Manual Testing Checklist
```
□ User registration/login
□ Product browsing and search
□ Add items to cart
□ Cart persistence
□ Checkout process
□ PayPal payment
□ Order confirmation
□ Mobile responsiveness
□ Error handling
```

## Error Recovery Workflows

### 1. Payment Failures

#### Payment Error Recovery
```
Payment Fails → 
Log Error Details → 
Check Error Type → 
If Recoverable:
  - Retry with backoff
  - Update user interface
If Not Recoverable:
  - Show error message
  - Preserve cart state
  - Offer alternatives
```

### 2. Session Expiry

#### Session Recovery
```
Session Expires → 
API Returns 401 → 
Clear Auth State → 
Redirect to Login → 
After Login: Restore Context → 
Continue User Journey
```

### 3. Network Connectivity

#### Offline Handling
```
Network Lost → 
Service Worker Active → 
Show Offline Banner → 
Queue Failed Requests → 
Network Restored → 
Sync Queued Requests → 
Update UI State
```

---

This workflow documentation provides comprehensive understanding of how data flows through the NatureVital platform, enabling effective debugging, maintenance, and feature development.