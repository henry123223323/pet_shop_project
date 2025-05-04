const express = require("express");
const cors = require("cors");
const mysql = require("mysql");       

const app = express();

console.log("__dirname =", __dirname);
console.log("process.cwd() =", process.cwd());

app.use(express.static("public"));
app.use((req, res, next) => {
    console.log(`⏱ ${req.method} ${req.url}`);
    next();
  });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());



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

app.get("/get/hot-ranking", (req, res) => {
    const hostUrl = `${req.protocol}://${req.get("host")}`; // e.g. http://localhost:8000
    const sql = `
      SELECT
        p.pid        AS pid,
        p.pd_name    AS pd_name,
        p.price      AS price,
        p.sale_count AS sale_count,
        pi.img_path  AS img_path
      FROM productslist p
      LEFT JOIN (
        SELECT pi1.pid, pi1.img_path
        FROM product_image pi1
        INNER JOIN (
          SELECT pid, MIN(pd_img_id) AS min_id
          FROM product_image
          GROUP BY pid
        ) pm
        ON pi1.pid = pm.pid
           AND pi1.pd_img_id = pm.min_id
      ) AS pi
        ON pi.pid = p.pid
      ORDER BY p.sale_count DESC
      LIMIT 3
    `;
    conn.query(sql, (err, results) => {
      if (err) {
        console.error("❌ /get/hot-ranking 查詢錯誤：", err);
        return res.status(500).send("伺服器錯誤，無法取得熱銷排行");
      }
  
      const data = results.map(row => {
        // 1) 把反斜線換正斜線  2) 去掉開頭的 "../"  3) 去掉開頭的 "/public/"
        let imgPath = (row.img_path || "")
          .replace(/\\/g, "/")
          .replace(/^(\.\.\/)+/, "")
          .replace(/^\/+/, "")
          .replace(/^public\//, "");
        const imageUrl = imgPath
          ? `${hostUrl}/${imgPath}`
          : null;
        return {
          pid: row.pid,
          pd_name: row.pd_name,
          price: row.price,
          sale_count: row.sale_count,
          imageUrl,
        };
      });
  
      // **請注意看這裡印出的最後 imageUrl 是否正確**
      console.log("🔥 最終 imageUrl：", data.map(d => d.imageUrl));
      res.json(data);
    });
  });
  
  
  
  
  // 啟動伺服器
  const PORT = 8000;
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
  


