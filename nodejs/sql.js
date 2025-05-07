var express = require("express");
var axios = require('axios');
const imageType = require('image-type');
// 夏威夷披薩


var cors = require("cors");
var app = express();
app.listen(8000);
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

var mysql = require("mysql");
const { log } = require("console");
var conn = mysql.createConnection({
    user: "root",
    password: "",
    host: "localhost",
    port: 3306,
    database: "howsmoat"
});

conn.connect(function (err) {
    console.log(err);
})
// app.get('/', function (req, res) {
//     res.sendFile(__dirname+'/test.html');

// })
// app.get('/api/taiwan_counties', async (req, res) => {
//     try {
//       const url = 'https://github.com/henry123223323/Lab_A/releases/download/v1.0.1/taiwan_counties.json';
//       const response = await axios.get(url, {
//         responseType: 'stream',
//         headers: {
//           'User-Agent': 'Mozilla/5.0', // 用瀏覽器的 UA 模擬
//           'Accept': '*/*'
//         }
//       });
  
//       res.setHeader('Content-Type', 'application/json');
//       response.data.pipe(res);
//     } catch (err) {
//       console.error('下載失敗：', err.message);
//       res.status(500).send('讀取檔案失敗');
//     }
// });
  
// app.get('/api/taiwan_town', async (req, res) => {
//     try {
//       const url = 'https://github.com/henry123223323/Lab_A/releases/download/v1.0.1/taiwan_townships.json';
//       const response = await axios.get(url, {
//         responseType: 'stream',
//         headers: {
//           'User-Agent': 'Mozilla/5.0', // 用瀏覽器的 UA 模擬
//           'Accept': '*/*'
//         }
//       });
  
//       res.setHeader('Content-Type', 'application/json');
//       response.data.pipe(res);
//     } catch (err) {
//       console.error('下載失敗：', err.message);
//       res.status(500).send('讀取檔案失敗');
//     }
//   });
  
  
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


