import type { Request, Response } from 'express';
import { createClassService,addStudentService,getClassService } from '../service/class.service.ts';

export const createClassController = async (req: any, res: Response) => {
  const { className } = req.body;
  const teacherId = req.user?.userId; 

  try {
    const newClass = await createClassService(className, teacherId);

    res.status(201).json({
      success: true,
      data: {
        _id: newClass._id,
        className: newClass.className,
        teacherId: newClass.teacherId,
        studentIds: newClass.studentIds,
      },
    });

  } catch (error: any) {
    console.error("Create Class Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};



export const addStudentController = async (req: any, res: Response) => {
  const { id } = req.params;       
  const { studentId } = req.body;  
  const teacherId = req.user?.userId; 

  try {
    const updatedClass = await addStudentService(id, studentId, teacherId);

    res.status(200).json({
      success: true,
      data: {
        _id: updatedClass._id,
        className: updatedClass.className,
        teacherId: updatedClass.teacherId,
        studentIds: updatedClass.studentIds,
      },
    });

  } catch (error: any) {
    console.error("Add Student Error:", error);
    
    if (error.message === "Class not found") {
      return res.status(404).json({ success: false, message: error.message });
    }

    if (error.message.includes("Forbidden") || error.message.includes("Invalid student ID")) {
      return res.status(403).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};



export const getClassController = async (req: any, res: Response) => {
  const { id } = req.params;      
  const userId = req.user?.userId; 
  const userRole = req.user?.role; 

  try {
    const classData = await getClassService(id, userId, userRole);


    res.status(200).json({
      success: true,
      data: {
        _id: classData._id,
        className: classData.className,
        teacherId: classData.teacherId,
        students: classData.studentIds, 
      },
    });

  } catch (error: any) {
    console.error("Get Class Error:", error);

    if (error.message === "Class not found") {
      return res.status(404).json({ success: false, message: error.message });
    }

    if (error.message.includes("Forbidden")) {
      return res.status(403).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};