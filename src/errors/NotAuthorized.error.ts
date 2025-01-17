import AppError from "./appError.error";

class NotAuthorized extends AppError {
  constructor(message: string = "Not authorized") {
    super(message, 403);
  }
}

export default NotAuthorized;
