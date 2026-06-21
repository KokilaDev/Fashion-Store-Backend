import { Document, model, Schema } from "mongoose";

export interface ICheckout extends Document {
  userId: string;

  billingDetails: {
    fullName: string;
    email: string;
    phone: string;
  };

  shippingDetails: {
    address: string;
    district: string;
    postalCode: string;
  };

  paymentMethod: "COD" | "CARD";

  coupon?: {
    code: string;
    discount: number;
  };

  items: {
    productId: string;
    name: string;
    qty: number;
    price: number;
  }[];

  subtotal: number;
  discountAmount: number;
  total: number;

  status: string;
}

const checkoutSchema = new Schema<ICheckout>(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },

    billingDetails: {
      fullName: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },
    },

    shippingDetails: {
      address: {
        type: String,
        required: true,
      },

      district: {
        type: String,
        required: true,
      },

      postalCode: {
        type: String,
        required: true,
      },
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "CARD"],
      required: true,
    },

    coupon: {
      code: String,
      discount: Number,
    },

    items: [
      {
        productId: {
          type: String,
          ref: "Product",
        },

        name: String,

        qty: Number,

        price: Number,
      },
    ],

    subtotal: Number,

    discountAmount: Number,

    total: Number,

    status: {
      type: String,
      enum: ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true}
);

export const CheckoutModel = model<ICheckout>(
  "Checkout",
  checkoutSchema
);