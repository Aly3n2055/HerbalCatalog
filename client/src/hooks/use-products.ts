
import { useQuery } from "@tanstack/react-query";
import { Product, Category } from "@shared/schema";

// Optimized fetch with better error handling
const fetchWithTimeout = async (url: string, timeout = 8000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Cache-Control': 'max-age=300' // 5 minute cache
      }
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const useProducts = (searchQuery?: string, categorySlug?: string) => {
  let apiUrl = "/api/products";
  
  if (categorySlug) {
    apiUrl += `?category=${encodeURIComponent(categorySlug)}`;
  } else if (searchQuery?.trim()) {
    apiUrl += `?search=${encodeURIComponent(searchQuery.trim())}`;
  }

  return useQuery<Product[]>({
    queryKey: ['products', categorySlug, searchQuery],
    queryFn: () => fetchWithTimeout(apiUrl),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => fetchWithTimeout("/api/categories"),
    staleTime: 15 * 60 * 1000, // 15 minutes - categories don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useProduct = (id: string) => {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => fetchWithTimeout(`/api/products/${id}`),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};
