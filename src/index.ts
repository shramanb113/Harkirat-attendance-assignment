import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import { connectDB } from './config/dbConfig.ts'; 
import { setupWebSocketServer } from './socket/socket.ts'; 

import authRouter from './router/auth.routes.ts';
import classRouter from './router/class.routes.ts';
import attendanceRouter from './router/attendance.route.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


app.use('/auth', authRouter);
app.use('/class', classRouter);
app.use('/attendance', attendanceRouter);

const server = http.createServer(app);


setupWebSocketServer(server);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`WebSocket running on ws://localhost:${PORT}/ws`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  });

app.use((err: any, req: any, res: any, next: any) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});