// emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Make sure .env is loaded if this file is run standalone

// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // your Gmail app password or OAuth token
  },
});

// Verify transporter configuration at startup (optional)
transporter.verify((error, success) => {
  if (error) {
    console.error('Error setting up email transporter:', error);
  } else {
    console.log('Email transporter is ready');
  }
});

/**
 * Send password reset email with a reset link.
 *
 * @param {string} toEmail - The recipient's email address.
 * @param {string} resetLink - The URL for the password reset.
 */
export async function sendResetPasswordEmail(toEmail, resetLink) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Password Reset Request',
    html: `
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reset password email sent to ${toEmail}`);
  } catch (error) {
    console.error('Error sending reset password email:', error);
    throw error;
  }
}
