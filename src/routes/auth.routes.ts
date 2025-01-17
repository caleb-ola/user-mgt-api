import { Router } from "express";
import {
  emailVerification,
  login,
  signup,
} from "../controllers/auth.controller";

const router = Router();

//Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/email-verification", emailVerification);

export default router;
