import nodemailer from "nodemailer";
import config from "../config/config";

interface EmailInfo {
  subject: string;
}

class EmailService {
  public to;
  public from;
  public firstName;
  public url;

  constructor(user: any, url: string) {
    this.to = user.email;
    this.from = `UserMgtApp <hello@usermgt.app>`;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: config.EMAIL_HOST,
      port: config.EMAIL_PORT,
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
      },
    } as nodemailer.TransportOptions);
  }

  async send(info: EmailInfo) {
    const mailOptions = {
      to: this.to,
      from: this.from,
      subject: info.subject,
      text: this.url,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendEmailVerification() {
    await this.send({
      subject: "Verify your email",
    });
  }
}

export default EmailService;
