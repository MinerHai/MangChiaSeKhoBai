import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(to: string, code: string) {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to,
    subject: "Mã xác thực OTP",
    text: `Mã OTP của bạn là: ${code}. Nó sẽ hết hạn trong 2 phút.`,
  };
  return transporter.sendMail(mailOptions);
}
