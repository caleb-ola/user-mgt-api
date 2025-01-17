import { NextFunction, Response } from "express";
import BadRequestError from "../errors/badRequest.error";
import User from "../models/user.model";
import AsyncHandler from "../utils/asyncHandler";
import { CustomRequest } from "../middlewares/middleware.types";
import NotAuthorized from "../errors/NotAuthorized.error";
import DeviceDetector from "node-device-detector";

export const getCurrentUser = AsyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { currentUser } = req;

    const user = await User.findById(currentUser.id);
    if (!user) throw new BadRequestError("User not found");

    res.status(200).json({
      status: "success",
      data: {
        data: user,
      },
    });
  }
);

export const updateUserProfile = AsyncHandler(
  async (req: CustomRequest, res, next) => {
    const { currentUser } = req;
    if (!currentUser)
      throw new NotAuthorized("Not authorized to perform this action");

    const { name, bio, email } = req.body;

    const user = await User.findById(currentUser.id);
    if (!user) throw new BadRequestError("User not found");

    if (name) user.name = name;

    await user.save();

    res.status(200).json({
      status: "success",
      data: {
        data: user,
      },
    });
  }
);

export const getCurrentDevice = AsyncHandler(async (req, res, next) => {
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

  console.log("Device Information:", result);

  res.status(200).json({
    result,
  });
});

export const getDevices = AsyncHandler(
  async (req: CustomRequest, res: Response): Promise<void> => {
    const { currentUser } = req;
    const user = await User.findById(currentUser.id);

    res.status(200).json({
      status: "success",
      data: {
        data: {
          devices: user?.devices || [],
        },
      },
    });
  }
);
