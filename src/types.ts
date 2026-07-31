export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number; // in OMR
  originalPrice?: number;
  category: string;
  occasionId?: string;
  rating: number;
  reviewsCount: number;
  images: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  flowerCountOptions?: number[];
  wrappingColors?: { nameAr: string; nameEn: string; hex: string }[];
  sizes?: { nameAr: string; nameEn: string; priceMultiplier: number }[];
  inStock: boolean;
  stockQuantity: number;
  tagsAr: string[];
  tagsEn: string[];
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  iconName: string;
  itemCount: number;
}

export interface Occasion {
  id: string;
  nameAr: string;
  nameEn: string;
  image: string;
  badgeColor: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface CartItem {
  cartId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedWrappingColor?: string;
  selectedFlowerCount?: number;
  cardMessage?: string;
  recipientName?: string;
  recipientPhone?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  giftBoxAddons?: string[];
  customAddonPrice?: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'arranging' | 'shipped' | 'delivered' | 'cancelled';

export interface TimelineStep {
  titleAr: string;
  titleEn: string;
  time: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: {
    city: string;
    area: string;
    street: string;
    building?: string;
    notes?: string;
  };
  deliveryDate: string;
  deliveryTime: string;
  paymentMethod: 'apple_pay' | 'google_pay' | 'visa' | 'thawani' | 'cod';
  paymentStatus: 'paid' | 'pending' | 'failed';
  trackingTimeline: TimelineStep[];
  couponCode?: string;
}

export interface Review {
  id: string;
  productId: string;
  productNameAr: string;
  productNameEn: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  city: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  minOrder: number;
  validUntil: string;
  active: boolean;
  usageCount: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export interface CustomGiftState {
  baseType: 'vase' | 'box' | 'basket' | 'tray';
  flowerType: 'red_roses' | 'white_lilies' | 'pink_peonies' | 'burgundy_orchids' | 'mixed_royal';
  flowerCount: number;
  wrappingColor: string;
  chocolateAddon?: string;
  perfumeAddon?: string;
  ribbonColor: string;
  cardMessage: string;
  recipientName: string;
  deliveryDate: string;
  deliveryTime: string;
}

export interface Banner {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  image: string;
  buttonTextAr: string;
  buttonTextEn: string;
  link: string;
  active: boolean;
}
