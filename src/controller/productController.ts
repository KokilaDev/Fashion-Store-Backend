import fs from "fs"
import path from "path"
import { Request, Response } from "express";
import { ProductModel } from "../model/productModel";

const generateProductId = async () => {
  const lastProduct = await ProductModel.findOne()
    .sort({ createdAt: -1 })
    .select("productId");

  let nextNumber = 1;

  if (lastProduct?.productId) {
    const lastNumber = parseInt(lastProduct.productId.split("-")[1]);
    nextNumber = lastNumber + 1;
  }

  const formatted = String(nextNumber).padStart(4, "0");
  return `P-${formatted}`;
}

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, category, price, stock, description } = req.body;
    const sizes = 
      typeof req.body.sizes === "string" 
        ? JSON.parse(req.body.sizes)
        : req.body.sizes;

    const image = req.file?.filename;

    const productId = await generateProductId();

    console.log("FILE:", req.file);

    const newProduct = new ProductModel({
      productId,
      name,
      category,
      price,
      stock,
      description,
      image,
      sizes,
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("🔥 PRODUCT ADD ERROR:", error);
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
        const sizes = 
          typeof req.body.sizes === "string" 
            ? JSON.parse(req.body.sizes)
            : req.body.sizes;

        const image = req.file?.filename

        const updateData: any = {
            name,
            category,
            price,
            stock,
            description,
            sizes,
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

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const product = await ProductModel.findById(id)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        if (product.image) {
            const imagePath = path.join(
                __dirname, 
                "../../uploads/", 
                product.image
            )

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath)
            }
        }

        await ProductModel.findByIdAndDelete(id)

        res.status(200).json({
            message: "Product deleted successfully"
        })

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}