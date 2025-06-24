# Component Documentation

## Overview

NatureVital uses a hierarchical component architecture with clear separation between UI components, feature components, and page components.

## Component Categories

### 1. Page Components (`client/src/pages/`)
Top-level route components that compose the application views.

### 2. Feature Components (`client/src/components/`)
Business logic components that handle specific functionality.

### 3. UI Components (`client/src/components/ui/`)
Reusable interface components based on Shadcn/ui.

---

## Page Components

### Home (`client/src/pages/home.tsx`)

**Purpose**: Landing page showcasing categories and featured products.

**Key Features**:
- Hero section with call-to-action
- Category grid with hover effects
- Featured products carousel
- Mobile-responsive design

**Props**: None (route component)

**State Dependencies**:
- Categories from `/api/categories`
- Featured products from `/api/products?featured=true`

**Usage**:
```typescript
// Rendered by router at "/"
<Route path="/" component={Home} />
```

**Mobile Optimizations**:
- Touch-friendly category cards
- Horizontal scroll for featured products
- Responsive hero section sizing

---

### Products (`client/src/pages/products.tsx`)

**Purpose**: Product listing with search, filtering, and category navigation.

**Props**:
```typescript
interface ProductsProps {
  // URL params handled by wouter
  category?: string; // From /products/:category
}
```

**Key Features**:
- Search functionality with real-time filtering
- Category-based product filtering
- Sort options (name, price, rating)
- Responsive product grid
- Loading states and empty states

**State Management**:
```typescript
const [searchQuery, setSearchQuery] = useState("");
const [sortBy, setSortBy] = useState("name");

// Server state
const { data: products, isLoading } = useQuery({
  queryKey: ['/api/products', category, search],
});
```

**Mobile Features**:
- Touch-optimized search input
- Mobile-first grid layout
- Improved spacing for mobile

---

### ProductDetail (`client/src/pages/product-detail.tsx`)

**Purpose**: Detailed product view with purchase options.

**URL Structure**: `/product/:id`

**Key Features**:
- Product image gallery
- Detailed description
- Add to cart functionality
- Related products
- Review display

**Props**:
```typescript
interface ProductDetailProps {
  productId: string; // From URL params
}
```

---

### Checkout (`client/src/pages/checkout.tsx`)

**Purpose**: Order summary and payment processing.

**Key Features**:
- Order summary with item details
- PayPal payment integration
- Responsive layout (mobile-first)
- Real-time total calculation

**Components Used**:
- `CheckoutForm` - Payment form wrapper
- `PayPalButton` - PayPal integration component

**Mobile Optimizations**:
- Stacked layout on mobile
- Enhanced touch targets
- Simplified order summary

---

### Account (`client/src/pages/account.tsx`)

**Purpose**: User authentication and profile management.

**Key Features**:
- Login/Register forms
- Profile information display
- Order history
- Responsive form design

**State Dependencies**:
```typescript
const { user, login, register, logout } = useAuth();
```

---

## Feature Components

### Header (`client/src/components/header.tsx`)

**Purpose**: Main navigation and site header.

**Key Features**:
- Responsive navigation menu
- Search toggle functionality
- Cart indicator with item count
- Mobile hamburger menu
- User account access

**Props**:
```typescript
interface HeaderProps {
  // No props - uses global state
}
```

**State Dependencies**:
```typescript
const { user } = useAuth();
const { getTotalItems, toggleCart } = useCart();
const [isSearchOpen, setIsSearchOpen] = useState(false);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
```

**Mobile Features**:
- Collapsible navigation
- Touch-friendly buttons (44px minimum)
- Slide-down search bar
- Glass morphism effects

**Component Structure**:
```typescript
<header className="sticky top-0 z-40">
  <div className="flex items-center justify-between">
    {/* Mobile menu button */}
    <Button onClick={() => setIsMobileMenuOpen(true)}>
      <Menu />
    </Button>
    
    {/* Logo */}
    <Link href="/">
      <h1>NatureVital</h1>
    </Link>
    
    {/* Desktop navigation */}
    <nav className="hidden lg:flex">
      {/* Navigation links */}
    </nav>
    
    {/* Action buttons */}
    <div className="flex items-center">
      <Button onClick={() => setIsSearchOpen(!isSearchOpen)}>
        <Search />
      </Button>
      <Button onClick={toggleCart}>
        <ShoppingCart />
        {getTotalItems() > 0 && <Badge>{getTotalItems()}</Badge>}
      </Button>
      <Link href="/account">
        <Button><User /></Button>
      </Link>
    </div>
  </div>
  
  {/* Expandable search */}
  {isSearchOpen && (
    <div className="border-t">
      <Input placeholder="Search products..." />
    </div>
  )}
</header>
```

---

### CartDrawer (`client/src/components/cart-drawer.tsx`)

**Purpose**: Slide-out cart interface for viewing and managing cart items.

