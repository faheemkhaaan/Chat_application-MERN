import { param, query, ValidationChain } from "express-validator";

export const deleteMessageValidationSchema: ValidationChain[] = [
    query("receiverId")
        .notEmpty().withMessage("receiverId is required")
        .isString().withMessage("receiverId must be string"),
    query("id")
        .notEmpty().withMessage("Message id was not provided")
        .isMongoId().withMessage("Invalid message id format")
]