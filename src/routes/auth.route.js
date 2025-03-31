import { Router } from "express";
import { 
    loginController, 
    registerController, 
    resetPasswordController, 
    rewritePasswordController, 
    verifyEmailController
} from "../controllers/auth.controller.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";

const authRouter = Router()

authRouter.post("/login", loginController)
authRouter.post('/register', registerController)
authRouter.get("/verify-email", AuthMiddleware, verifyEmailController)
authRouter.post('/reset-password', AuthMiddleware, resetPasswordController)
authRouter.put("/reset-password", AuthMiddleware, rewritePasswordController)

export default authRouter