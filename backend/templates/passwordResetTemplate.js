const createPasswordResetEmailTemplate = (username, resetLink) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background-color: #f8f9fa;
        padding: 20px;
        text-align: center;
        border-radius: 5px;
      }
      .content {
        padding: 20px;
        background-color: #ffffff;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #007bff; /* Button background color */
        color: #000000; /* Button text color set to black */
        text-decoration: none;
        border-radius: 5px;
        margin: 20px 0;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #666666;
        margin-top: 20px;
      }
      .warning {
        color: #dc3545;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h2>Password Reset Request</h2>
    </div>
    <div class="content">
      <p>Dear ${username},</p>
      
      <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
      
      <p>To reset your password, click the button below:</p>
      
      <div style="text-align: center;">
        <a href="${resetLink}" class="button">Reset Password</a>
      </div>
      
      <p class="warning">⚠️ This link will expire in 1 minute for security reasons.</p>
      
      <p>If you're having trouble clicking the button, copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${resetLink}</p>
      
      <p>For security reasons:</p>
      <ul>
        <li>Never share this link with anyone</li>
        <li>Make sure you're using a secure network</li>
        <li>Choose a strong password that you haven't used before</li>
      </ul>
      
      <p>Best regards,<br>Your Application Team</p>
    </div>
    <div class="footer">
      <p>This is an automated message, please do not reply to this email.</p>
      <p>If you need assistance, please contact our support team.</p>
    </div>
  </body>
</html>
`;

const createPlainTextEmail = (username, resetLink) => `
Dear ${username},

We received a request to reset your password. To reset your password, click this link: ${resetLink}

This link will expire in 5 minute.

If you didn't request this, please ignore this email.

Best regards,
Your Application Team
`;

export { createPasswordResetEmailTemplate, createPlainTextEmail };