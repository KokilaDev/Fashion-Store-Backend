import express from "express";
import { 
    calculateCheckout,
    getAllOrders,
    getOrderById,
    getOrdersByUser,
    placeOrder, 
    updateOrderStatus
} from "../controller/checkoutController";

const router = express.Router();

router.post("/", placeOrder);

router.post("/calculate", calculateCheckout);

router.get("/user/:userId", getOrdersByUser);

router.get("/:id", getOrderById);

router.put("/:id/status", updateOrderStatus);

router.get("/", getAllOrders);

export default router;