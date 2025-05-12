const express = require('express')
const cors = require('cors')
const fs = require('fs')
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

// Multer 設定 (最多 4 張圖)
const uploadDir = path.resolve(__dirname, '../public/media/second_pd')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadDir, { recursive: true })
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = Date.now() + '_' + Math.random().toString(36).slice(2, 7)
    cb(null, name + ext)
  }
})
const upload = multer({ storage }).array('images', 4)

// 建立 Router，掛載於 /get
const router = express.Router()
router.use(cors({ origin: 'http://localhost:3000', credentials: true }))

// 1. 所有二手商品列表（公開）
router.get('/second-products', async (req, res) => {
  const sql = `
    SELECT p.pid, p.pd_name, p.price, p.categories, p.new_level, p.status,
           MIN(pi.img_path) AS img_path
      FROM productslist p
 LEFT JOIN product_image pi ON p.pid = pi.pid
     WHERE p.\`condition\` = 'second'
     GROUP BY p.pid
  `
  try {
    const rows = await q(sql)
    const host = `${req.protocol}://${req.get('host')}`
    const data = rows.map(r => ({
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

// 2. 個人二手商品列表（需登入）
router.get('/my-second-products', async (req, res) => {
  const uid = req.get('X-UID')
  if (!uid) return res.status(400).json({ error: '請先登入' })

  const sql = `
    SELECT p.pid, p.pd_name, p.price, p.categories, p.new_level, p.status,
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

// 3. 新增個人二手商品
router.post('/my-second-products', upload, async (req, res) => {
  const uid = req.get('X-UID')
  if (!uid) return res.status(400).json({ error: '請先登入' })

  const { pd_name, price, categories, new_level, status } = req.body
  const insertSql = `
    INSERT INTO productslist
      (uid, pd_name, price, categories, new_level, status, \`condition\`)
    VALUES (?, ?, ?, ?, ?, ?, 'second')
  `
  const params = [uid, pd_name, price, categories, new_level, status]

  try {
    const result = await q(insertSql, params)
    const pid = result.insertId
    if (req.files && req.files.length) {
      const imgs = req.files.map(f => [pid, `/media/second_pd/${f.filename}`, ''])
      await q('INSERT INTO product_image (pid, img_path, img_value) VALUES ?', [imgs])
    }
    res.status(201).json({ pid })
  } catch (e) {
    console.error('上傳失敗：', e)
    res.status(500).json({ error: e.message })
  }
})

// 4. 更新個人二手商品
router.put('/my-second-products/:pid', upload, async (req, res) => {
  const uid = req.get('X-UID')
  const pid = +req.params.pid
  if (!uid) return res.status(400).json({ error: '請先登入' })
  const { pd_name, price, categories, new_level, status } = req.body

  try {
    const rows = await q(
      'SELECT 1 FROM productslist WHERE pid = ? AND uid = ? AND `condition` = "second"',
      [pid, uid]
    )
    if (!rows.length) return res.status(404).json({ error: '找不到商品' })

    await q(
      'UPDATE productslist SET pd_name=?, price=?, categories=?, new_level=?, status=? WHERE pid=?',
      [pd_name, price, categories, new_level, status, pid]
    )
    await q('DELETE FROM product_image WHERE pid = ?', [pid])
    if (req.files && req.files.length) {
      const imgs = req.files.map(f => [pid, `/media/second_pd/${f.filename}`, ''])
      await q('INSERT INTO product_image (pid, img_path, img_value) VALUES ?', [imgs])
    }
    res.json({ pid })
  } catch (e) {
    console.error('更新失敗：', e)
    res.status(500).json({ error: e.message })
  }
})

// 5. 刪除個人二手商品
router.delete('/my-second-products/:pid', async (req, res) => {
  const uid = req.get('X-UID')
  const pid = +req.params.pid
  if (!uid) return res.status(400).json({ error: '請先登入' })

  try {
    await q('DELETE FROM product_image WHERE pid = ?', [pid])
    const result = await q(
      'DELETE FROM productslist WHERE pid = ? AND uid = ? AND `condition` = "second"',
      [pid, uid]
    )
    if (!result.affectedRows) return res.status(404).json({ error: '找不到商品' })
    res.sendStatus(204)
  } catch (e) {
    console.error('刪除失敗：', e)
    res.status(500).json({ error: e.message })
  }
})

module.exports = router