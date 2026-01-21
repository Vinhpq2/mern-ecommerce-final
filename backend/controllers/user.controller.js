import User from "../models/user.model.js";

export const updateUserProfile = async (req, res) => {
    try {
        const { name, currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Cập nhật tên nếu có
        if (name && name !== user.name) {
            user.name = name;
        }

        // Cập nhật mật khẩu nếu có
        if (currentPassword && newPassword) {
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ message: "currentPasswordIncorrect" });
            }
            user.password = newPassword; // Hook pre-save trong user.model.js sẽ tự động mã hóa
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });

    } catch (error) {
        console.error("Error in updateUserProfile controller:", error.message);
        // Kiểm tra nếu là lỗi Validation của Mongoose (ví dụ: mật khẩu ngắn, thiếu tên...)
        if (error.name === "ValidationError") {
            const message = Object.values(error.errors).map((val) => val.message).join(", ");
            return res.status(400).json({ message });
        }
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};