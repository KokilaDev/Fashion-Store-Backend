import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import cartRoutes from "./routes/cartRoutes";
import couponRoutes from "./routes/couponRoutes";
import checkoutRoutes from "./routes/checkoutRoutes";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/orders", checkoutRoutes);

connectDB();

app.listen(PORT, () => {
    console.log("Server running on port: ", PORT);
});