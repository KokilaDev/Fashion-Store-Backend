import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { IUser } from "../model/userModel"

dotenv.config()

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string

export const signAccessToken = (user: IUser): string => {
    return jwt.sign(
        {
            sub: user._id.toString(),
            roles: user.roles,
        },
        JWT_ACCESS_SECRET,
        { expiresIn: "30m" }
    )
}

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

export const signRefreshToken = (user: IUser): string => {
    return jwt.sign(
        {
            sub: user._id.toString(),
        },
        JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    )
}