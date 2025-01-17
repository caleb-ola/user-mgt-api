import express, { Express } from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cors from "cors";
import helmet from "helmet";
import MongoSanitize from "express-mongo-sanitize";

import BadRequestError from "./src/errors/badRequest.error";

import dotenv from "dotenv";
dotenv.config();

import config from "./src/config/config";
import routers from "./src/routes/router";

const app: Express = express();

if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP address.",
});

app.use(limiter);
app.use(cors());
app.use(helmet());
app.use(MongoSanitize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routers);

app.all("*", () => {
  throw new BadRequestError("Route not found");
});

export default app;
