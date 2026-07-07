import express from "express";
import { 
    getAllOrders,
    getOrderById,
    getOrdersByUser,
    placeOrder, 
    updateOrderStatus
} from "../controller/orderController";

const router = express.Router();

router.post("/", placeOrder);

router.get("/", getAllOrders);

router.get("/user/:userId", getOrdersByUser);

router.get("/:id", getOrderById);

router.put("/:id/status", updateOrderStatus);

export default router;