import { Request, Response } from "express"
import { UserModel, UserRole } from "../model/userModel"
import bcrypt from "bcryptjs"
import { signAccessToken, signRefreshToken } from "../util/token"
import { AuthRequest } from "../middleware/auth"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, address, dob, contact, email, password } = req.body

        const existingUser = await UserModel.findOne({ email: email })

        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" })
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const newUser = new UserModel({
            name,
            address,
            dob,
            contact,
            email,
            password: hashedPassword,
            roles: [UserRole.USER],
            approved: true,
        })
        await newUser.save()

        res.status(201).json({ message: "User registered successfully" })

    } catch (error) {
        res.status(500).json({ 
            message: "Server error", 
            error: error
        })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const accessToken = signAccessToken(user)
        const refreshToken = signRefreshToken(user)

        res.status(200).json({
            message: "Login successful",
            data: {
                email: user.email,
                roles: user.roles,
                accessToken,
                refreshToken,
                id: user._id,
                name: user.name,
                address: user.address,
                dob: user.dob,
                contact: user.contact,
            }
        })

    } catch (error) {
        console.error("LOGIN ERROR:", error)
        res.status(500).json({ 
            message: "Login fail", 
            error: error
        })
    }
}

export const getMyDetails = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const user = await UserModel.findById(req.user.sub).select("-password")

    if (!user) {
        res.status(404).json({
            message: "User not found" 
        })
    }

    const { _id, name, email, address, dob, contact, roles } = user as any

    res.status(200).json({
        message: "OK",
        data: {
            id: _id,
            name,
            email,
            address,
            dob,
            contact,
            roles
        }
    })
}

export const registerAdmin = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body

        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await UserModel.create({
            name,
            email,
            password: hash,
            roles: [UserRole.ADMIN],
            approved: true
        })

        res.status(201).json({ 
            message: "Admin registered successfully", 
            data: { email: user.email, roles: user.roles } 
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ 
            message: "Internal server error"
        })
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body
    try {
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" })
        }
        const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET)
        const userId = payload.sub
        const user = await UserModel.findById(userId)
        if (!user) {
            return res.status(403).json({ message: "User not found" })
        }
        const newAccessToken = signAccessToken(user)
        res.status(200).json({
            message: "",
            data: { accessToken: newAccessToken }
        })
    } catch (error) {
        res.status(403).json({ message: "Invalid refresh token" })
    }
}