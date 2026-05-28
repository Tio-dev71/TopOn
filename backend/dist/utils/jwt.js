"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeAllUserTokens = exports.revokeRefreshToken = exports.verifyRefreshToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const prisma_1 = __importDefault(require("../config/prisma"));
const generateAccessToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ sub: userId, role }, process.env.JWT_SECRET, {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d'),
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = async (userId) => {
    const token = (0, uuid_1.v4)();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    await prisma_1.default.refreshToken.create({
        data: { userId, token, expiresAt },
    });
    return token;
};
exports.generateRefreshToken = generateRefreshToken;
const verifyRefreshToken = async (token) => {
    const record = await prisma_1.default.refreshToken.findUnique({ where: { token } });
    if (!record)
        throw new Error('Invalid refresh token');
    if (record.expiresAt < new Date()) {
        await prisma_1.default.refreshToken.delete({ where: { token } });
        throw new Error('Refresh token expired');
    }
    return record;
};
exports.verifyRefreshToken = verifyRefreshToken;
const revokeRefreshToken = async (token) => {
    await prisma_1.default.refreshToken.deleteMany({ where: { token } });
};
exports.revokeRefreshToken = revokeRefreshToken;
const revokeAllUserTokens = async (userId) => {
    await prisma_1.default.refreshToken.deleteMany({ where: { userId } });
};
exports.revokeAllUserTokens = revokeAllUserTokens;
//# sourceMappingURL=jwt.js.map