import { Router } from "express";
import { upload } from "../middleware/upload";
import { 
    addProduct, 
    deleteProduct, 
    getAllProducts, 
    updateProduct 
} from "../controller/productController";

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

router.delete("/:id", deleteProduct)

export default router