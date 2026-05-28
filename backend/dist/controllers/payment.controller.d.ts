import { Request, Response, NextFunction } from 'express';
export declare const getWallet: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const topUpWallet: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const assignBudget: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTransactionHistory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const requestWithdrawal: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getWithdrawalHistory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=payment.controller.d.ts.map