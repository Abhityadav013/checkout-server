export interface MenuCategory {
  id: string;
  imageUrl: string;
  categoryName: string;
  updatedAt: string;
  createdAt: string;
  isDelivery: boolean;
  order: number;
  spicy?: boolean;
  vegetarian?: boolean;
}
