import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendVerificationEmail = async (email: string, token: string) => {
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/new-verification?token=${token}`;
    
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Verify your email",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    line-height: 1.5;
                    color: #0f0f0f;
                    background-color: #fafafa;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .card {
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    padding: 32px;
                    margin-bottom: 24px;
                }
                .header {
                    margin-bottom: 24px;
                }
                .logo {
                    font-weight: 700;
                    font-size: 20px;
                    color: #000000;
                    text-decoration: none;
                }
                h1 {
                    font-size: 20px;
                    font-weight: 600;
                    color: #000000;
                    margin-bottom: 12px;
                }
                p {
                    font-size: 16px;
                    margin-bottom: 24px;
                    color: #444444;
                }
                .button {
                    display: inline-block;
                    background-color: #000000;
                    color: #ffffff !important;
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 1;
                    padding: 12px 24px;
                    border-radius: 6px;
                    text-decoration: none;
                }
                .footer {
                    font-size: 12px;
                    color: #666666;
                    text-align: center;
                    margin-top: 32px;
                }
                .link {
                    color: #888888;
                    font-size: 13px;
                    margin-top: 16px;
                    display: block;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="card">
                    <div class="header">
                        <span class="logo">Serverless Lambda</span>
                    </div>
                    <h1>Verify your email address</h1>
                    <p>Thanks for signing up! Please verify your email address to get full access to your account.</p>
                    <a href="${verificationUrl}" class="button" style="color: #ffffff !important; background-color: #000000; text-decoration: none;">Verify Email Address</a>
                    <div class="link">
                        If the button doesn't work, copy and paste this URL into your browser:<br>
                        <a href="${verificationUrl}">${verificationUrl}</a>
                    </div>
                </div>
                <div class="footer">
                    <p>${new Date().getFullYear()}</p>
                    <p>If you didn't create an account, you can safely ignore this email.</p>
                </div>
            </div>
        </body>
        </html>
        `,
    });
}


export const sendResetPasswordEmail = async (email: string, token: string) => {
    const resetPasswordUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/new-password?token=${token}`;
    
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    line-height: 1.5;
                    color: #0f0f0f;
                    background-color: #fafafa;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .card {
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    padding: 32px;
                    margin-bottom: 24px;
                }
                .header {
                    margin-bottom: 24px;
                }
                .logo {
                    font-weight: 700;
                    font-size: 20px;
                    color: #000000;
                    text-decoration: none;
                }
                h1 {
                    font-size: 20px;
                    font-weight: 600;
                    color: #000000;
                    margin-bottom: 12px;
                }
                p {
                    font-size: 16px;
                    margin-bottom: 24px;
                    color: #444444;
                }
                .button {
                    display: inline-block;
                    background-color: #000000;
                    color: #ffffff !important;
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 1;
                    padding: 12px 24px;
                    border-radius: 6px;
                    text-decoration: none;
                }
                .footer {
                    font-size: 12px;
                    color: #666666;
                    text-align: center;
                    margin-top: 32px;
                }
                .link {
                    color: #888888;
                    font-size: 13px;
                    margin-top: 16px;
                    display: block; 
                }
            </style>        
        </head>
        <body>
            <div class="container">
                <div class="card">
                    <div class="header">
                        <span class="logo">Serverless Lambda</span>
                    </div>
                    <h1>Reset your password</h1>
                    <p>Click the button below to reset your password.</p>
                    <a href="${resetPasswordUrl}" class="button" style="color: #ffffff !important; background-color: #000000; text-decoration: none;">Reset Password</a>
                    <div class="link">
                        If the button doesn't work, copy and paste this URL into your browser:<br>
                        <a href="${resetPasswordUrl}">${resetPasswordUrl}</a>
                    </div>
                </div>
                <div class="footer">
                    <p>${new Date().getFullYear()}</p>
                </div>
            </div>
        </body>
        </html>
        `,
    });
}