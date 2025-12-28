import type { Response } from 'express';
import { createClassService } from '../service/class.service.ts';

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

