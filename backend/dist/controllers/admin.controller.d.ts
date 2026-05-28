import { Request, Response, NextFunction } from 'express';
export declare const getUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const toggleUserActive: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getPendingWithdrawals: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const processWithdrawal: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAdminStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=admin.controller.d.ts.map