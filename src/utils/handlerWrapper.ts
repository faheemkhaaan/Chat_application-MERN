import { ISocket } from "../types/socket.types";
import { checkBlockedMiddleware } from "./socketMiddleware";


const withBlockedCheck = (handler: (socket: ISocket, data: any, callback?: (response: any) => void) => Promise<void>) => {
    return async (socket: ISocket, data: { senderId: string, receiverId: string }, callback?: (response: any) => void) => {
        try {
            await new Promise<void>((resolve, reject) => checkBlockedMiddleware(
                socket,
                (err) => {
                    if (err) reject(err);
                    else resolve()
                },
                { senderId: data.senderId, receiverId: data.receiverId }
            ))
            await handler(socket, data, callback)

        } catch (error: any) {
            socket.emit("server-error", {
                message: "Internal server error",
                error: process.env.NODE_ENV === "development" ? error : undefined
            });
        }
    }
}
export default withBlockedCheck