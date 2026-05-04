import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html: `
        <h2>OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1 style="color:blue;">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("OTP Email sent");
  } catch (error) {
    console.log("Email error:", error.message);
  }
};