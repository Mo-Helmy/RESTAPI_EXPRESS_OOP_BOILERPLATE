import nodemailer from 'nodemailer';
import { env } from '../config/environment';

export const sendEmail = async (to: string, subject: string, message: string) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: env.NODEMAILER_EMAIL, // generated ethereal user
      pass: env.NODEMAILER_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `"${env.CLIENT_NAME}" <${env.NODEMAILER_EMAIL}>`, // sender address
    replyTo: env.NODEMAILER_EMAIL,
    to: to, // list of receivers
    subject: subject, // Subject line
    // text: 'Hello world?!!!!!!!!!!!', // plain text body
    html: message, // html body
  });

  console.log('Message sent: %s', info.messageId);
};

export const signupMessage = (url: string, token: string) => {
  return `
                 <p style="margin: 0 0 16px">
                  To activate your Account, please verify your email address.
                  <br />
                  Your account will not be activated until your email address is
                  confirmed.
                </p>
                <div style="width: fit-content; margin-inline: auto; margin-bottom: 16px">
                  <a href="${url}?token=${token}" style="text-decoration: none">
                    <div
                      style="
                        background-color: #f44336;
                        padding: 8px 16px;
                        color: #f9f9f9;
                        text-decoration: none;
                        border-radius: 8px;
                      "
                    >
                      Verify Your Email
                    </div>
                  </a>
                </div>
                <p style="margin: 0">
                  Or, copy and paste the following URL into your browser:
                </p>
                <a href="${url}?token=${token}">${url}?token=${token}</a>
            `;
};

export const resetPasswordMessage = (url: string, token: string) => {
  return `
        <p style="margin: 0 0 16px">
            To reset your password, please click this button.
        </p>
        <div style="width: fit-content; margin-inline: auto; margin-bottom: 16px">
            <a href="${url}?token=${token}" style="text-decoration: none">
                <div
                    style="
                    background-color: #f44336;
                    padding: 8px 16px;
                    color: #f9f9f9;
                    text-decoration: none;
                    border-radius: 8px;
                    "
                >
                    Reset Password
                </div>
            </a>
        </div>
        <p style="margin: 0">
            Or, copy and paste the following URL into your browser:
        </p>
        <a href="${url}?token=${token}">${url}?token=${token}</a>
    `;
};

export const resetPasswordConfirmationMessage = () => {
  return `
            <p style="margin: 0 0 16px">
                Your password changed successfully. You can login with your new password 
            </p>
        `;
};
