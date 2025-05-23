import crypto from 'crypto'
import jwt from 'jsonwebtoken'
export const genrateRandomToken = () => {
    return crypto.randomBytes(20).toString("hex")
}

export const genrateJwtToken = (userId: string) => {
    return jwt.sign({ id: userId }, process.env.SECRET_KEY!, { expiresIn: "30d" });
}
