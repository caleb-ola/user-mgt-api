import AppError from "./appError.error";

class NotFound extends AppError {
  constructor(message: string = "Not found") {
    super(message, 404);
  }
}

export default NotFound;
