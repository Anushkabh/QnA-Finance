
import jwt from "jsonwebtoken";
export const setCookie = async (user, res, message, statusCode) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    
    // Remove sensitive fields like password
    const sanitizedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  
    await res
      .status(statusCode)
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // Cookie expires in 90 days
        sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Development" ? false : true,
      })
      .json({
        success: true,
        message,
        user: sanitizedUser, // Send sanitized user object
      });
  };
  