import express from "express";

import {
    getCart,
    addToCart,
    updateQty,
    removeItem,
    clearCart
} from "../controller/cartController";

const router = express.Router();

router.get("/:userId", getCart);

router.post("/add", addToCart);

router.put("/update", updateQty);

router.delete("/remove", removeItem);

router.delete("/clear/:userId", clearCart);

export default router;