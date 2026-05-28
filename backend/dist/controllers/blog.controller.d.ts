import { Request, Response, NextFunction } from 'express';
export declare const getBlogs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getBlogBySlug: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTipsGuides: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createBlog: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateBlog: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteBlog: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=blog.controller.d.ts.map