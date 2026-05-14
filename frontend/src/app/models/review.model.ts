export interface Review {
  id: number;
  productId: number;
  buyerId: number;
  buyerName: string;
  buyerImage?: string;
  rating: number;
  title?: string;
  comment?: string;
  createdAt: string;
}

export interface ReviewRequest {
  productId: number;
  orderId?: number;
  rating: number;
  title?: string;
  comment?: string;
}
