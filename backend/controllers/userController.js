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

const createRegistrationToken = (registration) => {
  const iv = crypto.randomBytes(12);
  const key = crypto.createHash("sha256").update(process.env.JWT_SECRET).digest();
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(registration), "utf8"),
    cipher.final(),
  ]);

  return [iv, cipher.getAuthTag(), encrypted]
    .map((part) => part.toString("base64url"))
    .join(".");
};

const readRegistrationToken = (registrationToken) => {
  const [encodedIv, encodedTag, encodedData] = registrationToken.split(".");
  if (!encodedIv || !encodedTag || !encodedData) return null;

  const key = crypto.createHash("sha256").update(process.env.JWT_SECRET).digest();
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(encodedIv, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(encodedTag, "base64url"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encodedData, "base64url")),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString("utf8"));
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

    if (!name?.trim() || !email?.trim() || !password) {
      return res.json({ success: false, message: "Name, email, and password are required" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong Password" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const exist = await userModel.findOne({ email: normalizedEmail });

    if (exist) return res.json({ success: false, message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const registrationToken = createRegistrationToken({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      expiresAt: Date.now() + 30 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Registration details ready. Generate an OTP to continue.",
      registrationToken,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const generateOtp = async (req, res) => {
  try {
    const { email, registrationToken } = req.body;

    if (registrationToken) {
      let registration;
      try {
        registration = readRegistrationToken(registrationToken);
      } catch {
        return res.json({ success: false, message: "Registration expired or invalid. Please sign up again." });
      }

      if (
        !registration ||
        registration.email !== String(email || "").trim().toLowerCase() ||
        registration.expiresAt < Date.now()
      ) {
        return res.json({ success: false, message: "Registration expired or invalid. Please sign up again." });
      }

      const otp = crypto.randomInt(100000, 1000000).toString();
      registration.otp = otp;
      registration.otpExpiresAt = Date.now() + 10 * 60 * 1000;
      await sendOtp(registration.email, otp);

      return res.json({
        success: true,
        message: "OTP sent successfully",
        registrationToken: createRegistrationToken(registration),
      });
    }

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
    const { email, otp, registrationToken } = req.body;

    if (registrationToken) {
      let registration;
      try {
        registration = readRegistrationToken(registrationToken);
      } catch {
        return res.json({ success: false, message: "Registration expired or invalid. Please sign up again." });
      }

      if (
        !registration ||
        registration.email !== String(email || "").trim().toLowerCase() ||
        registration.otp !== otp ||
        registration.expiresAt < Date.now() ||
        !registration.otpExpiresAt ||
        registration.otpExpiresAt < Date.now()
      ) {
        return res.json({ success: false, message: "Invalid or expired otp" });
      }

      const existingUser = await userModel.findOne({ email: registration.email });
      if (existingUser) {
        return res.json({ success: false, message: "User already exists" });
      }

      const registeredUser = await userModel.create({
        name: registration.name,
        email: registration.email,
        password: registration.password,
      });
      const token = createToken(registeredUser._id);
      return res.json({
        success: true,
        message: "Otp verified successfully",
        token,
        userId: registeredUser._id,
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.otp || user.otp !== otp || !user.otpExpire || user.otpExpire < Date.now()) {
      return res.json({ success: false, message: "Invalid or expired otp" });
    }

    user.otp = null;
    user.otpExpire = null;
    await user.save();

    const token = createToken(user._id);
    return res.json({ success: true, message: "Otp verified successfully", token, userId: user._id });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export { registerUser, loginUser, generateOtp, verifyOtp };
