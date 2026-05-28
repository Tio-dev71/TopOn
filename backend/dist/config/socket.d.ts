import { Server } from 'socket.io';
declare const connectedUsers: Map<string, string>;
export declare const initSocket: (io: Server) => void;
export declare const sendNotification: (io: Server, userId: string, data: object) => void;
export { connectedUsers };
//# sourceMappingURL=socket.d.ts.map