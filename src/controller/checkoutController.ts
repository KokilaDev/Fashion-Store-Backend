import { Request, Response } from "express";
import { CheckoutModel } from "../model/checkoutModel";

export const placeOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const today = new Date();

    const datePart =
        today.getFullYear().toString() +
        String(today.getMonth() + 1).padStart(2, "0") +
        String(today.getDate()).padStart(2, "0");

    const randomPart = Math.floor(
        1000 + Math.random() * 9000
    );

    const orderId = `ORD-${datePart}-${randomPart}`;

    const order = await CheckoutModel.create({
        ...req.body,
        orderId,
    });

    res.status(201).json({
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

export const calculateCheckout = async (req: Request, res: Response) => {
  const { items } = req.body;

  const total = items.reduce(
    (sum: number, item: any) => sum + item.price * item.qty,
    0
  );

  let coupon = null;
  let discount = 0;

  // AUTO COUPON LOGIC
  if (total > 5000) {
    coupon = {
      code: "AUTO10",
      discount: 10,
    };
    discount = (total * 10) / 100;
  }

  const finalTotal = total - discount;

  return res.json({
    total,
    coupon,
    discount,
    finalTotal,
  });
};

export const getOrdersByUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;

    const orders = await CheckoutModel.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getOrderById = async (
  req: Request,
  res: Response
) => {
  try {
    const order = await CheckoutModel.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { status } = req.body;

    const order = await CheckoutModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllOrders = async (
  req: Request, 
  res: Response
) => {
  try {
    const orders = await CheckoutModel.find()
      .sort({ createdAt: -1 });

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