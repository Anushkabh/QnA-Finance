
const bcrypt = require('bcrypt');


// MongoDB Connection
const User = require('../models/userModel'); // Adjust path as per structure
const db = require('../db/database'); // If you have a separate DB connection file
db.connect();



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
