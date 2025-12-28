import { loginController, signupController } from "../controller/auth.controller.ts";
import { router } from "../index.ts";
import { validateRequest } from "../middleware/validator.ts";
import { loginSchema, signupSchema} from "../schema/schema.ts";


router.post('/signup',validateRequest(signupSchema),signupController)
router.post('/login',validateRequest(loginSchema),loginController)