import dns from "node:dns"
dns.setServers(["8.8.8.8", "8.8.4.4"])

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import cartRoutes from "./routes/cartRoutes";
import couponRoutes from "./routes/couponRoutes";
import checkoutRoutes from "./routes/orderRoutes";
import customerRoutes from "./routes/customerRoutes";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// app.use(cors({
//     baseURL: "http://localhost:5000",
// }));

// globle middlewares
app.use(cors({
    origin: [
      "http://localhost:5173",
      "https://aura-fashion-store-sigma.vercel.app/",
    ],
    credentials: true,
}));


app.use(express.json());


// mount routes
app.get("/", (req, res) => {
    res.send("Backend Running...");
    console.log(req);
});


app.use("/uploads", express.static("uploads"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/orders", checkoutRoutes);
app.use("/api/v1/customers", customerRoutes);

connectDB();

app.listen(PORT, () => {
    console.log("Server running on port: ", PORT);
    
});