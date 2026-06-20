import { Document, model, Schema } from "mongoose";

export interface ICoupon extends Document {
    code: string;
    discount: number;
    type: string;
    expiryDate: Date;
    isActive: boolean;
    minOrderAmount: number;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const CouponModel = model<ICoupon>("Coupon", couponSchema);