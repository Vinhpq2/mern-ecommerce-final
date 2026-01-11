import { useState } from "react";
import { X, Save, Upload } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import type { Product } from "../types/product";
// Định nghĩa kiểu dữ liệu cơ bản cho props (hoặc import từ types nếu có)


interface EditProductFormProps {
	product: Product;
	onClose: () => void;
}

const EditProductForm = ({ product, onClose }: EditProductFormProps) => {
	const [formData, setFormData] = useState({
		name: product.name,
		price: Number(product.price),
		category: product.category,
		image: product.image,
		description: product.description || "",
        sizes: product.sizes?.join(", ") || "",
	});
	const [loading, setLoading] = useState(false);
	
	const { updateProduct } = useProductStore();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const sizesArray = formData.sizes
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);

			const dataToUpdate = { 
				...formData, 
				price: formData.price.toString(),
				sizes: sizesArray 
			};

			// Gọi hàm update từ store
			// We construct a full product object to satisfy the TypeScript type
			await updateProduct(product._id, { ...product, ...dataToUpdate });
			onClose();
		} catch (error) {
			console.error("Error updating product:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setFormData({ ...formData, image: reader.result as string });
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className='bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-md relative border border-gray-700'>
			<button
				onClick={onClose}
				className='absolute top-4 right-4 text-gray-400 hover:text-white transition-colors'
			>
				<X size={24} />
			</button>

			<h2 className='text-2xl font-bold text-emerald-400 mb-6'>Edit Product</h2>

			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label className='block text-sm font-medium text-gray-300 mb-1'>Product Name</label>
					<input
						type='text'
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						className='w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
						required
					/>
				</div>

				<div className='grid grid-cols-2 gap-4'>
					<div>
						<label className='block text-sm font-medium text-gray-300 mb-1'>Price ($)</label>
						<input
							type='number'
							value={formData.price}
							onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
							className='w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
							required
							min="0"
							step="0.01"
						/>
					</div>
					<div>
						<label className='block text-sm font-medium text-gray-300 mb-1'>Category</label>
						<select
							value={formData.category}
							onChange={(e) => setFormData({ ...formData, category: e.target.value })}
							className='w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
						>
							<option value="jeans">Jeans</option>
							<option value="t-shirts">T-shirts</option>
							<option value="shoes">Shoes</option>
							<option value="glasses">Glasses</option>
							<option value="jackets">Jackets</option>
							<option value="suits">Suits</option>
							<option value="bags">Bags</option>
						</select>
					</div>
				</div>

				<div>
					<label className='block text-sm font-medium text-gray-300 mb-1'>Sizes (comma separated)</label>
					<input
						type='text'
						placeholder="e.g. S, M, L or 38, 39, 40"
						value={formData.sizes}
						onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
						className='w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
					/>
					<p className="text-xs text-gray-400 mt-1">Leave empty if the product has no sizes.</p>
				</div>

				<div>
					<label className='block text-sm font-medium text-gray-300 mb-1'>Description</label>
					<textarea
						value={formData.description}
						onChange={(e) => setFormData({ ...formData, description: e.target.value })}
						className='w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
						rows={3}
					/>
				</div>

				<div>
					<label className='block text-sm font-medium text-gray-300 mb-1'>Product Image</label>
					<div className="flex items-center gap-2">
						<input type="file" id="edit-image" className="sr-only" accept="image/*" onChange={handleImageChange} />
						<label htmlFor='edit-image' className="cursor-pointer bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white hover:bg-gray-600 flex items-center">
							<Upload className="h-4 w-4 mr-2"/> Change Image
						</label>
					</div>
					{formData.image && <img src={formData.image} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />}
				</div>

				<button
					type='submit'
					disabled={loading}
					className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-50'
				>
					{loading ? (
						<span className="animate-spin mr-2">...</span>
					) : (
						<Save size={20} className="mr-2" />
					)}
					Save Changes
				</button>
			</form>
		</div>
	);
};

export default EditProductForm;
