import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Coupon } from '../types';
import { PRODUCTS as initialProducts } from '../data/mockData';
import { api } from '../lib/api';

export type Currency = 'OMR' | 'SAR' | 'USD';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface StoreContextType {
  products: Product[];
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceInOmr: number) => string;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartId'>) => void;
  removeFromCart: (cartId: string) => void;
  updateCartQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  discountAmount: number;
  deliveryFee: number;
  cartTotal: number;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status' | 'trackingTimeline'>) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  recentlyViewed: Product[];
  addRecentlyViewed: (product: Product) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Seeded with the bundled catalog so the storefront never shows an
  // empty grid — swapped for live data once the API responds (and kept
  // as-is if the API is unreachable or the database hasn't been seeded yet).
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    let cancelled = false;
    api
      .getProducts()
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {
        // Backend not configured yet or unreachable — keep the bundled catalog.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [currency, setCurrency] = useState<Currency>('OMR');
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('abaq_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('abaq_cart', JSON.stringify(cart));
  }, [cart]);

  // Currency conversion calculations (1 OMR = ~9.75 SAR = ~2.60 USD)
  const formatPrice = (priceInOmr: number) => {
    if (currency === 'SAR') {
      const priceSar = (priceInOmr * 9.75).toFixed(2);
      return `${priceSar} ر.س`;
    }
    if (currency === 'USD') {
      const priceUsd = (priceInOmr * 2.60).toFixed(2);
      return `$${priceUsd}`;
    }
    return `${priceInOmr.toFixed(2)} ر.ع.`;
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const addToCart = (item: Omit<CartItem, 'cartId'>) => {
    const cartId = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newItem: CartItem = { ...item, cartId };
    setCart((prev) => [newItem, ...prev]);
    showToast(`تمت إضافة "${item.product.nameAr}" إلى سلة الهدايا ✨`);
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((i) => i.cartId !== cartId));
    showToast('تم حذف المنتج من السلة', 'info');
  };

  const updateCartQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.cartId === cartId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartSubtotal = cart.reduce((acc, item) => {
    let itemPrice = item.product.price;
    if (item.customAddonPrice) {
      itemPrice += item.customAddonPrice;
    }
    return acc + itemPrice * item.quantity;
  }, 0);

  const applyCoupon = async (code: string) => {
    try {
      const result = await api.validateCoupon(code, cartSubtotal);
      if (result.success && result.coupon) {
        setAppliedCoupon(result.coupon);
        showToast(result.message + ' 🎁');
      }
      return { success: result.success, message: result.message };
    } catch {
      return { success: false, message: 'تعذر التحقق من كود الخصم، حاول مرة أخرى' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('تم إلغاء كود الخصم', 'info');
  };

  let discountAmount = 0;
  if (appliedCoupon) {
    discountAmount = (cartSubtotal * appliedCoupon.discountPercent) / 100;
    if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
      discountAmount = appliedCoupon.maxDiscount;
    }
  }

  const deliveryFee = cart.length > 0 ? 3.00 : 0; // Standard fast delivery in Oman
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

  const addRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 6);
    });
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status' | 'trackingTimeline'>) => {
    // The order is recorded for the admin dashboard, but WhatsApp is the
    // real confirmation channel — a slow or unreachable API must never
    // block the customer from sending their order.
    api.createOrder(orderData).catch(() => {
      console.error('Failed to persist order to backend; customer still received WhatsApp confirmation.');
    });
    clearCart();
    showToast('تمت عملية الشراء بنجاح! 🌸');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        currency,
        setCurrency,
        formatPrice,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        deliveryFee,
        cartTotal,
        createOrder,
        toasts,
        showToast,
        recentlyViewed,
        addRecentlyViewed,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
