import { Strategy as JwtStratagy, ExtractJwt } from "passport-jwt";
import { Request } from "express";
import passport from 'passport';
import User from "../../models/user.model";

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.jwtCookie,
    ]),
    secretOrKey: process.env.SECRET_KEY!,
}
passport.use(
    new JwtStratagy(jwtOptions, async (payload, done) => {
        const userId = payload.userId;
        if (!userId) return done(null, false);
        const user = await User.findById(userId)
        if (!user) return done(null, false);
        return done(null, user)
    })
)
export default passport