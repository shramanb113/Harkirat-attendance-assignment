import {Router} from 'express'
import { checkLoggedIn } from '../middleware/loginChecking.ts'
import { allowedUser } from '../middleware/allowedUser.ts'
import { addStudentController, createClassController, getClassController , getMyAttendanceController } from '../controller/class.controller.ts'
import { validateRequest } from '../middleware/validator.ts'
import { addStudentSchema, classRouteSchema} from '../schema/schema.ts'

const classRouter = Router()

classRouter.post('/',checkLoggedIn,allowedUser('teacher'),validateRequest(classRouteSchema),createClassController)
classRouter.post('/:id/add-student',checkLoggedIn,allowedUser('teacher'),validateRequest(addStudentSchema),addStudentController)
classRouter.get('/:id',checkLoggedIn,allowedUser('teacher','student'),getClassController)
classRouter.get(':id/my-attendance',checkLoggedIn,allowedUser('student'),getMyAttendanceController)

export default classRouter