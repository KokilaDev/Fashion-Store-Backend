import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string

export interface AuthRequest extends Request {
    user?: any
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" })
    }

    const token = authHeader.split(" ")[1]

    try {
        const payload = jwt.verify(token, JWT_ACCESS_SECRET)
        req.user = payload
        next()
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" })
    }
}