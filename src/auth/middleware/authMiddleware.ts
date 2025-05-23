import { Request, Response, NextFunction } from "express";
import passport from "passport";// Import the User model type
import { IUser } from "../../types/model.types";

interface AuthRequest extends Request {
    user?: IUser; // Explicitly define the user type
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: false }, (err: any, user: IUser | false) => {
        if (err || !user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.user = user; // Attach full user object
        next();
    })(req, res, next);
};
