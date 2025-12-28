import mongoose from 'mongoose';
import ClassModel from '../models/class.model.ts'; 
import { setActiveSession } from '../store/sessionStore.ts'; 
import type { ActiveSession } from '../store/sessionStore.ts'; 

export const startAttendanceService = async (classId: string, teacherId: string) => {
  const foundClass = await ClassModel.findById(classId);

  if (!foundClass) {
    throw new Error("Class not found");
  }

  if (foundClass.teacherId.toString() !== teacherId) {
    throw new Error("Forbidden: You do not own this class");
  }

  const newSession: ActiveSession = {
    classId: classId,
    startedAt: new Date().toISOString(),
    attendance: {},
  };

  setActiveSession(newSession);

  return newSession;
};