import jwt from "jsonwebtoken"
import { User } from "../models/User.js"

export const getUserByToken = async (token) => {
    if (!token) {
        res.status(401).json({message: "Access denied. No token provided."})
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.id

    const user = await User.findOne({ _id: userId})

    return user
}
