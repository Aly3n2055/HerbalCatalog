
import { useQuery } from '@tanstack/react-query';
import { productService, type Product, type Category } from '../services/products';

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
  list: (filters: Record<string, unknown>) => [...categoryKeys.lists(), { filters }] as const,
};

export function useProducts(params?: {
  category?: string;
  featured?: boolean;
  search?: string;
}) {
  return useQuery({
    queryKey: productKeys.list(params || {}),
    queryFn: () => productService.getProducts(params),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: productKeys.list({ featured: true }),
    queryFn: () => productService.getProducts({ featured: true }),
    staleTime: 10 * 60 * 1000, // Cache longer for featured products
  });
}

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => productService.getCategories(),
    staleTime: 15 * 60 * 1000, // Categories change less frequently
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
