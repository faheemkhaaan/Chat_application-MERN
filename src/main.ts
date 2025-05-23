import "dotenv/config";
import connectDB from "./db/mongodb";
import e, { Request, Response } from 'express'
import authRoute from './routes/auth.route'
import userRoute from './routes/user.route';
import messageRoute from './routes/messages.routes'
import groupRoute from './routes/group.route'

import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors'
import passport from './auth/index'
import { app, server } from "./socket/socket";
import path from "path";

const PORT = process.env.PORT || 5000;

const corsOption: CorsOptions = {
    origin: "http://localhost:5173",
    credentials: true
};


(async () => {
    await connectDB()

    app.use(passport.initialize())
    app.use(e.urlencoded({ extended: true }));
    app.use(e.json())
    app.use(cookieParser())
    app.use(cors(corsOption))

    app.use("/api/auth", authRoute);
    app.use("/api/user", passport.authenticate('jwt', { session: false }), userRoute);
    app.use("/api/message", passport.authenticate('jwt', { session: false }), messageRoute);
    app.use("/api/group", passport.authenticate("jwt", { session: false }), groupRoute);

    // if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(e.static(path.join(__dirname, 'frontend', 'dist')));

    app.get("*", (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
    });
    // }

})();

server.listen(PORT, () => {
    console.log(`[server] listening at http://localhost:${PORT}`);
});

