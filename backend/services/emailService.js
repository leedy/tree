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
