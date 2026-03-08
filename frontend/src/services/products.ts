export interface Product {
  id: string;
  name: string;
  category: 'Cow Milk' | 'Buffalo Milk' | 'Flavoured Milk' | 'Curd' | 'Butter' | 'Ghee';
  pricePerLitre: number;
  image: string;
  description: string;
  availability: 'In Stock' | 'Out of Stock' | 'Limited Stock';
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
}

export const products: Product[] = [];
