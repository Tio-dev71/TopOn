"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectedUsers = exports.sendNotification = exports.initSocket = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../utils/logger"));
const connectedUsers = new Map(); // userId -> socketId
exports.connectedUsers = connectedUsers;
const initSocket = (io) => {
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token)
            return next(new Error('Authentication error'));
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.sub;
            next();
        }
        catch {
            next(new Error('Invalid token'));
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.userId;
        connectedUsers.set(userId, socket.id);
        logger_1.default.info(`Socket connected: userId=${userId}`);
        socket.join(`user:${userId}`);
        socket.on('disconnect', () => {
            connectedUsers.delete(userId);
            logger_1.default.info(`Socket disconnected: userId=${userId}`);
        });
    });
};
exports.initSocket = initSocket;
const sendNotification = (io, userId, data) => {
    io.to(`user:${userId}`).emit('notification', data);
};
exports.sendNotification = sendNotification;
//# sourceMappingURL=socket.js.map