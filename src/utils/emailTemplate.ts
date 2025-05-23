export const getVerificationToken = (token: string) => ({
    subject: "Verify Your Email Address",  // Fixed typo in "Verify" and more professional
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Please verify your email</h2>
        <p style="font-size: 16px;">Thank you for registering! Click the button below to complete your email verification:</p>
        
        <a href="${process.env.CLIENT_URL}/verify-email?token=${encodeURIComponent(token)}" 
           style="display: inline-block; padding: 12px 24px; background-color: #2563eb; 
                  color: white; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 16px 0;">
          Verify Email
        </a>
        
        <p style="font-size: 14px; color: #6b7280;">
          If you didn't request this, please ignore this email.
          <br>
          This link will expire in 24 hours.
        </p>
      </div>
    `,
    text: `Please verify your email by clicking the following link:
  ${process.env.CLIENT_URL}/verify-email?token=${token}
  
  If you didn't request this, please ignore this email.
  This link will expire in 24 hours.`
});