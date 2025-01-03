import nodemailer from "nodemailer";

export const sendEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Lưu trong `.env`
      pass: process.env.EMAIL_PASS, // Lưu trong `.env`
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Đặt lại mật khẩu",
    html: `
      <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn. Để thay đổi mật khẩu, vui lòng bấm vào nút dưới đây:</p>
      <a href="${process.env.FRONTEND_URL}/reset-password/${token}" 
         style="display:inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-align: center; text-decoration: none; border-radius: 5px;">
         Bấm vào để thay đổi mật khẩu
      </a>
      <p>Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};
