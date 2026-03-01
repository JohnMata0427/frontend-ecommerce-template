export interface Category {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  subcategoryCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
  active: boolean;
}
