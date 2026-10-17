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

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN' | string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => {
        if (user) {
          const role = user.role?.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';
          set({ user: { ...user, role }, isLoading: false });
        } else {
          set({ user: null, isLoading: false });
        }
      },
      checkAuth: async () => {
        try {
          const { api } = await import('./api');
          const res = await api.auth.me();
          if (res?.user) {
            const role = res.user.role?.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';
            set({ user: { ...res.user, role }, isLoading: false });
          } else {
            set({ user: null, isLoading: false });
          }
        } catch {
          set({ user: null, isLoading: false });
        }
      },
      logout: async () => {
        try {
          const { api } = await import('./api');
          await api.auth.logout();
        } catch {
          // ignore error on logout
        } finally {
          set({ user: null, isLoading: false });
        }
      },
    }),
    {
      name: 'kingston-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

