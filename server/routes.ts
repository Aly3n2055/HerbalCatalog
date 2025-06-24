import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDistributorLeadSchema, loginSchema, registerSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";

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
  
  // Auth routes
  app.post("/api/register", async (req, res) => {
    try {
      const userData = registerSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
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

  // Stripe payment route for one-time payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
