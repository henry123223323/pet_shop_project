const multer = require('multer');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.join(__dirname, '..', 'fashion-paw', 'public', 'media', 'pet_know');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // 從前端 req.body 拿到 article_type 與 pet_type
        const { article_type, pet_type } = req.body;

        // 如果有任一個沒帶，就 fallback (或給一個預設資料夾)
        const typeDir = article_type || 'uncategorized';
        const petDir = pet_type || 'unknown';

        const dest = path.join(BASE_DIR, typeDir, petDir);
        fs.mkdirSync(dest, { recursive: true });
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        // 用時間戳加原始檔名副檔名
        const name = Date.now() + path.extname(file.originalname);
        cb(null, name);
    }
});

module.exports = multer({ storage }).single('banner');
