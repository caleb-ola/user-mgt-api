import { Router } from "express";
import {
  getCurrentDevice,
  getCurrentUser,
  getDevices,
  updateUserProfile,
  uploadUserImage,
} from "../controllers/user.controller";
import protect from "../middlewares/protect.middleware";
import upload from "../middlewares/multer.middleware";

const router = Router();

router.get("/", protect, getCurrentUser);
router.patch("/", protect, updateUserProfile);
router.patch(
  "/profile-image",
  protect,
  upload.single("profileImage"),
  uploadUserImage
);
router.get("/get-current-device", getCurrentDevice);
router.get("/devices", protect, getDevices);

export default router;
