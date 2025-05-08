// uploadProductImg.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.join(__dirname, 'public', 'media', 'new_pd');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { pet_type, categories } = req.body;
    const dest = path.join(BASE_DIR, pet_type, categories);
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

module.exports = multer({ storage }).array('images', 4);
