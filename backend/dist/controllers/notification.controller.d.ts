import { Server } from 'socket.io';
import { Request, Response, NextFunction } from 'express';
interface CreateNotifOptions {
    type: string;
    title: string;
    message: string;
    link?: string;
}
export declare const createNotification: (io: Server, userId: string, options: CreateNotifOptions) => Promise<{
    id: string;
    createdAt: Date;
    message: string;
    link: string | null;
    userId: string;
    type: import(".prisma/client").$Enums.NotificationType;
    title: string;
    isRead: boolean;
}>;
export declare const getNotifications: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const markAsRead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export {};
//# sourceMappingURL=notification.controller.d.ts.map