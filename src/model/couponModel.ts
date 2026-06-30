import { Document, model, Schema } from "mongoose";

export interface ICoupon extends Document {
    code: string;
    title: string;
    discount: number;
    type: string;
    description: string;
    startDate: Date;
    expiryDate: Date;
    isActive: boolean;
    minOrderAmount: number;

    event?: string;
    applicableMonths?: number[];
    isBirthdayMonthOffer?: boolean;
    priority?: number;
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
    title: {
      type: String,
      required: true,
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
    description: {
      type: String,
      default: ""
    },
    startDate: {
      type: Date,
      required: true,
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

    event: {
      type: String,
      enum: [
        "new-year",
        "christmas",
        "valentine",
        "year-end",
        "birthday",
        "birth-month",
        "order-value",
      ],
    },
    applicableMonths: {
      type: [Number],
      default: []
    },
    isBirthdayMonthOffer: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      default: 1,
    }
  },
  { timestamps: true }
);

export const CouponModel = model<ICoupon>("Coupon", couponSchema);