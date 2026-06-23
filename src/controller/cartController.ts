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

        const { userId, product, size, qty } = req.body;

        console.log("USER ID =", userId);

        let cart = await CartModel.findOne({ userId });

        if (!cart) {
            cart = new CartModel({
                userId,
                items: [],
            });
        } 

        if (!product?.productId) {
            return res.status(400).json({ message: "Invalid product data" });
        }

        console.log("PRODUCT =", product);
        
        const existing = cart.items.find(
            i => i.productId === product.productId && i.size === size
        );

        if (existing) {
            existing.qty += qty;
        } else {
            cart.items.push({
                productId: product.productId,
                name: product.name,
                price: product.price,
                image: product.image,
                qty: qty,
                size: product.size || "M",
                availableSizes: product.availableSizes || {},
            });
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

        const item = cart.items.find(
            i => i.productId?.toString() === productId
        );

        if (item) item.qty = qty;

        await cart.save();
        res.json(cart);

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const removeItem = async (req: Request, res: Response) => {
    try {
        const { userId, productId, size } = req.body || {};

        if (!userId || !productId) {
            return res.status(400).json({ message: "Missing data" });
        }

        const cart = await CartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter((item: any) => {
            return !(
                item.productId.toString() === productId &&
                item.size === size
            );
        });

        await cart.save();

        res.json({ success: true, cart });

    } catch (error: any) {
        console.error("REMOVE ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};