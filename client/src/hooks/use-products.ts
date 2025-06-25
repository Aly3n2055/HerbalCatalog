import { useQuery } from '@tanstack/react-query';
import { productService, type Product, type Category } from '../services/products';

// Query key factory for products
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  categories: ['categories'] as const,
};

// Get all products with filters
export function useProducts(filters?: {
  category?: string;
  featured?: boolean;
  search?: string;
}) {
  return useQuery({
    queryKey: productKeys.list(filters || {}),
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get single product
export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProduct(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

// Get featured products
export function useFeaturedProducts() {
  return useQuery({
    queryKey: productKeys.list({ featured: true }),
    queryFn: () => productService.getFeaturedProducts(),
    staleTime: 10 * 60 * 1000, // Cache longer for featured products
  });
}

// Get categories
export function useCategories() {
  return useQuery({
    queryKey: productKeys.categories,
    queryFn: () => productService.getCategories(),
    staleTime: 15 * 60 * 1000, // Cache categories longer
  });
}

// Search products with debouncing
export function useProductSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: productKeys.list({ search: query }),
    queryFn: () => productService.searchProducts(query),
    staleTime: 2 * 60 * 1000,
    enabled: enabled && query.length > 2,
  });
}