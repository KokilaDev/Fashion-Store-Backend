import { Request, Response } from "express";
import { CartModel } from "../model/cartModel";

export const getCart = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const cart = await CartModel.findOne({ userId });

        if (!cart) {
            return res.json({ items: [] });
        }

        res.json(cart);

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const addToCart = async (req: Request, res: Response) => {
    try {
        console.log("BODY =", req.body);

        const { userId, product } = req.body;

        console.log("USER ID =", userId);

        let cart = await CartModel.findOne({ userId });

        if (!cart) {
            cart = new CartModel({
                userId,
                items: [],
            });
        } 
        
        const existing = cart.items.find(
            (item) => String(item.productId) === String(product.productId)
        );

        if (existing) {
            existing.qty += 1;
        } else {
            cart.items.push(product);
        }

        console.log("CART BEFORE SAVE =", cart);

        await cart.save();
        res.json(cart);

    } catch (error: any) {
        console.error("ADD TO CART ERROR =", error);
        res.status(500).json({ message: error.message });
    }
};

export const updateQty = async (req: Request, res: Response) => {
    try {
        const { userId, productId, qty } = req.body;

        const cart = await CartModel.findOne({ userId });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find(i => i.productId === productId);

        if (item) item.qty = qty;

        await cart.save();
        res.json(cart);

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const removeItem = async (req: Request, res: Response) => {
    try {
        const { userId, productId } = req.body;

        const cart = await CartModel.findOne({ userId });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(
            (item) => item.productId !== productId
        );

        await cart.save();
        res.json(cart);

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};