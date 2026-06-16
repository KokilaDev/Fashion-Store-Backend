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

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await ProductModel.find()
        res.status(200).json({
            message: "Products retrieved successfully",
            products
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { name, category, price, stock, description } = req.body

        const image = req.file?.filename

        const updateData: any = {
            name,
            category,
            price,
            stock,
            description,
        }

        if (image) {
            updateData.image = image
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}