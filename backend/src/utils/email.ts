import nodemailer from 'nodemailer';
import logger from './logger';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'TopOn <noreply@topon.vn>',
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    logger.error(`Failed to send email to ${to}:`, error);
  }
};

export const sendVerificationEmail = (email: string, token: string) => {
  const url = `${process.env.CORS_ORIGIN}/auth/verify?token=${token}`;
  return sendEmail({
    to: email,
    subject: 'Xác thực tài khoản TopOn',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #FF4D4D, #FF8C00); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0;">TopOn</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 12px 12px;">
          <h2>Xác thực tài khoản của bạn</h2>
          <p>Chào mừng bạn đến với TopOn! Nhấn vào nút bên dưới để xác thực email.</p>
          <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #FF4D4D, #FF8C00); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0;">
            Xác thực Email
          </a>
          <p style="color: #888; font-size: 12px;">Link có hiệu lực trong 24 giờ.</p>
        </div>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = (email: string, token: string) => {
  const url = `${process.env.CORS_ORIGIN}/auth/reset-password?token=${token}`;
  return sendEmail({
    to: email,
    subject: 'Đặt lại mật khẩu TopOn',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #FF4D4D, #FF8C00); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0;">TopOn</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 12px 12px;">
          <h2>Đặt lại mật khẩu</h2>
          <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào nút bên dưới:</p>
          <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #FF4D4D, #FF8C00); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0;">
            Đặt lại mật khẩu
          </a>
          <p style="color: #888; font-size: 12px;">Link có hiệu lực trong 1 giờ. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
        </div>
      </div>
    `,
  });
};

export const sendOTPEmail = (email: string, otp: string) => {
  return sendEmail({
    to: email,
    subject: 'Mã OTP xác thực TopOn',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #FF4D4D, #FF8C00); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0;">TopOn</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9; text-align: center; border-radius: 0 0 12px 12px;">
          <h2>Mã OTP của bạn</h2>
          <div style="font-size: 40px; font-weight: bold; color: #FF4D4D; letter-spacing: 8px; padding: 20px; background: white; border-radius: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #888; font-size: 12px;">Mã có hiệu lực trong 5 phút.</p>
        </div>
      </div>
    `,
  });
};
