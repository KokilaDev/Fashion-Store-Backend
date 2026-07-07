import { Document, model, Schema } from "mongoose";

export interface IProduct extends Document {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    sizes: string[];
    isTrending: boolean;
    isNewProduct: boolean;
    rating: Number;
    description: string;
    stock: number;
}

const productSchema = new Schema<IProduct>(
    {
        id: { type: String, unique: true, required: true },
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true },
        originalPrice: { type: Number, default: 0 },
        image: { type: String, default: "" },
        category: { type: String, required: true },
        sizes: { type: [String], default: [] },
        isTrending: { type: Boolean, default: false },
        isNewProduct: { type: Boolean, default: false },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        description: { type: String, default: "" },
        stock: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
);

export const ProductModel = model<IProduct>("Product", productSchema);