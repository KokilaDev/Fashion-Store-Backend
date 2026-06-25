import { Request, Response } from "express";
import { CouponModel } from "../model/couponModel";

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    const existing = await CouponModel.findOne({
      code: code.toUpperCase(),
    });

    if (existing) {
      return res.status(400).json({ message: "Coupon already exists" });
    }

    const coupon = await CouponModel.create({
      ...req.body,
      code: code.toUpperCase(),
    });

    return res.status(201).json({ success: true, coupon });

  } catch (error: any) {
    console.error("CREATE COUPON ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await CouponModel.find();
    res.json(coupons);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    let { code, total, userBirthMonth } = req.body;

    if (!code || typeof total !== "number") {
      return res.status(400).json({ message: "Code and valid total required" });
    }

    code = code.toUpperCase();

    const coupon = await CouponModel.findOne({
      code,
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon" });
    }

    if (new Date(coupon.expiryDate).getTime() < Date.now()) {
      return res.status(400).json({ message: "Coupon expired" });
    }

    if (coupon.minOrderAmount > total) {
      return res.status(400).json({ message: "Min order not met" });
    }

    const currentMonth = new Date().getMonth() + 1;

    if (coupon.isBirthdayMonthOffer) {
      if (Number(userBirthMonth) !== currentMonth) {
        return res.status(400).json({ message: "Not your birthday month" });
      }
    }

    let discount = 0;

    if (coupon.type === "percentage") {
      discount = Math.min((total * coupon.discount) / 100, total);
    } else {
      discount = Math.min(coupon.discount, total);
    }

    const finalTotal = Math.max(total - discount, 0);

    return res.json({
      success: true,
      discount,
      finalTotal,
      coupon,
    });

  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const coupon = await CouponModel.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    return res.json({
      success: true,
      message: "Coupon deleted successfully",
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const coupon = await CouponModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    return res.json({
      success: true,
      coupon,
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getActiveCoupons = async (req: Request, res: Response) => {
  try {
    const offer = await CouponModel.find({ 
      isActive: true,
      expiryDate: { $gt: new Date() }
    }).sort({ priority: -1 });

    console.log("Active Coupon:", offer);

    res.json(offer);
    
  } catch (error: any) {
    res.status(500).json({ 
      message: error.message 
    });
  }
}