
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService, type CartItem } from '../services/cart';
import { useAuth } from './use-auth';

// Query keys for cart
export const cartKeys = {
  all: ['cart'] as const,
  user: (userId: number) => [...cartKeys.all, userId] as const,
};

// Get cart items for current user
export function useCartQuery() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: cartKeys.user(user?.id || 0),
    queryFn: () => cartService.getCartItems(user!.id),
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000, // 1 minute for cart data
  });
}

// Add to cart mutation
export function useAddToCart() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: cartKeys.user(user.id) });
      }
    },
  });
}

// Update cart item mutation
export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      cartService.updateCartItem(itemId, quantity),
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: cartKeys.user(user.id) });
      }
    },
  });
}

// Remove from cart mutation
export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: cartService.removeFromCart,
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: cartKeys.user(user.id) });
      }
    },
  });
}
