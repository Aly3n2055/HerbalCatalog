
import { apiClient } from './api';

export interface CartItem {
  id: number;
  productId: number;
  userId: number;
  quantity: number;
  product?: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  };
}

export const cartService = {
  // Get cart items for user
  async getCartItems(userId: number): Promise<CartItem[]> {
    return apiClient.get<CartItem[]>(`/cart/${userId}`);
  },

  // Add item to cart
  async addToCart(item: {
    userId: number;
    productId: number;
    quantity: number;
  }): Promise<CartItem> {
    return apiClient.post<CartItem>('/cart', item);
  },

  // Update cart item quantity
  async updateCartItem(itemId: number, quantity: number): Promise<CartItem> {
    return apiClient.put<CartItem>(`/cart/${itemId}`, { quantity });
  },

  // Remove item from cart
  async removeFromCart(itemId: number): Promise<void> {
    return apiClient.delete(`/cart/${itemId}`);
  },

  // Clear entire cart
  async clearCart(userId: number): Promise<void> {
    return apiClient.delete(`/cart/clear/${userId}`);
  },
};
