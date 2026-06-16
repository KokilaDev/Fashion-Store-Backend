import { Router } from "express";
import { upload } from "../middleware/upload";
import { addProduct } from "../controller/productController";

const router = Router()

router.post(
    "/add", 
    upload.single("image"), 
    addProduct
);

export default router