import type { Response } from 'express';
import { startAttendanceService } from '../service/attendance.service.ts';

export const startAttendanceController = async (req: any, res: Response) => {
  const { classId } = req.body;
  const teacherId = req.user?.userId; 

  try {
    const session = await startAttendanceService(classId, teacherId);

    res.status(200).json({
      success: true,
      data: {
        classId: session.classId,
        startedAt: session.startedAt,
      },
    });

  } catch (error: any) {
    console.error("Start Attendance Error:", error);

    if (error.message === "Class not found") {
      return res.status(404).json({ success: false, message: error.message });
    }

    if (error.message.includes("Forbidden")) {
      return res.status(403).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};