**Key Features**:
- Slide-out drawer interface
- Item quantity controls
- Remove item functionality
- Total calculation
- Checkout navigation

**Props**:
```typescript
interface CartDrawerProps {
  // No props - uses global cart state
}
```

**State Dependencies**:
```typescript
const { 
  items, 
  isOpen, 
  toggleCart, 
  updateQuantity, 
  removeItem, 
  getTotalPrice 
} = useCart();
```

**Mobile Optimizations**:
- Full-width on mobile
- Large touch targets for quantity controls
- Smooth slide animations
- Optimized item layout

**Component Structure**:
```typescript
<Sheet open={isOpen} onOpenChange={toggleCart}>
  <SheetContent side="right" className="max-w-sm sm:max-w-md">
    <SheetHeader>
      <SheetTitle>Shopping Cart</SheetTitle>
      <Badge>{items.length} items</Badge>
    </SheetHeader>
    
    <div className="flex-1 overflow-y-auto">
      {items.length === 0 ? (
        <EmptyCartState />
      ) : (
        <CartItemsList />
      )}
    </div>
    
    {items.length > 0 && (
      <div className="border-t pt-4">
        <div className="flex justify-between">
          <span>Total:</span>
          <span>${getTotalPrice().toFixed(2)}</span>
        </div>
        <Button onClick={handleCheckout}>
          Proceed to Checkout
        </Button>
      </div>
    )}
  </SheetContent>
</Sheet>
```

---

### ProductCard (`client/src/components/product-card.tsx`)

**Purpose**: Reusable product display component for grids and lists.

**Props**:
```typescript
interface ProductCardProps {
  product: Product;
  className?: string;
}
```

**Key Features**:
- Product image with lazy loading
- Name, price, and rating display
- Add to cart button
- Stock status indicator
- Hover animations
- Featured product badge

**Mobile Optimizations**:
- Touch-friendly card size
- Optimized image loading
- Responsive typography
- Active state feedback

**Component Structure**:
```typescript
<Link href={`/product/${product.id}`}>
  <Card className="group hover:shadow-lg transition-all">
    <CardContent>
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105"
        />
        {product.featured && (
          <Badge className="absolute top-2 left-2">Featured</Badge>
        )}
        {!product.inStock && (
          <Badge className="absolute top-2 right-2">Out of Stock</Badge>
        )}
      </div>
      
      <div className="space-y-2">
        <h4 className="font-semibold line-clamp-2">{product.name}</h4>
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.shortDescription}
        </p>
        
        <div className="flex items-center">
          <StarRating rating={product.rating} />
          <span className="text-sm text-gray-500">
            ({product.reviewCount})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-nature-green">
            ${parseFloat(product.price).toFixed(2)}
          </span>
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            {product.inStock ? "Add to Cart" : "Sold Out"}
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</Link>
```

---

### CategoryCard (`client/src/components/category-card.tsx`)

**Purpose**: Category display with navigation to filtered products.

**Props**:
```typescript
interface CategoryCardProps {
  category: Category;
  className?: string;
}
```

**Key Features**:
- Category image with overlay
- Product count display
- Hover scale effect
- Gradient overlay for text readability

**Mobile Features**:
- Touch-optimized sizing
- Responsive image heights
- Enhanced contrast for readability

---

### BottomNavigation (`client/src/components/bottom-navigation.tsx`)

**Purpose**: Mobile-first bottom navigation for key actions.

**Key Features**:
- Fixed bottom positioning
- 5-tab layout (Home, Products, Search, Cart, Account)
- Active state indicators
- Cart item badge
- Safe area support for notched devices

**Mobile Optimizations**:
- 44px minimum touch targets
- Glass morphism background
- Haptic feedback simulation
- Badge animations

**Component Structure**:
```typescript
<nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md lg:hidden safe-area-inset-bottom">
  <div className="grid grid-cols-5 py-1 px-2">
    <NavigationItem 
      href="/" 
      icon={<Home />} 
      label="Home" 
      active={isActive("/")} 
    />
    <NavigationItem 
      href="/products" 
      icon={<Leaf />} 
      label="Products"
      active={isActive("/products")} 
    />
    <NavigationItem 
      onClick={handleSearch}
      icon={<Search />} 
      label="Search" 
    />
    <NavigationItem 
      onClick={toggleCart}
      icon={<ShoppingCartWithBadge />} 
      label="Cart" 
    />
    <NavigationItem 
      href="/account" 
      icon={<User />} 
      label="Account"
      active={isActive("/account")} 
    />
  </div>
</nav>
```

---

### PayPalButton (`client/src/components/PayPalButton.tsx`)

**Purpose**: PayPal payment integration component.

**Props**:
```typescript
interface PayPalButtonProps {
  amount: string;
  currency: string;
  intent: string;
}
```

**Key Features**:
- PayPal SDK integration
- Order creation and capture
- Error handling
- Loading states

**Critical Implementation Notes**:
- Must use exact code from blueprint
- No modifications allowed
- Handles PayPal SDK loading
- Manages payment flow

