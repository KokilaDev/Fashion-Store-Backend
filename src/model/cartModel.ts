import { Document, model, Schema } from "mongoose";

export interface ICartItem {
    productId: string;
    name: string;
    price: number;
    image: string;
    qty: number;
    size: string;
    availableSizes: any;
}

export interface ICart extends Document {
    userId: string;
    items: ICartItem[];
}

const cartSchema = new Schema<ICart>(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },

        items: [
            {
                productId: {
                    type: String,
                    required: true,
                },
                name: String,
                price: Number,
                image: String,
                qty: {
                    type: Number,
                    default: 1,
                },
                size: {
                    type: String,
                    required: true,
                },
                availableSizes: {
                    type: Schema.Types.Mixed,
                    default: {},
                }
            },
        ],
    },
    { timestamps: true }
);

export const CartModel = model<ICart>("Cart", cartSchema);