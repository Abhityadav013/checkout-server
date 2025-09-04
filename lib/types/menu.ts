export type MenuItem = {
  id: string;
  name: string;
  imageURL: string;
  price: number;
  description: string;
  category: {
    id: string;
    order: number;
  };
  isDelivery: boolean;
  spicy?: boolean;
  vegetarian?: boolean;
};

