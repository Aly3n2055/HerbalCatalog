# API Documentation

## Overview

The NatureVital API is a RESTful service built with Express.js and TypeScript, providing endpoints for user management, product catalog, shopping cart, and payment processing.

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.replit.app/api`

## Authentication

The API uses session-based authentication with HTTP-only cookies.

### Authentication Flow
1. User submits credentials to `/api/auth/login`
2. Server validates credentials and creates session
3. Session cookie is set (HTTP-only, secure in production)
4. Subsequent requests include session cookie automatically
5. Protected endpoints verify session before processing

---

## Authentication Endpoints

### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2025-06-24T17:30:00.000Z"
}
```

**Error Responses:**
- `400` - Validation error (invalid email, weak password)
- `409` - Email already exists

**Implementation:**
```typescript
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = registerSchema.parse(req.body);
    
    // Check if user exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Create user
    const user = await storage.createUser({
      email,
      passwordHash,
      firstName,
      lastName,
    });
    
    // Create session
    req.session.userId = user.id;
    
    // Return user (without password)
    const { passwordHash: _, ...userResponse } = user;
    res.status(201).json(userResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});
```

---

### POST /api/auth/login

Authenticate user and create session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Invalid credentials

---

### POST /api/auth/logout

End user session.

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### GET /api/auth/me

Get current authenticated user information.

**Success Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Error Response:**
- `401` - Not authenticated

---

## Product Endpoints

### GET /api/products

Get all products with optional filtering.

**Query Parameters:**
- `category` (string, optional) - Filter by category slug
- `search` (string, optional) - Search in name and description
- `featured` (boolean, optional) - Get only featured products

**Examples:**
- `/api/products` - All products
- `/api/products?category=supplements` - Supplements only
- `/api/products?search=turmeric` - Search for "turmeric"
- `/api/products?featured=true` - Featured products only

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Premium Turmeric Curcumin",
    "description": "High-potency turmeric supplement with black pepper extract for enhanced absorption.",
    "shortDescription": "High-potency turmeric with enhanced absorption",
    "price": "29.99",
    "categoryId": 1,
    "imageUrl": "https://images.unsplash.com/photo-1584308072243-4dd2c7ad7ac2",
    "inStock": true,
    "featured": true,
    "rating": "4.8",
    "reviewCount": 245,
    "createdAt": "2025-06-24T17:30:00.000Z"
  }
]
```

**Implementation:**
```typescript
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    
    let products: Product[];
    
    if (category) {
      products = await storage.getProductsByCategory(category as string);
    } else if (search) {
      products = await storage.searchProducts(search as string);
    } else if (featured === 'true') {
      products = await storage.getFeaturedProducts();
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

---

### GET /api/products/:id

Get single product by ID.

**Path Parameters:**
- `id` (number) - Product ID

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Premium Turmeric Curcumin",
  "description": "Detailed product description...",
  "price": "29.99",
  "categoryId": 1,
  "imageUrl": "https://images.unsplash.com/photo-1584308072243-4dd2c7ad7ac2",
  "inStock": true,
  "featured": true,
  "rating": "4.8",
  "reviewCount": 245
}
```

**Error Response:**
- `404` - Product not found

---

## Category Endpoints

### GET /api/categories

Get all product categories.

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Supplements",
    "slug": "supplements",
    "description": "Natural health supplements and vitamins",
    "imageUrl": "https://images.unsplash.com/photo-1556228720-195a672e8a03",
    "productCount": 25
  }
]
```

---

### GET /api/categories/:slug

Get single category by slug.

**Path Parameters:**
- `slug` (string) - Category slug

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Supplements",
  "slug": "supplements",
  "description": "Natural health supplements and vitamins",
  "imageUrl": "https://images.unsplash.com/photo-1556228720-195a672e8a03",
  "productCount": 25
}
```

---

## Cart Endpoints

All cart endpoints require authentication.

### GET /api/cart

Get current user's cart items.

**Success Response (200):**
```json
[
  {
    "id": 1,
    "productId": 1,
    "quantity": 2,
    "product": {
      "id": 1,
      "name": "Premium Turmeric Curcumin",
      "price": "29.99",
      "imageUrl": "https://images.unsplash.com/photo-1584308072243-4dd2c7ad7ac2"
    }
  }
]
```

---

### POST /api/cart

Add item to cart or update quantity if item exists.

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "productId": 1,
  "quantity": 2,
  "userId": 1
}
```

**Implementation:**
```typescript
app.post('/api/cart', requireAuth, async (req, res) => {
  try {
    const { productId, quantity } = addToCartSchema.parse(req.body);
    const userId = req.session.userId!;
    
    // Check if product exists
    const product = await storage.getProduct(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check if item already in cart
    const existingItems = await storage.getCartItems(userId);
    const existingItem = existingItems.find(item => item.productId === productId);
    
    if (existingItem) {
      // Update existing item
      const updatedItem = await storage.updateCartItem(
        existingItem.id, 
        existingItem.quantity + quantity
      );
      res.json(updatedItem);
    } else {
      // Add new item
      const newItem = await storage.addToCart({
        userId,
        productId,
        quantity,
      });
      res.status(201).json(newItem);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});
```

---

### PUT /api/cart/:id

Update cart item quantity.

**Path Parameters:**
- `id` (number) - Cart item ID

**Request Body:**
```json
{
  "quantity": 3
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "productId": 1,
  "quantity": 3,
  "userId": 1
}
```

---

### DELETE /api/cart/:id

Remove item from cart.

**Path Parameters:**
- `id` (number) - Cart item ID

**Success Response (204):**
No content

---

### DELETE /api/cart

Clear all items from cart.

**Success Response (204):**
No content

---

