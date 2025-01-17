import multer from "multer";
import path from "path";
import { CustomRequest } from "./middleware.types";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = `${__dirname}/../uploads`;
    cb(null, uploadDir); // Set the upload folder
  },
  filename: (req: CustomRequest, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + req.currentUser.id;
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique file name
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
