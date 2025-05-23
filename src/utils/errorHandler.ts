import { Response } from "express";
interface ErrorsReponse {
    success: boolean;
    message: string;
    error?: any;
}

export const handleError = (res: Response, error: unknown, context: string) => {
    console.error(`Error in ${context}`, error);

    const response: ErrorsReponse = {
        success: false,
        message: "Internal server Error"
    }
    if (process.env.NODE_ENV === "development") {
        response.error = error instanceof Error ? error.message : error;
    }

    res.status(500).json(response)
}

export const handleClientError = (res: Response, statusCode: number, message: string) => {
    res.status(statusCode).json({ success: false, message });
}