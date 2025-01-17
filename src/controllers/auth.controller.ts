import jwt from "jsonwebtoken";
import config from "../config/config";
import { Request, Response } from "express";
import AsyncHandler from "../utils/asyncHandler";
import BadRequestError from "../errors/badRequest.error";
import User from "../models/user.model";
import EmailService from "../services/Email.service";
import crypto from "crypto";
import DeviceDetector from "node-device-detector";

const generateToken = (id: string, email: string) => {
  return jwt.sign({ id, email }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES,
  });
};

const createSendToken = async (
  user: any,
  statusCode: number,
  res: Response
) => {
  const token = generateToken(user.id, user.email);

  await user.save();

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      data: user,
    },
  });
};

// User registration and send verification link to their email
export const signup = AsyncHandler(async (req, res, next) => {
  // Collect user inputs
  const { name, email, password, confirmPassword } = req.body;

  // Check passwords matching
  if (password !== confirmPassword)
    throw new BadRequestError(
      "Passwords do not match, please check and try again"
    );

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser)
    throw new BadRequestError(
      "User email already exists, please try another email"
    );

  // Create new user instance
  const newUser = new User({
    name,
    email,
    password,
  });

  // Send Verifiaction Token to New User
  const token = newUser.createVerificationToken();

  const url = `${config.APP_CLIENT}/auth/email-verification/${token}`;

  await new EmailService(newUser, url).sendEmailVerification();

  await newUser.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      message: "Verification to your email address",
    },
  });
});

// Email verification
export const emailVerification = AsyncHandler(async (req, res, next) => {
  const { token } = req.body;
  if (!token) throw new BadRequestError("Token is required");

  const verificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    verificationToken,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) throw new BadRequestError("Invalid token, token may have expired");

  if (user.isVerified)
    throw new BadRequestError("User already verified, please proceed to login");

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;

  // Add user's device
  const userAgentString = req.headers["user-agent"];

  const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
    deviceTrusted: false,
    deviceInfo: false,
    maxUserAgentSize: 500,
  });

  const result = detector.detect(userAgentString as string);

  user.devices.push(result);

  await user.save();

  createSendToken(user, 200, res);
});

// Login User
export const login = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Checking if user with email exists
  const existingUser = await User.findOne({ email }).select(
    "+password +isVerified"
  );
  if (!existingUser) throw new BadRequestError("Email or password incorrect.");

  // Check if user is verified
  if (!existingUser.isVerified) {
    throw new BadRequestError(
      "Check for verification email, please verify your email"
    );
  }

  // Checking if user passwords are the same
  const correctPassword = existingUser.checkPassword(
    password,
    existingUser.password
  );
  if (!correctPassword)
    throw new BadRequestError("Email or password incorrect.");

  createSendToken(existingUser, 200, res);
});
