// migrate_sizes.js (đặt trong folder backend)
import mongoose from 'mongoose';
import Product from './models/product.model.js'; // Lưu ý phải có đuôi .js
import dotenv from 'dotenv';
dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    // 1. Quần áo / Clothing (Tiếng Việt + Tiếng Anh) -> Size S, M, L, XL
    const clothing = await Product.updateMany(
      {
        sizes: { $exists: false },
        category: { $regex: /jeans|jackets/i }
      },
      { $set: { sizes: ["S", "M", "L", "XL"] } }
    );
    console.log(`Đã update size quần áo cho ${clothing.modifiedCount} sản phẩm.`);

    // 2. Giày dép / Shoes (Tiếng Việt + Tiếng Anh) -> Size số 38-42
    const shoes = await Product.updateMany(
      {
        sizes: { $exists: true },
        category: { $regex: /shoes/i }
      },
      { $set: { sizes: ["38", "39", "40", "41", "42"] } }
    );
    console.log(`Đã update size giày dép cho ${shoes.modifiedCount} sản phẩm.`);

    // 3. Các sản phẩm còn lại (Túi/Bags, Nón, Phụ kiện...) -> Mảng rỗng (Không có size)
    const others = await Product.updateMany(
      { sizes: { $exists: true } },
      { $set: { sizes: [] } }
    );
    console.log(`Đã update mảng rỗng cho ${others.modifiedCount} sản phẩm còn lại.`);

  } catch (error) {
    console.error("Lỗi migration:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Đã ngắt kết nối");
  }
};

migrate();
