import { Request, Response } from "express";
import Wishlist from "../model/wishlistModel";

export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.body;

    const item = await Wishlist.create({ userId, productId });

    res.status(201).json(item);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getWishlist = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const items = await Wishlist.find({ userId }).populate("productId");
    res.json(items);
    
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.params;

    await Wishlist.findOneAndDelete({ userId, productId });

    res.json({ message: "Removed" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};