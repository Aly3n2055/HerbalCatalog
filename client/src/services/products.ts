
export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  featured?: boolean;
  stock?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

class ProductService {
  private baseUrl = '/api';

  async getProducts(params?: {
    category?: string;
    featured?: boolean;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    
    if (params?.category) searchParams.set('category', params.category);
    if (params?.featured) searchParams.set('featured', 'true');
    if (params?.search) searchParams.set('search', params.search);

    const url = `${this.baseUrl}/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  }

  async getProduct(id: string) {
    const response = await fetch(`${this.baseUrl}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return response.json();
  }

  async getCategories() {
    const response = await fetch(`${this.baseUrl}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  }

  async searchProducts(query: string) {
    return this.getProducts({ search: query });
  }
}

export const productService = new ProductService();
