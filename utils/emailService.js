import nodemailer from 'nodemailer';

// Configure transporter with enhanced options
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // For development only (remove in production)
  },
  logger: true, // Enable logging
  debug: true   // Show debug output
});

// Enhanced email sending function for password reset
export const sendResetEmail = async (toEmail, resetUrl) => {
  if (!toEmail || !resetUrl) {
    throw new Error('Both toEmail and resetUrl are required');
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: toEmail,
    subject: 'QuickBite Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6b46c1;">Password Reset Request</h2>
        <p>You requested a password reset for your QuickBite account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 12px 24px; 
                  background-color: #6b46c1; color: white; 
                  text-decoration: none; border-radius: 4px;
                  font-weight: bold; margin: 20px 0;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 1 hour. If you didn't request this, 
          please ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          QuickBite Team<br>
          <a href="http://yourwebsite.com" style="color: #6b46c1;">www.yourwebsite.com</a>
        </p>
      </div>
    `,
    text: `To reset your password, visit this link: ${resetUrl}\n\nThis link expires in 1 hour.`
  };

  try {
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('Server is ready to send emails');

    console.log(`Attempting to send email to ${toEmail}...`);
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
    
  } catch (error) {
    console.error('Email sending failed:', {
      error: error.message,
      stack: error.stack,
      smtpError: error.responseCode,
      smtpMessage: error.response
    });
    
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Shopping Reminder Email Function
export const sendShoppingReminderEmail = async (toEmail, comment, shoppingDate) => {
  if (!toEmail || !shoppingDate) {
    throw new Error('toEmail and shoppingDate are required');
  }

  const formattedDate = new Date(shoppingDate).toLocaleString();
  const safeComment = comment || 'No comment provided.';

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: toEmail,
    subject: '🛒 QuickBite Shopping Reminder',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6b46c1;">Your Shopping Time is Here!</h2>
        <p>This is a reminder for your scheduled shopping time.</p>
        <p><strong>🕒 Time:</strong> ${formattedDate}</p>
        <p><strong>📝 Comment:</strong> ${safeComment}</p>
        <p>Happy shopping! 🛍️</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          QuickBite Team<br>
          <a href="http://yourwebsite.com" style="color: #6b46c1;">www.yourwebsite.com</a>
        </p>
      </div>
    `,
    text: `Your shopping reminder:\n\nTime: ${formattedDate}\nComment: ${safeComment}`
  };

  try {
    console.log('Verifying SMTP connection for shopping reminder...');
    await transporter.verify();
    console.log('SMTP verified, sending shopping reminder email to', toEmail);

    const info = await transporter.sendMail(mailOptions);
    console.log('Shopping reminder email sent:', info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('Failed to send shopping reminder email:', error);
    throw new Error(`Failed to send shopping reminder email: ${error.message}`);
  }
};


// Optional: Test function for reset email (for dev)
export const testEmailService = async () => {
  const testEmail = 'test@example.com';
  const testUrl = 'https://yourwebsite.com/reset?token=test123';
  
  try {
    console.log('Testing email service...');
    const result = await sendResetEmail(testEmail, testUrl);
    console.log('Test email result:', result);
    return result;
  } catch (error) {
    console.error('Email service test failed:', error);
    throw error;
  }
};
