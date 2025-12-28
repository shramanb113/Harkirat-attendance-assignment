import ClassModel from '../models/class.model.ts';
import { Types } from 'mongoose';

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