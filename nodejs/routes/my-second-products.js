const express = require('express')
const cors = require('cors')
const fs = require('fs');

const cookieParser = require('cookie-parser')
const multer = require('multer')
const path = require('path')
const mysql = require('mysql')
const util = require('util')

// 建立 DB 連線
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'howsmoat',
  port: 3306
})
conn.connect(err => console.log(err || 'DB connected'))
const q = util.promisify(conn.query).bind(conn)

const uploadDir = path.resolve(__dirname, '../public/media/second_pd');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 如果資料夾不存在就建立
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    cb(null, name + ext);
  }
});
// 限制至最多 4 張圖
const upload = multer({ storage }).array('images', 4);
module.exports = upload;

// 建立 Router
const router = express.Router()
router.use(cors({ origin: 'http://localhost:3000', credentials: true }))
router.use(cookieParser())

// 1. GET /my-second-products
router.get('/', async (req, res) => {
  const uid = req.get('X-UID')
  if (!uid) return res.status(400).json({ error: '請帶入 X-UID' })

  // 一筆商品一張圖，直接取出完整 img_path
  const sql = `
    SELECT
      p.uid,
      p.pid,
      p.pd_name,
      p.price,
      p.categories,
      p.new_level,
      p.status,
      MIN(pi.img_path) AS img_path
    FROM productslist p
    LEFT JOIN product_image pi ON p.pid = pi.pid
    WHERE p.uid = ? AND p.\`condition\` = 'second'
    GROUP BY p.pid
  `

  try {
    const rows = await q(sql, [uid])
    const host = `${req.protocol}://${req.get('host')}`
    const data = rows.map(r => ({
      uid: r.uid,
      pid: r.pid,
      pd_name: r.pd_name,
      price: r.price,
      categories: r.categories,
      new_level: r.new_level,
      status: r.status,
      imageUrl: r.img_path ? `${host}${r.img_path}` : null
    }))
    res.json(data)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
})

router.post('/', upload, async (req, res) => {
  const uid = req.get('X-UID')
  console.log('▶️ 收到 POST /my-second-products')
  if (!uid) return res.status(400).json({ error: '請帶入 X-UID' })

  const { pd_name, price, categories, new_level, status } = req.body
  const sql = `
    INSERT INTO productslist
      (uid, pd_name, price, categories, new_level, status, \`condition\`)
    VALUES
      (?, ?, ?, ?, ?, ?, "second")
  `
  const params = [uid, pd_name, price, categories, new_level, status]
  console.log('即將執行 SQL：', sql.trim(), '參數：', params)

  try {
    const { insertId: pid } = await q(sql, params)
    console.log('插入後的 pid：', pid)

    if (req.files && req.files.length) {
      for (const file of req.files) {
        const imgPath = `/media/second_pd/${file.filename}`;
        await q(
          'INSERT INTO product_image (pid, img_path, img_value) VALUES (?, ?, ?)',
          [pid, imgPath, '']
        );
        console.log('已插入圖片：', imgPath);
      }
    }
    return res.status(201).json({ pid })
  } catch (e) {
    console.error('上傳失敗完整錯誤：', e);
    console.error('e.message：', e.message);
    console.error('e.stack：', e.stack);
    return res.status(500).json({ error: e.message })
  }
})


// 3. PUT /my-second-products/:pid
router.put('/:pid', upload, async (req, res) => {
  const uid = req.get('X-UID')
  const pid = +req.params.pid
  if (!uid) return res.status(400).json({ error: '請帶入 X-UID' })
  const { pd_name, price, categories, new_level, status } = req.body

  try {
    // 驗證商品是否存在
    const rows = await q(
      'SELECT 1 FROM productslist WHERE pid = ? AND uid = ? AND `condition` = "second"',
      [pid, uid]
    )
    if (rows.length === 0) return res.status(404).json({ error: '找不到商品' })

    // 更新商品
    await q(
      'UPDATE productslist SET pd_name=?, price=?, categories=?, new_level=?, status=? WHERE pid=?',
      [pd_name, price, categories, new_level, status, pid]
    )
    // 刪除舊圖
    await q('DELETE FROM product_image WHERE pid = ?', [pid])
    // 新增新圖
    if (req.files && req.files.length) {
      const imgs = req.files.map(file => [pid, `/media/second_pd/${file.filename}`, ''])
      await q('INSERT INTO product_image (pid, img_path, img_value) VALUES ?', [imgs])
    }
    res.json({ pid })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
})

// 4. DELETE /my-second-products/:pid
router.delete('/:pid', async (req, res) => {
  const uid = req.get('X-UID')
  const pid = +req.params.pid
  if (!uid) return res.status(400).json({ error: '請帶入 X-UID' })

  try {
    await q('DELETE FROM product_image WHERE pid = ?', [pid])
    const { affectedRows } = await q(
      'DELETE FROM productslist WHERE pid = ? AND uid = ? AND `condition` = "second"',
      [pid, uid]
    )
    if (!affectedRows) return res.status(404).json({ error: '找不到商品' })
    res.sendStatus(204)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
})

module.exports = router