## Order Endpoints

### POST /api/orders

Create new order from cart items.

**Request Body:**
```json
{
  "paypalOrderId": "PAYPAL_ORDER_ID_123"
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "userId": 1,
  "totalAmount": "59.98",
  "status": "completed",
  "paypalOrderId": "PAYPAL_ORDER_ID_123",
  "createdAt": "2025-06-24T17:30:00.000Z",
  "items": [
    {
      "id": 1,
      "productId": 1,
      "quantity": 2,
      "price": "29.99"
    }
  ]
}
```

---

### GET /api/orders

Get user's order history.

**Success Response (200):**
```json
[
  {
    "id": 1,
    "totalAmount": "59.98",
    "status": "completed",
    "createdAt": "2025-06-24T17:30:00.000Z",
    "items": [
      {
        "id": 1,
        "productId": 1,
        "quantity": 2,
        "price": "29.99",
        "product": {
          "name": "Premium Turmeric Curcumin",
          "imageUrl": "https://images.unsplash.com/photo-1584308072243-4dd2c7ad7ac2"
        }
      }
    ]
  }
]
```

---

## PayPal Integration Endpoints

### GET /api/paypal/setup

Get PayPal client token for SDK initialization.

**Success Response (200):**
```json
{
  "clientToken": "PAYPAL_CLIENT_TOKEN_HERE"
}
```

**Implementation:**
```typescript
app.get('/api/paypal/setup', async (req, res) => {
  try {
    const clientToken = await getClientToken();
    res.json({ clientToken });
  } catch (error) {
    console.error('PayPal setup error:', error);
    res.status(500).json({ error: 'Failed to initialize PayPal' });
  }
});
```

---

### POST /api/paypal/order

Create PayPal order for payment processing.

**Request Body:**
```json
{
  "amount": "29.99",
  "currency": "USD",
  "intent": "CAPTURE"
}
```

**Success Response (201):**
```json
{
  "id": "PAYPAL_ORDER_ID_123",
  "status": "CREATED",
  "links": [
    {
      "href": "https://api.sandbox.paypal.com/v2/checkout/orders/PAYPAL_ORDER_ID_123",
      "rel": "self",
      "method": "GET"
    }
  ]
}
```

**Implementation:**
```typescript
app.post('/api/paypal/order', async (req, res) => {
  try {
    const { amount, currency, intent } = req.body;
    
    // Validate amount
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    
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
    const jsonResponse = JSON.parse(String(body));
    
    res.status(201).json(jsonResponse);
  } catch (error) {
    console.error('PayPal order creation error:', error);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
});
```

---

### POST /api/paypal/order/:orderID/capture

Capture PayPal payment after user approval.

**Path Parameters:**
- `orderID` (string) - PayPal order ID

**Success Response (200):**
```json
{
  "id": "PAYPAL_ORDER_ID_123",
  "status": "COMPLETED",
  "purchase_units": [
    {
      "payments": {
        "captures": [
          {
            "id": "CAPTURE_ID_123",
            "status": "COMPLETED",
            "amount": {
              "currency_code": "USD",
              "value": "29.99"
            }
          }
        ]
      }
    }
  ]
}
```

---

## Distributor Endpoints

### POST /api/distributor-leads

Submit distributor application.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "experience": "5+ years in health and wellness",
  "motivation": "Passionate about natural health products"
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "experience": "5+ years in health and wellness",
  "motivation": "Passionate about natural health products",
  "status": "pending",
  "createdAt": "2025-06-24T17:30:00.000Z"
}
```

---

## Error Handling

### Error Response Format
```json
{
  "error": "Error message description",
  "details": "Optional additional details",
  "code": "ERROR_CODE" // Optional error code
}
```

### Common Error Codes
- `VALIDATION_ERROR` - Request validation failed
- `AUTHENTICATION_REQUIRED` - User must be logged in
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `DUPLICATE_RESOURCE` - Resource already exists
- `PAYMENT_FAILED` - Payment processing error
- `INTERNAL_ERROR` - Server-side error

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Authentication endpoints**: 5 requests per minute per IP
- **Product endpoints**: 100 requests per minute per IP
- **Cart/Order endpoints**: 30 requests per minute per user
- **PayPal endpoints**: 10 requests per minute per user

---

## Request/Response Examples

### Complete Cart Flow Example

1. **Add product to cart:**
```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 2}' \
  --cookie "session=USER_SESSION_COOKIE"
```

2. **View cart:**
```bash
curl http://localhost:5000/api/cart \
  --cookie "session=USER_SESSION_COOKIE"
```

3. **Create PayPal order:**
```bash
curl -X POST http://localhost:5000/api/paypal/order \
  -H "Content-Type: application/json" \
  -d '{"amount": "59.98", "currency": "USD", "intent": "CAPTURE"}'
```

4. **Capture payment:**
```bash
curl -X POST http://localhost:5000/api/paypal/order/PAYPAL_ORDER_ID/capture \
  -H "Content-Type: application/json"
```

5. **Create order:**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"paypalOrderId": "PAYPAL_ORDER_ID"}' \
  --cookie "session=USER_SESSION_COOKIE"
```

---

## Testing the API

### Using curl
```bash
# Test product endpoint
curl http://localhost:5000/api/products

# Test with search
curl "http://localhost:5000/api/products?search=turmeric"

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### Using Postman
Import the provided Postman collection for comprehensive API testing.

### Using JavaScript fetch
```javascript
// Get products
const products = await fetch('/api/products').then(res => res.json());

// Login user
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password' }),
  credentials: 'include', // Important for session cookies
});
```

---

This API documentation provides comprehensive information for integrating with the NatureVital e-commerce platform, including authentication, product management, cart operations, and payment processing.