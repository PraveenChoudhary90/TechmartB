import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const sendOTPEmail = async (email, otp) => {
  try {
    // 🔐 Safety check
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Missing EMAIL credentials in .env file");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // ✅ Google App Password only
      },
    });

    const mailOptions = {
      from: `"TechMart" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family:Arial;padding:10px">
          <h2>OTP Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="color:blue;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ OTP Email sent successfully");

  } catch (error) {
    console.log("❌ Email error:", error.message);
  }
};