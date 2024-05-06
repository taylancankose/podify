import { generateTemplate } from "#/mail/template";
import {
  LOGIN_URL,
  MAILTRAP_HOST,
  MAILTRAP_PASSWORD,
  MAILTRAP_PORT,
  MAILTRAP_USER,
  VERIFICATION_EMAIL,
} from "./variables";
import nodemailer from "nodemailer";
import path from "path";

export const generateMailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: MAILTRAP_HOST,
    port: MAILTRAP_PORT,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASSWORD,
    },
  });
  return transport;
};

interface Profile {
  name: string;
  email: string;
  userId: string;
}

export const sendVerificationMail = async (token: string, profile: Profile) => {
  const transport = generateMailTransporter();
  const { name, email, userId } = profile;

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "You need to verify your account",
    html: generateTemplate({
      title: `Hello ${name}`,
      message:
        "Welcome to the Podify! There are so much thing that we do for verified users. Use the given OTP to verify your email",
      logo: "cid:logo",
      link: "#",
      btnTitle: "Verify the Account",
      code: token,
    }),
    attachments: [
      {
        filename: "logo.jpg",
        path: path.join(__dirname, "../mail/logo.jpg"),
        cid: "logo", // content id
      },
    ],
  });
};

// token = 6 digit OTP token => 123456 => send to your API
// token = attach these tokens to the <a href="yourURL/token=kajdksajd"> => verify

interface Options {
  email: string;
  link: string;
}

export const sendForgetPasswordLink = async (options: Options) => {
  const transport = generateMailTransporter();
  const { email, link } = options;

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Reset Password Link",
    html: generateTemplate({
      title: `Hello `,
      message:
        "We just received a request that you forgot your password. You can use the link below and create new password",
      logo: "cid:logo",
      link,
      btnTitle: "Reset Password",
    }),
    attachments: [
      {
        filename: "logo.jpg",
        path: path.join(__dirname, "../mail/logo.jpg"),
        cid: "logo", // content id
      },
    ],
  });
};
export const sendPasswordResetSuccessEmail = async (
  name: string,
  email: string
) => {
  const transport = generateMailTransporter();

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Password Reset Success",
    html: generateTemplate({
      title: `Hello ${name}`,
      message:
        "We just updated your password. You can now loging with your new password",
      logo: "cid:logo",
      link: LOGIN_URL,
      btnTitle: "Reset Password",
    }),
    attachments: [
      {
        filename: "logo.jpg",
        path: path.join(__dirname, "../mail/logo.jpg"),
        cid: "logo", // content id
      },
    ],
  });
};
