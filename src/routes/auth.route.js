import { Router } from "express";
import { 
    loginController, 
    registerController, 
    resetPasswordController, 
    rewritePasswordController, 
    verifyEmailController
} from "../controllers/auth.controller.js";

const authRouter = Router()

authRouter.post('/register', registerController)
authRouter.get("/verify-email", verifyEmailController)
authRouter.post("/login", loginController);
authRouter.post('/reset-password', resetPasswordController)
authRouter.put("/reset-password", rewritePasswordController)

export default authRouter