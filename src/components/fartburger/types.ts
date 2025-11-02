export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  ingredients: string[];
  protein: number;
  fat: number;
  carbs: number;
  options?: {
    type: string;
    choices: { label: string; price: number }[];
  }[];
  imageUrl: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedOptions: Record<string, string>;
  removedIngredients: string[];
  addedIngredients: Record<string, number>;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}
