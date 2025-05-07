require('dotenv').config();               

var express = require("express");
var axios = require('axios');
const imageType = require('image-type');
// 夏威夷披薩


const verifyRoutes = require('./routes/verify');
var cors = require("cors");
var app = express();
app.listen(8000, function () {
    console.log("好拾毛" + new Date().toLocaleTimeString());
});
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/media', express.static('media'))
const uploadRoute = require('./upload');
const ai_robot=require('./aiRobot/chat')
app.use('/api', uploadRoute);//用於上傳圖片
app.use('/robot',ai_robot)

const resetPasswordRoutes = require('./routes/resetPassword');
app.use('/password', resetPasswordRoutes);
var mysql = require("mysql");
var conn = mysql.createConnection({
    user: "root",
    password: "",
    host: "localhost",
    port: 3306,
    database: "howsmoat"
});
app.use('/verify', verifyRoutes);

conn.connect(function (err) {
    console.log(err);
})

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



app.post("/post/deletecard/:cid",function(req,res){
    const cid = req.params.cid
    console.log("cid from request:", cid)
    conn.query("DELETE FROM creditcard WHERE cid =?",[cid],function(err,results){
        if (err) {
            console.error("資料庫查詢錯誤:", err);
            res.status(500).send("伺服器錯誤");
        } else {
            console.log("信用卡已刪除");
            res.json(results); // 正確回傳結果給前端
        }
    })
})


app.post("/post/newcard/:credit_num/:expiry_date/:uid",function(req,res){
    const credit_num = req.params.credit_num
    const expiry_date = req.params.expiry_date
    const uid = req.params.uid
    console.log(credit_num);
    console.log(expiry_date);
    console.log(uid);
    conn.query("INSERT INTO `creditcard` (`cid`, `uid`, `credit_num`, `expiry_date`) VALUES (NULL, ?, ?, ?)",[uid,expiry_date,credit_num],function(err,results){
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
    conn.query("SELECT cid as id, uid, credit_num as card_num, expiry_date as expiry FROM creditcard WHERE uid = ?",[uid], function (err, results) {
        if (err) {
            console.error("資料庫查詢錯誤:", err);
            res.status(500).send("伺服器錯誤");
        } else {
            console.log("正確抓到資料庫信用卡資訊");
            res.json(results); // 正確回傳結果給前端
        }
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
            console.log("http://localhost:8000/get/new_product/home 被連線");
            res.json(results); // 正確回傳結果給前端
        }
    });
});

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

app.get("/get/second_product/home", function (req, res) {
    let sql = `
    SELECT   p.pid as id,  p.pet_type,  p.pd_name as name,  p.price,  p.description,  p.categories,  p.city,  p.district,  p.uid,  p.new_level,  p.created_at,  p.stock,  p.sale_count,  p.delivery_method,
  CONCAT(
    '[', GROUP_CONCAT(DISTINCT
      CONCAT(
        '{\"img_path\":\"', pi.img_path, '\",',
        '\"img_value\":\"', pi.img_value, '\"}'
      )
    ), ']'
  ) AS images,
  CONCAT(
    '{', GROUP_CONCAT(DISTINCT
      CONCAT('"', pa.attr, '":"', pa.attr_value, '"')
    ), '}'
  ) AS attributes_object

FROM productslist p
LEFT JOIN product_image pi ON p.pid = pi.pid
LEFT JOIN product_attribute pa ON p.pid = pa.pid
WHERE p.condition = 'second' AND p.status = 1
GROUP BY p.pid;`
    conn.query(sql, function (err, results) {
        if (err) {
            console.error("資料庫查詢錯誤:", err);
            res.status(500).send("伺服器錯誤");
        } else {
            console.log("http://localhost:8000/get/second_product/home 被連線");
            res.json(results); // 正確回傳結果給前端
        }
    });
});

app.post("/post/productsreach/new", function (req, res) {
    let {keyword}=req.body
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
    conn.query(sql,[`%${keyword}%`,`%${keyword}%`,`%${keyword}%`] ,function (err, rows) {
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
    let {keyword}=req.body
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
    conn.query(sql,[`%${keyword}%`,`%${keyword}%`,`%${keyword}%`] ,function (err, rows) {
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