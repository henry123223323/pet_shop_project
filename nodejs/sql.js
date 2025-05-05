var express = require("express");
const path = require('path');
var cors = require("cors");
var mysql = require("mysql");

var app = express();

app.listen(8000);

app.use(express.static("public"));
const rootPublic = path.resolve(__dirname, '../fashion-paw/public');
app.use(express.static(rootPublic));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const uploadRoute = require('./upload');
app.use('/api', uploadRoute);

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
//       const url = 'https://github.com/henry123223323/Lab_A/sreleases/download/v1.0.1/taiwan_townships.json';
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

// // 新增二手商品
// app.post('/get/second-products', (req, res) => {
//   const p = req.body;
//   const insertSql = `
//     INSERT INTO productslist
//       (pd_name, price, description, pet_type, categories, city, district,
//        new_level, stock, sale_count, delivery_method, \`condition\`, status)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'second', ?)
//   `;
//   const params = [
//     p.pd_name, p.price, p.description, p.pet_type, p.categories,
//     p.city, p.district, p.new_level, p.stock, p.sale_count,
//     p.delivery_method, p.status || 0
//   ];
//   conn.query(insertSql, params, (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     const newPid = result.insertId;
//     // 如果你有要寫入 product_image，可再接著做
//     res.status(201).json({ pid: newPid, ...p });
//   });
// });

// // 更新二手商品
// app.put('/get/second-products/:pid', (req, res) => {
//   const pid = +req.params.pid;
//   const p = req.body;
//   const updateSql = `
//     UPDATE productslist
//     SET pd_name = ?, price = ?, description = ?, pet_type = ?, categories = ?,
//         city = ?, district = ?, new_level = ?, stock = ?, sale_count = ?,
//         delivery_method = ?, status = ?
//     WHERE pid = ? AND \`condition\` = 'second'
//   `;
//   const params = [
//     p.pd_name, p.price, p.description, p.pet_type, p.categories,
//     p.city, p.district, p.new_level, p.stock, p.sale_count,
//     p.delivery_method, p.status, pid
//   ];
//   conn.query(updateSql, params, (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     if (result.affectedRows === 0) return res.status(404).json({ error: '找不到此商品' });
//     res.json({ pid, ...p });
//   });
// });

