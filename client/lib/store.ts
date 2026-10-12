import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  pricePerKg: number;
  imageUrl: string;
  quantityKg: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantityKg: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.productId === item.productId);
        
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantityKg: i.quantityKg + item.quantityKg }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },
      updateQuantity: (productId, quantityKg) => {
        if (quantityKg <= 0) {
          get().removeItem(productId);
        } else {
          set({
            items: get().items.map((i) =>
              i.productId === productId ? { ...i, quantityKg } : i
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.pricePerKg * item.quantityKg,
          0
        );
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantityKg, 0);
      },
    }),
    {
      name: 'kingston-cart',
    }
  )
);
