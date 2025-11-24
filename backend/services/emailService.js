import nodemailer from 'nodemailer';

// Create reusable transporter using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send contact form email
export const sendContactEmail = async ({ name, email, message }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `Tree on a Truck - Contact Form: ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5016;">Tree on a Truck - Contact Form</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          </div>
          <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h3>Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw error;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async ({ email, teamName, resetToken, resetUrl }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Tree on a Truck - Password Reset Request',
      text: `
Hello ${teamName},

You requested a password reset for your Tree on a Truck account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request this reset, you can safely ignore this email.

Happy tree hunting!
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5016;">Tree on a Truck - Password Reset</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p>Hello <strong>${teamName}</strong>,</p>
            <p>You requested a password reset for your Tree on a Truck account.</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
               style="background-color: #2d5016; color: white; padding: 12px 30px;
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <p style="font-size: 14px; color: #666;">
              Or copy and paste this link into your browser:<br>
              <a href="${resetUrl}">${resetUrl}</a>
            </p>
            <p style="font-size: 14px; color: #666; margin-top: 20px;">
              <strong>This link will expire in 1 hour.</strong>
            </p>
            <p style="font-size: 14px; color: #666; margin-top: 20px;">
              If you didn't request this reset, you can safely ignore this email.
            </p>
          </div>
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            Happy tree hunting! 🎄
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Send new team registration notification to admin
export const sendNewTeamNotificationEmail = async ({ teamName, email, season }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `Tree on a Truck - New Team Registered: ${teamName}`,
      text: `
A new team has registered for Tree on a Truck!

Team Name: ${teamName}
Email: ${email}
Season: ${season}
Registration Time: ${new Date().toLocaleString()}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5016;">🎄 New Team Registration!</h2>
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2d5016;">
            <p style="margin: 5px 0;"><strong>Team Name:</strong> ${teamName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 5px 0;"><strong>Season:</strong> ${season}</p>
            <p style="margin: 5px 0;"><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            Tree on a Truck Admin Notification
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('New team notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending new team notification email:', error);
    // Don't throw - registration should succeed even if notification fails
    return { success: false, error: error.message };
  }
};
