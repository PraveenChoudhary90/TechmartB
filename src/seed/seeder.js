
import { configDotenv } from "dotenv";
import { ConnectDB } from "../config/DB.js";
import Admin from "../../models/AdminModel.js";
configDotenv();
ConnectDB();

const seedAdmin = async () => {
  try {
    const exists = await Admin.findOne({ email: "test@gmail.com" });

    if (exists) {
      console.log("Admin already exists");
      return;
    }

    const adminData = {
      firstname: "Test",
      lastname: "Test",
      email: "test@gmail.com",
      password: "test@123",
      role: "admin",
      agreeTerms: true,
      agreeMarketing: false
    };

    const admin = new Admin(adminData);
    await admin.save(); 

    console.log("Admin seeded successfully:", admin);
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};

// seedAdmin();
