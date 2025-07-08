import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Public');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.fieldname}`);
  }
});

const upload = multer({ storage });

export default upload;
