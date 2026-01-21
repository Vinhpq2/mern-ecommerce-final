import { Link } from 'react-router-dom';
import { LogIn, UserPlus, X } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal = ({ onClose }: LoginModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
      <div className="bg-gray-800 rounded-xl p-6 w-11/12 max-w-xs relative shadow-2xl border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold text-center text-emerald-400 mb-6">Chào mừng!</h2>
        <div className="flex flex-col gap-4">
          <Link to="/login" onClick={onClose} className="flex items-center justify-center gap-3 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors">
            <LogIn size={20} /> Đăng nhập
          </Link>
          <Link to="/signup" onClick={onClose} className="flex items-center justify-center gap-3 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors">
            <UserPlus size={20} /> Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;