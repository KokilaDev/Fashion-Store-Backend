import fs from "fs"
import path from "path"
import { Request, Response } from "express";
import { ProductModel } from "../model/productModel";

const generateProductId = async () => {
  const lastProduct = await ProductModel.findOne()
    .sort({ createdAt: -1 })
    .select("id");

  let nextNumber = 1;

  if (lastProduct?.id) {
    const lastNumber = parseInt(lastProduct.id.split("-")[1]);
    nextNumber = lastNumber + 1;
  }

  const formatted = String(nextNumber).padStart(4, "0");
  return `P-${formatted}`;
}

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      category, 
      price, 
      originalPrice,
      stock, 
      description,
      isTrending,
      isNewProduct,
      rating
    } = req.body;

    const sizes = 
      typeof req.body.sizes === "string" 
        ? JSON.parse(req.body.sizes)
        : req.body.sizes || [];

    const image = req.file?.filename || "";

    const id = await generateProductId();

    console.log("FILE:", req.file);

    const product = await ProductModel.create({
      id,
      name,
      category,
      price: Number(price),
      originalPrice: Number(originalPrice) || 0,
      stock: Number(stock),
      description,
      image,
      sizes,
      isTrending: isTrending === "true",
      isNewProduct: isNewProduct === "true",
      rating: Number(rating) || 0,
    });

    console.log("Product Details:", product);

    res.status(201).json({
      message: "Product added successfully",
      product,
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

    const { 
      name, 
      category, 
      price, 
      originalPrice,
      stock, 
      description,
      isTrending,
      isNewProduct,
      rating
    } = req.body;

    const sizes = 
      typeof req.body.sizes === "string" 
        ? JSON.parse(req.body.sizes)
        : req.body.sizes || [];

    const updateData: any = {
      name,
      category,
      price: Number(price),
      originalPrice: Number(originalPrice) || 0,
      stock: Number(stock),
      description,
      sizes,
      isTrending: isTrending === "true",
      isNewProduct: isNewProduct === "true",
      rating: Number(rating),
    }

    if (req.file) {
      updateData.image = req.file.filename;
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
    res.status(500).json({ 
      message: "Server error", 
      error 
    });
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

export const getLatestProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find({ active: true })
      .sort({ createdAt: -1 })
      .limit(2);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};