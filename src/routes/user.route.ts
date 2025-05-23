import { Router } from "express";
import { blockUser, fetchAllUsers, searchUsers, unblockUser, updateProfile } from "../controllers/user.controller";
import uploads from "../middleware/upload";
const router = Router();

router.get("/users", fetchAllUsers)
router.get("/searchUsers", searchUsers);
router.patch("/updateProfile", uploads.single("picture"), updateProfile)
router.patch("/blockUser", blockUser);
router.patch("/unblockUser", unblockUser);
export default router