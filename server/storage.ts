import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import type { User, Product, CartItem, Order, DistributorLead } from "@shared/schema";

const db = new Database("./database.db");

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'customer',
    distributor_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    in_stock BOOLEAN DEFAULT 1,
    featured BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
  );

  CREATE TABLE IF NOT EXISTS distributor_leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    experience TEXT NOT NULL,
    goals TEXT NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// User operations
export const createUser = async (userData: {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
}): Promise<User> => {
  const hashedPassword = await bcrypt.hash(userData.password, 12);

  const stmt = db.prepare(`
    INSERT INTO users (email, username, password_hash, first_name, last_name, phone, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    userData.email,
    userData.username,
    hashedPassword,
    userData.firstName || null,
    userData.lastName || null,
    userData.phone || null,
    userData.role || 'customer'
  );

  return getUserById(result.lastInsertRowid as number)!;
};

export const getUserByEmail = (email: string): User | null => {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email) as any;

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone,
    role: user.role,
    distributorId: user.distributor_id,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};

export const getUserById = (id: number): User | null => {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const user = stmt.get(id) as any;

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone,
    role: user.role,
    distributorId: user.distributor_id,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};

export const getUserByUsername = (username: string): User | null => {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const user = stmt.get(username) as any;

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone,
    role: user.role,
    distributorId: user.distributor_id,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};

export const checkUsernameExists = (username: string): boolean => {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM users WHERE username = ?');
  const result = stmt.get(username) as { count: number };
  return result.count > 0;
};

export const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

// Product operations
export const getAllProducts = (): Product[] => {
  const stmt = db.prepare('SELECT * FROM products ORDER BY name');
  const products = stmt.all() as any[];

  return products.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    image: p.image,
    category: p.category,
    inStock: Boolean(p.in_stock),
    featured: Boolean(p.featured),
  }));
};

export const getProductById = (id: number): Product | null => {
  const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
  const product = stmt.get(id) as any;

  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    category: product.category,
    inStock: Boolean(product.in_stock),
    featured: Boolean(product.featured),
  };
};

// Cart operations
export const addToCart = (userId: number, productId: number, quantity: number): void => {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO cart_items (user_id, product_id, quantity)
    VALUES (?, ?, COALESCE((SELECT quantity FROM cart_items WHERE user_id = ? AND product_id = ?), 0) + ?)
  `);
  stmt.run(userId, productId, userId, productId, quantity);
};

export const getCartItems = (userId: number): CartItem[] => {
  const stmt = db.prepare(`
    SELECT ci.*, p.name, p.description, p.price, p.image, p.category, p.in_stock, p.featured
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
  `);
  const items = stmt.all(userId) as any[];

  return items.map(item => ({
    id: item.id,
    productId: item.product_id,
    quantity: item.quantity,
    product: {
      id: item.product_id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category,
      inStock: Boolean(item.in_stock),
      featured: Boolean(item.featured),
    },
  }));
};

export const removeFromCart = (userId: number, productId: number): void => {
  const stmt = db.prepare('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?');
  stmt.run(userId, productId);
};

export const clearCart = (userId: number): void => {
  const stmt = db.prepare('DELETE FROM cart_items WHERE user_id = ?');
  stmt.run(userId);
};

// Distributor operations
export const createDistributorLead = (leadData: DistributorLead): number => {
  const stmt = db.prepare(`
    INSERT INTO distributor_leads (first_name, last_name, email, phone, experience, goals, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    leadData.firstName,
    leadData.lastName,
    leadData.email,
    leadData.phone,
    leadData.experience,
    JSON.stringify(leadData.goals),
    leadData.notes || null
  );

  return result.lastInsertRowid as number;
};

// Seed data
export const seedDatabase = () => {
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };

  if (productCount.count === 0) {
    const products = [
      {
        name: "Turmeric Curcumin Plus",
        description: "Premium turmeric supplement with enhanced bioavailability for joint health and inflammation support.",
        price: 29.99,
        image: "/products/turmeric.jpg",
        category: "Supplements",
        featured: true,
      },
      {
        name: "Organic Ashwagandha Root",
        description: "Pure ashwagandha extract to support stress management and natural energy levels.",
        price: 24.99,
        image: "/products/ashwagandha.jpg",
        category: "Adaptogens",
        featured: true,
      },
      {
        name: "Evening Primrose Oil",
        description: "Cold-pressed evening primrose oil capsules for hormone balance and skin health.",
        price: 19.99,
        image: "/products/evening-primrose.jpg",
        category: "Women's Health",
        featured: false,
      },
    ];

    const stmt = db.prepare(`
      INSERT INTO products (name, description, price, image, category, featured)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    products.forEach(product => {
      stmt.run(product.name, product.description, product.price, product.image, product.category, product.featured);
    });
  }
};

// Initialize seed data
seedDatabase();