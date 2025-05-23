import { body, ValidationChain } from "express-validator"
import User from "../models/user.model"

export const loginValidationSchema: ValidationChain[] = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid email address")
        .custom(async email => {
            const user = await User.findOne({ email });
            console.log(user)
            if (!user) {
                throw new Error("User with this email does not exist");
            }
            true;
        })
        .normalizeEmail(),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Passowrd must be at least 6 charactors long")
]
export const signupValidationSchema: ValidationChain[] = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters numbers and underscore"),
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid email addresss")
        .custom(async (email) => {
            const user = await User.findOne({ email })
            if (user) {
                throw new Error("Email already in use")
            }
            return true;
        })
        .normalizeEmail(),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]$/).withMessage("Password must contain at least one lower case letter one upper case letter and a speacial charater @$!%*?&")
]