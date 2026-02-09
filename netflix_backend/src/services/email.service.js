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
 * @param {Object} options - Email options
 * @param {String} options.to - Recipient email
 * @param {String} options.subject - Email subject
 * @param {String} options.html - HTML content
 * @param {String} options.text - Plain text content
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from:
        process.env.EMAIL_FROM || "Netflix Clone <noreply@netflix-clone.com>",
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
 * @param {Object} user - User object
 * @param {String} resetToken - Reset token
 */
export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
       {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #e50914;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
          margin: -30px -30px 20px -30px;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .message {
          font-size: 16px;
          line-height: 1.8;
          color: #555;
          margin-bottom: 30px;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          display: inline-block;
          padding: 15px 40px;
          background-color: #e50914;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: 600;
          font-size: 16px;
        }
        .link-section {
          margin: 30px 0;
          padding: 20px;
          background-color: #f8f8f8;
          border-radius: 5px;
        }
        .link-section p {
          margin-bottom: 10px;
          font-size: 14px;
          color: #666;
        }
        .link-text {
          word-break: break-all;
          color: #0066cc;
          font-size: 13px;
        }
        .warning {
          background-color: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 5px;
          padding: 20px;
          margin: 30px 0;
        }
        .warning-title {
          font-weight: 600;
          color: #856404;
          margin-bottom: 10px;
          font-size: 16px;
        }
        .warning ul {
          margin-left: 20px;
          color: #856404;
        }
        .warning li {
          margin: 5px 0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        
        <div class="content">
          <p class="greeting">Hi <strong>${user.name}</strong>,</p>
          
          <p class="message">
            We received a request to reset your password for your Netflix Clone account.
          </p>
          
          <p class="message">
            Click the button below to reset your password:
          </p>
          
          <div class="button-container">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          
          <div class="link-section">
            <p>Or copy and paste this link into your browser:</p>
            <p class="link-text">${resetUrl}</p>
          </div>
          
          <div class="warning">
            <p class="warning-title">⚠️ Security Notice:</p>
            <ul>
              <li>This link will expire in <strong>1 hour</strong></li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Your password won't change until you create a new one</li>
              <li>Never share this link with anyone</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} Netflix Clone. All rights reserved.</p>
          </div>
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
    
    ---
    This is an automated email. Please do not reply.
    © ${new Date().getFullYear()} Netflix Clone. All rights reserved.
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
 * @param {Object} user - User object
 */
export const sendPasswordResetConfirmation = async (user) => {
  const html = `
    <!DOCTYPE html>
    <<html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Changed</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #28a745;
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
        }
        .success-icon {
          text-align: center;
          font-size: 60px;
          margin-bottom: 20px;
        }
        .success-box {
          background-color: #d4edda;
          border: 2px solid #28a745;
          border-radius: 8px;
          padding: 20px;
          margin: 30px 0;
          text-align: center;
        }
        .success-box p {
          font-size: 18px;
          font-weight: 600;
          color: #155724;
          margin: 0;
        }
        .message {
          font-size: 16px;
          line-height: 1.8;
          color: #555;
          margin-bottom: 20px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Password Changed Successfully</h1>
        </div>
        
        <div class="content">
          <div class="success-icon">✓</div>
          
          <p class="message">Hi <strong>${user.name}</strong>,</p>
          
          <div class="success-box">
            <p>Your password has been changed successfully!</p>
          </div>
          
          <p class="message">
            You can now login to your Netflix Clone account with your new password.
          </p>
          
          <p class="message">
            If you didn't make this change, please contact our support team immediately.
          </p>
          
          <p class="message">
            Best regards,<br>
            <strong>Netflix Clone Team</strong>
          </p>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} Netflix Clone. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Hi ${user.name},

    Your password has been changed successfully!

    You can now login to your Netflix Clone account with your new password.

    If you didn't make this change, please contact our support team immediately.

    Best regards,
    Netflix Clone Team

    ---
    This is an automated email. Please do not reply.
    © ${new Date().getFullYear()} Netflix Clone. All rights reserved.
    `;

  await sendEmail({
    to: user.email,
    subject: "Password Changed Successfully - Netflix Clone",
    html,
    text,
  });
};

/**
 * Send welcome email (optional - for new registrations)
 * @param {Object} user - User object
 */
export const sendWelcomeEmail = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Netflix Clone</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #e50914 0%, #b8070f 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
        }
        .content {
          padding: 40px 30px;
        }
        .button {
          display: inline-block;
          padding: 15px 40px;
          background-color: #e50914;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: 600;
          font-size: 16px;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎬 Welcome to Netflix Clone!</h1>
        </div>
        
        <div class="content">
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Welcome! Your account is ready.</p>
          <div class="button-container">
            <a href="${process.env.FRONTEND_URL}" class="button">Start Watching</a>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Netflix Clone. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: "Welcome to Netflix Clone! 🎬",
    html,
  });
};

export default {
  sendPasswordResetEmail,
  sendPasswordResetConfirmation,
  sendWelcomeEmail,
};
