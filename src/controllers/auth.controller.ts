import { Request, Response } from "express"
import User from "../models/user.model";
import { genrateToken } from "../auth";
import { asyncWrapper } from "../utils/asyncWrapper";
import { handleClientError } from "../utils/errorHandler";
import { IUser } from "../types/model.types";
import { genrateRandomToken } from "../utils/token";
import { getVerificationToken } from "../utils/emailTemplate";
import transporter from "../config/nodemailer";


export const signUp = asyncWrapper(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        handleClientError(res, 400, 'User Already Exist')
        return;
    }
    const newUser = new User({ username, email, password });
    await newUser.save();
    await sendVerificationEmail(newUser);
    res.status(200).send({ message: "account created successfully" })

}, "signUp")

export const signIn = asyncWrapper(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
        handleClientError(res, 404, "User Not Found")
        return
    }
    // if (!findUser.isVerified) {
    //     handleClientError(res, 400, "Please verify you email");
    //     return
    // }
    const isMatch = await findUser.comparePassword(password);
    if (!isMatch) {
        handleClientError(res, 404, "Invalid Credentials")
        return
    }
    const token = genrateToken(findUser.id, res);
    // console.log(token)
    const userWithoutPassword = { ...findUser.toObject(), password: undefined };
    res.status(200).json({ user: userWithoutPassword });

}, "signIn")

export const logout = asyncWrapper(async (req: Request, res: Response) => {
    res.clearCookie("jwtCookie", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure in production
        sameSite: "strict", // or "lax" depending on your needs
        path: "/", // Should match the path used when setting the cookie
        domain: process.env.COOKIE_DOMAIN // If using cross-domain cookies
    })
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
}, "logout")

export const sendVerificationEmail = async (user: IUser) => {
    if (!process.env.EMAIL_FROM || !process.env.CLIENT_URL) {
        throw new Error('Email configuration missing');
    }
    const token = genrateRandomToken();
    // const verificationUrl = `${process.env.CLIENT_URL}`;
    user.emailVerificationToken = token;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save()
    const email = getVerificationToken(token);

    await transporter.sendMail({
        from: `"ChatApp" <${process.env.EMAIL_FROM}>`,
        to: user.email,
        subject: email.subject,
        html: email.html,
        text: email.text
    });
    // console.log("Email sent:", result);
};

export const verifyEmail = asyncWrapper(async (req: Request, res: Response) => {

    const { token } = req.query;
    const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() }
    });
    if (!user) {
        handleClientError(res, 400, "Invalid or expired token");
        return
    };
    user.isVerified = true;
    user.emailVerificationExpires = null;
    user.emailVerificationToken = null;
    await user.save();
    res.status(200).send({ message: "Email verified successfully" });
}, "verifyEmail")