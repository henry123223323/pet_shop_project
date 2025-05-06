var express = require("express");
var axios = require('axios');

var cors = require("cors");
var app = express();
app.listen(8000);
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/media', express.static('media'))
const uploadRoute = require('./upload');
app.use('/api', uploadRoute);

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


