import express from "express";

import {
    getCart,
    addToCart,
    updateQty,
    removeItem
} from "../controller/cartController";

const router = express.Router();

router.get("/:userId", getCart);

router.post("/add", addToCart);

router.put("/update", updateQty);

router.delete("/remove", removeItem);

export default router;