import express from "express";
import {
    createCoupon,
    getCoupons,
    validateCoupon,
    deleteCoupon,
    updateCoupon,
    getActiveCoupons
} from "../controller/couponController"

const router = express.Router();

router.post("/create", createCoupon);

router.get("/all", getCoupons);

router.post("/validate", validateCoupon);

router.delete("/delete/:id", deleteCoupon);

router.put("/update/:id", updateCoupon);

router.get("/active", getActiveCoupons);

export default router;