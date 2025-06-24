import { useCartStore, CartItem } from "@/lib/cart-store";
import { Product } from "@shared/schema";

interface UseCartReturn {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export function useCart(): UseCartReturn {
  const cart = useCartStore();
  
  return {
    items: cart.items,
    isOpen: cart.isOpen,
    addItem: cart.addItem,
    removeItem: cart.removeItem,
    updateQuantity: cart.updateQuantity,
    clearCart: cart.clearCart,
    toggleCart: cart.toggleCart,
    getTotalItems: cart.getTotalItems,
    getTotalPrice: cart.getTotalPrice,
  };
}
