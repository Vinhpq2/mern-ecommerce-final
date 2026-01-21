import { useState } from 'react';
import { useUserStore } from '../stores/useUserStore';
import { useLanguageStore } from '../stores/useLanguageStore';
import { toast } from 'react-hot-toast';
import { User, Lock, Save, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { user, updateUser, loading } = useUserStore();
  const { t } = useLanguageStore();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      toast.error(t.wrongPassword);
      return;
    }
    await updateUser(formData);
    // Xóa các trường mật khẩu sau khi gửi
    setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    }));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Vui lòng đăng nhập để xem trang này.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <motion.div
        className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-emerald-400 mb-6 text-center">{t.profile}</h1>
        
        <div className="mb-8 text-center">
            <p className="text-gray-400">Email</p>
            <p className="text-lg text-white font-medium">{user.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              {t.fullName}
            </label>
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-lg font-semibold text-white mb-4">{t.changePassword_text}</p>
            <div className="space-y-4">
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                    {t.currentPassword_text}
                    </label>
                     <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="********"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                    {t.newPassword_text}
                    </label>
                     <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="********"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-300 mb-1">
                    {t.confirmPassword}
                    </label>
                     <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        placeholder="********"
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <>
                <Save className="mr-2" size={20} />
                {t.save}
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfilePage;