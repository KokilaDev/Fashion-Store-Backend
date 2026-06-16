import { Router } from "express";
import { upload } from "../middleware/upload";
import { addProduct, getAllProducts, updateProduct } from "../controller/productController";

const router = Router()

router.post(
    "/add", 
    upload.single("image"), 
    addProduct
);

router.get("/all", getAllProducts)

router.put(
    "/update/:id", 
    upload.single("image"), 
    updateProduct
)

export default router