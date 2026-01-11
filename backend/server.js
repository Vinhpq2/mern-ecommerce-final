import express from "express";
import dotenv from "dotenv";
import path from "path";
import authRouters from "./routes/auth.route.js";
import productRouters from "./routes/product.route.js";
import cartRouters from "./routes/cart.route.js";
import couponRouters from "./routes/coupon.route.js";
import paymentRouters from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import videoRouters from "./routes/video.router.js";
import cookieParser from 'cookie-parser';
import { connectDB } from "./lib/db.js";
import cors from "cors";

dotenv.config()

 // allow json data to be sent in the request body
const app = express();
app.use(cors({
  origin: [
    "https://mern-ecommerce-sage-five.vercel.app", // domain FE
    "http://localhost:5173"                   // domain dev local (nếu cần)
  ],
  methods:["GET","POST","PUT","DELETE","PATCH"],
  credentials: true,
  
}));
// const PORT 
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();
app.use(express.json({limit:"10mb"})); // allow json data to be sent in the request body
app.use(cookieParser());



app.use("/api/video",videoRouters);
app.use("/api/auth", authRouters);
app.use("/api/products",productRouters);
app.use("/api/cart",cartRouters);
app.use("/api/coupons",couponRouters);
app.use("/api/payments",paymentRouters);
app.use("/api/analytics",analyticsRoutes);





app.listen(PORT,()=> {
    console.log("Server is running on http://localhost:"+ PORT);
    console.log(`🌐 Public URL: ${process.env.RAILWAY_STATIC_URL || process.env.RAILWAY_PUBLIC_DOMAIN || "localhost:" + PORT}`);
    connectDB();
});
 