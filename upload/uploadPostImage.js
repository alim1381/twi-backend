const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    fs.mkdirSync(process.cwd(), "public");

    cb(null, "public/upload");
  },
  filename: (req, file, cd) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cd(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
