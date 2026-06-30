import { Document, model, Schema, Types } from "mongoose";

export interface ICustomer extends Document {
  customerId: string;
  userId: Types.ObjectId;
  name: string;
  email: string;
  contact: string;
  orders: number;
  totalPurchases: number;
  tier: "VIP" | "Loyalty" | "New";
}

const customerSchema = new Schema<ICustomer>({
  customerId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  orders: {
    type: Number,
    default: 0,
  },
  totalPurchases: {
    type: Number,
    default: 0,
  },
  tier: {
    type: String,
    enum: ["VIP", "Loyalty", "New"],
    default: "New",
  }
});

export const CustomerModel = model<ICustomer>("Customer", customerSchema);