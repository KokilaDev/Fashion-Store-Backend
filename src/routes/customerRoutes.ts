import express from "express";

import {
    getAllCustomers
} from "../controller/customerController";

const router = express.Router();

router.get("/", getAllCustomers);

export default router;