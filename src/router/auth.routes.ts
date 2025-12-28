import { Router } from 'express';
import { signupController, loginController, getMeController } from '../controller/auth.controller.ts';
import { validateRequest } from '../middleware/validator.ts';
import { signupSchema, loginSchema } from '../schema/schema.ts';
import { checkLoggedIn } from '../middleware/loginChecking.ts'; 

const authRouter = Router();

authRouter.post('/signup', validateRequest(signupSchema), signupController);
authRouter.post('/login', validateRequest(loginSchema), loginController);
authRouter.get('/me', checkLoggedIn, getMeController);

export default authRouter;