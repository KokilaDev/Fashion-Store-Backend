import { Request, Response } from "express";
import { OrderModel } from "../model/orderModel";

const generateOrderId = async () => {
  const lastOrder = await OrderModel.findOne()
    .sort({ createdAt: -1 })
    .select("orderId");

  let nextNumber = 1;

  if (lastOrder?.orderId) {
    const lastNumber = parseInt(lastOrder.orderId.split("-")[1]);
    nextNumber = lastNumber + 1;
  }

  const formatted = String(nextNumber).padStart(4, "0");
  return `O-${formatted}`;
}

export const placeOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      userId,
      items,
      shipping,
      subtotal,
      discount,
      shippingFee,
      total,
      coupon,
      paymentMethod,
      orderStatus,
    } = req.body;

    if (!userId || !items?.length || !shipping || subtotal == null || total == null) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const orderId = await generateOrderId();

    const order = await OrderModel.create({
      orderId,
      userId,
      items,
      shipping,
      subtotal,
      discount,
      shippingFee,
      total,
      coupon,
      paymentMethod,
      orderStatus: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrders = async (
  req: Request, 
  res: Response
) => {
  try {
    const orders = await OrderModel.find()
      .populate("userId", "name email")
      .populate("items.product", "name image price")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};

export const getOrdersByUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;

    const orders = await OrderModel.find({ userId })
      .populate("items.product", "name image price")
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true,
      orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderById = async (
  req: Request,
  res: Response
) => {
  try {
    const order = await OrderModel.findById( req.params.id )
      .populate("userId", "name email")
      .populate("items.product", "name image price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderStatus } = req.body;

    const order = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { 
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};