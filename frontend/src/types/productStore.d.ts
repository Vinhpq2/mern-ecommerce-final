import type { Product } from "../types/product";

export interface ProductStore {
  products:Product[]; 
  loading: boolean;
  product: Product;
  // setProducts: (products: Product[]) => void;
  createProduct: (productData: Product) => void;
  updateProduct: (productId: string, productData: Product) => void;
  deleteProduct: (id: string) => void;
  fetchAllProducts: () => void;
  fetchProductById: (productId :string) => void;
  fetchProductsBySearch: (searchTerm: string) => void;
  fetchProductsByCategory: (category: string) => void;
  toggleFeaturedProduct: (productId: string) => void;
  fetchFeaturedProducts: () => void;

}