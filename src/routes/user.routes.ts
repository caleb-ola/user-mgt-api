import { Router } from "express";
import {
  getCurrentDevice,
  getCurrentUser,
  getDevices,
  updateUserProfile,
} from "../controllers/user.controller";
import protect from "../middlewares/protect.middleware";

const router = Router();

router.get("/", protect, getCurrentUser);
router.patch("/", protect, updateUserProfile);
router.get("/get-current-device", getCurrentDevice);
router.get("/devices", protect, getDevices);

export default router;
