import { Request, Response, NextFunction } from 'express';
export declare const searchReviewers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getReviewerDetail: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const inviteReviewer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const bookmarkReviewer: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getBookmarks: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=reviewer.controller.d.ts.map