import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { IncomingMessage } from 'http';
import { URL } from 'url';
import mongoose, { Types } from 'mongoose'; 
import ClassModel from '../models/class.model.ts'
import AttendanceModel from '../models/attendance.model.ts';
import { activeSession, resetSession } from '../store/sessionStore.ts'; 

export interface SocketUser {
  userId: string;
  role: 'teacher' | 'student';
}

export interface ExtendedWebSocket extends WebSocket {
  user?: SocketUser;
}

const sendError = (ws: ExtendedWebSocket, message: string) => {
  const payload = {
    event: 'ERROR',
    data: { message },
  };
  ws.send(JSON.stringify(payload));
};

const broadcast = (wss: WebSocketServer, payload: any) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
};

export const setupWebSocketServer = (server: any) => {
  const wss = new WebSocketServer({
    server,
    path: '/ws',
  });

  wss.on('connection', (ws: ExtendedWebSocket, req: IncomingMessage) => {
    try {
      if (!req.url) throw new Error('Invalid connection URL');
      const { searchParams } = new URL(req.url, 'http://localhost:3000');
      const token = searchParams.get('token');

      if (!token) throw new Error('No token provided');

      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error('JWT Secret missing');

      const decoded = jwt.verify(token, secret) as SocketUser;

      ws.user = decoded;

      console.log(`WebSocket Connected: User ${decoded.userId} (${decoded.role})`);

    } catch (error: any) {
      console.error('WebSocket Auth Error:', error.message);
      sendError(ws, 'Unauthorized or invalid token');
      ws.close();
      return;
    }

    ws.on('message', async (data: Buffer) => {
      try {
        const payload = JSON.parse(data.toString());

        if (!ws.user) {
          sendError(ws, 'Unauthorized');
          return;
        }

        switch (payload.event) {
          case 'ATTENDANCE_MARKED':
            await handleAttendanceMarked(wss, ws, payload.data);
            break;

          case 'TODAY_SUMMARY':
            await handleTodaySummary(wss, ws);
            break;

          case 'MY_ATTENDANCE':
            await handleMyAttendance(ws);
            break;

          case 'DONE':
            await handleDone(wss, ws);
            break;

          default:
            sendError(ws, 'Unknown event');
        }

      } catch (error: any) {
        console.error('WebSocket Message Error:', error);
        sendError(ws, error.message || 'Internal server error');
      }
    });

    ws.on('close', () => {
      console.log(`User Disconnected: ${ws.user?.userId}`);
    });
  });
};


const handleAttendanceMarked = async (
  wss: WebSocketServer,
  ws: ExtendedWebSocket,
  data: { studentId: string; status: string }
) => {
  if (ws.user!.role !== 'teacher') {
    return sendError(ws, 'Forbidden, teacher event only');
  }

  if (!activeSession) {
    return sendError(ws, 'No active attendance session');
  }

  activeSession.attendance[data.studentId] = data.status;

  broadcast(wss, {
    event: 'ATTENDANCE_MARKED',
    data: {
      studentId: data.studentId,
      status: data.status,
    },
  });
};

const handleTodaySummary = async (
  wss: WebSocketServer,
  ws: ExtendedWebSocket
) => {
  if (ws.user!.role !== 'teacher') {
    return sendError(ws, 'Forbidden, teacher event only');
  }

  if (!activeSession) {
    return sendError(ws, 'No active attendance session');
  }

  const classData = await ClassModel.findById(activeSession.classId);
  const totalStudents = classData ? classData.studentIds.length : 0;

  const markedStudents = Object.values(activeSession.attendance);
  const present = markedStudents.filter((status) => status === 'present').length;

  const absent = totalStudents - present;

  broadcast(wss, {
    event: 'TODAY_SUMMARY',
    data: {
      present,
      absent,
      total: totalStudents,
    },
  });
};

const handleMyAttendance = async (ws: ExtendedWebSocket) => {
  if (ws.user!.role !== 'student') {
    return sendError(ws, 'Forbidden, student event only');
  }

  if (!activeSession) {
    return sendError(ws, 'No active attendance session');
  }

  const myStatus = activeSession.attendance[ws.user!.userId];

  const responsePayload = {
    event: 'MY_ATTENDANCE',
    data: {
      status: myStatus ? myStatus : 'not yet updated',
    },
  };

  ws.send(JSON.stringify(responsePayload));
};

const handleDone = async (wss: WebSocketServer, ws: ExtendedWebSocket) => {
  if (ws.user!.role !== 'teacher') {
    return sendError(ws, 'Forbidden, teacher event only');
  }

  if (!activeSession) {
    return sendError(ws, 'No active attendance session');
  }

  const classData = await ClassModel.findById(activeSession.classId);
  
  if (!classData) {
    return sendError(ws, 'Class not found');
  }

  const allStudentIds = classData.studentIds; 


  for (const studentId of allStudentIds) {
    const studentIdStr = studentId.toString();
    
    const memoryStatus = activeSession.attendance[studentIdStr];
    
    const finalStatus = memoryStatus === 'present' ? 'present' : 'absent';

    await AttendanceModel.create({
      classId: new Types.ObjectId(activeSession.classId),
      studentId: new Types.ObjectId(studentIdStr),
      status: finalStatus,
    });
  }

  const present = Object.values(activeSession.attendance).filter((s) => s === 'present').length;
  const total = allStudentIds.length;
  const absent = total - present;

  resetSession();

  broadcast(wss, {
    event: 'DONE',
    data: {
      message: 'Attendance persisted',
      present,
      absent,
      total,
    },
  });
};