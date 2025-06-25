import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/products';
import type { Product, Category } from "@shared/schema";

// Query key factory
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
};

export function useProducts(params?: {
  category?: string;
  featured?: boolean;
  search?: string;
}) {
  return useQuery<Product[]>({
    queryKey: productKeys.list(params || {}),
    queryFn: async () => {
      const response = await productService.getProducts(params);
      if (!response) {
        const error = new Error(`Failed to fetch products`);
        console.error('Products fetch error:', error);
        throw error;
      }
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: 1000,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: productKeys.list({ featured: true }),
    queryFn: () => productService.getProducts({ featured: true }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: categoryKeys.lists(),
    queryFn: async () => {
      const response = await productService.getCategories();
      if (!response) {
        const error = new Error(`Failed to fetch categories`);
        console.error('Categories fetch error:', error);
        throw error;
      }
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}