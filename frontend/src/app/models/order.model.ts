export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CASH_ON_DELIVERY' | 'ONLINE_PAYMENT';

export interface Address {
  id?: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  shopId: number;
  shopName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  itemStatus: OrderStatus;
}

export interface Order {
  id: number;
  orderNumber: string;
  buyerId: number;
  buyerName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string;
  shippingAddress?: Address;
  createdAt: string;
}

export interface OrderRequest {
  shippingAddressId: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}
