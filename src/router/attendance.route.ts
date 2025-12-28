import { Router } from 'express';
import { startAttendanceController } from '../controller/attendance.controller.ts';
import { checkLoggedIn } from '../middleware/loginChecking.ts';
import { allowedUser } from '../middleware/allowedUser.ts';
import { validateRequest } from '../middleware/validator.ts';
import { startAttendanceSchema } from '../schema/schema.ts';

const attendanceRouter = Router();


attendanceRouter.post(
  '/start',
  checkLoggedIn,
  allowedUser('teacher'),
  validateRequest(startAttendanceSchema),
  startAttendanceController
);

export default attendanceRouter;