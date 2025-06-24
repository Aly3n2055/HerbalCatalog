import { 
  users, products, categories, cartItems, orders, orderItems, distributorLeads,
  type User, type InsertUser, type Product, type InsertProduct, 
  type Category, type InsertCategory, type CartItem, type InsertCartItem,
  type Order, type InsertOrder, type OrderItem, type InsertOrderItem,
  type DistributorLead, type InsertDistributorLead
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(id: number, customerId: string, subscriptionId?: string): Promise<User>;

  // Products
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(slug: string): Promise<Category | undefined>;

  // Cart
  getCartItems(userId: number): Promise<(CartItem & { product: Product })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem>;
  removeFromCart(id: number): Promise<void>;
  clearCart(userId: number): Promise<void>;

  // Orders
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;

  // Distributor Leads
  createDistributorLead(lead: InsertDistributorLead): Promise<DistributorLead>;
  getDistributorLeads(): Promise<DistributorLead[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private categories: Map<number, Category>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private distributorLeads: Map<number, DistributorLead>;
  private currentUserId: number;
  private currentProductId: number;
  private currentCategoryId: number;
  private currentCartItemId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;
  private currentLeadId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.distributorLeads = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentCategoryId = 1;
    this.currentCartItemId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentLeadId = 1;

    this.seedData();
  }

  private seedData() {
    // Seed categories
    const categoriesData = [
      { id: 1, name: "Supplements", slug: "supplements", description: "Premium natural supplements", imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", productCount: 12 },
      { id: 2, name: "Herbal Teas", slug: "herbal-teas", description: "Organic herbal tea blends", imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", productCount: 8 },
      { id: 3, name: "Essential Oils", slug: "essential-oils", description: "Pure essential oils", imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", productCount: 15 },
      { id: 4, name: "Skincare", slug: "skincare", description: "Natural skincare products", imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", productCount: 6 }
    ];
    
    categoriesData.forEach(cat => {
      this.categories.set(cat.id, { ...cat });
      this.currentCategoryId = Math.max(this.currentCategoryId, cat.id + 1);
    });

    // Seed products
    const productsData = [
      {
        id: 1,
        name: "Premium Turmeric Curcumin",
        description: "High-potency turmeric with BioPerine for enhanced absorption. Contains 95% curcuminoids for maximum anti-inflammatory benefits.",
        shortDescription: "High-potency turmeric with BioPerine for enhanced absorption",
        price: "29.99",
        category: "supplements",
        imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        inStock: true,
        featured: true,
        externalUrl: null,
        rating: "4.8",
        reviewCount: 142,
        createdAt: new Date()
      },
      {
        id: 2,
        name: "Organic Ashwagandha Root",
        description: "Adaptogenic herb for stress relief and energy support. Certified organic KSM-66 ashwagandha extract.",
        shortDescription: "Adaptogenic herb for stress relief and energy support",
        price: "24.99",
        category: "supplements",
        imageUrl: "https://images.unsplash.com/photo-1581443833683-749b5a7da5b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        images: ["https://images.unsplash.com/photo-1581443833683-749b5a7da5b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        inStock: true,
        featured: true,
        externalUrl: null,
        rating: "4.6",
        reviewCount: 89,
        createdAt: new Date()
      },
      {
        id: 3,
        name: "Immunity Green Tea Blend",
        description: "Antioxidant-rich blend with ginger and elderberry. Organic green tea with immune-supporting herbs.",
        shortDescription: "Antioxidant-rich blend with ginger and elderberry",
        price: "18.99",
        category: "herbal-teas",
        imageUrl: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        images: ["https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        inStock: true,
        featured: true,
        externalUrl: null,
        rating: "4.9",
        reviewCount: 203,
        createdAt: new Date()
      },
      {
        id: 4,
        name: "Lavender Essential Oil",
        description: "Pure therapeutic grade lavender oil for relaxation and aromatherapy. Steam distilled from Bulgarian lavender.",
        shortDescription: "Pure therapeutic grade lavender oil for relaxation",
        price: "32.99",
        category: "essential-oils",
        imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        images: ["https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        inStock: true,
        featured: false,
        externalUrl: null,
        rating: "4.7",
        reviewCount: 156,
        createdAt: new Date()
      },
      {
        id: 5,
        name: "Vitamin D3 + K2",
        description: "Synergistic combination of vitamin D3 and K2 for bone and cardiovascular health. 5000 IU D3 with 100mcg K2 MK-7.",
        shortDescription: "Synergistic combination for bone and cardiovascular health",
        price: "26.99",
        category: "supplements",
        imageUrl: "https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        images: ["https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        inStock: true,
        featured: false,
        externalUrl: null,
        rating: "4.5",
        reviewCount: 78,
        createdAt: new Date()
      },
      {
        id: 6,
        name: "Chamomile Sleep Tea",
        description: "Calming herbal blend with chamomile, passionflower, and lemon balm. Naturally caffeine-free bedtime tea.",
        shortDescription: "Calming herbal blend for better sleep",
        price: "16.99",
        category: "herbal-teas",
        imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        images: ["https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        inStock: true,
        featured: false,
        externalUrl: null,
        rating: "4.8",
        reviewCount: 92,
        createdAt: new Date()
      }
    ];

    productsData.forEach(product => {
      this.products.set(product.id, { ...product });
      this.currentProductId = Math.max(this.currentProductId, product.id + 1);
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser,
      id, 
      createdAt: new Date(),
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      role: insertUser.role || "customer",
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      phone: insertUser.phone || null,
      distributorId: insertUser.distributorId || null,
      uplineId: insertUser.uplineId || null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStripeInfo(id: number, customerId: string, subscriptionId?: string): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updated = { 
      ...user, 
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId || user.stripeSubscriptionId
    };
    this.users.set(id, updated);
    return updated;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.category === category);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.featured);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
    );
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  // Cart
  async getCartItems(userId: number): Promise<(CartItem & { product: Product })[]> {
    const userCartItems = Array.from(this.cartItems.values()).filter(item => item.userId === userId);
    return userCartItems.map(item => ({
      ...item,
      product: this.products.get(item.productId!)!
    })).filter(item => item.product); // Filter out items where product doesn't exist
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      cartItem => cartItem.userId === item.userId && cartItem.productId === item.productId
    );

    if (existingItem) {
      // Update quantity
      const updated = { ...existingItem, quantity: existingItem.quantity + (item.quantity || 1) };
      this.cartItems.set(existingItem.id, updated);
      return updated;
    }

    const id = this.currentCartItemId++;
    const cartItem: CartItem = { 
      ...item, 
      id, 
      createdAt: new Date(),
      userId: item.userId || null,
      productId: item.productId || null,
      quantity: item.quantity || 1
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    const item = this.cartItems.get(id);
    if (!item) throw new Error("Cart item not found");
    
    const updated = { ...item, quantity };
    this.cartItems.set(id, updated);
    return updated;
  }

  async removeFromCart(id: number): Promise<void> {
    this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<void> {
    Array.from(this.cartItems.entries()).forEach(([id, item]) => {
      if (item.userId === userId) {
        this.cartItems.delete(id);
      }
    });
  }

  // Orders
  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const orderId = this.currentOrderId++;
    const newOrder: Order = { 
      ...order, 
      id: orderId, 
      createdAt: new Date(),
      status: order.status || "pending",
      userId: order.userId || null,
      stripePaymentIntentId: order.stripePaymentIntentId || null
    };
    this.orders.set(orderId, newOrder);

    // Create order items
    items.forEach(item => {
      const orderItemId = this.currentOrderItemId++;
      const orderItem: OrderItem = { 
        ...item, 
        id: orderItemId, 
        orderId: orderId,
        productId: item.productId || null
      };
      this.orderItems.set(orderItemId, orderItem);
    });

    return newOrder;
  }

  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  // Distributor Leads
  async createDistributorLead(lead: InsertDistributorLead): Promise<DistributorLead> {
    const id = this.currentLeadId++;
    const newLead: DistributorLead = { 
      ...lead, 
      id, 
      createdAt: new Date(),
      phone: lead.phone || null,
      status: lead.status || "new",
      notes: lead.notes || null
    };
    this.distributorLeads.set(id, newLead);
    return newLead;
  }

  async getDistributorLeads(): Promise<DistributorLead[]> {
    return Array.from(this.distributorLeads.values());
  }
}

export const storage = new MemStorage();
