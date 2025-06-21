// // src/middlewares/upload.ts
// import multer from 'multer';
// import path from 'path';

// const storage = multer.diskStorage({});

// const fileFilter = (req, file, cb) => {
//   const ext = path.extname(file.originalname);
//   if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
//     cb(new Error('File type not supported'), false);
//     return;
//   }
//   cb(null, true);
// };

// export const upload = multer({ storage, fileFilter });

import multer from "multer";
import path from "path";

// Destination and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

export const upload = multer({ storage });
