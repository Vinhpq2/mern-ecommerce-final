import { motion } from "framer-motion";
import { Trash, Star, Edit } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useState, useEffect } from "react";
import EditProductForm from "./EditProductForm";
import type { Product } from "../types/product";

const ProductsList = () => {
	const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();
	const [showModal, setShowModal] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [productToEdit, setProductToEdit] = useState<Product | null>(null);
	const [activeCategory, setActiveCategory] = useState("all");

	// Khóa cuộn trang body khi Modal Edit mở
	useEffect(() => {
		if (isEditModalOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => { document.body.style.overflow = "unset"; };
	}, [isEditModalOpen]);

	const handleDeleteClick = (id: string) => {
		setSelectedId(id);
		setShowModal(true);
	};

	const confirmDelete = () => {
		if (selectedId) {
			deleteProduct(selectedId);
		}
		setShowModal(false);
		setSelectedId(null);
	};

	const handleEditClick = (product: Product) => {
		setProductToEdit(product);
		setIsEditModalOpen(true);
	};

	const filteredProducts = activeCategory === "all" 
		? products 
		: products?.filter((product) => product.category === activeCategory);

	return (
		<>
			{/* Category Filter Tabs */}
			<div className='flex flex-wrap justify-center gap-4 mb-8'>
				<button
					onClick={() => setActiveCategory("all")}
					className={`px-4 py-2 rounded-full transition-colors ${
						activeCategory === "all" ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
					}`}
				>
					All
				</button>
				{[...new Set(products?.map((p) => p.category))].filter(Boolean).map((cat) => (
					<button
						key={cat}
						onClick={() => setActiveCategory(cat as string)}
						className={`px-4 py-2 rounded-full transition-colors ${
							activeCategory === cat ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
						}`}
					>
						{(cat as string).charAt(0).toUpperCase() + (cat as string).slice(1)}
					</button>
				))}
			</div>

			{/* Bảng sản phẩm */}
			<motion.div
				className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead className='bg-gray-700'>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Product
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Price
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Category
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Featured
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Actions
							</th>
						</tr>
					</thead>

					<tbody className='bg-gray-800 divide-y divide-gray-700'>
						{filteredProducts?.map((product) => (
							<tr key={product._id} className='hover:bg-gray-700'>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center'>
										<div className='flex-shrink-0 h-10 w-10'>
											<img
												className='h-10 w-10 rounded-full object-cover'
												src={product.image}
												alt={product.name}
											/>
										</div>
										<div className='ml-4'>
											<div className='text-sm font-medium text-white'>{product.name}</div>
										</div>
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300'>
										${(Number(product.price)).toFixed(2)}
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300'>{product.category}</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<button
										onClick={() => toggleFeaturedProduct(product._id)}
										className={`p-1 rounded-full ${
											product.isFeatured
												? "bg-yellow-400 text-gray-900"
												: "bg-gray-600 text-gray-300"
										} hover:bg-yellow-500 transition-colors duration-200`}
									>
										<Star className='h-5 w-5' />
									</button>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
									<button
										onClick={() => handleEditClick(product)}
										className='text-blue-400 hover:text-blue-300 mr-2'
									>
										<Edit className='h-5 w-5' />
									</button>
									<button
										onClick={() => handleDeleteClick(product._id)}
										className='text-red-400 hover:text-red-300'
									>
										<Trash className='h-5 w-5' />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</motion.div>

			{/* Modal xác nhận */}
			{showModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-gray-800 rounded-lg p-6 shadow-lg max-w-sm w-full'>
						<h2 className='text-lg font-semibold text-white mb-4'>
							Bạn có chắc muốn xóa sản phẩm này?
						</h2>
						<div className='flex justify-end gap-3'>
							<button
								onClick={() => setShowModal(false)}
								className='px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500'
							>
								Hủy
							</button>
							<button
								onClick={confirmDelete}
								className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500'
							>
								Xóa
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Modal Edit Product */}
			{isEditModalOpen && productToEdit && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-[9999] p-4 pt-24 overflow-y-auto'>
					<EditProductForm 
						product={productToEdit} 
						onClose={() => setIsEditModalOpen(false)} 
					/>
				</div>
			)}
		</>
	);
};
export default ProductsList;
