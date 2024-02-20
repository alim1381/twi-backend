const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cb(null, "/public");
  },
  filename: (req, file, cd) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cd(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
