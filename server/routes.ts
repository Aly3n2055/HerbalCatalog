import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDistributorLeadSchema, loginSchema, registerSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";

function getCardType(cardNumber: string): string {
  const number = cardNumber.replace(/\s/g, '');
  if (/^4/.test(number)) return 'Visa';
  if (/^5[1-5]/.test(number)) return 'Mastercard';
  if (/^3[47]/.test(number)) return 'American Express';
  if (/^6/.test(number)) return 'Discover';
  return 'Unknown';
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // PayPal routes
  app.get("/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/paypal/order", async (req, res) => {
    // Request body should contain: { intent, amount, currency }
    await createPaypalOrder(req, res);
  });

  app.post("/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  app.post("/paypal/card-payment", async (req, res) => {
    try {
      const { amount, currency, card } = req.body;
      
      // For demo purposes, simulate successful card processing
      // In production, this would integrate with PayPal's card processing API
      const paymentResult = {
        id: `CARD_${Date.now()}`,
        status: "COMPLETED",
        amount: { currency_code: currency, value: amount },
        card: {
          last_digits: card.number.slice(-4),
          type: getCardType(card.number)
        },
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        payment: paymentResult,
        message: "Payment processed successfully"
      });
    } catch (error: any) {
      res.status(400).json({ 
        success: false, 
        message: error.message || "Payment processing failed" 
      });
    }
  });
  
  // Username availability check
  app.get("/api/check-username", async (req, res) => {
    try {
      const { username } = req.query;
      
      if (!username || typeof username !== 'string') {
        return res.status(400).json({ error: 'Username parameter is required' });
      }
      
      // Basic validation
      if (username.length < 3 || username.length > 20) {
        return res.json({ 
          available: false,
          reason: 'Username must be between 3 and 20 characters'
        });
      }
      
      if (!/^[a-z0-9_]+$/.test(username)) {
        return res.json({ 
          available: false,
          reason: 'Username can only contain lowercase letters, numbers, and underscores'
        });
      }
      
      if (!/^[a-z]/.test(username)) {
        return res.json({ 
          available: false,
          reason: 'Username must start with a letter'
        });
      }
      
      // Check reserved usernames
      const reserved = [
        'admin', 'administrator', 'root', 'api', 'www', 'mail', 'email',
        'support', 'help', 'info', 'contact', 'sales', 'marketing',
        'system', 'user', 'users', 'account', 'accounts', 'profile',
        'settings', 'config', 'test', 'demo', 'sample', 'null', 'undefined'
      ];
      
      if (reserved.includes(username)) {
        return res.json({ 
          available: false,
          reason: 'This username is reserved'
        });
      }
      
      // Check if username exists in database
      const existingUser = await storage.getUserByUsername(username);
      
      res.json({ 
        available: !existingUser,
        reason: existingUser ? 'Username is already taken' : undefined
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Auth routes
  app.post("/api/register", async (req, res) => {
    try {
      const userData = registerSchema.parse(req.body);
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      
      if (existingUserByEmail) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username is already taken" });
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      res.status(201).json({ 
        id: user.id, 
        email: user.email, 
        username: user.username,
        role: user.role 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ 
        id: user.id, 
        email: user.email, 
        username: user.username,
        role: user.role 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, featured, search } = req.query;
      
      let products;
      if (search) {
        products = await storage.searchProducts(search as string);
      } else if (category) {
        products = await storage.getProductsByCategory(category as string);
      } else if (featured === 'true') {
        products = await storage.getFeaturedProducts();
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Cart routes (simplified for demo - in real app would need auth middleware)
  app.get("/api/cart/:userId", async (req, res) => {
    try {
      const cartItems = await storage.getCartItems(parseInt(req.params.userId));
      res.json(cartItems);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const cartItem = await storage.addToCart(req.body);
      res.status(201).json(cartItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(parseInt(req.params.id), quantity);
      res.json(cartItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      await storage.removeFromCart(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/cart/clear/:userId", async (req, res) => {
    try {
      await storage.clearCart(parseInt(req.params.userId));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Orders routes
  app.post("/api/orders", async (req, res) => {
    try {
      const { userId, items, total, stripePaymentIntentId } = req.body;
      
      const order = await storage.createOrder({
        userId,
        status: "pending",
        total,
        stripePaymentIntentId,
      }, items);

      // Clear cart after successful order
      await storage.clearCart(userId);

      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/orders/:userId", async (req, res) => {
    try {
      const orders = await storage.getOrders(parseInt(req.params.userId));
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Distributor leads route
  app.post("/api/distributor-leads", async (req, res) => {
    try {
      const leadData = insertDistributorLeadSchema.parse(req.body);
      const lead = await storage.createDistributorLead(leadData);
      res.status(201).json(lead);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Payment processing is handled by PayPal routes above

  const httpServer = createServer(app);
  return httpServer;
}
