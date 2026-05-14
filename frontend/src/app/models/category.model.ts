export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface CategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
}
