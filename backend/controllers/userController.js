import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/userSchema.js";
import validator from "validator";
import crypto from "crypto";
import { sendOtp } from "../utils/sendMail.js";

const createToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET);
};

const isValidemail = (email) => {
  if (email.includes("@") && email.includes(".")) {
    return true;
  } else {
    return false;
  }
};

const isPasswordMatch = async (enteredPassword, storedPassword) => {
  if (!storedPassword) return false;

  try {
    const isHashMatch = await bcrypt.compare(enteredPassword, storedPassword);
    if (isHashMatch) return true;
  } catch (error) {
    console.log(error);
  }

  return storedPassword === enteredPassword;
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!isValidemail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }

    const isMatch = await isPasswordMatch(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      return res.json({ success: true, token, userId: user._id });
    } else {
      return res.json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    const exist = await userModel.findOne({ email });

    if (exist) return res.json({ success: false, message: "User already exists" });

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong Password" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.json({ success: true, token, userId: user._id });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const generateOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtp(email, otp);
    res.json({ success: true, message: "OTP send successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpire < Date.now()) {
      return res.json({ success: false, message: "Invalid or expired otp" });
    }

    user.otp = null;
    user.otpExpire = null;
    await user.save();

    const token = createToken(user._id);
    res.json({ success: true, message: "Otp verified successfully", token, userId: user._id });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export { registerUser, loginUser, generateOtp, verifyOtp };
