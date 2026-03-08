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

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Cow Milk',
    category: 'Cow Milk',
    pricePerLitre: 60,
    image: '/images/cow-milk.png',
    description: 'Farm-fresh, wholesome cow milk. Rich in calcium and essential vitamins.',
    availability: 'In Stock',
    nutrition: { calories: 60, protein: 3.2, fat: 3.4, carbs: 4.8 },
  },
  {
    id: '2',
    name: 'Organic Buffalo Milk',
    category: 'Buffalo Milk',
    pricePerLitre: 75,
    image: '/images/buffalo-milk.png',
    description: 'Creamy and rich buffalo milk, perfect for traditional recipes.',
    availability: 'In Stock',
    nutrition: { calories: 97, protein: 3.8, fat: 6.5, carbs: 5.2 },
  },
  {
    id: '3',
    name: 'Chocolate Flavoured Milk',
    category: 'Flavoured Milk',
    pricePerLitre: 80,
    image: '/images/flavoured-milk.png',
    description: 'Delicious chocolate milk, a favorite for all ages.',
    availability: 'Limited Stock',
    nutrition: { calories: 80, protein: 3.0, fat: 2.5, carbs: 10.0 },
  },
  {
    id: '4',
    name: 'Homemade Curd',
    category: 'Curd',
    pricePerLitre: 50,
    image: '/images/curd.png',
    description: 'Probiotic-rich curd, made fresh daily with traditional methods.',
    availability: 'In Stock',
    nutrition: { calories: 60, protein: 3.5, fat: 3.0, carbs: 4.5 },
  },
  {
    id: '5',
    name: 'Pure Desi Ghee',
    category: 'Ghee',
    pricePerLitre: 600,
    image: '/images/ghee.png',
    description: '100% pure desi ghee, rich aroma and healthy fats.',
    availability: 'In Stock',
    nutrition: { calories: 900, protein: 0.0, fat: 100.0, carbs: 0.0 },
  },
  {
    id: '6',
    name: 'Strawberry Flavoured Milk',
    category: 'Flavoured Milk',
    pricePerLitre: 80,
    image: '/images/flavoured-milk.png',
    description: 'Sweet and refreshing strawberry flavored milk.',
    availability: 'Limited Stock',
    nutrition: { calories: 85, protein: 3.0, fat: 2.5, carbs: 11.0 },
  },
  {
    id: '7',
    name: 'Low-Fat Cow Milk',
    category: 'Cow Milk',
    pricePerLitre: 55,
    image: '/images/cow-milk.png',
    description: 'Healthy low-fat cow milk for a balanced diet.',
    availability: 'In Stock',
    nutrition: { calories: 45, protein: 3.4, fat: 1.5, carbs: 4.9 },
  },
];
