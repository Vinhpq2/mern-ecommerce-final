import {useState} from 'react';
import {motion} from 'framer-motion';
import {PlusCircle,Upload,Loader} from "lucide-react";
import { useProductStore } from '../stores/useProductStore';

const categories = ["jeans","t-shirts","shoes","glasses","jackets","suits","bags"];
const CreateProductForm = () => {
    const [newProduct,setNewProduct] = useState({
        _id:"",
        name:"",
        description:"",
        price:"",
        category:"",
        image:"",
    });
    

    const {createProduct,loading} = useProductStore();
    const handleSubmit :React.FormEventHandler<HTMLFormElement> = (e) =>{
        e.preventDefault();
        if(Number(newProduct.price) <= 0){
            alert("Price must be greater than 0");
            return;
        }
        try{
            createProduct(newProduct);
            setNewProduct({_id:"",name:"",description:"",price:"",category:"",image:""});
    }
    catch{
        console.error("Error creating product");
    }
}

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  // hàm xử lý sự kiện khi thay đổi hình ảnh
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();

    reader.onloadend = () => {
      setNewProduct({ ...newProduct, image: reader.result as string });
    };

    reader.readAsDataURL(file); // chuyển đổi thành base64
  }
};
  return (
   <motion.div
   className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto "
   initial={{opacity:0,y:20}}
   animate={{opacity:1,y:0}}
   transition={{duration:0.8}}>
    <h2 className="text-2xl font-semibold mb-6 text-emerald-300">Tạo sản phẩm mới</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Tên sản phẩm
            </label>
            <input 
            type="text"
            id="name"
            value={newProduct.name}
            onChange={(e)=>setNewProduct({...newProduct,name:e.target.value})}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 
            text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required/>
        </div>
        <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                Mô tả sản phẩm
            </label>
            <textarea
            id="description"
            name="description"
            value={newProduct.description}
            onChange={(e)=>setNewProduct({...newProduct,description:e.target.value})}
            rows={3}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3
            text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required/>
        </div>
         <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-300">
                Giá cả
            </label>
            <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            min="0"
            value={newProduct.price}
            onChange={(e)=>setNewProduct({...newProduct,price:e.target.value})}
            
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3
            text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required/>
        </div>
         <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                Danh mục
            </label>
           <select 
            id="category"
            name="category"
            value={newProduct.category}
            onChange={(e)=>setNewProduct({...newProduct,category:e.target.value})}
             className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3
            text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required>
            <option value="">Chọn 1 một danh mục</option>
            {categories.map((category) =>(
                <option key={category} value={category}>{category}</option>
            ))}
            </select>
        </div>

        <div className="mt-1 flex items-center">
            <input type="file" id="image" className="sr-only" accept="image/*"
                onChange={handleImageChange} />
            <label htmlFor='image'  
            className="cursor-pointer bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3
            text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                <Upload className="h-5 w-5 inline-block mr-2"/>
                Chọn ảnh sản phẩm
            </label>
            {newProduct.image && <span className="ml-3 text-sm text-gray-400">Tải ảnh thành công</span>}
        </div>

        <button 
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm 
            font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 
            focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            disabled={loading}>
        {loading ? (
            <>
            <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" /> 
            Loading...</>) : (
                <>
                <PlusCircle className="mr-2 h-5 w-5"/>
                Tạo sản phẩm
                </>
            )}
        </button>
    </form>

 
   </motion.div>
  )
}
export default CreateProductForm