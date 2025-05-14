require('dotenv').config();
const fs = require('fs');
var express = require("express");
const router = express.Router();
const path = require('path');
var cors = require("cors");
var axios = require('axios');
const util = require('util');
var mysql = require("mysql");
const imageType = require("image-type").default;
const multer = require("multer");
const photoUpload = multer();
// 再動就自己寫後端


const verifyRoutes = require('./routes/verify');
const upload = require('../fashion-paw/uploadProductImg');
const uploadArticleImg = require('../fashion-paw/uploadArticleImg');

const paymentRouter = require('./routes/payment');
const cvsRoute = require('./routes/cvs');

var app = express();
app.listen(8000, function () {
  console.log("好拾毛" + new Date().toLocaleTimeString());
});
app.use(express.static("public"));
app.use(express.static(path.resolve(__dirname, '../fashion-paw/public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  '/media',
  express.static(path.join(__dirname, 'public', 'media'))
);
const uploadRoute = require('./upload');
const cookieParser = require('cookie-parser')

const ai_robot = require('./aiRobot/chat')
app.use(cookieParser())
app.use('/api', uploadRoute);//用於上傳圖片
app.use('/robot', ai_robot)

// 定義 authenticate middleware：從 req.cookies.uid 讀取使用者 ID
function authenticate(req, res, next) {
  const uid = req.cookies.uid
  if (!uid) {
    return res.status(401).json({ error: '未登入或 Cookie 過期' })
  }
  req.user = { id: uid }
  next()
}
const resetPasswordRoutes = require('./routes/resetPassword');
const { log } = require('console');
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

//付款綠界API
app.use('/payment', paymentRouter);
app.use('/', cvsRoute);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

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

app.post(
  '/api/create/article',
  uploadArticleImg.single('banner_URL'),   // ← Multer middleware
  async (req, res) => {
    try {
      // 1. 解構 + 預設值
      const {
        title = '',
        intro = '',
        pet_type = '',
        product_category = '',
        article_type = '',
        sections = '[]'
      } = req.body;

      // 2. 必填檢查
      if (!title.trim()) {
        return res.status(400).json({ error: 'title 為必填欄位' });
      }

      // 3. 從 req.file 組路徑給前端讀
      const banner_URL = req.file
        ? `/media/pet_know/${article_type}/${pet_type}/${req.file.filename}`
        : '';

      // 4. SQL 欄位一定要和參數一一對應
      const sql = `
        INSERT INTO article
          (title, banner_URL, intro, pet_type, product_category, article_type, sections, create_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      const params = [
        title.trim(),
        banner_URL,
        intro.trim(),
        pet_type,
        product_category,
        article_type,
        // 如果前端送的是物件就 stringify，否則直接用字串
        typeof sections === 'string' ? sections : JSON.stringify(sections)
      ];

      const result = await q(sql, params);
      return res.status(201).json({ insertId: result.insertId });
    } catch (err) {
      console.error('新增文章失敗：', err);
      return res.status(500).json({ error: err.message });
    }
  }
);
// 4. 刪除文章
app.delete('/api/article/:id', async (req, res) => {
  const id = +req.params.id;
  try {
    // 1. 先撈出 banner_URL、article_type、pet_type
    const [row] = await q(
      'SELECT banner_URL, article_type, pet_type FROM article WHERE ArticleID = ?',
      [id]
    );
    if (!row) return res.status(404).json({ error: 'Not Found' });

    const { banner_URL, article_type, pet_type } = row;

    if (banner_URL) {
      // 假設 banner_URL="/media/pet_know/health_check/dog/xxxxx.png"
      // 切掉 "/media/" 前綴
      const rel = banner_URL.replace(/^\/media\/+/, '');
      // 拼成實體路徑
      const fileOnDisk = path.resolve(
        __dirname,       // e.g. /Users/.../nodejs
        '..',            // 回到專案根目錄（看你的結構決定）
        'fashion-paw',   // 或你的 public 資料夾上層資料夾
        'public',
        'media',
        rel
      );
      console.log('🗑️ 要刪除的檔案：', fileOnDisk);

      // 確認檔案存在再刪
      if (fs.existsSync(fileOnDisk)) {
        try {
          fs.unlinkSync(fileOnDisk);
          console.log('✅ 檔案刪除成功');
        } catch (e) {
          console.error('❌ 刪除檔案失敗：', e);
        }
      } else {
        console.warn('⚠️ 檔案不存在，無法刪除');
      }
    }

    // 2. 再刪除資料庫紀錄
    const result = await q('DELETE FROM article WHERE ArticleID = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not Found' });

    res.sendStatus(204);
  } catch (err) {
    console.error('刪除文章失敗：', err);
    res.status(500).json({ error: err.message });
  }
});

app.put(
  '/api/update/article/:id',
  uploadArticleImg.single('banner_URL'),
  async (req, res) => {
    // 1. 取出 id，並驗證
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: '文章 ID 格式不正確' });
    } try {
      // 1. 先讀舊路徑
      const [old] = await q(
        'SELECT banner_URL, article_type, pet_type FROM article WHERE ArticleID = ?',
        [id]
      );
      if (!old) return res.status(404).json({ error: 'Not Found' });

      // 2. 準備新的 bannerPath（先不動檔案）
      let bannerPath = old.banner_URL;
      if (req.file) {
        bannerPath = `/media/pet_know/${req.body.article_type}/${req.body.pet_type}/${req.file.filename}`;
      }

      // 3. 執行 UPDATE
      await q(
        `UPDATE article SET
           title            = ?,
           intro            = ?,
           pet_type         = ?,
           product_category = ?,
           article_type     = ?,
           sections         = ?,
           banner_URL       = ?,
           create_at        = NOW()
         WHERE ArticleID = ?`,
        [
          req.body.title,
          req.body.intro,
          req.body.pet_type,
          req.body.product_category,
          req.body.article_type,
          typeof req.body.sections === 'string'
            ? req.body.sections
            : JSON.stringify(req.body.sections),
          bannerPath,
          id
        ]
      );

      // 4. UPDATE 成功後，再刪舊檔
      if (req.file && old.banner_URL) {
        const oldRel = old.banner_URL.replace(/^\/+/, '');
        const oldFile = path.resolve(
          __dirname,
          '../fashion-paw/public',   // ← 往上到 fashion-paw，再進 public
          oldRel
        );
        if (fs.existsSync(oldFile)) {
          fs.unlinkSync(oldFile);
          console.log('已刪除舊檔：', oldFile);
        } else {
          console.warn('找不到舊檔，不刪除：', oldFile);
        }
      }

      res.json({ success: true });
    } catch (err) {
      console.error('☆ 更新文章失敗：', err);
      res.status(500).json({ error: err.message });
    }
  }
);

// ── 取得所有文章清單（帶回 category 欄位） ─────────────────────
app.get('/get/petknowarticles', async (req, res) => {
  try {
    const rows = await q(`
      SELECT
        ArticleID        AS id,
        title            AS title,
        banner_URL       AS bannerFile,
        intro            AS summary,
        pet_type         AS pet,
        article_type     AS articleType,
        product_category AS category,
        sections         AS sections,
        create_at        AS date
      FROM article
    `);
    res.json({ list: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// ── 取得單篇文章 / 篩出 category 欄位 ───────────────────────────
app.get('/api/petknowarticle/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const rows = await q(
      `
      SELECT
        ArticleID        AS id,
        title            AS title,
        banner_URL       AS bannerFile,
        intro            AS summary,
        pet_type         AS pet,
        article_type     AS articleType,
        product_category AS category,
        sections         AS sections,
        create_at        AS date
      FROM article
      WHERE ArticleID = ?
      `,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });

    const row = rows[0];
    const host = `${req.protocol}://${req.get('host')}`;
    const fileName = path.basename(row.bannerFile || '');
    const bannerUrl = fileName
      ? `${host}/media/pet_know/${row.articleType}/${row.pet}/${fileName}`
      : null;

    res.json({
      id: row.id,
      title: row.title,
      summary: row.summary,
      pet: row.pet,
      category: row.category,
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

// ── 分頁取得文章列表 / 帶回 category ────────────────────────────
app.get('/api/petknowarticle', async (req, res) => {
  const { type, pet, page = 1, size = 5 } = req.query;
  const pageNum = Math.max(1, Number(page));
  const pageSize = Math.max(1, Number(size));
  const offset = (pageNum - 1) * pageSize;

  if (!type || !pet) {
    return res.status(400).json({ error: '缺少必要參數 type 或 pet' });
  }

  try {
    // 1. 計算總筆數
    const countRows = await q(
      `SELECT COUNT(*) AS cnt
         FROM article
        WHERE article_type = ? AND pet_type = ?`,
      [type, pet]
    );
    const cnt = countRows[0]?.cnt || 0;
    const totalPages = Math.ceil(cnt / pageSize);
    const host = `${req.protocol}://${req.get('host')}`;

    // 2. 取分頁資料
    const rows = await q(
      `
      SELECT
        ArticleID        AS id,
        title            AS title,
        banner_URL       AS bannerFile,
        intro            AS summary,
        pet_type         AS pet,
        article_type     AS articleType,
        product_category AS category,
        create_at        AS date
      FROM article
      WHERE article_type = ? AND pet_type = ?
      ORDER BY create_at DESC
      LIMIT ?, ?
      `,
      [type, pet, offset, pageSize]
    );

    // 3. 處理 bannerUrl
    const list = rows.map(r => {
      const fileName = path.basename(r.bannerFile || '');
      return {
        id: r.id,
        title: r.title,
        summary: r.summary,
        pet: r.pet,
        category: r.category,
        articleType: r.articleType,
        date: r.date,
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
  const uid = req.params.uid;

  conn.query("SELECT uid,email,username,photo,fullname,birthday,power,last_time_login,AboutMe as aboutme,Device as device FROM userinfo WHERE uid = ?", [uid], function (err, results) {
    if (err) {
      console.error("資料庫查詢錯誤:", err);
      return res.status(500).send("伺服器錯誤");
    }

    if (results.length > 0) {
      const user = results[0];
      const photoBuffer = user.photo;
      const type = imageType(photoBuffer);

      const base64Image = type
        ? `data:${type.mime};base64,${photoBuffer.toString('base64')}`
        : null;

      res.json({
        uid: user.uid,
        email: user.email,
        username: user.username,
        photo: base64Image,
        fullname: user.fullname,
        birthday: user.birthday,
        lastname_time_login: user.lastname_time_login,
        aboutme: user.aboutme,
        device: user.device,
        power: user.power
      });
    } else {
      res.status(404).send("沒有找到資料");
    }
  });
});


app.post("/post/deleteaddress/:Aid", function (req, res) {
  const Aid = req.params.Aid
  conn.query("DELETE FROM address WHERE Aid =?", [Aid], function (err, results) {
    if (err) {
      console.error("資料庫查詢錯誤:", err);
      res.status(500).send("伺服器錯誤");
    } else {
      console.log("地址已刪除");
      res.json(results); // 正確回傳結果給前端
    }
  })

})





app.post("/post/deleteaddress/:Aid", function (req, res) {
  const Aid = req.params.Aid
  conn.query("DELETE FROM address WHERE Aid =?", [Aid], function (err, results) {
    if (err) {
      console.error("資料庫查詢錯誤:", err);
      res.status(500).send("伺服器錯誤");
    } else {
      console.log("地址已刪除");
      res.json(results); // 正確回傳結果給前端
    }
  })

})






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
app.get("/get/address/:uid", function (req, res) {
  const uid = req.params.uid
  conn.query("SELECT Aid,uid,City as city,District as district,address,AdressName as addressName,AdressPhone as addressPhone FROM address WHERE uid = ?", [uid], function (err, results) {
    if (err) {
      console.error("資料庫查詢錯誤:", err);
      res.status(500).send("伺服器錯誤");
    } else {
      console.log("http://localhost:8000/get/userinfo 被連線");
      res.json(results); // 正確回傳結果給前端
    }
  });
});

app.post("/post/makenewaddress/:uid/:AdressName/:AdressPhone/:City/:District/:address", function (req, res) {
  const uid = decodeURIComponent(req.params.uid);
  const AdressName = decodeURIComponent(req.params.AdressName);
  const AdressPhone = decodeURIComponent(req.params.AdressPhone);
  const City = decodeURIComponent(req.params.City);
  const District = decodeURIComponent(req.params.District);
  const address = decodeURIComponent(req.params.address);

  console.log(AdressName);
  console.log(AdressPhone);
  console.log(City);
  console.log(District);
  console.log(address);

    conn.query("INSERT INTO address (uid, AdressName, AdressPhone, City, District, address) VALUES (?, ?, ?, ?, ?, ?)", 
    [uid, AdressName, AdressPhone, City, District, address], function(err, results) {
        if (err) {
            console.error("資料庫建立地址錯誤:", err);
            res.status(500).send("伺服器錯誤");
        } else {
            console.log("新地址建立成功");
            res.json(results); // 正確回傳結果給前端
        }
    });
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


app.get("/get/creditcard/:uid", function (req, res) {
    const uid = req.params.uid;
    conn.query("SELECT cid as id, uid, credit_num as card_num, expiry_date as expiry FROM creditcard WHERE uid = ?",[uid], function (err, results) {
        if (err) {
            console.error("資料庫建立地址錯誤:", err);
            res.status(500).send("伺服器錯誤");
        } else {
            console.log("新地址建立成功");
            res.json(results); // 正確回傳結果給前端
        }
    });
});
















app.post("/post/addressedit/:Aid/:AdressName/:AdressPhone/:City/:District/:address",function(req,res){
  const Aid = decodeURIComponent(req.params.Aid);  // 解碼 URL 參數
  const AdressName = decodeURIComponent(req.params.AdressName);
  const AdressPhone = decodeURIComponent(req.params.AdressPhone);
  const City = decodeURIComponent(req.params.City);
  const District = decodeURIComponent(req.params.District);
  const address = decodeURIComponent(req.params.address);

  console.log(Aid);
  console.log(AdressName);
  console.log(AdressPhone);
  console.log(City);
  console.log(District);
  console.log(address);
  


  conn.query("UPDATE address SET AdressName = ?, AdressPhone = ?, City = ?, District = ?, address = ? WHERE Aid = ?",[AdressName,AdressPhone,City,District,address,Aid],function(err,results){
      if (err) {
          console.error("資料庫查詢錯誤:", err);
          res.status(500).send("伺服器錯誤");
      } else {
          console.log("地址更改成功");
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






app.get("/get/getcollect/:uid",function(req,res){
  const uid = req.params.uid
  console.log(uid);
  conn.query("SELECT p.pd_name as pd_name ,c.CollectId AS cid ,p.price as price,p.pid as id, i.img_path as img FROM collection c JOIN productslist p ON c.pid = p.pid LEFT JOIN product_image i ON p.pid = i.pid AND i.img_value = '主圖' WHERE c.uid = ?",[uid],function(err,results){
    if (err) {
          console.error("資料庫查詢錯誤:", err);
          res.status(500).send("伺服器錯誤");
      } else {
          console.log("收藏查詢成功");
          res.json(results); // 正確回傳結果給前端
      }
  })
})

app.post("/post/deletecollect/:uid/:cid", function(req, res) {
  const uid = req.params.uid
  const cid = req.params.cid
  console.log(uid);
  console.log(cid);
  conn.query("DELETE FROM collection WHERE CollectId =? AND uid = ?",[cid,uid],function(err,results){
    if (err) {
          console.error("資料庫查詢錯誤:", err);
          res.status(500).send("伺服器錯誤");
      } else {
          console.log("收藏刪除成功");
          res.json(results); // 正確回傳結果給前端
      }
  })
})

app.get("/get/getcoupon/:uid",function(req,res){
  const uid = req.params.uid
  
  console.log(uid);
  
  conn.query("SELECT coupon_id as coupon_id, discount_ratio as discount_ratio, coupon_code as coupon_code, create_at as create_at, overdate as overdate, description as description FROM coupon WHERE uid = ?",[uid],function(err,results){
    if (err) {
          console.error("資料庫查詢錯誤:", err);
          res.status(500).send("伺服器錯誤");
      } else {
          console.log("尋找折扣卷成功");
          res.json(results); // 正確回傳結果給前端
      }
  })

})


app.get("/get/getorder/:uid",function(req,res){
  const uid = req.params.uid
  console.log(uid);
  

  conn.query("SELECT display_order_num as ordernum, order_type as neworsecond, order_time as orderdate, total_price as price ,order_id FROM orders WHERE uid = ?",[uid],function(err,results){
    if (err) {
          console.error("資料庫查詢錯誤:", err);
          res.status(500).send("伺服器錯誤");
      } else {
          console.log("尋找商品訂單成功");
          res.json(results); // 正確回傳結果給前端
      }
  })




})

app.get("/get/orderitems/:order_id", function(req, res) {
  const order_id = req.params.order_id;
  conn.query("SELECT * FROM orderitem WHERE order_id = ?", [order_id], function(err, results) {
    if (err) return res.status(500).send("資料庫錯誤");
    res.json(results);
  });
});


app.get("/get/orderitemfirstpig/:order_id",function(req,res){
  const order_id = req.params.order_id
  conn.query("SELECT img_path as pd_img FROM orderitem WHERE order_id = ? limit 1 ",[order_id],function(err,results){
    if (err) {
          console.error("資料庫查詢錯誤:", err);
          res.status(500).send("伺服器錯誤");
      } else {
          console.log("尋找商品訂單內容成功");
          res.json(results); // 正確回傳結果給前端
      }
  })
})



// app.post("/post/createuserinfo/")









app.get("/get/useruid/:email",function(req,res){
  const email = req.params.email
  conn.query("SELECT uid FROM userinfo WHERE email = ?",[email],function(err,results){
    if (err) {
          console.error("資料庫查詢錯誤:", err);
          res.status(500).send("伺服器錯誤");
      } else {
          console.log("找到新建用戶uid");
          res.json(results); // 正確回傳結果給前端
      }
  })
})








app.post("/post/edituserinfo", photoUpload.single("photo"), (req, res) => {
  const { uid, username, email, birthday } = req.body;
  const photoBuffer = req.file ? req.file.buffer : null;

  let sql, params;

  if (photoBuffer) {
    // ✅ 有上傳圖片，就更新 photo 欄位
    sql = "UPDATE userinfo SET username=?, email=?, birthday=?, photo=? WHERE uid=?";
    params = [username, email, birthday, photoBuffer, uid];
  } else {
    // ✅ 沒有圖片就不更新 photo
    sql = "UPDATE userinfo SET username=?, email=?, birthday=? WHERE uid=?";
    params = [username, email, birthday, uid];
  }

  conn.query(sql, params, (err, result) => {
    if (err) return res.status(500).send("更新失敗");
    res.send("更新成功！");
  });
});








app.get("/get/new_product/home", function (req, res) {
    let sql = `
SELECT p.pid as id, p.pd_name as name, p.pet_type, p.price, p.description, p.categories, p.stock, p.created_at, p.sale_count,
CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{\"img_path\":\"', pi.img_path, '\",\"img_value\":\"', pi.img_value, '\"}')), ']') AS images,
CONCAT('{', GROUP_CONCAT(DISTINCT CONCAT('"', pa.attr, '":"', pa.attr_value, '"')), '}') AS attributes_object
FROM productslist p
LEFT JOIN product_image pi ON p.pid = pi.pid
LEFT JOIN product_attribute pa ON p.pid = pa.pid
WHERE p.condition = 'new' AND p.status = 1
GROUP BY p.pid;
`;

    conn.query(sql, function (err, results) {
        if (err) {
            console.error("資料庫查詢錯誤:", err);
            res.status(500).send("伺服器錯誤");
        } else {
            console.log("地址更改成功");
            res.json(results); // 正確回傳結果給前端
        }
    })
})






app.get("/get/new_product/brand", function (req, res) {
    let sql = `
    SELECT attr_value AS brand
    FROM product_attribute
    LEFT JOIN productslist p
    ON product_attribute.pid=p.pid
    WHERE attr = 'brand' and p.condition="new"
    GROUP BY attr_value;`
    conn.query(sql, function (err, results) {
        if (err) {
            console.error("資料庫查詢錯誤:", err);
            res.status(500).send("伺服器錯誤");
        } else {
            console.log("http://localhost:8000/get/new_product/brand 被連線");
            res.json(results); // 正確回傳結果給前端
        }
    });
});


// app.get("/get/userinfo/:uid/:power",function(req,res){
//   const power = req.params.power
//   conn.query("")
// })









app.get("/get/creditcard/:uid", function (req, res) {
  const uid = req.params.uid;
  conn.query("SELECT cid as id, uid, credit_num as card_num, expiry_date as expiry FROM creditcard WHERE uid = ?", [uid], function (err, results) {
    if (err) {
      console.error("資料庫建立地址錯誤:", err);
      res.status(500).send("伺服器錯誤");
    } else {
      console.log("新地址建立成功");
      res.json(results); // 正確回傳結果給前端
    }
  });
});



app.get("/get/new_product/home", function (req, res) {//給全新商品瀏覽頁的api
  let sql = `
SELECT p.pid as id, p.pd_name as name, p.pet_type, p.price, p.description, p.categories, p.stock, p.created_at, p.sale_count,
CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{\"img_path\":\"', pi.img_path, '\",\"img_value\":\"', pi.img_value, '\"}')), ']') AS images,
CONCAT('{', GROUP_CONCAT(DISTINCT CONCAT('"', pa.attr, '":"', pa.attr_value, '"')), '}') AS attributes_object
FROM productslist p
LEFT JOIN product_image pi ON p.pid = pi.pid
LEFT JOIN product_attribute pa ON p.pid = pa.pid
WHERE p.condition = 'new' AND p.status = 1
GROUP BY p.pid;
`;

  conn.query(sql, function (err, results) {
    if (err) {
      console.error("資料庫查詢錯誤:", err);
      res.status(500).send("伺服器錯誤");
    } else {
      console.log("地址更改成功");
      res.json(results); // 正確回傳結果給前端
    }
  })
})






app.get("/get/new_product/brand", function (req, res) {//查詢有哪些品牌
  let sql = `
    SELECT attr_value AS brand
    FROM product_attribute
    LEFT JOIN productslist p
    ON product_attribute.pid=p.pid
    WHERE attr = 'brand' and p.condition="new"
    GROUP BY attr_value;`
  conn.query(sql, function (err, results) {
    if (err) {
      console.error("資料庫查詢錯誤:", err);
      res.status(500).send("伺服器錯誤");
    } else {
      console.log("http://localhost:8000/get/new_product/brand 被連線");
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


app.get('/get/recommend-products', (req, res) => {
  const { pet_type, product_category } = req.query;
  console.log('🔍 前端傳來 pet_type =', pet_type, '、product_category =', product_category);

  // 基本 SQL
  let sql = `
    SELECT p.pid, p.pd_name, p.price,
           (SELECT img_path
              FROM product_image
             WHERE pid = p.pid
             ORDER BY pd_img_id
             LIMIT 1) AS img_path
      FROM productslist p
     WHERE p.status = 1
  `;
  const params = [];

  // 依 pet_type 篩選
  if (pet_type) {
    sql += ` AND p.pet_type = ?`;
    params.push(pet_type);
  }

 if (product_category) {
  sql += ` AND FIND_IN_SET(?, p.categories)`;
  params.push(product_category);
 }

  // 隨機取三筆
  sql += ` AND p.condition = 'new'`;
  sql += ` ORDER BY RAND() LIMIT 3`;
  console.log('🔍 最終 SQL =', sql.trim(), '／params =', params);

  conn.query(sql, params, (err, results) => {
    if (err) {
      console.error('GET /get/recommend-products 錯誤：', err.message);
      return res.status(500).json({ error: err.message });
    }

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

--  子查詢組屬性物件
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
      // console.log(JSON.parse(rows[0].images)[0].img_path );
      
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


app.get('/select/collect/:uid/:pid', function (req, res) {
  let uid = req.params.uid;
  let pid = req.params.pid;
  if (pid == 'all') {

    let sql = `
        SELECT *
        from collection
        WHERE uid=? ;
        `
    conn.query(sql, [uid], function (err, rows) {
      if (err) {
        console.error("查詢收藏失敗：", err);
        return res.status(500).send("伺服器錯誤");
      }
      console.log(`Select uid:${uid}`);
      let array = []
      rows.forEach((element, index) => {
        array[index] = element.pid
      });
      res.json(array)

    })
  }
  else {

    let sql = `
        SELECT *
        from collection
        WHERE uid=? and pid=?;
        `
    conn.query(sql, [uid, pid], function (err, rows) {
      if (err) {
        console.error("查詢收藏失敗：", err);
        return res.status(500).send("伺服器錯誤");
      }
      console.log(`Select uid:${uid},pid:${pid}`);

      rows.length > 0 ? res.json(true) : res.json(false)


    })
  }
})

app.get('/insert/collect/:uid/:pid', function (req, res) {
  let uid = req.params.uid;
  let pid = req.params.pid;
  let sql = `
    INSERT INTO collection (uid,pid) VALUES (?,?);
    `
  conn.query(sql, [uid, pid], function (err, rows) {
    if (err) {
      console.error("查詢收藏失敗：", err);
      return res.status(500).send("伺服器錯誤");
    }
    console.log(`Insert uid:${uid},pid:${pid}`);

    rows.length > 0 ? res.json(true) : res.json(false)


  })
})
app.get('/delete/collect/:uid/:pid', function (req, res) {
  let uid = req.params.uid;
  let pid = req.params.pid;
  let sql = `
    DELETE FROM collection Where uid=? and pid=?;
    `
  conn.query(sql, [uid, pid], function (err, rows) {
    if (err) {
      console.error("查詢收藏失敗：", err);
      return res.status(500).send("伺服器錯誤");
    }
    console.log(`Delete uid:${uid},pid:${pid}`);

    rows.length > 0 ? res.json(true) : res.json(false)


  })
})

//後台管理 賣家個人商場api
// 只抓自己的二手商品
// (1) 讀取二手商品
app.get('/get/my-second-products', async (req, res) => {
  const uid = req.get('X-UID')
  if (!uid) return res.status(400).json({ error: '請帶入 X-UID' })

  const sql = `
    SELECT p.uid,p.pid,p.pd_name,p.price,p.categories,p.new_level,p.status,
           MIN(pi.img_path) AS img_path
      FROM productslist p
 LEFT JOIN product_image pi ON p.pid=pi.pid
     WHERE p.uid=? AND p.\`condition\`='second'
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

// (2) 新增二手商品
app.post('/get/my-second-products', upload, async (req, res) => {
  console.log('🔎 POST 收到 X-UID:', req.get('X-UID'));
  const uid = req.get('X-UID');
  if (!uid) return res.status(400).json({ error: '請帶入 X-UID' });

  const { pd_name, price, categories, new_level, status } = req.body;
  const insertSql = `
    INSERT INTO productslist
      (uid, pd_name, price, categories, new_level, status, \`condition\`)
    VALUES (?, ?, ?, ?, ?, ?, "second")
  `;
  try {
    const { insertId: pid } = await q(insertSql, [uid, pd_name, price, categories, new_level, status]);
    console.log('新增後 pid=', pid);

    // 處理圖片：直接 batch insert
    // 1. 先刪掉任何舊圖（理論上不應該有）
    await q('DELETE FROM product_image WHERE pid = ?', [pid]);

    // 2. 解析描述陣列
    let rawValues = req.body['img_value[]'] || req.body.img_value || [];
    if (!Array.isArray(rawValues)) rawValues = [rawValues];
    console.log('解析後的 imgValues =', rawValues);

    // 3. 準備 batch INSERT 的 rows
    const mediaRoot = path.join(__dirname, '..', 'public', 'media', 'second_pd');
    const imgRows = (req.files || []).map((file, i) => {
      // file.path 已是實體路徑，可直接取 file.filename
      return [
        pid,
        `/media/second_pd/${file.filename}`,
        rawValues[i] || ''
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

    res.status(201).json({ pid });
  } catch (e) {
    console.error('上傳失敗：', e);
    res.status(500).json({ error: e.message });
  }
});


// (3) 編輯二手商品
app.put('/get/my-second-products/:pid', upload, async (req, res) => {
  const uid = req.get('X-UID');
  const pid = +req.params.pid;
  if (!uid) return res.status(400).json({ error: '請帶入 X-UID' });

  const { pd_name, price, categories, new_level, status } = req.body;
  try {
    // 驗證商品
    const rows = await q(
      'SELECT 1 FROM productslist WHERE pid=? AND uid=? AND `condition`="second"',
      [pid, uid]
    );
    if (!rows.length) return res.status(404).json({ error: '找不到商品' });

    // 更新商品基本資料
    await q(
      'UPDATE productslist SET pd_name=?,price=?,categories=?,new_level=?,status=? WHERE pid=?',
      [pd_name, price, categories, new_level, status, pid]
    );
    console.log('已更新 productslist pid=', pid);

    // 刪掉舊圖
    await q('DELETE FROM product_image WHERE pid=?', [pid]);
    console.log('已刪除 PID=', pid, '的舊圖片紀錄');

    // 解析描述陣列
    let rawValues = req.body['img_value[]'] || req.body.img_value || [];
    if (!Array.isArray(rawValues)) rawValues = [rawValues];
    console.log('解析後的 imgValues =', rawValues);

    // 準備 batch INSERT
    const imgRows = (req.files || []).map((file, i) => [
      pid,
      `/media/second_pd/${file.filename}`,
      rawValues[i] || ''
    ]);
    console.log('準備寫入 product_image 的 rows：', imgRows);

    if (imgRows.length) {
      await q(
        'INSERT INTO product_image (pid, img_path, img_value) VALUES ?',
        [imgRows]
      );
      console.log('成功寫入', imgRows.length, '筆圖片資料');
    }

    res.json({ pid });
  } catch (e) {
    console.error('更新失敗：', e);
    res.status(500).json({ error: e.message });
  }
});

// (4) 刪除二手商品
app.delete('/get/my-second-products/:pid', async (req, res) => {
  const uid = req.get('X-UID')
  const pid = +req.params.pid
  if (!uid) return res.status(400).json({ error: '請帶入 X-UID' })

  try {
    await q('DELETE FROM product_image WHERE pid=?', [pid])
    const { affectedRows } = await q(
      'DELETE FROM productslist WHERE pid=? AND uid=? AND `condition`="second"',
      [pid, uid]
    )
    if (!affectedRows) return res.status(404).json({ error: '找不到商品' })
    res.sendStatus(204)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
})



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


// 給首頁的熱銷
app.get('/get/category-ranking', (req, res) => {
  const hostUrl = `${req.protocol}://${req.get('host')}`;
  const sql = `
    SELECT
      cr.categories    AS category,    -- 這裡改成 category
      cr.pid,
      cr.pd_name       AS name,
      cr.price,
      cr.sale_count    AS saleCount,
      cr.img_path      AS img_path
    FROM (
      SELECT
        p.categories,
        p.pid,
        p.pd_name,
        p.price,
        p.sale_count,
        pi.img_path,
        ROW_NUMBER() OVER (
          PARTITION BY p.categories
          ORDER BY p.sale_count DESC
        ) AS rn
      FROM productslist p
      LEFT JOIN (
        SELECT pid, img_path
        FROM product_image
        WHERE pd_img_id IN (
          SELECT MIN(pd_img_id)
          FROM product_image
          GROUP BY pid
        )
      ) AS pi
        ON pi.pid = p.pid
      WHERE p.condition <> 'second'    -- 只挑新品（排除二手）
    ) AS cr
    WHERE cr.rn <= 5
    ORDER BY cr.categories, cr.rn;
  `;

  conn.query(sql, (err, results) => {
    if (err) {
      console.error('查詢分類排行（排除二手）失敗：', err);
      return res.status(500).send('伺服器錯誤');
    }
    // 這裡取 row.category，不要再用 row.categories
    const data = results.map(row => ({
      category: row.category,
      pid: row.pid,
      name: row.name,
      price: row.price,
      saleCount: row.saleCount,
      imageUrl: row.img_path
        ? `${hostUrl}/${row.img_path.replace(/^\.\.\//, '')}`
        : null
    }));
    res.json(data);
  });
});






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



app.get("/get/back-userinfo", function (req, res) {
  conn.query("SELECT uid,email,username,photo,fullname,birthday,power,last_time_login,AboutMe as aboutme,Device as device FROM userinfo", function (err, results) {
    if (err) {
      console.error("資料庫查詢錯誤:", err);
      res.status(500).send("伺服器錯誤");
    } else {
      console.log("http://localhost:8000/get/back-userinfo 被連線");
      res.json(results); // 正確回傳結果給前端
    }
  });
});
// ── 刪除會員 ───────────────────────────────────────────────
app.delete('/get/back-userinfo/:uid', async (req, res) => {
  const { uid } = req.params;
  try {
    const result = await q('DELETE FROM userinfo WHERE uid = ?', [uid]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '找不到該會員' });
    }
    return res.json({ success: true, message: '刪除成功' });
  } catch (err) {
    console.error('刪除失敗：', err);
    return res.status(500).json({ error: err.message });
  }
});

// ── 編輯會員 ───────────────────────────────────────────────
app.put('/get/back-userinfo/:uid', async (req, res) => {
  const { uid } = req.params;
  // 從前端傳來的 editinguser 物件，解構你需要的欄位
  const {
    username,
    email,
    fullname,
    birthday,
    power,
    aboutme,
    device
  } = req.body;

  try {
    const sql = `
      UPDATE userinfo
         SET username = ?,
             email    = ?,
             fullname = ?,
             birthday = ?,
             power    = ?,
             aboutme  = ?,
             device   = ?
       WHERE uid = ?
    `;
    const result = await q(sql, [
      username,
      email,
      fullname,
      birthday,
      power,
      aboutme,
      device,
      uid
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '找不到該會員' });
    }
    return res.json({ success: true, message: '更新成功' });
  } catch (err) {
    console.error('更新失敗：', err);
    return res.status(500).json({ error: err.message });
  }
});




app.get('/get/recommend-products', (req, res) => {
  const petType = req.query.pet_type || req.query.petType;
  console.log('🔍 接收到 pet_type =', petType);

  let sql = `
    SELECT p.pid, p.pd_name, p.price,
           (SELECT img_path
              FROM product_image
             WHERE pid = p.pid
             ORDER BY pd_img_id
             LIMIT 1) AS img_path
      FROM productslist p
     WHERE p.status = 1
  `;
  const params = [];

  // 只依 pet_type 篩選
  if (pet_type) {
    sql += ` AND p.pet_type = ?`;
    params.push(pet_type);
  }

  if (product_category) {
    sql += ` AND FIND_IN_SET(REPLACE(?, ' ', '_'), p.categories)`;
    params.push(product_category);
  }

  // 隨機 3 筆
  sql += ` AND p.condition = 'new'`;

  sql += ` ORDER BY RAND() LIMIT 3`;
  console.log(sql.trim());
  console.log(params);
  conn.query(sql, params, (err, results) => {
    if (err) {
      console.error('GET /get/recommend-products 錯誤：', err.message);
      return res.status(500).json({ error: err.message });
    }

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





//建立訂單

// ✅ 新增一筆訂單（主 + 明細）
app.post('/orders/create', async (req, res) => {
  const { order, items } = req.body;

  if (!order || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: '缺少訂單資料或明細' });
  }

  const conn2 = await q.getConnection ? await q.getConnection() : conn; // 確保可 transaction（若使用 pool）
  try {
    await q('START TRANSACTION');

    // 1. 插入主訂單
    const insertOrderSQL = `
      INSERT INTO orders (
        uid, order_type, display_order_num, total_price, pay_way, card_last4,
        delivery_method, receiver_name, receiver_phone, receiver_address, receipt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const orderParams = [
      order.uid,
      order.order_type,
      order.display_order_num,
      order.total_price,
      order.pay_way,
      order.card_last4,
      order.delivery_method,
      order.receiver_name,
      order.receiver_phone,
      order.receiver_address,
      order.receipt
    ];

    const result = await q(insertOrderSQL, orderParams);
    const order_id = result.insertId;

    // 2. 插入明細
    const itemValues = items.map(item => [
      order_id,
      item.pid,
      item.pd_name,
      item.spec,
      item.quantity,
      item.unit_price,
      item.total_price,
      item.img_path
    ]);

    await q(
      `INSERT INTO orderitem
      (order_id, pid, pd_name, spec, quantity, unit_price, total_price, img_path)
      VALUES ?`,
      [itemValues]
    );

    await q('COMMIT');
    res.status(200).json({ success: true, order_id });

  } catch (err) {
    await q('ROLLBACK');
    console.error('新增訂單失敗:', err);
    res.status(500).json({ error: '訂單建立失敗' });
  }
});

//登入後把登入前的購物車資料存進uid的該購物車資料庫
app.post("/cart/merge", async (req, res) => {
  const { cartList } = req.body;

  if (!Array.isArray(cartList)) {
    return res.status(400).send("缺少購物車資料");
  }

  try {
    for (const item of cartList) {
      const { uid, pid, spec, quantity, unit_price } = item;
      const specValue = spec || null;

      // 查詢是否已存在此商品
      const existingQuery = specValue === null
        ? `SELECT * FROM shoppingcart WHERE uid = ? AND pid = ? AND spec IS NULL`
        : `SELECT * FROM shoppingcart WHERE uid = ? AND pid = ? AND spec = ?`;

      const [existing] = await q(existingQuery, specValue === null ? [uid, pid] : [uid, pid, specValue]);

      if (existing) {
        // 已存在 → 更新數量
        const updateQuery = specValue === null
          ? `UPDATE shoppingcart SET quantity = quantity + ? WHERE uid = ? AND pid = ? AND spec IS NULL`
          : `UPDATE shoppingcart SET quantity = quantity + ? WHERE uid = ? AND pid = ? AND spec = ?`;

        await q(updateQuery, specValue === null ? [quantity, uid, pid] : [quantity, uid, pid, specValue]);
      } else {
        // 不存在 → 新增
        await q(`
          INSERT INTO shoppingcart (uid, couponId, pid, spec, quantity, unit_price)
          VALUES (?, NULL, ?, ?, ?, ?)
        `, [uid, pid, specValue, quantity, unit_price]);
      }
    }

    res.send("✅ 購物車合併完成");
  } catch (err) {
    console.error("❌ 購物車合併失敗", err);
    res.status(500).send("伺服器錯誤");
  }
});
app.get('/build_AIchatroom/:user_id', async (req, res) => {
  let { user_id } = req.params;
  let sql = `
  INSERT INTO chatroomuser (uidX,uidY) VALUES(?,1)
  `
  conn.query(sql, [user_id], function (err, rows) {
    
  })
})
app.get('/AI_check/:userid', async (req, res) => {
  let { userid } = req.params;
  let sql = `
  SELECT * 
  FROM chatroomuser
  WHERE uidX=? and uidY=1;
  `
  conn.query(sql, [userid], function (err, rows) {
    if (rows.length>0) {
      res.json(true)
    }
    else {
      res.json(false)
    }
  })
})
// 從資料庫讀出購物車資料
app.get("/cart/:uid", async (req, res) => {
  const uid = Number(req.params.uid);

  try {
    const result = await q(`
      SELECT 
        sc.cart_id,
        sc.uid,
        sc.pid,
        sc.spec,
        sc.quantity,
        sc.unit_price,
        p.pd_name,
        p.condition, -- ✅ 從商品表撈出新品/二手
        p.uid AS seller_uid,
        img.img_path,
        img.img_value
      FROM shoppingcart sc
      LEFT JOIN productslist p ON sc.pid = p.pid
      LEFT JOIN (
        SELECT pid, MIN(img_path) AS img_path, MIN(img_value) AS img_value
        FROM product_image
        GROUP BY pid
      ) img ON sc.pid = img.pid
      WHERE sc.uid = ?
    `, [uid]);

    console.log("✅ 撈到購物車資料：", result.length, "筆");
    console.log("🔍 API 回傳的每個 item：");
    result.forEach(item => {
      console.log(`pid: ${item.pid}, condition: ${item.condition}, seller_uid: ${item.seller_uid}`);
    });

    res.json(result);
  } catch (err) {
    console.error("❌ 撈取購物車失敗", err);
    res.status(500).send("伺服器錯誤");
  }
});

//修改購物車商品數量
app.put("/cart/update", async (req, res) => {
  const { uid, pid, spec, quantity } = req.body;

  if (!uid || !pid || quantity == null) {
    return res.status(400).send("缺少必要欄位");
  }

  try {
    await q(`
      UPDATE shoppingcart 
      SET quantity = ? 
      WHERE uid = ? AND pid = ? AND spec <=> ?
    `, [quantity, uid, pid, spec || null]);

    res.send("✅ 購物車數量已更新");
  } catch (err) {
    console.error("❌ 更新購物車數量失敗", err);
    res.status(500).send("伺服器錯誤");
  }
});

//刪除購物車商品
app.delete("/cart/remove", async (req, res) => {
  const { uid, pid, spec } = req.body;

  if (!uid || !pid) {
    return res.status(400).send("缺少必要欄位");
  }

  try {
    await q(`
      DELETE FROM shoppingcart 
      WHERE uid = ? AND pid = ? AND spec <=> ?
    `, [uid, pid, spec || null]);

    res.send("✅ 已從資料庫刪除該商品");
  } catch (err) {
    console.error("❌ 刪除購物車商品失敗", err);
    res.status(500).send("伺服器錯誤");
  }
});
app.get('/channel/:uid', (req, res) => {
  const uidX = req.params.uid;
  const sql = `
    SELECT
      cru.chatroomID AS id,
      ui.uid,
      ui.username        AS name,
      ui.photo           AS avatar,
      ui.last_time_login AS lastTime,
      cm.message         AS snippet
    FROM chatroomuser AS cru
    LEFT JOIN userinfo AS ui
      ON cru.uidY = ui.uid
    LEFT JOIN chatmessage AS cm
      ON cm.ChatroomID = cru.chatroomID
      AND cm.messageID = (
        SELECT MAX(messageID)
        FROM chatmessage
        WHERE ChatroomID = cru.chatroomID
      )
    WHERE cru.uidX = ?
  `;

  conn.query(sql, [uidX], (err, rows) => {
    if (err) {
      console.error('取得聊天室列表失敗：', err);
      return res.status(500).json({ error: '伺服器錯誤' });
    }

    // rows 可能是 undefined，也可能是 []，统一用 [] 防呆
    const list = Array.isArray(rows) ? rows : [];

    const result = list.map(room => ({
      // 前端预期的 id 格式
      id: 'chatroom' + room.id,
      uid: room.uid,
      name: room.name,
      avatar: room.avatar,
      // 格式化成「上午10:22」这种 zh-TW 时间
      lastTime: room.lastTime
        ? new Date(room.lastTime)
            .toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
        : null,
      snippet: room.snippet
    }));

    console.log('channel result:', result);
    res.json(result);
  });
});

app.get('/chatroom/message/:room', (req, res) => {
  const match = req.params.room.match(/\d+/);
  const roomid = match ? parseInt(match[0], 10) : null;
  if (roomid === null) {
    return res.status(400).json({ error: '無效的 room 參數' });
  }

  const sql = `
    SELECT 
      cm.speakerID AS id,
      cm.message   AS text,
      cm.create_time AS time
    FROM chatmessage cm
    WHERE cm.ChatroomID = ?
  `;

  conn.query(sql, [roomid], (err, rows) => {
    // 2. SQL 錯誤先攔截
    if (err) {
      console.error('取得訊息失敗：', err);
      return res.status(500).json({ error: '伺服器錯誤' });
    }

    // 3. 确保 rows 是陣列，否則用空陣列
    const messages = Array.isArray(rows) ? rows.map(msg => ({
      id: msg.id,
      text: msg.text,
      // 4. 格式化時間為 zh-TW 兩位小時兩位分鐘
      time: new Date(msg.time)
        .toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
    })) : [];

    console.log(`聊天室 ${roomid} 訊息：`, messages);
    res.json(messages);
  });
});


app.get('/message/:uid', async (req, res) => {
  try {
    const uidX = req.params.uid;
    // 先拿所有 chatroom
    const channelResp = await axios.get(`http://localhost:8000/channel/${uidX}`);
    const chatroomIds = channelResp.data.map(room => room.id);

    // 串 Promise 取得每個聊天室的訊息，並標記 from
    const messagesByRoom = {};
    await Promise.all(chatroomIds.map(async (roomId) => {
      const msgResp = await axios.get(`http://localhost:8000/chatroom/message/${roomId}`);
      const processed = msgResp.data.map(msg => ({
        ...msg,
        from: msg.id == uidX ? 'user' : 'bot'
      }));
      messagesByRoom[roomId] = processed;
    }));

    // 全部做完再回傳
    return res.json(messagesByRoom);

  } catch (err) {
    console.error(err);
    return res.status(500).send('伺服器錯誤');
  }
});

app.post('/post/insert/message', function (req, res) {
  req.body.ChatroomID = parseInt(req.body.ChatroomID.match(/\d+/)[0], 10);
  req.body.speakerID = parseInt(req.body.speakerID);

  const { ChatroomID, speakerID, message, isRead } = req.body;
  console.log('[Insert 試圖寫入]', { ChatroomID, speakerID, message, isRead });

  conn.query(`
    INSERT INTO chatmessage
      (ChatroomID, speakerID, message, isRead)
    VALUES (?, ?, ?, ?)
  `, [ChatroomID, speakerID, message, isRead], function (err, result) {
    if (err) {
      console.error('[Insert 錯誤]', err.sqlMessage);
      return res.status(500).json({ error: err.sqlMessage });
    }

    console.log('[Insert 成功]');
    res.json({ success: true });
  });
});


//獲取折扣碼
app.get('/coupons/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    const coupons = await q(`
      SELECT coupon_code, description, discount_ratio 
      FROM coupon
      WHERE uid = ? 
    `, [uid]);

    res.json(coupons);
  } catch (err) {
    console.error("❌ 撈取折扣碼失敗", err);
    res.status(500).send("伺服器錯誤");
  }
});

// 訂單更新載具
app.post('/updateDevice', async (req, res) => {
  const { uid, device } = req.body;

  if (!uid || !device) {
    return res.status(400).json({ success: false, message: '缺少 uid 或 device' });
  }

  try {
    await q('UPDATE userinfo SET device = ? WHERE uid = ?', [device, uid]);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ 更新 device 失敗', err);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
});

//訂單新增地址
app.post("/newAddress", function (req, res) {
  const { uid, City, District, address, AdressName, AdressPhone } = req.body;

  // ✅ 欄位檢查
  if (!uid || !City || !District || !address || !AdressName || !AdressPhone) {
    return res.status(400).json({
      success: false,
      message: "缺少必要欄位",
      missing: {
        uid: !uid,
        City: !City,
        District: !District,
        address: !address,
        AdressName: !AdressName,
        AdressPhone: !AdressPhone
      }
    });
  }

  // ✅ 檢查是否重複地址
  const checkSQL = `
    SELECT * FROM address 
    WHERE uid = ? AND City = ? AND District = ? AND address = ?
  `;

  conn.query(checkSQL, [uid, City, District, address], function (err, rows) {
    if (err) {
      console.error("❌ 資料庫查詢錯誤:", err);
      return res.status(500).json({
        success: false,
        message: "資料庫查詢失敗",
        error: err.message
      });
    }

    if (rows.length > 0) {
      return res.json({
        success: false,
        message: "地址已存在"
      });
    }

    // ✅ 新增地址
    const insertSQL = `
      INSERT INTO address (uid, City, District, address, AdressName, AdressPhone)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    conn.query(insertSQL, [uid, City, District, address, AdressName, AdressPhone], function (err, result) {
      if (err) {
        console.error("❌ 儲存地址失敗:", err);
        return res.status(500).json({
          success: false,
          message: "資料庫新增失敗",
          error: err.message
        });
      }

      console.log("✅ 新地址儲存成功，insertId:", result.insertId);
      res.json({
        success: true,
        message: "地址已成功儲存",
        insertId: result.insertId
      });
    });
  });
});

//增加商品
app.post("/cart/add", async (req, res) => {
  let { uid, pid, spec, quantity, unit_price } = req.body;

  if (!uid || !pid || !quantity) {
    return res.status(400).send("缺少必要參數");
  }

  // 強制轉型為字串（避免 uid = '205' 和 205 對不上）
  uid = String(uid);
  spec = spec || null;
  quantity = parseInt(quantity, 10);
  unit_price = parseInt(unit_price, 10);

  try {
    const [existing] = await q(`
      SELECT * FROM shoppingcart WHERE uid = ? AND pid = ? AND spec ${spec === null ? 'IS NULL' : '= ?'}
    `, spec === null ? [uid, pid] : [uid, pid, spec]);

    if (existing) {
      await q(`
        UPDATE shoppingcart SET quantity = quantity + ? 
        WHERE uid = ? AND pid = ? AND spec ${spec === null ? 'IS NULL' : '= ?'}
      `, spec === null ? [quantity, uid, pid] : [quantity, uid, pid, spec]);
    } else {
      await q(`
        INSERT INTO shoppingcart (uid, couponId, pid, spec, quantity, unit_price)
        VALUES (?, NULL, ?, ?, ?, ?)
      `, [uid, pid, spec, quantity, unit_price]);
    }

    res.send("✅ 商品已加入購物車");
  } catch (err) {
    console.error("❌ 新增購物車失敗", err);
    res.status(500).send("伺服器錯誤");
  }
});

  module.exports = { q };//匯出q給payment使用
