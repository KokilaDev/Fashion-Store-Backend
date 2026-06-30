import { Request, Response } from "express"
import { CustomerModel } from "../model/customerModel"

export const getAllCustomers = async (
    req: Request, 
    res: Response
) => {
    const customers = await CustomerModel.find();
    res.json({
        data: customers
    });
}