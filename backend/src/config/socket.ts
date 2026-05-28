import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

const connectedUsers = new Map<string, string>(); // userId -> socketId

export const initSocket = (io: Server) => {
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
      (socket as any).userId = decoded.sub;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId;
    connectedUsers.set(userId, socket.id);
    logger.info(`Socket connected: userId=${userId}`);

    socket.join(`user:${userId}`);

    socket.on('disconnect', () => {
      connectedUsers.delete(userId);
      logger.info(`Socket disconnected: userId=${userId}`);
    });
  });
};

export const sendNotification = (io: Server, userId: string, data: object) => {
  io.to(`user:${userId}`).emit('notification', data);
};

export { connectedUsers };
