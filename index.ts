import process from "process";
import mongoose from "mongoose";

import app from "./app";
import config from "./src/config/config";

process.on("uncaughtExpression", (err: Error) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXPRESSION, SHUTTING DOWN....");
  process.exit(1);
});

const port = config.PORT;

const URI = config.DATABASE.replace("<PASSWORD>", config.DATABASE_PASSWORD);

mongoose.connect(URI).then(() => {
  console.log("Database connection successful");
});

const server = app.listen(port, () => {
  console.log(`App is listening on port ${port} in ${config.NODE_ENV} mode`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION, SHUTTING DOWN ....");
  server.close(() => {
    process.exit(1);
  });
});
