
import { apiClient } from './api';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  featured?: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export const productService = {
  // Get all products with optional filters
  async getProducts(params?: {
    category?: string;
    featured?: boolean;
    search?: string;
  }): Promise<Product[]> {
    const searchParams = new URLSearchParams();
    
    if (params?.category) searchParams.set('category', params.category);
    if (params?.featured) searchParams.set('featured', 'true');
    if (params?.search) searchParams.set('search', params.search);
    
    const query = searchParams.toString();
    const endpoint = query ? `/products?${query}` : '/products';
    
    return apiClient.get<Product[]>(endpoint);
  },

  // Get single product by ID
  async getProduct(id: number): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`);
  },

  // Get featured products
  async getFeaturedProducts(): Promise<Product[]> {
    return this.getProducts({ featured: true });
  },

  // Search products
  async searchProducts(query: string): Promise<Product[]> {
    return this.getProducts({ search: query });
  },

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.getProducts({ category });
  },

  // Get all categories
  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories');
  },
};
