export declare const generateAccessToken: (userId: string, role: string) => string;
export declare const generateRefreshToken: (userId: string) => Promise<string>;
export declare const verifyRefreshToken: (token: string) => unknown;
export declare const revokeRefreshToken: (token: string) => any;
export declare const revokeAllUserTokens: (userId: string) => any;
//# sourceMappingURL=jwt.d.ts.map