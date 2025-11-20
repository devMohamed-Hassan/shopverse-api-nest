export const template = ({
    otpCode,
    receiverName,
    subject,
  }: {
    otpCode: string;
    receiverName: string;
    subject: string;
  }) => `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${subject}</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        margin: 0;
        padding: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        background-color: #f5f7fa;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      .email-wrapper {
        padding: 40px 20px;
        min-height: 100vh;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      }
      .email-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #ffffff;
        text-align: center;
        padding: 40px 30px;
        position: relative;
        overflow: hidden;
      }
      .email-header::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        animation: pulse 3s ease-in-out infinite;
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.1); opacity: 0.8; }
      }
      .email-header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.5px;
        position: relative;
        z-index: 1;
      }
      .email-body {
        padding: 40px 30px;
        color: #2d3748;
        line-height: 1.7;
      }
      .email-body h2 {
        margin: 0 0 20px 0;
        color: #1a202c;
        font-size: 24px;
        font-weight: 600;
      }
      .email-body p {
        margin: 0 0 20px 0;
        font-size: 16px;
        color: #4a5568;
      }
      .otp-container {
        margin: 30px 0;
        text-align: center;
      }
      .otp-label {
        display: block;
        font-size: 14px;
        color: #718096;
        margin-bottom: 12px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .otp-code {
        display: inline-block;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #ffffff;
        font-size: 32px;
        font-weight: 700;
        letter-spacing: 8px;
        padding: 20px 40px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        font-family: 'Courier New', monospace;
        margin: 10px 0;
        text-align: center;
        min-width: 200px;
      }
      .divider {
        height: 1px;
        background: linear-gradient(to right, transparent, #e2e8f0, transparent);
        margin: 30px 0;
      }
      .warning-text {
        background-color: #fff5f5;
        border-left: 4px solid #fc8181;
        padding: 15px 20px;
        border-radius: 8px;
        margin: 25px 0;
        font-size: 14px;
        color: #742a2a;
      }
      .signature {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #e2e8f0;
      }
      .signature p {
        margin: 5px 0;
        color: #4a5568;
      }
      .signature .name {
        font-weight: 600;
        color: #2d3748;
      }
      .email-footer {
        text-align: center;
        padding: 30px;
        background: linear-gradient(to bottom, #f7fafc, #edf2f7);
        font-size: 13px;
        color: #718096;
        border-top: 1px solid #e2e8f0;
      }
      .email-footer p {
        margin: 8px 0;
      }
      .email-footer a {
        color: #667eea;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s ease;
      }
      .email-footer a:hover {
        color: #764ba2;
        text-decoration: underline;
      }
      .footer-links {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #e2e8f0;
      }
      .footer-links a {
        margin: 0 10px;
      }
      @media only screen and (max-width: 600px) {
        .email-wrapper {
          padding: 20px 10px;
        }
        .email-container {
          border-radius: 12px;
        }
        .email-header {
          padding: 30px 20px;
        }
        .email-header h1 {
          font-size: 24px;
        }
        .email-body {
          padding: 30px 20px;
        }
        .email-body h2 {
          font-size: 20px;
        }
        .otp-code {
          font-size: 24px;
          letter-spacing: 4px;
          padding: 15px 25px;
        }
        .email-footer {
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-container">
        <div class="email-header">
          <h1>${subject}</h1>
        </div>
        <div class="email-body">
          <h2>Hello ${receiverName || 'there'},</h2>
          <p>Thank you for signing up with us! To complete your registration and start using your account, please use the OTP code below to ${subject.toLowerCase()}.</p>
          
          <div class="otp-container">
            <span class="otp-label">Your Verification Code</span>
            <div class="otp-code">${otpCode}</div>
          </div>

          <div class="divider"></div>

          <div class="warning-text">
            <strong>⚠️ Security Notice:</strong> This code will expire in 10 minutes. If you did not sign up for this account, please ignore this email.
          </div>

          <div class="signature">
            <p>Best regards,</p>
            <p class="name">Mohamed Hassan</p>
            <p style="font-size: 14px; color: #718096;">Shopverse Team</p>
          </div>
        </div>
        <div class="email-footer">
          <p>&copy; 2024 Shopverse. All rights reserved.</p>
          <div class="footer-links">
            <a href="[SupportLink]">Contact Support</a>
            <span style="color: #cbd5e0;">|</span>
            <a href="[UnsubscribeLink]">Unsubscribe</a>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>`;
  