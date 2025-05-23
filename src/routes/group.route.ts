import { Router } from "express";
import { approveRequests, createGroup, deleteGroup, leaveGroup, requestToJoinGroup, searchGroups } from "../controllers/group.contoller";
import uploads from "../middleware/upload";


const router = Router();

router.post("/createGroup", uploads.single('avatar'), createGroup);
router.delete("/deleteGroup/:groupId", deleteGroup);
router.post("/requestToJoinGroup/:groupId", requestToJoinGroup);
router.post("/leaveGroup/:groupId", leaveGroup);
router.patch("/approveRequests/:groupId/:userId", approveRequests);
router.get("/searchGroups", searchGroups)
export default router;