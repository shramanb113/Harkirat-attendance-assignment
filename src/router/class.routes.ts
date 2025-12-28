import {Router} from 'express'
import { checkLoggedIn } from '../middleware/loginChecking.ts'
import { allowedUser } from '../middleware/allowedUser.ts'
import { createClassController } from '../controller/class.controller.ts'

const classRouter = Router()

classRouter.post('/',checkLoggedIn,allowedUser('teacher'),createClassController)

export default classRouter