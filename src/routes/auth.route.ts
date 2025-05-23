
import { Router } from "express";
import { logout, signIn, signUp, verifyEmail } from "../controllers/auth.controller";
import { loginValidationSchema, signupValidationSchema } from "../middleware/auth.validation";
import { handleValidationErrors } from "../middleware/handleValidationErrors";


const router = Router();

router.post("/signup", [...signupValidationSchema, handleValidationErrors], signUp)
router.post("/signin", [...loginValidationSchema, handleValidationErrors], signIn)
router.post("/logout", logout)
router.post('/verify-email', verifyEmail);
export default router