import { Document, model, Schema } from "mongoose";

export interface IProduct extends Document {
    name: string;
    category: string;
    price: number;
    stock: number;
    description: string;
    image: string;
    active: boolean;
}

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        description: { type: String, required: false },
        image: { type: String, required: false },
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const ProductModel = model<IProduct>("Product", productSchema);