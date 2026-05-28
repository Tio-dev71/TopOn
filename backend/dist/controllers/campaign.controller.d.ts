import { Request, Response, NextFunction } from 'express';
export declare const getCampaigns: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getCampaignById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createCampaign: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateCampaign: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteCampaign: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getMyAdvertiserCampaigns: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const applyToCampaign: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getCampaignApplications: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateApplicationStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getReviewerCampaigns: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=campaign.controller.d.ts.map