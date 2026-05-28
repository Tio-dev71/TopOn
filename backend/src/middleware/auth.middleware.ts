import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { User, Role } from '@prisma/client';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: User) => {
    if (err || !user) {
      return res.status(401).json({ success: false, message: 'Không có quyền truy cập' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền thực hiện hành động này' });
    }
    next();
  };
};
