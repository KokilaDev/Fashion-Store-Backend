import { Request, Response } from "express"
import { UserModel, UserRole } from "../model/userModel"
import bcrypt from "bcryptjs"
import { signAccessToken, signRefreshToken } from "../util/token"
import { AuthRequest } from "../middleware/auth"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import { CustomerModel } from "../model/customerModel"

dotenv.config()

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

export const registerUser = async (req: Request, res: Response) => {
    console.log("REGISTER USER BODY:", req.body)

    try {
        const { name, email, password } = req.body

        const existingUser = await UserModel.findOne({ email: email })

        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" })
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            phone: "",
            address: "",
            city: "",
            zip: "",
            roles: [UserRole.USER],
            approved: true,
        })

        const count = await CustomerModel.countDocuments();

        const customerId = 
            "C-" + String(count + 1).padStart(4, "0");

        await newUser.save()
        
        await CustomerModel.create({
            customerId,
            userId: newUser._id,
            name,
            email,
            contact: "",
            orders: 0,
            totalPurchases: 0,
            tier: "New",
        })

        console.log("Customer Created");

        res.status(201).json({ message: "User registered successfully" })

    } catch (error: any) {
        console.log("REGISTER USER ERROR:", error.message || error);
        alert("Register fail")
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

        console.log("USER:", user);

        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        const isValid = await bcrypt.compare(password, user.password)

        console.log("INPUT PASSWORD :", password);
        console.log("DB PASSWORD :", user!.password);
        console.log("MATCH :", isValid);

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
    try {    
        console.log("AUTH USER:", req.user);

        if (!req.user) {
            return res.status(401).json({ 
                message: "Unauthorized" 
            })
        }

        const userId = req.user.sub;

        console.log("USER ID FROM TOKEN:", userId);

        const user = await UserModel.findById(userId).select("-password")

        console.log("FOUND USER:", user);

        if (!user) {
            return res.status(404).json({
                message: "User not found" 
            })
        }

        // const { _id, name, email, roles } = user as any

        return res.status(200).json({
            message: "OK",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                roles: user.roles,
                phone: user.phone,
                address: user.address,
                city: user.city,
                zip: user.zip,
                approved: user.approved
            }
        })
    } catch (error) {
        console.error("GET MY DETAILS ERROR:", error);
        res.status(500).json({ 
            message: "Server error", 
            error: error
        })
    }
}

export const updateMyDetails = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.sub;

        const { name, email, phone, address, city, zip } = req.body;

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { name, email, phone, address, city, zip },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "User details updated successfully",
            data: updatedUser
        });

    } catch (error) {
        console.error("UPDATE MY DETAILS ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error
        });
    }
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

    } catch (error: any) {
        console.error("REGISTER ADMIN ERROR:", error);

        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
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

export const logout = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({ 
            message: "Logout successful" 
        })
    } catch (error) {
        return res.status(500).json({
            message: "Logout failed",
            error: error
        })
    }
}