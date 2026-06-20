import express from "express";
import {
    createCoupon,
    getCoupons,
    validateCoupon,
    deleteCoupon,
    updateCoupon
} from "../controller/couponController"

const router = express.Router();

router.post("/create", createCoupon);

router.get("/all", getCoupons);

router.post("/validate", validateCoupon);

router.delete("/delete/:id", deleteCoupon);

router.put("/update/:id", updateCoupon);

export default router;