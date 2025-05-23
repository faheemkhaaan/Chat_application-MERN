import jwt from 'jsonwebtoken';
import { Response } from 'express';
export const genrateToken = (userId: string, res: Response): string => {
    const token = jwt.sign({ userId }, process.env.SECRET_KEY!, { expiresIn: "7d" });
    res.cookie('jwtCookie', token, {
        maxAge: 60 * 60 * 24 * 7 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? 'strict' : 'lax'
    })
    return token
}