// 新增二手商品
app.post('/get/second-products', (req, res) => {
  console.log('🔔 POST /get/second-products body:', req.body);

  const pd = req.body;
  const insertPd = `
    INSERT INTO productslist
      (pd_name, price, description, pet_type,
       categories, city, district, new_level,
       stock, sale_count, delivery_method,
       \`condition\`, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'second', ?)
  `;
  const pdParams = [
    pd.pd_name, pd.price, pd.description, pd.pet_type,
    pd.categories, pd.city, pd.district, pd.new_level,
    pd.stock, pd.sale_count||0, pd.delivery_method,
    pd.status||0
  ];
  conn.query(insertPd, pdParams, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    const newPid = result.insertId;

       // attributes
    const attrs = Object.entries(pd.attribute || {});
    if (attrs.length) {
      const attrVals = attrs.map(([k,v]) => [newPid, k, v]);
      conn.query(
        'INSERT INTO product_attribute (pid,attr,attr_value) VALUES ?',
        [attrVals],
        (attrErr, attrRes) => {
          if (attrErr) {
            console.error('❌ INSERT attributes failed:', attrErr);
          } else {
            console.log(`✓ Inserted ${attrRes.affectedRows} attributes`);
          }
        }
      );
    }

    // images
    const imgs = (pd.images || []).filter(i => i.img_path);
    if (imgs.length) {
      const imgVals = imgs.map((i, idx) => [
        newPid, i.img_path, i.img_value, idx
      ]);
      conn.query(
        'INSERT INTO product_image (pid,img_path,img_value,pd_img_id) VALUES ?',
        [imgVals],
        (imgErr, imgRes) => {
          if (imgErr) {
            console.error('❌ INSERT images failed:', imgErr);
          } else {
            console.log(`✓ Inserted ${imgRes.affectedRows} images`);
          }
        }
      );
    }

    return res.status(201).json({ pid: newPid, ...pd });
  });
});
// 更新二手商品
app.put('/get/second-products/:pid', (req, res) => {
  const pid = +req.params.pid;
  const pd = req.body;
  const upd = `
    UPDATE productslist SET
      pd_name=?, price=?, description=?, pet_type=?,
      categories=?, city=?, district=?, new_level=?,
      stock=?, sale_count=?, delivery_method=?, status=?
    WHERE pid=?
  `;
  const updParams = [
    pd.pd_name, pd.price, pd.description, pd.pet_type,
    pd.categories, pd.city, pd.district, pd.new_level,
    pd.stock, pd.sale_count||0, pd.delivery_method,
    pd.status||0, pid
  ];
  conn.query(upd, updParams, err => {
    if (err) return res.status(500).json({ error: err.message });

    // 先清屬性再寫新屬性
    conn.query('DELETE FROM product_attribute WHERE pid=?',[pid], ()=>{
      const attrs = Object.entries(pd.attribute||{});
      if (attrs.length) {
        const attrVals = attrs.map(([k,v])=>[pid,k,v]);
        conn.query(
          'INSERT INTO product_attribute (pid,attr,attr_value) VALUES ?',
          [attrVals],
          e=> e&&console.error(e)
        );
      }
    });

    // 清圖再寫新圖
    conn.query('DELETE FROM product_image WHERE pid=?',[pid], ()=>{
      const imgs = (pd.images||[]).filter(i=>i.img_path);
      if (imgs.length) {
        const imgVals = imgs.map((i,idx)=>[pid,i.img_path,i.img_value,idx]);
        conn.query(
          'INSERT INTO product_image (pid,img_path,img_value,pd_img_id) VALUES ?',
          [imgVals],
          e=> e&&console.error(e)
        );
      }
    });

    res.json({ pid, ...pd });
  });
});

// 刪除二手商品
app.delete('/get/second-products/:pid', (req, res) => {
  const pid = +req.params.pid;
  console.log('DELETE /get/second-products/', pid);

  conn.query('DELETE FROM productslist WHERE pid = ?', [pid], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).send();
    res.sendStatus(204);
  });
});

app.get("/get/hot-ranking", (req, res) => {
  const hostUrl = `${req.protocol}://${req.get("host")}`; // e.g. http://localhost:8000

  const sql = `
    SELECT
      p.pid,
      p.pd_name,
      p.price,
      p.sale_count,
      pi.img_path
    FROM productslist p
    LEFT JOIN (
      -- 從 product_image 表中挑出每個 pid 第一張圖
      SELECT 
        pid, 
        img_path
      FROM product_image
      WHERE pd_img_id IN (
        SELECT MIN(pd_img_id)
        FROM product_image
        GROUP BY pid
      )
    ) AS pi
      ON pi.pid = p.pid
    ORDER BY p.sale_count DESC
    LIMIT 3;
  `;

  conn.query(sql, (err, results) => {
    if (err) {
      console.error("❌ /get/hot-ranking 查詢錯誤：", err);
      return res.status(500).send("伺服器錯誤，無法取得熱銷排行");
    }

    const data = results.map(row => {
      // 清理 ../ 前綴，並把反斜線轉正斜線
      const imgPath = (row.img_path || "")
        .replace(/\\/g, "/")
        .replace(/^(\.\.\/)+/, "")
        .replace(/^\/+/, "");
      return {
        pid:        row.pid,
        pd_name:   row.pd_name,
        price:     row.price,
        sale_count: row.sale_count,
        imageUrl:  imgPath ? `${hostUrl}/${imgPath}` : null,
      };
    });

    // 印出最終的 URL 確認沒問題
    console.log("🔥 /get/hot-ranking 最終 imageUrl：", data.map(d => d.imageUrl));

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
