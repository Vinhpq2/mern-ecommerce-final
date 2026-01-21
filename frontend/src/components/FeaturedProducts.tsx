import { useEffect, useState } from "react";
import {ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguageStore } from "../stores/useLanguageStore";

import type { Product } from "../types/product";
import { Link } from "react-router-dom";

const FeaturedProducts = ({ featuredProducts }: { featuredProducts: Product[] }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(4);
	const { t } = useLanguageStore();
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) setItemsPerPage(1);
			else if (window.innerWidth < 1024) setItemsPerPage(2);
			else if (window.innerWidth < 1280) setItemsPerPage(3);
			else setItemsPerPage(4);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
	};

	const isStartDisabled = currentIndex === 0;
	const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

	return (
		<div className='py-12'>
			<div className='container mx-auto px-4'>
				<h2 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>{t.featured}</h2>
				<div className='relative'>
					<div className='overflow-hidden'>
						<div
							className='flex transition-transform duration-300 ease-in-out'
							style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
						>
							{featuredProducts?.map((product:Product) => (
								<div key={product._id} className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2'>
									<div className=' backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-emerald-500/30'>
										<div className='overflow-hidden'>
											<Link to={`/product/${product._id}`}>
												<img
													src={product.image}
													alt={product.name}
													className='w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110'
												/>
											</Link>
										</div>
										<div className='p-4'>
											<Link to={`/product/${product._id}`}>
												<h3 className='text-lg font-semibold mb-2 text-white hover:text-emerald-400 transition-colors'>{product.name}</h3>
											</Link>							
											{product.sizes && product.sizes.length > 0 && (
												<div className="flex flex-wrap gap-1 mb-2">
													{product.sizes.slice(0, 3).map((size: string) => (
														<span key={size} className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded border border-gray-600">
															{size}
														</span>
													))}
												</div>
											)}
											<p className='text-emerald-300 font-medium mb-4'>
												${Number(product.price).toFixed(2)}
											</p>
										
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
					<button
						onClick={prevSlide}
						disabled={isStartDisabled}
						className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
							isStartDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
						}`}
					>
						<ChevronLeft className='w-6 h-6' />
					</button>

					<button
						onClick={nextSlide}
						disabled={isEndDisabled}
						className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
							isEndDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
						}`}
					>
						<ChevronRight className='w-6 h-6' />
					</button>
				</div>
			</div>
		</div>
	);
};
export default FeaturedProducts;
