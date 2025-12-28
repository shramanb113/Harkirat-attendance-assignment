import ClassModel from '../models/class.model.ts';
import { Types } from 'mongoose';
import AttendanceModel from '../models/attendance.model.ts';
import { activeSession } from '../store/sessionStore.ts'


export const createClassService = async (
  className: string,
  teacherId: string,
) => {
  const newClass = await ClassModel.create({
    className,
    teacherId,
    studentIds: [],
  });

  return newClass;
};



export const addStudentService = async (
  classId: string,
  studentId: string,
  teacherId: string
) => {
  const foundClass = await ClassModel.findById(classId);

  if (!foundClass) {
    throw new Error("Class not found");
  }

  if (foundClass.teacherId.toString() !== teacherId) {
    throw new Error("Forbidden: You do not own this class");
  }

  if (!studentId) {
    throw new Error("Invalid student ID: User does not exist");
  }

  const isAlreadyAdded = foundClass.studentIds.some(id => id.toString() === studentId);

  if (!isAlreadyAdded) {
    foundClass.studentIds.push(new Types.ObjectId(studentId));
    await foundClass.save();
  }

  return foundClass;
};



export const getClassService = async (
  classId: string,
  userId: string,
  userRole: string
) => {

  const foundClass = await ClassModel.findById(classId).populate(
    'studentIds',
    'name email _id' 
  );

  if (!foundClass) {
    throw new Error("Class not found");
  }

  if (userRole === 'teacher' && foundClass.teacherId.toString() === userId) {
    return foundClass;
  }

  const isEnrolled = foundClass.studentIds.some((student: any) => {
    return student._id.toString() === userId;
  });

  if (userRole === 'student' && isEnrolled) {
    return foundClass;
  }

  throw new Error("Forbidden: You do not have access to this class");
};



export const getMyAttendanceService = async (
  classId: string,
  studentId: string
) => {
  const foundClass = await ClassModel.findById(classId);

  if (!foundClass) {
    throw new Error("Class not found");
  }

  const isEnrolled = foundClass.studentIds.some((id) => id.toString() === studentId);

  if (!isEnrolled) {
    throw new Error("Forbidden: You are not enrolled in this class");
  }

  if (activeSession && activeSession.classId === classId) {
    const realtimeStatus = activeSession.attendance[studentId];

    if (realtimeStatus === 'present') {
      return realtimeStatus; 
    } else {
      return null; 
    }
  }


  const attendanceRecord = await AttendanceModel.find({
    classId: new Types.ObjectId(classId),
    studentId:new Types.ObjectId(studentId),
  });

  if (attendanceRecord) {
    return "present";
  } else {
    return "absent"; 
  }
};