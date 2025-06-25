import { z } from "zod";

// User schema
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  username: z.string().min(3).max(50),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(["customer", "distributor"]).default("customer"),
  distributorId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof userSchema>;

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginData = z.infer<typeof loginSchema>;

// Register schema
export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(["customer", "distributor"]).default("customer"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterData = z.infer<typeof registerSchema>;

// Product schema
export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  image: z.string(),
  category: z.string(),
  inStock: z.boolean(),
  featured: z.boolean().default(false),
});

export type Product = z.infer<typeof productSchema>;

// Cart item schema
export const cartItemSchema = z.object({
  id: z.number(),
  productId: z.number(),
  quantity: z.number().min(1),
  product: productSchema,
});

export type CartItem = z.infer<typeof cartItemSchema>;

// Order schema
export const orderSchema = z.object({
  id: z.number(),
  userId: z.number(),
  total: z.number(),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
  items: z.array(cartItemSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Order = z.infer<typeof orderSchema>;

// Distributor lead schema
export const distributorLeadSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  experience: z.enum(["none", "some", "experienced"]),
  goals: z.array(z.string()).min(1, "Please select at least one goal"),
  notes: z.string().optional(),
});

export type DistributorLead = z.infer<typeof distributorLeadSchema>;

// Username availability schema
export const usernameCheckSchema = z.object({
  username: z.string().min(3).max(50),
});

export type UsernameCheck = z.infer<typeof usernameCheckSchema>;