import type { Product } from "../types/product";

export interface ProductStore {
  products:Product[]; 
  loading: boolean;
  // setProducts: (products: Product[]) => void;
  createProduct: (productData: Product) => void;
  deleteProduct: (id: string) => void;
  fetchAllProducts: () => void;
  fetchProductsByCategory: (category: string) => void;
  toggleFeaturedProduct: (productId: string) => void;
  fetchFeaturedProducts: () => void;

}