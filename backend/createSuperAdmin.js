import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/adminModel.js";
import connectDB from "./config/mongodb.js";

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await connectDB();

    const existingSuperAdmin = await Admin.findOne({ role: "SuperAdmin" });
    const password = process.env.ADMIN_PASSWORD ;
    const email = process.env.ADMIN_EMAIL; 

    if (existingSuperAdmin) {
      console.log("Super Admin already exists. Updating credentials...");
      existingSuperAdmin.email = email;
      existingSuperAdmin.password = password; 
      // Note: Admin model pre-save hook handles hashing if modification is detected
      
      await existingSuperAdmin.save();
      console.log("✅ Super Admin credentials updated!");
      console.log(`Email: ${existingSuperAdmin.email}`);
      console.log(`Password: ${password}`);
      process.exit(0);
    }


    
    // Hash is handled by pre-save hook in model, but we can do it explicitly or let the model handle it.
    // The model has:
    // adminSchema.pre("save", async function() { ... if (!this.isModified("password")) return; ... hash ... })
    
    const superAdmin = new Admin({
      name: "Super Admin",
      email: email,
      password: password, 
      role: "SuperAdmin",
      permissions: ["products", "orders"], // Full permissions
    });

    await superAdmin.save();

    console.log("✅ Super Admin created successfully!");
    console.log(`Email: ${superAdmin.email}`);
    console.log(`Password: ${password}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating Super Admin:", error.message);
    process.exit(1);
  }
};

createSuperAdmin();
