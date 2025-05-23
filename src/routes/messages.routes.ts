import { Router } from "express";
import { deleteMessage, getPreviews, getMessages, sendMessage, uploadMessageImage, addReaction } from "../controllers/message.controller";
import uploads from "../middleware/upload";
import { deleteMessageValidationSchema } from "../middleware/messages.validation";


const router = Router();

router.post('/send/:receiverId', sendMessage);
router.get('/getMessages/:receiverId', getMessages);
router.get("/conversationPreviews", getPreviews);
router.post("/uploadMessageImage", uploads.array("pictures", 10), uploadMessageImage);
router.delete("/deleteMessage", deleteMessageValidationSchema, deleteMessage);
router.patch("/addReactions", addReaction);
export default router