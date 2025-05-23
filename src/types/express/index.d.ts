// import { IUser, User } from '../models/user.model'
// declare global {
//     namespace Express {
//         interface Request {
//             user?: IUser
//         }
//     }
// }

import { IUser } from "../model.types";


// types/express/index.d.ts
// adjust import to your path

declare module "express-serve-static-core" {
    interface Request {
        user?: IUser; // add your custom type here
    }
}
