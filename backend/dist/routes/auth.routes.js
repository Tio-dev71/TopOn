"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const express_validator_1 = require("express-validator");
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const authController = __importStar(require("../controllers/auth.controller"));
const router = (0, express_1.Router)();
const registerValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Email không hợp lệ'),
    (0, express_validator_1.body)('password').isLength({ min: 8 }).withMessage('Mật khẩu ít nhất 8 ký tự'),
    (0, express_validator_1.body)('role').optional().isIn(['REVIEWER', 'ADVERTISER']).withMessage('Role không hợp lệ'),
    (0, express_validator_1.body)('fullName').optional().isString(),
];
const loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Email không hợp lệ'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Mật khẩu không được trống'),
];
// Email auth
router.post('/register', registerValidation, validate_middleware_1.validate, authController.register);
router.post('/login', loginValidation, validate_middleware_1.validate, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.get('/verify-email', authController.verifyEmail);
router.post('/forgot-password', (0, express_validator_1.body)('email').isEmail(), validate_middleware_1.validate, authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/me', auth_middleware_1.authenticate, authController.getMe);
// 2FA
router.post('/2fa/setup', auth_middleware_1.authenticate, authController.setup2FA);
router.post('/2fa/enable', auth_middleware_1.authenticate, authController.enable2FA);
router.post('/2fa/disable', auth_middleware_1.authenticate, authController.disable2FA);
router.post('/2fa/verify', authController.verify2FA);
// Google OAuth
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport_1.default.authenticate('google', { session: false, failureRedirect: `${process.env.CORS_ORIGIN}/auth/login?error=oauth` }), authController.oauthCallback);
// Facebook OAuth
router.get('/facebook', passport_1.default.authenticate('facebook', { scope: ['email'], session: false }));
router.get('/facebook/callback', passport_1.default.authenticate('facebook', { session: false, failureRedirect: `${process.env.CORS_ORIGIN}/auth/login?error=oauth` }), authController.oauthCallback);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map