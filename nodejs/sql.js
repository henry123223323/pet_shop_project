
const express = require('express');
const path = require('path');
const cors = require('cors');
const util = require('util');
const mysql = require('mysql');

const app = express();
app.listen(8000, () => console.log('API listening on port 8000'));

// 靜態檔案
app.use(express.static('public'));
app.use(express.static(path.resolve(__dirname, '../fashion-paw/public')));
app.use('/media',express.static(path.resolve(__dirname, '../fashion-paw/public/media')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api', require('./upload'));

// MySQL 連線
const conn = mysql.createConnection({
  user: 'root',
  password: '',
  host: 'localhost',
  port: 3306,
  database: 'howsmoat'
});
conn.connect(err => console.log(err || 'DB connected'));
const q = util.promisify(conn.query).bind(conn);

// 共用 CRUD 處理函式
async function getList(req, res, condition) {
  const sql = `
    SELECT p.*, pi.img_path
      FROM productslist p
      LEFT JOIN (
        SELECT pid, img_path
          FROM product_image
         WHERE (pid, pd_img_id) IN (
           SELECT pid, MIN(pd_img_id) FROM product_image GROUP BY pid
         )
      ) pi ON pi.pid = p.pid
     WHERE p.\`condition\` = ?
  `;
  try {
    const rows = await q(sql, [condition]);
    const host = `${req.protocol}://${req.get('host')}`;
    res.json(rows.map(r => ({
      ...r,
      imageUrl: r.img_path ? `${host}/${r.img_path.replace(/^\.\.\//, '')}` : null
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function getOne(req, res) {
  const pid = +req.params.pid;
  try {
    const rows = await q('SELECT * FROM productslist WHERE pid=?', [pid]);
    if (rows.length === 0) return res.status(404).send();
    const p = rows[0];
    const attrs = await q('SELECT attr, attr_value FROM product_attribute WHERE pid=?', [pid]);
    const imgs = await q('SELECT img_path, img_value FROM product_image WHERE pid=? ORDER BY pd_img_id', [pid]);
    res.json({
      ...p,
      attribute: attrs.reduce((o, { attr, attr_value }) => {
        o[attr] = attr_value;
        return o;
      }, {}),
      images: imgs.map(i => ({ img_path: i.img_path, img_value: i.img_value }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function createOrUpdate(req, res, condition, isUpdate = false) {
  const pid = isUpdate ? +req.params.pid : null;
  const pd = req.body;
  const attrs = Object.entries(pd.attribute || {});
  const imgs = (pd.images || []).filter(i => i.img_path);
  try {
    await q('START TRANSACTION');
    let targetPid;
    if (isUpdate) {
      targetPid = pid;
      await q(
        `UPDATE productslist SET
           pd_name=?, price=?, description=?, pet_type=?, categories=?,
           city=?, district=?, new_level=?, stock=?, sale_count=?,
           delivery_method=?, status=?
         WHERE pid=?`,
        [
          pd.pd_name, pd.price, pd.description, pd.pet_type, pd.categories,
          pd.city, pd.district, pd.new_level, pd.stock, pd.sale_count || 0,
          pd.delivery_method, pd.status || 0, pid
        ]
      );
    } else {
      const result = await q(
        `INSERT INTO productslist
           (pd_name, price, description, pet_type, categories,
            city, district, new_level, stock, sale_count,
            delivery_method, \`condition\`, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          pd.pd_name, pd.price, pd.description, pd.pet_type,
          pd.categories, pd.city, pd.district, pd.new_level,
          pd.stock, pd.sale_count || 0, pd.delivery_method,
          condition, pd.status || 0
        ]
      );
      targetPid = result.insertId;
    }
    await q('DELETE FROM product_attribute WHERE pid=?', [targetPid]);
    if (attrs.length) {
      const vals = attrs.map(([k, v]) => [targetPid, k, v]);
      await q('INSERT INTO product_attribute (pid, attr, attr_value) VALUES ?', [vals]);
    }
    await q('DELETE FROM product_image WHERE pid=?', [targetPid]);
    if (imgs.length) {
      const vals = imgs.map((i, idx) => [targetPid, i.img_path, i.img_value, idx]);
      await q('INSERT INTO product_image (pid, img_path, img_value, pd_img_id) VALUES ?', [vals]);
    }
    await q('COMMIT');
    res.status(isUpdate ? 200 : 201).json({ pid: targetPid, ...pd });
  } catch (err) {
    await q('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function removeOne(req, res) {
  const pid = +req.params.pid;
  try {
    await q('START TRANSACTION');
    await q('DELETE FROM product_attribute WHERE pid=?', [pid]);
    await q('DELETE FROM product_image WHERE pid=?', [pid]);
    const result = await q('DELETE FROM productslist WHERE pid=?', [pid]);
    if (result.affectedRows === 0) { await q('ROLLBACK'); return res.status(404).send(); }
    await q('COMMIT');
    res.sendStatus(204);
  } catch (err) {
    await q('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

['second', 'new'].forEach(condition => {
  const base = `/get/${condition}-products`;
  app.get(base, (req, res) => getList(req, res, condition));
  app.get(`${base}/:pid`, getOne);
  app.post(base, (req, res) => createOrUpdate(req, res, condition, false));
  app.put(`${base}/:pid`, (req, res) => createOrUpdate(req, res, condition, true));
  app.delete(`${base}/:pid`, removeOne);
});

// 其他獨立路由
app.get('/get/new_product/home', (req, res) => {
  const sql = `
    SELECT p.pid as id, p.pd_name as name, p.pet_type, p.price, p.description,
           p.categories, p.stock, p.created_at, p.sale_count,
           CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{"img_path":"', pi.img_path, '","img_value":"', pi.img_value, '"}')), ']') AS images,
           CONCAT('{', GROUP_CONCAT(DISTINCT CONCAT('"', pa.attr, '":"', pa.attr_value, '"')), '}') AS attributes_object
      FROM productslist p
 LEFT JOIN product_image pi ON p.pid = pi.pid
 LEFT JOIN product_attribute pa ON p.pid = pa.pid
     WHERE p.condition = 'new' AND p.status = 1
  GROUP BY p.pid;
  `;
  conn.query(sql, (err, results) => err ? res.status(500).send('伺服器錯誤') : res.json(results));
});

app.get('/get/new_product/brand', (req, res) => {
  const sql = `
    SELECT attr_value AS brand
      FROM product_attribute
 LEFT JOIN productslist p ON product_attribute.pid = p.pid
     WHERE attr = 'brand' AND p.condition = 'new'
  GROUP BY attr_value;
  `;
  conn.query(sql, (err, results) => err ? res.status(500).send('伺服器錯誤') : res.json(results));
});

app.get('/get/second_product/home', (req, res) => {
  const sql = `
    SELECT p.pid as id, p.pet_type, p.pd_name as name, p.price, p.description,
           p.categories, p.city, p.district, p.uid, p.new_level, p.created_at,
           p.stock, p.sale_count, p.delivery_method,
           CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{"img_path":"', pi.img_path, '","img_value":"', pi.img_value, '"}')), ']') AS images,
           CONCAT('{', GROUP_CONCAT(DISTINCT CONCAT('"', pa.attr, '":"', pa.attr_value, '"')), '}') AS attributes_object
      FROM productslist p
 LEFT JOIN product_image pi ON p.pid = pi.pid
 LEFT JOIN product_attribute pa ON p.pid = pa.pid
     WHERE p.condition = 'second' AND p.status = 1
  GROUP BY p.pid;
  `;
  conn.query(sql, (err, results) => err ? res.status(500).send('伺服器錯誤') : res.json(results));
});

app.get('/get/hot-ranking', (req, res) => {
  const hostUrl = `${req.protocol}://${req.get('host')}`;
  const sql = `
    SELECT p.pid, p.pd_name, p.price, p.sale_count, pi.img_path
      FROM productslist p
 LEFT JOIN (
        SELECT pid, img_path
          FROM product_image
         WHERE pd_img_id IN (
           SELECT MIN(pd_img_id) FROM product_image GROUP BY pid
         )
      ) pi ON pi.pid = p.pid
  `;
  conn.query(sql, (err, results) => {
    if (err) return res.status(500).send('伺服器錯誤');
    res.json(
      results.map(row => ({
        pid: row.pid,
        pd_name: row.pd_name,
        price: row.price,
        sale_count: row.sale_count,
        imageUrl: row.img_path ? `${hostUrl}/${row.img_path.replace(/^\.\.\//, '')}` : null
      }))
    );
  });
});

//文章相關//
app.get("/get/article", function (req, res) {
  conn.query("SELECT * FROM article", function (err, results) {
      if (err) {
          console.error("資料庫查詢錯誤:", err);
          res.status(500).send("伺服器錯誤");
      } else {
          console.log("/get/article被連線");
          res.json(results); // 正確回傳結果給前端
      }
  });
});




// 4. 刪除文章
app.delete('/get/article/:id', async (req, res) => {
  const id = +req.params.id;
  try {
    const result = await q('DELETE FROM article WHERE ArticleID = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).send('Not Found');
    res.sendStatus(204);
  } catch (err) {
    console.error('刪除文章失敗：', err);
    res.status(500).send('Server Error');
  }
});












app.get("/get/userinfo", function (req, res) {
  conn.query("SELECT uid,email,username,photo,fullname,birthday,power,last_time_login,AboutMe as aboutme,Device as device FROM userinfo", function (err, results) {
    if (err) {
      console.error("資料庫查詢錯誤:", err);
      res.status(500).send("伺服器錯誤");
    } else {
      console.log("http://localhost:8000/get/userinfo 被連線");
      res.json(results); // 正確回傳結果給前端
    }
  });
});