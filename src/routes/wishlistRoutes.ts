import express from "express";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controller/wishlistController";

const router = express.Router();

router.post("/", addToWishlist);

router.get("/:userId", getWishlist);

router.delete("/:userId/:productId", removeFromWishlist);

export default router;