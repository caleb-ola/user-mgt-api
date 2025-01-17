import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

interface UserTypes {
  name: string;
  email: string;
  bio: string;
  avatar: string;
  devices: [Object];
  password: string;
  isVerified: boolean;
  verificationToken: string | undefined;
  verificationTokenExpires: string | undefined;
  checkPassword(inputPassword: string, userPassword: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createVerificationToken(): string;
}

const userSchema = new mongoose.Schema<UserTypes>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      max: [60, "Name cannot be more than 60 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lower: true,
      unique: true,
      validate: [validator.isEmail, "Input must be an email"],
    },
    bio: {
      type: String,
      max: [250, "Bio cannot be more than 25 characters"],
    },
    avatar: String,
    devices: [
      {
        type: [Object],
        default: [],
      },
    ],
    password: {
      type: String,
      minimum: [5, "Password cannot be less than 5 characters"],
      required: [true, "Password is required"],
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
      select: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: {
      virtuals: true,
      transform(doc, rect) {
        rect.id = rect._id;
        delete rect._id;
        delete rect.__v;
      },
    },
  }
);

// Method to check password
userSchema.methods.checkPassword = async function (
  inputPassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(inputPassword, userPassword);
};

// Checking if user changed their password after token was issued
userSchema.methods.changedPasswordAfter = function (
  JWTTimestamp: number
): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime(), 10);

    return JWTTimestamp < changedTimestamp / 1000;
  }

  return false;
};

// Method for email verification token
userSchema.methods.createVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");

  this.verificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.verificationTokenExpires = Date.now() + 10 * 60 * 1000;

  return token;
};

const User = mongoose.model<UserTypes>("User", userSchema);

export default User;
