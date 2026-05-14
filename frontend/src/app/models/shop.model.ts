export type ShopStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export interface Shop {
  id: number;
  sellerId: number;
  sellerName: string;
  name: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  status: ShopStatus;
  createdAt: string;
}

export interface ShopRequest {
  name: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
}
