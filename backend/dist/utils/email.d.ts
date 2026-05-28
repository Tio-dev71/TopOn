interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}
export declare const sendEmail: ({ to, subject, html }: EmailOptions) => any;
export declare const sendVerificationEmail: (email: string, token: string) => any;
export declare const sendPasswordResetEmail: (email: string, token: string) => any;
export declare const sendOTPEmail: (email: string, otp: string) => any;
export {};
//# sourceMappingURL=email.d.ts.map