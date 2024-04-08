import * as brevo from "@getbrevo/brevo";

const { BREVO_API_KEY } = process.env;

if (typeof BREVO_API_KEY !== "string")
  throw new Error("BREVO_API_KEY must be defined in your .env file");

const emailApi = new brevo.TransactionalEmailsApi();
emailApi.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, BREVO_API_KEY);

type Message = {
  from: string;
  to: string;
  subject: string;
  html: string;
  senderEmail: string;
};
export const sendEmail = async (message: Message) => {
  const { from, to, subject, html, senderEmail } = message;
  const sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;
  sendSmtpEmail.sender = { name: from, email: senderEmail };
  sendSmtpEmail.to = [{ email: to }];
  await emailApi.sendTransacEmail(sendSmtpEmail);
};
