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


// 取得新品列表
app.get("/get/new-products", (req, res) => {
  const hostUrl = `${req.protocol}://${req.get("host")}`; // e.g. http://localhost:8000
  const sql = `
    SELECT
      p.pid        AS pid,
      p.pd_name    AS pd_name,
      p.price      AS price,
      p.categories AS categories,
      p.status     AS status,
      (
        SELECT pi.img_path
        FROM product_image pi
        WHERE pi.pid = p.pid
        ORDER BY pi.pd_img_id
        LIMIT 1
      ) AS img_path
    FROM productslist p
    WHERE p.condition = 'NEW'
  `;
  conn.query(sql, (err, results) => {
    if (err) {
      console.error("❌ /get/new-products 查詢錯誤：", err);
      return res.status(500).send("伺服器錯誤，無法取得新品列表");
    }

    // 清理路徑並拼完整 URL
    const data = results.map(row => {
      let p = row.img_path || "";
      p = p.replace(/\\/g, "/")        // 反斜線 → 正斜線
        .replace(/^(\.\.\/)+/, "")  // 去掉所有 ../
        .replace(/^public\//, "")   // 去掉 public/
        .replace(/^\/+/, "")        // 去掉開頭的 /
      return {
        pid: row.pid,
        pd_name: row.pd_name,
        price: row.price,
        categories: row.categories,
        status: row.status,
        imageUrl: p ? `${hostUrl}/${p}` : null,
      };
    });

    console.log("🔥 /get/new-products 回傳 imageUrl：", data.map(d => d.imageUrl));
    res.json(data);
  });
});


app.post("/get/new-products", async (req, res) => {
  const pd = req.body;
  // 1. 把商品主表寫入 productslist
  const insertProductSql = `
    INSERT INTO productslist
      (pd_name, price, description, pet_type, categories, stock, status, condition, sale_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    pd.pd_name,
    pd.price,
    pd.description,
    pd.pet_type,
    pd.categories,
    pd.stock,
    pd.status || 0,
    pd.condition || 'NEW',
    pd.sale_count || 0
  ];
  conn.query(insertProductSql, params, (err, result) => {
    if (err) {
      console.error("新增 productslist 失敗：", err);
      return res.status(500).json({ error: "無法新增商品" });
    }
    const newPid = result.insertId;

    // 2. 如果有主打圖或內容圖，一併寫入 product_image
    const images = [];
    if (pd.images && pd.images.point_area && pd.images.point_area.img_path) {
      images.push({
        pid: newPid,
        img_path: pd.images.point_area.img_path,
        img_value: pd.images.point_area.img_value,
        pd_img_id: 0
      });
    }
    if (pd.images && Array.isArray(pd.images.content_area)) {
      pd.images.content_area.forEach((img, idx) => {
        if (img.img_path) {
          images.push({
            pid: newPid,
            img_path: img.img_path,
            img_value: img.img_value,
            pd_img_id: idx + 1
          });
        }
      });
    }

    if (!images.length) {
      // 沒有圖片就直接回傳
      return res.json({ pid: newPid, ...pd });
    }

    // 批次寫入 product_image
    const imgSql =
      "INSERT INTO product_image (pid, img_path, img_value, pd_img_id) VALUES ?";
    const imgValues = images.map(i => [
      i.pid,
      i.img_path,
      i.img_value,
      i.pd_img_id
    ]);
    conn.query(imgSql, [imgValues], imgErr => {
      if (imgErr) {
        console.error("寫入 product_image 失敗：", imgErr);
        // 圖片寫失敗也不至於整個動作失敗，還是回傳商品
      }
      // 3. 回傳剛創建的商品（前端會把 response.data 拆進 state）
      res.json({ pid: newPid, ...pd });
    });
  });
});

// 新增新品
app.post('/get/new-products', (req, res) => {
  const data = req.body;
  const pid = nextPid++;
  const newProduct = { pid, ...data };
  products.unshift(newProduct);
  console.log(`Created product ${pid}`);
  res.status(201).json(newProduct);
});
// 更改商品資訊
app.put('/get/new-products/:pid', (req, res) => {
  const pid = parseInt(req.params.pid, 10);
  const index = products.findIndex(p => p.pid === pid);
  if (index === -1) {
    return res.status(404).json({ error: `Product ${pid} not found` });
  }
  const updated = { ...products[index], ...req.body, pid };
  products[index] = updated;
  console.log(`Updated product ${pid}`);
  res.json(updated);
});

// 刪除商品
app.delete('/get/new-products/:pid', (req, res) => {
  const pid = parseInt(req.params.pid, 10);
  const initialLength = products.length;
  products = products.filter(p => p.pid !== pid);
  if (products.length === initialLength) {
    return res.status(404).json({ error: `Product ${pid} not found` });
  }
  console.log(`Deleted product ${pid}`);
  res.sendStatus(204);
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

// 取得二手商品清單
app.get('/get/second-products', (req, res) => {
  const sql = `
    SELECT 
      p.pid            AS pid,
      p.pd_name        AS pd_name,
      p.price          AS price,
      p.\`condition\`  AS product_condition,
      p.status         AS status,
      p.pet_type       AS pet_type,
      p.categories     AS categories,
      p.city           AS city,
      p.district       AS district,
      p.uid            AS uid,
      p.new_level      AS new_level,
      p.stock          AS stock,
      p.sale_count     AS sale_count,
      p.delivery_method AS delivery_method,
      pi.img_path      AS img_path
    FROM productslist p
    LEFT JOIN (
      SELECT pi1.pid, pi1.img_path
      FROM product_image pi1
      JOIN (
        SELECT pid, MIN(pd_img_id) AS min_id
        FROM product_image
        GROUP BY pid
      ) AS mi ON pi1.pid = mi.pid AND pi1.pd_img_id = mi.min_id
    ) AS pi ON pi.pid = p.pid
    WHERE p.\`condition\` = 'second'
  `;

  conn.query(sql, (err, results) => {
    if (err) {
      console.error('取得二手商品失敗：', err);
      return res.status(500).json({ error: err.message });
    }
    const host = `${req.protocol}://${req.get('host')}`;
    const data = results.map(r => {
      // 去掉所有 ../
      const cleaned = r.img_path?.replace(/^(\.\.\/)+/, '') || '';
      return {
        pid: r.pid,
        pd_name: r.pd_name,
        price: r.price,
        condition: r.product_condition,
        status: r.status,
        pet_type: r.pet_type,
        categories: r.categories,
        city: r.city,
        district: r.district,
        uid: r.uid,
        new_level: r.new_level,
        stock: r.stock,
        sale_count: r.sale_count,
        delivery_method: r.delivery_method,
        images: [{ img_path: cleaned, img_value: '' }],
        // 最终拼成 http://localhost:8000/media/new_pd/dog/test01.jpg
        imageUrl: cleaned
          ? `${host}/${cleaned}`
          : null
      };
    });
    res.json(data);
  });
});






// 啟動伺服器
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});



