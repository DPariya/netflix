import nodemailer from "nodemailer";

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Send email
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Failed to send email");
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #f9f9f9;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #e50914;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
          margin: -30px -30px 20px -30px;
        }
        .button {
          display: inline-block;
          padding: 15px 30px;
          background-color: #e50914;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
        }
        .warning {
          background-color: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 5px;
          padding: 15px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        
        <p>Hi <strong>${user.name}</strong>,</p>
        
        <p>We received a request to reset your password for your Netflix Clone account.</p>
        
        <p>Click the button below to reset your password:</p>
        
        <center>
          <a href="${resetUrl}" class="button">Reset Password</a>
        </center>
        
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #0066cc;">${resetUrl}</p>
        
        <div class="warning">
          <strong>⚠️ Security Notice:</strong><br>
          • This link will expire in <strong>1 hour</strong><br>
          • If you didn't request this, please ignore this email<br>
          • Your password won't change until you create a new one
        </div>
        
        <div class="footer">
          <p>This is an automated email. Please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} Netflix Clone. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Hi ${user.name},
    
    We received a request to reset your password.
    
    Click the link below to reset your password:
    ${resetUrl}
    
    This link will expire in 1 hour.
    
    If you didn't request this, please ignore this email.
    
    Thanks,
    Netflix Clone Team
  `;

  await sendEmail({
    to: user.email,
    subject: "Password Reset Request - Netflix Clone",
    html,
    text,
  });
};

/**
 * Send password reset confirmation email
 */
export const sendPasswordResetConfirmation = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #f9f9f9;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #28a745;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
          margin: -30px -30px 20px -30px;
        }
        .success {
          background-color: #d4edda;
          border: 1px solid #28a745;
          border-radius: 5px;
          padding: 15px;
          margin: 20px 0;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Password Changed Successfully</h1>
        </div>
        
        <p>Hi <strong>${user.name}</strong>,</p>
        
        <div class="success">
          <p><strong>Your password has been changed successfully!</strong></p>
        </div>
        
        <p>You can now login with your new password.</p>
        
        <p>If you didn't make this change, please contact support immediately.</p>
        
        <p>Best regards,<br>Netflix Clone Team</p>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: "Password Changed Successfully - Netflix Clone",
    html,
  });
};

export default {
  sendPasswordResetEmail,
  sendPasswordResetConfirmation,
};
