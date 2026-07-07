import { Document, model, Schema, Types } from "mongoose";

export interface IOrder extends Document {
  userId: Types.ObjectId;

  orderId: string;

  items: {
    product: string;
    name: string;
    qty: number;
    size: string;
    price: number;
    image: string;
  }[];

  shipping: {
    name: string;
    phone: string;
    street: string;
    city: string;
    zip: string;
  };

  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;

  coupon?: string;

  paymentMethod: "COD" | "CARD";

  paymentStatus: "Pending" | "Paid";

  orderStatus: 
  | "Pending" 
  | "Processing" 
  | "Shipped" 
  | "Delivered" 
  | "Cancelled";
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: String, required: true, unique: true },
    items: [
      {
        product: { type: String, ref: "Product", required: true },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        size: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, default: "" },
      },
    ],

    shipping: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      zip: { type: String, required: true },
    },

    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    coupon: { type: String, default: "" },
    paymentMethod: { type: String, enum: ["COD", "CARD"], default: "COD" },
    paymentStatus: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
    orderStatus: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
  },
  { timestamps: true}
);

export const OrderModel = model<IOrder>(
  "Order",
  orderSchema
);