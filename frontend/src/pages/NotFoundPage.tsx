import { Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFoundPage = () => {
	return (
		<div className='flex flex-col items-center justify-center min-h-[70vh] text-center px-4 relative z-10'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<AlertTriangle className='w-24 h-24 text-emerald-500 mb-6 mx-auto' />
			</motion.div>
			
			<h1 className='text-4xl sm:text-6xl font-bold text-white mb-4'>404</h1>
			<h2 className='text-2xl font-semibold text-emerald-400 mb-6'>Trang không tìm thấy</h2>
			<p className='text-gray-300 text-lg mb-8 max-w-md'>
				Rất tiếc, trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
			</p>
			
			<Link
				to='/'
				className='inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105'
			>
				<ArrowLeft size={20} />
				Về trang chủ
			</Link>
		</div>
	);
};

export default NotFoundPage;