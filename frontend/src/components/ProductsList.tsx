import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useState } from "react";

const ProductsList = () => {
	const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();
	const [showModal, setShowModal] = useState(false);
	const [selectedId, setSelectedId] = useState<string | null>(null);

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

	return (
		<>
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
						{products?.map((product) => (
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
		</>
	);
};

export default ProductsList;
