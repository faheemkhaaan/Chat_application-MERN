import { NextFunction, Request, Response } from "express"
import { Result, ValidationError, validationResult } from "express-validator"

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const error: Result<ValidationError> = validationResult(req);
    if (!error.isEmpty()) {
        console.log(error.array())
        res.status(400).json({
            succes: false,
            errors: error.array().reduce((acc: Record<string, string>, error) => {
                if (error.type === 'field') {
                    acc[error.path] = error.msg
                } else {
                    acc['general'] = error.msg;
                }

                return acc
            }, {})
        })
        return;
    }
    next()
}