import { Document, model, Schema } from "mongoose";

export interface IProduct extends Document {
    productId: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    description: string;
    image: string;
    active: boolean;

    sizes: {
        XS: number;
        S: number;
        M: number;
        L: number;
        XL: number;
    };
}

const productSchema = new Schema<IProduct>(
    {
        productId: { type: String, unique: true },
        name: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        description: { type: String, required: false },
        image: { type: String, required: false },
        active: { type: Boolean, default: true },
        sizes: { 
            XS: { type: Number, default: 0 },
            S: { type: Number, default: 0 },
            M: { type: Number, default: 0 },
            L: { type: Number, default: 0 },
            XL: { type: Number, default: 0 },
        }
    },
    { timestamps: true }
);

export const ProductModel = model<IProduct>("Product", productSchema);