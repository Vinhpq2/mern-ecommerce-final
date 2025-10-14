import {create} from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";
import type {Product} from "../types/product";
import type {ProductStore} from "../types/productStore";


export const useProductStore =  create<ProductStore>((set) => ({
    products:[],
    loading:false,

    createProduct: async (productData) =>{
        set({loading:true});
        try{
            const res = await axios.post("/products",productData);
            set((prevState : { products: Product[] }) =>({
                products:[...prevState.products,res.data],
                loading:false,
            }))
            toast.success("Tạo sản phẩm thành công");
        }
        catch(error){
            console.error("Error creating product:",error);
            toast.error("Tạo sản phẩm thất bại");
            set({loading:false});
    }
    },

    fetchAllProducts: async() =>{
      set({loading:true});
      try{
        const res = await axios.get("/products");
        set({products:res.data,loading:false});
        console.log(typeof res.data);
      }catch(error){
        console.error("Error fetching products:",error);
        set({loading:false});
        toast.error("Lấy sản phẩm thất bại");
      }
    },

    fetchProductsByCategory: async (category:string)=>{
      set({loading:true});
      try{
        const res = await axios.get(`/products/category/${category}`);
        set({products:res.data,loading:false});
      }catch(error){
        console.error("Error fetching products:",error);
        set({loading:false});
        toast.error("Lấy sản phẩm thất bại");
      }
    },

    deleteProduct: async (productId) =>{
      set({loading:true});
      try{
        await axios.delete(`/products/${productId}`);
        set((prevProducts)=>({
          products:prevProducts.products.filter((product) => product._id !== productId),
          loading:false
        }))
        toast.success("Xóa sản phẩm thành công");
      }
      catch(error){
        set({loading:false});
        console.error("Error deleting product:",error);
        toast.error("Xóa sản phẩm thất bại");
        
      }
    },
    toggleFeaturedProduct: async(productId) =>{
      set({loading:true});
      try{
        const res = await axios.patch(`/products/${productId}`);
        set((prevProducts) =>({
          products:prevProducts.products.map((product) =>
            product._id === productId ? {...product,isFeatured:res.data.isFeatured} : product
        ),
        loading:false,
        }))
      }
      catch(error){
        console.error("Error toggling feature status:",error);
        set({loading:false});
        toast.error("Cập nhật trạng thái nổi bật thất bại");
      }
    },

    fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({loading: false });
			console.log("Error fetching featured products:", error);
		}
	},

}))