import { getMeController, loginController, signupController } from "../controller/auth.controller.ts";
import { Router } from "express";
import { validateRequest } from "../middleware/validator.ts";
import { loginSchema, signupSchema} from "../schema/schema.ts";

const authRouter = Router()

authRouter.post('/signup',validateRequest(signupSchema),signupController)
authRouter.post('/login',validateRequest(loginSchema),loginController)
authRouter.post('/me',getMeController)

export default authRouter