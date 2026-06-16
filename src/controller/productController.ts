import { Request, Response } from "express";
import { ProductModel } from "../model/productModel";

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, category, price, stock, description } = req.body;

    const image = req.file?.filename;

    console.log("FILE:", req.file);

    const newProduct = new ProductModel({
      name,
      category,
      price,
      stock,
      description,
      image,
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};