export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  shopId: number;
  shopName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  availableStock: number;
}

export interface Cart {
  id: number;
  buyerId: number;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  itemCount: number;
}

export interface CartItemRequest {
  productId: number;
  quantity: number;
}
