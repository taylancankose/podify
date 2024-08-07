import { generateTemplate } from "#/mail/template";
import {
  LOGIN_URL,
  MAILTRAP_ENDPOINT,
  MAILTRAP_HOST,
  MAILTRAP_PASSWORD,
  MAILTRAP_TOKEN,
  MAILTRAP_USER,
  VERIFICATION_EMAIL,
} from "./variables";
import nodemailer from "nodemailer";
import path from "path";
const { MailtrapClient } = require("mailtrap");
import fs from "fs";

export const generateMailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: MAILTRAP_HOST,
    port: 2525,
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
  const { name, email } = profile;

  const welcomeMsg =
    "Welcome to the Podify! There are so much thing that we do for verified users. Use the given OTP to verify your email";

  const client = new MailtrapClient({
    endpoint: MAILTRAP_ENDPOINT,
    token: MAILTRAP_TOKEN,
  });

  const sender = {
    email: VERIFICATION_EMAIL,
    name: "You need to verify your Podify account",
  };
  const recipients = [
    {
      email: email,
    },
  ];

  const logoImg = fs.readFileSync(
    path.join(__dirname, "../mail/images/logo.jpg")
  );

  // client
  //   .send({
  //     from: sender,
  //     to: recipients,
  //     subject: "Verifiction email",
  //     html: generateTemplate({
  //       title: `Hello ${name}`,
  //       message:
  //         "Welcome to the Podify! There are so much thing that we do for verified users. Use the given OTP to verify your email",
  //       logo: "cid:logo",
  //       link: "#",
  //       btnTitle: "Verify the Account",
  //       code: token,
  //     }),
  //     category: "Verifiction Mail",
  //     attachments: [
  //       {
  //         filename: "logo.jpg",
  //         content_id: "logo",
  //         disposition: "inline",
  //         content: logoImg,
  //         type: "image/jpg",
  //       },
  //     ],
  //   })
  //   .then(console.log, console.error);

  client.send({
    from: sender,
    to: recipients,
    template_uuid: "ce1e6712-a9b1-4a3d-bc8c-64e41b739746",
    template_variables: {
      user_name: name,
      token: token,
    },
  });
};

// token = 6 digit OTP token => 123456 => send to your API
// token = attach these tokens to the <a href="yourURL/token=kajdksajd"> => verify

interface Options {
  email: string;
  link: string;
}

export const sendForgetPasswordLink = async (options: Options) => {
  // const transport = generateMailTransporter();
  const { email, link } = options;

  const client = new MailtrapClient({
    endpoint: MAILTRAP_ENDPOINT,
    token: MAILTRAP_TOKEN,
  });

  const sender = {
    email: VERIFICATION_EMAIL,
    name: "Password Reset",
  };
  const recipients = [
    {
      email: email,
    },
  ];

  client.send({
    from: sender,
    to: recipients,
    template_uuid: "59004a70-67d7-444c-9e43-0f0993f4dd81",
    template_variables: {
      user_email: "email",
      pass_reset_link: link,
    },
  });

  // transport.sendMail({
  //   to: email,
  //   from: VERIFICATION_EMAIL,
  //   subject: "Reset Password Link",
  //   html: generateTemplate({
  //     title: `Hello `,
  //     message:
  //       "We just received a request that you forgot your password. You can use the link below and create new password",
  //     logo: "cid:logo",
  //     link,
  //     btnTitle: "Reset Password",
  //   }),
  //   attachments: [
  //     {
  //       filename: "logo.jpg",
  //       path: path.join(__dirname, "../mail/images/logo.jpg"),
  //       cid: "logo", // content id
  //     },
  //   ],
  // });
};

export const sendPasswordResetSuccessEmail = async (
  name: string,
  email: string
) => {
  // const transport = generateMailTransporter();

  const client = new MailtrapClient({
    endpoint: MAILTRAP_ENDPOINT,
    token: MAILTRAP_TOKEN,
  });

  const sender = {
    email: VERIFICATION_EMAIL,
    name: "Password Reset Success",
  };

  client.send({
    from: sender,
    to: [{ email }],
    template_uuid: "5a5c80f6-04f6-4c07-af0f-0ffa05c2f923",
    template_variables: {
      user_name: name,
      user_email: email,
    },
  });

  // transport.sendMail({
  //   to: email,
  //   from: VERIFICATION_EMAIL,
  //   subject: "Password Reset Success",
  //   html: generateTemplate({
  //     title: `Hello ${name}`,
  //     message:
  //       "We just updated your password. You can now loging with your new password",
  //     logo: "cid:logo",
  //     link: LOGIN_URL,
  //     btnTitle: "Reset Password",
  //   }),
  //   attachments: [
  //     {
  //       filename: "logo.jpg",
  //       path: path.join(__dirname, "../mail/images/logo.jpg"),
  //       cid: "logo", // content id
  //     },
  //   ],
  // });
};
