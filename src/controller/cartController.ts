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
        const { userId, product } = req.body;

        let cart = await CartModel.findOne({ userId });

        if (!cart) {
            cart = new CartModel({
                userId,
                items: [{ ...product }],
            });
        } else {
            const existing = cart.items.find(
                (item) => item.productId === product.productId
            );

            if (existing) {
                existing.qty += 1;
            } else {
                cart.items.push(product);
            }
        }

        await cart.save();
        res.json(cart);

    } catch (error: any) {
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