import express from "express";
import { 
    calculateCheckout,
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

export default router;