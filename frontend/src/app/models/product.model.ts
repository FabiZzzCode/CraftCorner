export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';

export interface Product {
  id: number;
  shopId: number;
  shopName: string;
  categoryId: number;
  categoryName: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  effectivePrice: number;
  stockQuantity: number;
  material?: string;
  productionTime?: string;
  deliveryOption?: string;
  status: ProductStatus;
  averageRating: number;
  reviewCount: number;
  imageUrls: string[];
  primaryImageUrl?: string;
  createdAt: string;
}

export interface ProductRequest {
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  categoryId: number;
  material?: string;
  productionTime?: string;
  deliveryOption?: string;
  imageUrls?: string[];
}

export interface ProductFilter {
  keyword?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  shopId?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
