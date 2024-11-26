import bcrypt from 'bcrypt'; // If you're using bcrypt
import { User } from '../models/userModel.js'; // Adjust path as per structure
import { connectToDB } from '../db/database.js'; // Import the DB connection
import mongoose from 'mongoose'; // Import mongoose to close connection

// MongoDB Connection
connectToDB();

const createAdmin = async () => {
  const name = "Anushka"; // Replace with desired admin name
  const email = "bhandaanu123@gmail.com"; // Replace with desired admin email
  const password = "adminpassword"; // Replace with desired admin password

  try {
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('Admin already exists!');
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    await newAdmin.save();
    console.log('Admin created successfully!');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.connection.close(); // Close the connection after completion
  }
};

createAdmin();

