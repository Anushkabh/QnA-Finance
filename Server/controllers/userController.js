



import { User } from "../models/userModel.js";
import { setCookie } from "../utils/features.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Set cookie and respond
    setCookie(user, res, "Registered successfully", 201);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }
  
      // Find user by email
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found. Please register first.",
        });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }
  
      // Set cookie and respond
      setCookie(user, res, "Logged in successfully", 200);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };  
  
  
  



  export const logout = (req, res) => {
    res.set('Cache-Control', 'no-store'); // Disable caching for this response
    res
      .status(200)
      .clearCookie('token', {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
        secure: process.env.NODE_ENV === 'production',
      })
      .json({
        success: true,
        message: 'Logged out successfully',
      });
  };

 

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });

    if (user) {
      // User already exists, generate JWT and set cookie
      return setCookie(user, res, "Logged in successfully via Google", 200);
    }

    // User does not exist, create a new user
    const generatedPassword =
      Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    user = new User({
      name,
      email,
      password: hashedPassword,
      profilePicture: googlePhotoUrl,
    });

    await user.save();

    // Generate JWT and set cookie for the new user
    setCookie(user, res, "Registered and logged in successfully via Google", 201);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

  
  


