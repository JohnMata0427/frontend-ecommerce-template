export interface Subcategory {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  categoryName: string;
  active: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubcategoryRequest {
  name: string;
  description?: string;
  categoryId: string;
  active: boolean;
}
