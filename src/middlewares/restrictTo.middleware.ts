import { NextFunction, Response } from "express";
import { CustomRequest } from "./middleware.types";
import NotAuthorized from "../errors/NotAuthorized.error";

const restrictTo = (...roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.currentUser.role)) {
      throw new NotAuthorized("You are not authorized to perform this action.");
    }

    next();
  };
};

export default restrictTo;
