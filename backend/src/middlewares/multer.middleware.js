import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Public");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  if (file.fieldname === "thumbnail") {
    const allowedImageTypes = /jpeg|jpg|png|gif/;
    const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedImageTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    return cb(new Error("Only image files are allowed for thumbnail!"));
  }

  if (file.fieldname === "videoFile") {
    const allowedVideoTypes = /mp4|mov|avi|mkv/;
    const extname = allowedVideoTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedVideoTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    return cb(new Error("Only video files are allowed for videoFile!"));
  }

  cb(new Error("Invalid field name!"));
}

const upload = multer({
  storage,
  limits: { fileSize: 60 * 1024 * 1024 }, // 60 MB limit
  fileFilter,
});

export default upload;
