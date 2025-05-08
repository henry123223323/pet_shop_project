require('dotenv').config();
const fs = require('fs');
var express = require("express");
const router  = express.Router();
const path = require('path');
var cors = require("cors");
var axios = require('axios');
const util = require('util');
var mysql = require("mysql");
const imageType = require('image-type');
// 夏威夷披薩
const verifyRoutes = require('./routes/verify');
const upload = require('../fashion-paw/uploadProductImg');
const ArticleImgupload = require('../fashion-paw/uploadArticleImg')
var app = express();
app.listen(8000, function () {
  console.log("好拾毛" + new Date().toLocaleTimeString());
});
app.use(express.static("public"));
app.use(express.static(path.resolve(__dirname, '../fashion-paw/public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/media', express.static('media'))
const uploadRoute = require('./upload');

const ai_robot = require('./aiRobot/chat')
app.use('/api', uploadRoute);//用於上傳圖片
app.use('/robot', ai_robot)

const resetPasswordRoutes = require('./routes/resetPassword');
app.use('/password', resetPasswordRoutes);
var conn = mysql.createConnection({
  user: "root",
  password: "",
  host: "localhost",
  port: 3306,
  database: "howsmoat"
});
conn.connect(err => console.log(err || 'DB connected'));
const q = util.promisify(conn.query).bind(conn);
app.use('/verify', verifyRoutes);


app.get("/get/article", function (req, res) {//用於開發者後臺管理
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

// 新增文章
router.post(
  '/api/create/article',
  ArticleImgupload,        
  async (req, res) => {
    const {
      title,
      intro,
      pet_type,
      product_category,
      article_type,
      sections
    } = req.body;

    // Multer 會把檔案路徑放在 req.file.path
    // 我們轉成 public 下的相對路徑
    const banner_URL = req.file
      ? `/media/pet_know/${article_type}/${pet_type}/${req.file.filename}`
      : '';

    const sql = `
      INSERT INTO article
        (title, banner_URL, intro, pet_type,
         product_category, article_type, sections, create_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const params = [
      title,
      banner_URL,
      intro,
      pet_type,
      product_category,
      article_type,
      JSON.stringify(sections || [])
    ];

    try {
      const result = await q(sql, params);
      res.status(201).json({ insertId: result.insertId });
    } catch (err) {
      console.error('新增文章失敗：', err);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
// 4. 刪除文章
app.delete('/api/article/:id', async (req, res) => {
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

//寵物小知識區取得文章//
app.get('/get/petknowarticles', async (req, res) => {
  try {
    const rows = await q('SELECT * FROM article');
    res.json({ list: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 篩選單篇文章
app.get('/api/petknowarticle/:id', async (req, res) => {
  const id = +req.params.id;
  try {
    const rows = await q(
      `SELECT
         ArticleID      AS id,
         title          AS title,
         banner_URL     AS bannerFile,    -- 可能是 "dog/dogcare.png" 或 "/dog/dogcare.png"
         intro          AS summary,
         pet_type       AS pet,           -- "dog"
         article_type   AS articleType,   -- "health_check" 或 "pet_feeding"
         sections       AS sections,
         create_at      AS date
       FROM article
       WHERE ArticleID = ?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });

    const row = rows[0];
    const host = `${req.protocol}://${req.get('host')}`; // e.g. http://localhost:8000

    // 用 path.basename 只留下最末端檔名 ("dogcare.png")
    const fileName = require('path').basename(row.bannerFile || '');
    const bannerUrl = fileName
      ? `${host}/media/pet_know/${row.articleType}/${row.pet}/${fileName}`
      : null;

    res.json({
      id: row.id,
      title: row.title,
      summary: row.summary,
      pet: row.pet,
      topic: row.topic,
      articleType: row.articleType,
      sections: row.sections,
      date: row.date,
      bannerUrl
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});
// 列表分頁（同樣拼 bannerUrl）
app.get('/api/petknowarticle', async (req, res) => {
  const { type, pet, page = 1, size = 5 } = req.query;
  const pageNum = +page,
    pageSize = +size,
    offset = (pageNum - 1) * pageSize;

  try {
    // 1. 總筆數
    const countRows = await q(
      'SELECT COUNT(*) AS cnt FROM article WHERE article_type=? AND pet_type=?',
      [type, pet]
    );
    const cnt = countRows[0]?.cnt || 0;
    const totalPages = Math.ceil(cnt / pageSize);
    const host = `${req.protocol}://${req.get('host')}`;

    // 2. 分頁資料
    const rows = await q(
      `SELECT
         ArticleID        AS id,
         title            AS title,
         banner_URL       AS bannerFile,
         intro            AS summary,
         pet_type         AS pet,
         product_category AS topic,
         article_type     AS articleType,
         create_at        AS date
       FROM article
       WHERE article_type=? AND pet_type=?
       ORDER BY create_at DESC
       LIMIT ?, ?`,
      [type, pet, offset, pageSize]
    );

    // 3. 用 path.basename 只留檔名，再拼出正確路徑
    const list = rows.map(r => {
      // r.bannerFile 可能帶了 "dog/dogcare.png" 或 "/dog/dogcare.png"
      const fileName = path.basename(r.bannerFile || '');
      return {
        ...r,
        bannerUrl: fileName
          ? `${host}/media/pet_know/${r.articleType}/${r.pet}/${fileName}`
          : null
      };
    });

    // 4. 回傳
    res.json({ list, totalPages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});


// app.get("/get/userinfo/:uid", function (req, res) {
//     const uid = req.params.uid;  // 從 URL 中獲取 uid
//     console.log("UID from request:", uid);  // 輸出 uid 確認是否正確

//     conn.query("SELECT uid,email,username,photo,fullname,birthday,power,last_time_login,AboutMe as aboutme,Device as device FROM userinfo WHERE uid = ?", [uid], function (err, results) {
//         if (err) {
//             console.error("資料庫查詢錯誤:", err);
//             res.status(500).send("伺服器錯誤");
//         } else {
//             if (results.length > 0) {
//                 console.log("查詢結果:", results);  // 輸出查詢結果
//                   // 正確回傳結果給前端

//                 const photoBase64 = `data:image/png;base64,${photoBuffer.toString('base64')}`;
//                 // console.log("Base64 圖片資料:", photoBase64);
//                 res.json({
//                     uid: results[0].uid,
//                     email: results[0].email,
//                     username: results[0].username,
//                     photo: photoBase64,
//                     firstname: results[0].firstname,
//                     lastname: results[0].lastname,
//                     fullname: results[0].fullname,
//                     birthday: results[0].birthday,
//                     lastname_time_login: results[0].lastname_time_login,
//                     aboutme: results[0].aboutme,
//                     device: results[0].device,
//                     power: results[0].power
//                 });
//             } else {
//                 console.log("沒有找到該 uid 的使用者資料");
//                 res.status(404).send("沒有找到資料");
//             }
//         }
//     });
// });

app.get("/get/userinfo/:uid", function (req, res) {
  const uid = req.params.uid;  // 從 URL 中獲取 uid
  console.log("UID from request:", uid);  // 輸出 uid 確認是否正確

  conn.query("SELECT uid,email,username,photo,fullname,birthday,power,last_time_login,AboutMe as aboutme,Device as device FROM userinfo WHERE uid = ?", [uid], function (err, results) {
    if (err) {
      console.error("資料庫查詢錯誤:", err);
      res.status(500).send("伺服器錯誤");
    } else {
      if (results.length > 0) {
        console.log("查詢結果:", results);  // 輸出查詢結果
        // 正確回傳結果給前端
        const user = results[0];
        const photoBuffer = user.photo; // 假設 `photo` 是二進位資料 (Buffer)

        // 將 Buffer 轉換為 Base64
        const base64Image = `data:image/png;base64,${photoBuffer.toString('base64')}`;
        // console.log("Base64 圖片資料:", photoBase64);
        res.json({
          uid: results[0].uid,
          email: results[0].email,
          username: results[0].username,
          photo: base64Image,
          firstname: results[0].firstname,
          lastname: results[0].lastname,
          fullname: results[0].fullname,
          birthday: results[0].birthday,
          lastname_time_login: results[0].lastname_time_login,
          aboutme: results[0].aboutme,
          device: results[0].device,
          power: results[0].power
        });
      } else {
        console.log("沒有找到該 uid 的使用者資料");
        res.status(404).send("沒有找到資料");
      }
    }
  });
});



app.post("/post/deletecard/:cid", function (req, res) {
  const cid = req.params.cid
  console.log("cid from request:", cid)
  conn.query("DELETE FROM creditcard WHERE cid =?", [cid], function (err, results) {
    if (err) {
      console.error("資料庫查詢錯誤:", err);
      res.status(500).send("伺服器錯誤");
    } else {
      console.log("信用卡已刪除");
      res.json(results); // 正確回傳結果給前端
    }
  })
})


app.post("/post/newcard/:credit_num/:expiry_date/:uid", function (req, res) {
  const credit_num = req.params.credit_num
  const expiry_date = req.params.expiry_date
  const uid = req.params.uid
  console.log(credit_num);
  console.log(expiry_date);
  console.log(uid);
  conn.query("INSERT INTO `creditcard` (`cid`, `uid`, `credit_num`, `expiry_date`) VALUES (NULL, ?, ?, ?)", [uid, expiry_date, credit_num], function (err, results) {
    if (err) {
      console.error("資料庫建立錯誤:", err);
      res.status(500).send("伺服器錯誤");
    } else {
      console.log("成功建立信用卡");
      res.json(results); // 正確回傳結果給前端
    }
  })
})


// app.get("/get/address/:uid", function (req, res) {
//     conn.query("SELECT Aid,uid,City,District,address,birthday,power,last_time_login,AboutMe as aboutme,Device as device FROM userinfo", function (err, results) {
//         if (err) {
//             console.error("資料庫查詢錯誤:", err);
//             res.status(500).send("伺服器錯誤");
//         } else {
//             console.log("http://localhost:8000/get/userinfo 被連線");
//             res.json(results); // 正確回傳結果給前端
//         }
//     });
// });







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


app.get("/get/creditcard/:uid", function (req, res) {
  const uid = req.params.uid;
  conn.query("SELECT cid as id, uid, credit_num as card_num, expiry_date as expiry FROM creditcard WHERE uid = ?", [uid], function (err, results) {
    if (err) {
      console.error("資料庫查詢錯誤:", err);
      res.status(500).send("伺服器錯誤");
    } else {
      console.log("正確抓到資料庫信用卡資訊");
      res.json(results); // 正確回傳結果給前端
    }
  });
});


// 假設推薦商品存在 productslist 表裡，用某種邏輯挑 3 筆
app.get('/get/recommend-products', (req, res) => {
  const sql = `
    SELECT p.pid, p.pd_name, p.price,
           (SELECT img_path FROM product_image WHERE pid = p.pid ORDER BY pd_img_id LIMIT 1) AS img_path
    FROM productslist p
    WHERE p.status = 1
    ORDER BY RAND()
    LIMIT 3
  `;
  conn.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const host = `${req.protocol}://${req.get('host')}`;
    const data = results.map(r => ({
      pid: r.pid,
      name: r.pd_name,
      price: r.price,
      imageUrl: r.img_path
        ? host + '/' + r.img_path.replace(/^public\//, '')
        : null
    }));
    res.json(data);
  });
});

app.post("/post/productsreach/new", function (req, res) {
  let { keyword } = req.body
  let sql = `
   SELECT 
  p.pid AS id,
  p.pd_name AS name,
  p.pet_type,
  p.price,
  p.description,
  p.categories,
  p.stock,
  p.created_at,
  p.sale_count,
  imgs.images,
  attrs.attributes_object

FROM productslist p

-- 🔸 子查詢組圖片陣列
LEFT JOIN (
  SELECT 
    pid, 
    CONCAT(
      '[', GROUP_CONCAT(
        DISTINCT CONCAT(
          '{\"img_path\":\"', img_path, '\",',
          '\"img_value\":\"', img_value, '\"}'
        )
      ), ']'
    ) AS images
  FROM product_image
  GROUP BY pid
) imgs ON p.pid = imgs.pid

-- 🔸 子查詢組屬性物件
LEFT JOIN (
  SELECT 
    pid, 
    CONCAT(
      '{', GROUP_CONCAT(
        DISTINCT CONCAT('"', attr, '":"', attr_value, '"')
      ), '}'
    ) AS attributes_object
  FROM product_attribute
  GROUP BY pid
) attrs ON p.pid = attrs.pid

-- 🔍 搜尋條件：全新商品 + 狀態為上架 + 關鍵字出現在名稱、描述或屬性中
WHERE p.condition = 'new' 
  AND p.status = 1
  AND (
    p.pd_name LIKE ? 
    OR p.description LIKE ? 
    OR attrs.attributes_object LIKE ?
);

    `
  conn.query(sql, [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`], function (err, rows) {
    if (err) {
      console.error("資料庫查詢錯誤:", err);
      res.status(500).send("伺服器錯誤");
    } else {
      console.log("http://localhost:8000/post/productsreach/new 被post連線");
      res.json(rows); // 正確回傳結果給前端
    }
  })
})

app.post("/post/productsreach/second", function (req, res) {
  let { keyword } = req.body
  let sql = `
  SELECT   p.pid AS id,  p.pet_type,  p.pd_name AS name, p.price,  p.description,  p.categories,  p.city,
  p.district,
  p.uid,
  p.new_level,
  p.created_at,
  p.stock,
  p.sale_count,
  p.delivery_method,

  -- 圖片 JSON 陣列
  imgs.images,
  
  -- 屬性 JSON 物件
  attrs.attributes_object

FROM productslist p

--  子查詢組圖片陣列
LEFT JOIN (
  SELECT 
    pid, 
    CONCAT(
      '[', GROUP_CONCAT(
        DISTINCT CONCAT(
          '{\"img_path\":\"', img_path, '\",',
          '\"img_value\":\"', img_value, '\"}'
        )
      ), ']'
    ) AS images
  FROM product_image
  GROUP BY pid
) imgs ON p.pid = imgs.pid

-- 🔸 子查詢組屬性物件
LEFT JOIN (
  SELECT 
    pid, 
    CONCAT(
      '{', GROUP_CONCAT(
        DISTINCT CONCAT('"', attr, '":"', attr_value, '"')
      ), '}'
    ) AS attributes_object
  FROM product_attribute
  GROUP BY pid
) attrs ON p.pid = attrs.pid

-- 🔍 搜尋條件
WHERE p.condition = 'second' 
  AND p.status = 1
  AND (
    p.pd_name LIKE ? 
    OR p.description LIKE ? 
    OR attrs.attributes_object LIKE ?
);
    `
  conn.query(sql, [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`], function (err, rows) {
    if (err) {
      console.error("資料庫查詢錯誤:", err);
      res.status(500).send("伺服器錯誤");
    } else {
      console.log("http://localhost:8000/post/productsreach/second 被post連線");
      res.json(rows); // 正確回傳結果給前端
    }
  })
})

//商品詳細頁
app.get("/productslist/:pid", function (req, res) {
  const pid = req.params.pid;
  const sql = `
    SELECT 
        p.pid,p.condition,p.status,p.pet_type,p.pd_name,p.price,p.description,p.categories,p.city,p.district,p.uid,p.new_level,p.created_at,p.stock,p.sale_count,
        CONCAT('{', GROUP_CONCAT(DISTINCT CONCAT('"', pa.attr, '":"', pa.attr_value, '"')), '}') AS attributes,
        CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT(
            '{\"img_path\":\"', pi.img_path, '\",\"img_value\":\"', pi.img_value, '\"}'
        )), ']') AS images
    FROM 
        productslist p
    LEFT JOIN 
        product_attribute pa ON p.pid = pa.pid
    LEFT JOIN 
        product_image pi ON p.pid = pi.pid
    WHERE 
        p.status = 1 AND p.pid = ?
    GROUP BY 
        p.pid;
    `;

  conn.query(sql, [pid], function (err, results) {
    if (err) {
      console.error("查詢商品失敗：", err);
      return res.status(500).send("伺服器錯誤");
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "找不到商品" });
    }

    const p = results[0];
    let attributes = {};
    let images = [];

    try {
      attributes = JSON.parse(p.attributes || '{}');
    } catch (e) {
      console.error("屬性解析失敗：", e);
    }

    try {
      images = JSON.parse(p.images || '[]');
    } catch (e) {
      console.error("圖片解析失敗：", e);
    }

    res.json({
      pid: String(p.pid),
      condition: p.condition,
      status: p.status,
      pet_type: p.pet_type,
      pd_name: p.pd_name,
      price: String(p.price),
      description: p.description,
      categories: p.categories,
      city: p.city || "",
      district: p.district || "",
      uid: p.uid ? String(p.uid) : "",
      new_level: p.new_level || attributes.new_level || "",
      stock: String(p.stock),
      sale_count: String(p.sale_count || "0"),
      attribute: attributes,
      images: images
    });
  });
});


//新品評論
app.get("/review/newproduct/:pid", (req, res) => {
  const { pid } = req.params;
  const sql = `
      SELECT r.*, u.username, p.pd_name 
      FROM review r 
      LEFT JOIN userinfo u ON r.uid = u.uid 
      LEFT JOIN productslist p ON r.pid = p.pid 
      WHERE r.pid = ?`;
  conn.query(sql, [pid], (err, results) => {
    if (err) return res.status(500).send("伺服器錯誤");
    res.json(results);
  });
});

//二手評論
app.get("/review/seller/:uid", (req, res) => {
  const { uid } = req.params;
  const sql = `
      SELECT r.*, u.username, p.pd_name 
      FROM review r 
      LEFT JOIN userinfo u ON r.uid = u.uid 
      LEFT JOIN productslist p ON r.pid = p.pid 
      WHERE p.uid = ?`;
  conn.query(sql, [uid], (err, results) => {
    if (err) return res.status(500).send("伺服器錯誤");
    res.json(results);
  });
});




// 賣家其他商品（簡化欄位）
app.get("/sellerOtherPd/:uid/:excludePid", function (req, res) {
  const { uid, excludePid } = req.params;

  const sql = `
    SELECT 
        p.pid, 
        p.pd_name, 
        p.price, 
        p.condition,
        p.uid,
        MIN(pi.img_path) AS img_path
    FROM 
        productslist p
    LEFT JOIN 
        product_image pi ON p.pid = pi.pid
    WHERE 
        p.uid = ? 
        AND p.status = 1
        AND p.pid != ?
    GROUP BY 
        p.pid
    LIMIT 6;
    `;

  conn.query(sql, [uid, excludePid], function (err, results) {

    if (err) {
      console.error("查詢賣家其他商品失敗：", err);
      return res.status(500).send("伺服器錯誤");
    }

    res.json(results);
  });
});

//大頭貼
app.get("/userphoto/:uid", function (req, res) {
  const uid = req.params.uid;

  conn.query("SELECT photo FROM userinfo WHERE uid = ?", [uid], function (err, results) {
    if (err || results.length === 0 || !results[0].photo) {
      return res.status(404).send("找不到照片");
    }

    const photoBlob = results[0].photo;

    // 不同格式的圖片判斷
    function getMimeType(buffer) {
      const hex = buffer.toString('hex', 0, 4).toLowerCase();
      if (hex.startsWith('ffd8')) return 'image/jpeg';
      if (hex.startsWith('8950')) return 'image/png';
      if (hex.startsWith('4749')) return 'image/gif';
      if (hex.startsWith('5249')) return 'image/webp';
      return 'application/octet-stream';
    }

    const mimeType = getMimeType(photoBlob);

    res.setHeader("Content-Type", mimeType);
    res.send(photoBlob);
  });
});

// 後台管理 新品和二手共用 上架 刪除 編輯函式
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
// 取得單個商品資料
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

  try {
    await q('START TRANSACTION');

    // 1. 新增 or 更新 productslist
    let targetPid;
    if (isUpdate) {
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
      targetPid = pid;
    } else {
      const result = await q(
        `INSERT INTO productslist
           (pd_name, price, description, pet_type, categories,
            city, district, new_level, stock, sale_count,
            delivery_method, \`condition\`, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          pd.pd_name, pd.price, pd.description, pd.pet_type, pd.categories,
          pd.city, pd.district, pd.new_level, pd.stock, pd.sale_count || 0,
          pd.delivery_method, condition, pd.status || 0
        ]
      );
      targetPid = result.insertId;
    }

    // 2. 處理屬性
    await q('DELETE FROM product_attribute WHERE pid=?', [targetPid]);
    const attrEntries = Object.entries(pd)
      .filter(([k]) => k.startsWith('attribute.'))
      .map(([k, v]) => [targetPid, k.split('.')[1], v]);
    if (attrEntries.length) {
      await q(
        'INSERT INTO product_attribute (pid, attr, attr_value) VALUES ?',
        [attrEntries]
      );
    }

    // 3. 處理圖片
    // 先刪掉舊圖
    await q('DELETE FROM product_image WHERE pid = ?', [targetPid]);
    console.log('已刪除 PID=', targetPid, '的舊圖片紀錄');

    // 取得上傳的描述陣列
    let rawValues = pd['img_value[]'] || pd.img_value || [];
    if (!Array.isArray(rawValues)) rawValues = [rawValues];
    console.log('解析後的 imgValues =', rawValues);

    const files = req.files || [];
    const mediaRoot = path.join(__dirname, '..', 'fashion-paw', 'public', 'media');

    // 組 batch INSERT 的 rows
    const imgRows = files.map((file, i) => {
      const rel = path.relative(mediaRoot, file.path).replace(/\\/g, '/');
      return [
        targetPid,
        `/media/${rel}`,
        rawValues[i] || '',
      ];
    });

    console.log('準備寫入 product_image 的 rows：', imgRows);

    if (imgRows.length) {
      await q(
        'INSERT INTO product_image (pid, img_path, img_value) VALUES ?',
        [imgRows]
      );
      console.log('成功寫入', imgRows.length, '筆圖片資料');
    }

    await q('COMMIT');
    console.log('提交資料庫，結束 createOrUpdate');
    res.status(isUpdate ? 200 : 201).json({ pid: targetPid, ...pd });

  } catch (err) {
    await q('ROLLBACK');
    console.error('★ createOrUpdate 錯誤：', err);
    res.status(500).json({ error: err.message });
  }
}
module.exports = { createOrUpdate };


// 路由部分確保 middleware 放在最前面
app.post(
  '/get/:condition-products',
  upload,
  (req, res) => createOrUpdate(req, res, req.params.condition, false)
);
app.put(
  '/get/:condition-products/:pid',
  upload,
  (req, res) => createOrUpdate(req, res, req.params.condition, true)
);


// 刪除商品（含屬性、圖片資料庫紀錄，以及實體檔案）
async function removeOne(req, res) {
  const pid = +req.params.pid;
  try {
    await q('START TRANSACTION');

    // 1. 先讀出所有圖片的 img_path
    const rows = await q(
      'SELECT img_path FROM product_image WHERE pid = ?',
      [pid]
    );

    // 2. 刪除實體檔案
    for (const { img_path } of rows) {
      // 假設 img_path 像 '/media/new_pd/dog/…/123.jpg'
      // 你要把它轉成 public 下的真實路徑
      const fileOnDisk = path.join(
        __dirname,
        '..',        // 回到 nodejs/ 上層
        'fashion-paw',
        'public',
        img_path.replace(/^\/+/, '')  // 去掉開頭的斜線
      );
      if (fs.existsSync(fileOnDisk)) {
        try { fs.unlinkSync(fileOnDisk); }
        catch (e) { console.warn('刪除檔案失敗：', fileOnDisk, e); }
      }
    }

    // 3. 刪除 DB 裡的屬性與圖片紀錄
    await q('DELETE FROM product_attribute WHERE pid = ?', [pid]);
    await q('DELETE FROM product_image       WHERE pid = ?', [pid]);

    // 4. 刪除 productslist
    const result = await q('DELETE FROM productslist WHERE pid = ?', [pid]);
    if (result.affectedRows === 0) {
      await q('ROLLBACK');
      return res.status(404).send('Not Found');
    }

    await q('COMMIT');
    res.sendStatus(204);

  } catch (err) {
    await q('ROLLBACK');
    console.error('removeOne 錯誤：', err);
    res.status(500).json({ error: err.message });
  }
}

// 把 removeOne 接到你的路由
app.delete('/get/:condition-products/:pid', removeOne);
//分辨是二手 還是新品
['second', 'new'].forEach(condition => {
  const base = `/get/${condition}-products`;
  app.post(
    base,
    upload,
    (req, res) => createOrUpdate(req, res, condition, false)
  );
  app.put(
    `${base}/:pid`,
    upload,
    (req, res) => createOrUpdate(req, res, condition, true)
  );
  app.delete(`${base}/:pid`, removeOne);
  app.get(base, (req, res) => getList(req, res, condition));
  app.get(`${base}/:pid`, getOne);
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

// 熱銷排行（只取前三筆）
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
  ORDER BY p.sale_count DESC
     LIMIT 3
  `;
  conn.query(sql, (err, results) => {
    if (err) return res.status(500).send('伺服器錯誤');
    res.json(
      results.map(row => ({
        pid: row.pid,
        pd_name: row.pd_name,
        price: row.price,
        sale_count: row.sale_count,
        imageUrl: row.img_path
          ? `${hostUrl}/${row.img_path.replace(/^\.\.\//, '')}`
          : null
      }))
    );
  });
});

//首頁的熱銷排行

//文章管理頁面取得文章//
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
// 新增文章
handleSubmit = async () => {
  const { mode, createArticle, editArticle } = this.props;
  const { form } = this.state;

  // 準備 FormData
  const fd = new FormData();
  fd.append('title', form.title);
  fd.append('intro', form.intro);
  fd.append('pet_type', form.pet_type);
  fd.append('product_category', form.product_category);
  fd.append('article_type', form.article_type);
  // sections 串成 JSON 字串
  fd.append('sections', JSON.stringify(form.sections || []));
  // 如果使用者有選檔案，再放進去
  if (form.banner_URL instanceof File) {
    fd.append('banner', form.banner_URL);
  }

  try {
    if (mode === 'Add') {
      await axios.post('/api/create/article', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('新增成功');
      createArticle && createArticle();
    } else {
      await axios.put(`/api/article/${form.id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('更新成功');
      editArticle && editArticle();
    }
    this.props.close();
  } catch (err) {
    console.error(err);
    alert('上傳失敗');
  }
}




// 4. 刪除文章
app.delete('/api/article/:id', async (req, res) => {
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
// 假設推薦商品存在 productslist 表裡，用某種邏輯挑 3 筆
app.get('/get/recommend-products', (req, res) => {
  const sql = `
    SELECT p.pid, p.pd_name, p.price,
           (SELECT img_path FROM product_image WHERE pid = p.pid ORDER BY pd_img_id LIMIT 1) AS img_path
    FROM productslist p
    WHERE p.status = 1
    ORDER BY RAND()
    LIMIT 3
  `;
  conn.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const host = `${req.protocol}://${req.get('host')}`;
    const data = results.map(r => ({
      pid: r.pid,
      name: r.pd_name,
      price: r.price,
      imageUrl: r.img_path
        ? host + '/' + r.img_path.replace(/^public\//, '')
        : null
    }));
    res.json(data);
  });
}); 