---

### MobileMenu (`client/src/components/mobile-menu.tsx`)

**Purpose**: Full-screen mobile navigation menu.

**Props**:
```typescript
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Key Features**:
- Full-screen overlay
- Slide-in animation
- Category navigation
- User account links
- Close on navigation

---

## UI Components (`client/src/components/ui/`)

### Button (`client/src/components/ui/button.tsx`)

**Purpose**: Standardized button component with variants.

**Variants**:
- `default` - Primary action button
- `secondary` - Secondary action
- `outline` - Outlined button
- `ghost` - Minimal button
- `destructive` - Danger actions

**Sizes**:
- `sm` - Small button
- `default` - Standard size
- `lg` - Large button

**Props**:
```typescript
interface ButtonProps {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
  asChild?: boolean;
  children: React.ReactNode;
}
```

---

### Card (`client/src/components/ui/card.tsx`)

**Purpose**: Container component for content grouping.

**Sub-components**:
- `Card` - Main container
- `CardHeader` - Header section
- `CardTitle` - Title component
- `CardContent` - Main content area
- `CardFooter` - Footer section

---

### Input (`client/src/components/ui/input.tsx`)

**Purpose**: Form input component with consistent styling.

**Features**:
- Consistent border radius
- Focus states
- Error states
- Disabled states
- Mobile optimization (16px font size to prevent zoom)

---

### Badge (`client/src/components/ui/badge.tsx`)

**Purpose**: Small status and label indicators.

**Variants**:
- `default` - Primary badge
- `secondary` - Secondary badge
- `destructive` - Error/warning badge
- `outline` - Outlined badge

---

## Component Patterns

### Compound Components

Example: Card component family
```typescript
<Card>
  <CardHeader>
    <CardTitle>Product Name</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Product description</p>
  </CardContent>
  <CardFooter>
    <Button>Add to Cart</Button>
  </CardFooter>
</Card>
```

### Render Props Pattern

Example: Product grid with loading
```typescript
<ProductGrid
  products={products}
  isLoading={isLoading}
  renderProduct={(product) => (
    <ProductCard key={product.id} product={product} />
  )}
  renderLoading={() => (
    <div className="grid gap-4">
      {Array(8).fill(0).map((_, i) => (
        <Skeleton key={i} className="h-80" />
      ))}
    </div>
  )}
/>
```

### Higher-Order Components

Example: withAuth wrapper
```typescript
const withAuth = (WrappedComponent) => {
  return (props) => {
    const { user, isLoading } = useAuth();
    
    if (isLoading) return <LoadingSpinner />;
    if (!user) return <Navigate to="/account" />;
    
    return <WrappedComponent {...props} />;
  };
};
```

---

## Performance Considerations

### Memoization
```typescript
// Expensive product filtering
const filteredProducts = useMemo(() => {
  return products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [products, searchQuery]);

// Component memoization
const ProductCard = memo(({ product }) => {
  // Component implementation
});
```

### Lazy Loading
```typescript
// Image lazy loading
<img
  src={product.imageUrl}
  alt={product.name}
  loading="lazy"
  className="w-full h-48 object-cover"
/>

// Component lazy loading
const ProductDetail = lazy(() => import('@/pages/product-detail'));
```

### Virtual Scrolling
For large product lists:
```typescript
import { FixedSizeGrid as Grid } from 'react-window';

const ProductGrid = ({ products }) => (
  <Grid
    height={600}
    width={800}
    rowCount={Math.ceil(products.length / 4)}
    columnCount={4}
    rowHeight={300}
    columnWidth={200}
  >
    {({ columnIndex, rowIndex, style }) => (
      <div style={style}>
        <ProductCard product={products[rowIndex * 4 + columnIndex]} />
      </div>
    )}
  </Grid>
);
```

---

## Testing Components

### Unit Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/product-card';

test('renders product information correctly', () => {
  const product = {
    id: 1,
    name: 'Test Product',
    price: '29.99',
    imageUrl: 'test.jpg',
  };
  
  render(<ProductCard product={product} />);
  
  expect(screen.getByText('Test Product')).toBeInTheDocument();
  expect(screen.getByText('$29.99')).toBeInTheDocument();
});

test('handles add to cart click', () => {
  const mockAddToCart = jest.fn();
  // Test implementation
});
```

### Integration Testing
```typescript
test('cart drawer updates when item added', async () => {
  render(<App />);
  
  // Add item to cart
  const addButton = screen.getByRole('button', { name: /add to cart/i });
  fireEvent.click(addButton);
  
  // Open cart drawer
  const cartButton = screen.getByRole('button', { name: /cart/i });
  fireEvent.click(cartButton);
  
  // Verify item appears in cart
  expect(screen.getByText('Test Product')).toBeInTheDocument();
});
```

---

This component documentation provides a comprehensive overview of the component architecture, implementation details, and usage patterns throughout the NatureVital application.