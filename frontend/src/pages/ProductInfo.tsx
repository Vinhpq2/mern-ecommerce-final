import { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '../stores/useProductStore';
import { useCartStore } from '../stores/useCartStore';
import { useUserStore } from '../stores/useUserStore';
import { useLanguageStore } from '../stores/useLanguageStore';
import { ShoppingCart, Star, ArrowLeft } from 'lucide-react';
import type { Product } from '../types/product';

const ProductInfo = () => {
    const { id } = useParams();
    const { fetchProductById, product, loading } = useProductStore();
    const { addToCart } = useCartStore();
    const {user} = useUserStore();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const { t } = useLanguageStore();

    useEffect(() => {
        if (id) {
            console.log("Fetching product with ID:", id);
            fetchProductById(id);
        }
    }, [id, fetchProductById]);

    	const handleAddToCart = (product:Product) => {
		if (!user) {
			toast.error("Đăng nhập để thêm vào giỏ hàng", { id: "login" });
            // {id:"login"} để chống spam thêm giỏ hàng hiển thị nhiều lần
			return;
		} else {
            if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                toast.error("Vui lòng chọn kích thước", { id: "size-error" });
                return;
            }
           // @ts-ignore
			addToCart({ ...product, size: selectedSize });
		}
	};

    if (loading) return (
        <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500'></div>
        </div>
    );

    if (!product) return (
        <div className='min-h-screen bg-gray-900 flex items-center justify-center text-white'>
            <div className='text-center'>
                <h2 className='text-2xl font-bold mb-4'>Không tìm thấy sản phẩm</h2>
                <Link to="/" className='text-emerald-400 hover:underline'>Quay về trang chủ</Link>
            </div>
        </div>
    );

    return (
        <div className='min-h-screen  text-white pt-10 pb-10 px-4 mt-0'>
            <div className='max-w-6xl mx-auto'>
                <Link to="/" className='inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-8 transition-colors'>
                    <ArrowLeft size={20} />
                    Quay lại
                </Link>

                <div className='flex flex-col md:flex-row gap-8 bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700'>
                    {/* Image Section */}
                    <div className='flex-1'>
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className='w-full h-96 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300' 
                        />
                    </div>

                    {/* Info Section */}
                    <div className='flex-1 space-y-6'>
                        <div>
                            <h1 className='text-3xl font-bold text-emerald-400 mb-2'>{product.name}</h1>
                            <div className='flex items-center gap-2 text-gray-400 text-sm'>
                                <span className='bg-gray-700 px-2 py-1 rounded uppercase text-xs font-bold tracking-wider'>{product.category}</span>
                                <div className='flex items-center text-yellow-400'>
                                    <Star size={16} fill="currentColor" />
                                    <span className='ml-1'>4.5</span>
                                </div>
                            </div>
                        </div>

                        {/* Hiển thị Size nếu có */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className='mt-4'>
                                <h3 className='text-sm font-medium text-gray-300 mb-2'>Kích thước:</h3>
                                <div className='flex flex-wrap gap-2'>
                                    {product.sizes.map((size: string) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 rounded-md border transition-all ${selectedSize === size ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-gray-600 text-gray-300 hover:border-emerald-500'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <p className='text-gray-300 leading-relaxed text-lg'>
                            {product.description}
                        </p>

                        <div className='text-4xl font-bold text-white'>
                            ${product.price}
                        </div>

                        <div className='flex gap-4 pt-4'>
                            <button 
                                onClick={() => handleAddToCart(product)}
                                className='flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-lg flex items-center justify-center gap-2 transition-colors font-bold text-lg shadow-lg shadow-emerald-900/20'
                            >
                                <ShoppingCart size={24} />
                                {t.addToCart}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;