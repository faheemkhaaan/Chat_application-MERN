import { Request, Response, NextFunction } from "express";
import { handleError } from "./errorHandler";

type AsyncFuntion = (
    req: Request,
    res: Response,
    next?: NextFunction,

) => Promise<any>;

export const asyncWrapper = (fn: AsyncFuntion, context: string) => async (req: Request, res: Response, next?: NextFunction) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        handleError(res, error, context)
    }
}