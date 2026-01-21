import {useEffect, useState} from 'react'
import {useProductStore} from "../stores/useProductStore";
import {useParams} from "react-router-dom";
import {motion} from "framer-motion";
import ProductCard from '../components/ProductCard';
import { useLanguageStore } from '../stores/useLanguageStore';
const CategoryPage = () => {
    const {fetchProductsByCategory,products} = useProductStore();
    const {category} = useParams();
    const [visibleCount, setVisibleCount] = useState(8); // Ban đầu hiển thị 8 sản phẩm

    useEffect(()=>{
        fetchProductsByCategory(category!);
        setVisibleCount(8); // Reset lại khi đổi category
    },[category,fetchProductsByCategory]);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 4); // Tải thêm 4 sản phẩm
    };

	const {t} = useLanguageStore();

   	return (
		<div className='min-h-screen'>
			<div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				{category && <motion.h1
					className='text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					{category.charAt(0).toUpperCase() + category?.slice(1)} 
                    {/*  viết hoa shoe = Shoes */}
				</motion.h1>}

				<motion.div
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					{products?.length === 0 && (
						<h2 className='text-3xl font-semibold text-gray-300 text-center col-span-full'>
							{t.noProductsFound}
						</h2>
					)}

					{products?.slice(0, visibleCount).map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
				</motion.div>

                {/* Nút Xem thêm */}
                {products && products.length > visibleCount && (
                    <div className="flex justify-center mt-8 pb-8">
                        <button
                            onClick={handleLoadMore}
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Xem thêm
                        </button>
                    </div>
                )}
			</div>
		</div>
	);
}
    
export default CategoryPage