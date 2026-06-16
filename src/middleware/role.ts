import { Request, Response, NextFunction } from "express"
import { AuthRequest } from "./auth"
import { UserRole } from "../model/userModel"

export const requireRole = (roles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const hasRole = roles.some((role) => req.user.roles?.includes(role))
        if (!hasRole) {
            return res.status(403).json({
                message: `Require ${roles} role` 
            })
        }
        next()
    }
}