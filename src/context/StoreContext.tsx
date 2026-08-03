import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Coupon, Review, Customer, OrderStatus } from '../types';
import { PRODUCTS as initialProducts, REVIEWS as initialReviews, COUPONS as initialCoupons, INITIAL_ORDERS, MOCK_CUSTOMERS } from '../data/mockData';

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
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmount: number;
  deliveryFee: number;
  cartTotal: number;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status' | 'trackingTimeline'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'verified'>) => void;
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  deleteCoupon: (id: string) => void;
  customers: Customer[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  recentlyViewed: Product[];
  addRecentlyViewed: (product: Product) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('abaq_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [currency, setCurrency] = useState<Currency>('OMR');
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('abaq_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('abaq_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('abaq_coupons');
    return saved ? JSON.parse(saved) : initialCoupons;
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('abaq_reviews');
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [customers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('abaq_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('abaq_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('abaq_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('abaq_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('abaq_coupons', JSON.stringify(coupons));
  }, [coupons]);

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

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code === cleanCode && c.active);
    if (!found) {
      return { success: false, message: 'كود الخصم غير صحيح أو منتهي الصلاحية' };
    }
    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `الحد الأدنى لاستخدام هذا الكود هو ${found.minOrder} ر.ع.`,
      };
    }
    setAppliedCoupon(found);
    showToast(`تم تطبيق خصم ${found.discountPercent}% بنجاح! 🎁`);
    return { success: true, message: `تم تطبيق خصم ${found.discountPercent}%` };
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

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status' | 'trackingTimeline'>): Order => {
    const orderNum = `AN-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending',
      trackingTimeline: [
        { titleAr: 'تم استلام الطلب والدفع', titleEn: 'Order Received & Paid', time: 'الآن', completed: true, current: true },
        { titleAr: 'اختيار الورد والتجهيز', titleEn: 'Selecting Fresh Roses', time: 'قيد الانتظار', completed: false },
        { titleAr: 'تنسيق الباقة والتغليف الملكي', titleEn: 'Arranging Bouquet & Wrapping', time: 'قيد الانتظار', completed: false },
        { titleAr: 'خرجت مع مندوب التوصيل', titleEn: 'Out for Delivery', time: 'قيد الانتظار', completed: false },
        { titleAr: 'تم التوصيل بنجاح', titleEn: 'Delivered', time: 'قيد الانتظار', completed: false },
      ]
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast(`تمت عملية الشراء بنجاح! رقم الطلب ${orderNum} 🌸`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const updatedTimeline = o.trackingTimeline.map((t, idx) => {
          if (status === 'preparing' && idx <= 1) return { ...t, completed: true, current: idx === 1 };
          if (status === 'arranging' && idx <= 2) return { ...t, completed: true, current: idx === 2 };
          if (status === 'shipped' && idx <= 3) return { ...t, completed: true, current: idx === 3 };
          if (status === 'delivered') return { ...t, completed: true, current: false };
          return t;
        });
        return { ...o, status, trackingTimeline: updatedTimeline };
      })
    );
    showToast('تم تحديث حالة الطلب بنجاح');
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'verified'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10),
      verified: true,
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast('شكراً لمشاركتك تقييمك الفاخر! ⭐');
  };

  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usageCount'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `c-${Date.now()}`,
      usageCount: 0,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    showToast('تمت إضافة كود الخصم الجديد');
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    showToast('تم حذف كود الخصم', 'info');
  };

  const addProduct = (p: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => {
    const newP: Product = {
      ...p,
      id: `p-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
    };
    setProducts((prev) => [newP, ...prev]);
    showToast('تمت إضافة المنتج الجديد بنجاح ✨');
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast('تم تحديث بيانات المنتج بنجاح');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('تم حذف المنتج', 'info');
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
        orders,
        createOrder,
        updateOrderStatus,
        reviews,
        addReview,
        coupons,
        addCoupon,
        deleteCoupon,
        customers,
        addProduct,
        updateProduct,
        deleteProduct,
        toasts,
        showToast,
        recentlyViewed,
        addRecentlyViewed,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        isAdmin,
        setIsAdmin,
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
