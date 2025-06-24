import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@shared/schema";

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

interface CartStore {
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

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.product.id === product.id);
          
          if (existingItem) {
            return {
              ...state,
              items: state.items.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          
          return {
            ...state,
            items: [...state.items, { 
              id: Date.now(), 
              product, 
              quantity 
            }],
          };
        });
      },
      
      removeItem: (productId: number) => {
        set((state) => ({
          ...state,
          items: state.items.filter(item => item.product.id !== productId),
        }));
      },
      
      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set((state) => ({
          ...state,
          items: state.items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      toggleCart: () => {
        set((state) => ({ ...state, isOpen: !state.isOpen }));
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => 
          total + (parseFloat(item.product.price) * item.quantity), 0
        );
      },
    }),
    {
      name: "naturevital-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
