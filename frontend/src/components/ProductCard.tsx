import { useState } from "react";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import type { Product } from "../types/product";
import { useLanguageStore } from "../stores/useLanguageStore";
import { Link } from "react-router-dom";


const ProductCard = ({product}:{product: Product }) => {
	const {user} = useUserStore();
	const { addToCart } = useCartStore();
	const {t} = useLanguageStore();
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [showAllSizes, setShowAllSizes] = useState(false);

	const handleAddToCart = () => {
		if (!user) {
			toast.error("Đăng nhập để thêm vào giỏ hàng", { id: "login" });
            // {id:"login"} để chống spam thêm giỏ hàng hiển thị nhiều lần
			return;
		}
		
		// @ts-ignore - Kiểm tra an toàn với optional chaining (?.)
		if (product.sizes?.length > 0 && !selectedSize) {
			toast.error("Vui lòng chọn kích thước", { id: "select-size" });
			return;
		}

		// add to cart
		// @ts-ignore
		addToCart({ ...product, size: selectedSize || undefined });
	};

	return (
		<div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg'>
			<div className='mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
				<Link to={`/product/${product._id}`} className="w-full h-full">
					<img className='object-cover w-full h-full z-10' src={product.image} alt='product image' />
				</Link>
			</div>

			<div className='mt-4 px-5 pb-5'>
				<Link to={`/product/${product._id}`}>
					<h5 className='text-xl font-semibold tracking-tight text-white hover:text-emerald-400 transition-colors'>{product.name}</h5>
				</Link>
				
				{/* Hiển thị sizes nếu có */}
				{/* @ts-ignore */}
				{product.sizes && product.sizes.length > 0 && (
					<div className="flex flex-wrap gap-1 mt-2 mb-2">

						{product.sizes.slice(0, showAllSizes ? product.sizes.length : 4).map((size) => (
							<button 
								key={size} 
								onClick={() => {
									if (selectedSize === size) {
										setSelectedSize(null);
									} else {
										setSelectedSize(size);
									}
								}}
								className={`text-xs px-2 py-0.5 rounded border cursor-pointer transition-colors ${selectedSize === size ? "bg-emerald-600 text-white border-emerald-600" : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"}`}
							>
								{size}
							</button>
						))}

						{product.sizes.length > 4 && (
							<button
								onClick={() => setShowAllSizes(!showAllSizes)}
								className='text-xs text-gray-400 hover:text-emerald-400 transition-colors'
							>
								{showAllSizes ? "<<" : "..."}
							</button>
						)}
					</div>
				)}

				<div className='mt-2 mb-5 flex items-center justify-between'>
					<p>
						<span className='text-3xl font-bold text-emerald-400'>${Number(product.price).toFixed(2)}</span>
					</p>
				</div>
				<button
					className='flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					onClick={handleAddToCart}
				>
					<ShoppingCart size={22} className='mr-2' />
					{t.addToCart}
				</button>
			</div>
		</div>
	);
};
export default ProductCard;
