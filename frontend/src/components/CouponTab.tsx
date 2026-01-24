import { motion } from "framer-motion";
import { Trash } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "../lib/axios";
import toast from "react-hot-toast";

interface Coupon {
	_id: string;
	code: string;
	discountPercentage: number;
	expirationDate: string;
	isActive: boolean;
	userId: string;
	usageLimit?: number;
	usageCount?: number;
}

const CouponTab = () => {
	const [coupons, setCoupons] = useState<Coupon[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchCoupons = async () => {
		try {
			// Giả định route backend là /coupons/all cho admin
			const res = await axios.get("/coupons/all");
			setCoupons(res.data);
		} catch (error) {
			console.error("Error fetching coupons:", error);
			toast.error("Failed to fetch coupons");
		} finally {
			setIsLoading(false);
		}
	};

	const deleteCoupon = async (id: string) => {
		if (!confirm("Are you sure you want to delete this coupon?")) return;
		try {
			await axios.delete(`/coupons/${id}`);
			setCoupons((prev) => prev.filter((c) => c._id !== id));
			toast.success("Coupon deleted successfully");
		} catch (error) {
			console.error("Error deleting coupon:", error);
			toast.error("Failed to delete coupon");
		}
	};

	useEffect(() => {
		fetchCoupons();
	}, []);

	if (isLoading) return <div className="text-white text-center">Loading coupons...</div>;

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-5xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<table className='min-w-full divide-y divide-gray-700'>
				<thead className='bg-gray-700'>
					<tr>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Code</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Discount</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Usage</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Expiration</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Status</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Action</th>
					</tr>
				</thead>
				<tbody className='bg-gray-800 divide-y divide-gray-700'>
					{coupons.length === 0 && (
						<tr>
							<td colSpan={6} className="text-center py-4 text-gray-400">No coupons found</td>
						</tr>
					)}
					{coupons.map((coupon) => (
						<tr key={coupon._id} className='hover:bg-gray-700 transition'>
							<td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-400'>{coupon.code}</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{coupon.discountPercentage}%</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
								{coupon.usageCount || 0} / {coupon.usageLimit ? coupon.usageLimit : "∞"}
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{new Date(coupon.expirationDate).toLocaleDateString()}</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm'>
								<span className={`px-2 py-1 rounded text-xs ${coupon.isActive ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
									{coupon.isActive ? "Active" : "Inactive"}
								</span>
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
								<button onClick={() => deleteCoupon(coupon._id)} className='text-red-400 hover:text-red-300'>
									<Trash className='h-5 w-5' />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</motion.div>
	);
};
export default CouponTab;