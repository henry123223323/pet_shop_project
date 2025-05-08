const express = require('express');
const moment = require('moment');
const ecpay_payment = require('../utils/ecpay-sdk/lib/ecpay_payment.js');
const {options, HOST} = require('../utils/ecpay-sdk/conf/config.js')

const router = express.Router();

let TradeNo;

// 建立訂單，導向綠界付款頁
router.get('/create-order', (req, res) => {
    const MerchantTradeDate = moment().format('YYYY/MM/DD HH:mm:ss');
    TradeNo = 'HSM' + moment().format('YYYYMMDDHHmmssSSS');
  
    const base_param = {
      MerchantTradeNo: TradeNo,
      MerchantTradeDate,
      TotalAmount: '100',
      TradeDesc: '測試交易描述',
      ItemName: '測試商品等',
      ReturnURL: `${HOST}/payment/return`,
      ClientBackURL: `${HOST}/payment/clientReturn`,
      EncryptType: 1,
    };
  
    const create = new ecpay_payment(options);
    const html = create.payment_client.aio_check_out_all(base_param);
  
    //  直接用 res.send() 回傳整段 HTML
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>正在導向綠界付款頁...</title>
        </head>
        <body>
          <h2>請稍候，正在導向綠界付款頁...</h2>
          ${html}
        </body>
      </html>
    `);
  });

// 綠界背景通知
router.post('/return', express.urlencoded({ extended: false }), (req, res) => {
  console.log('綠界回傳參數:', req.body);

  const { CheckMacValue, ...rest } = req.body;
  const create = new ecpay_payment(options);
  const checkValue = create.payment_client.helper.gen_chk_mac_value(rest);

  console.log(
    'CheckMacValue 驗證結果:',
    CheckMacValue === checkValue ? '✅ 成功' : '❌ 失敗',
    '\n原始:',
    CheckMacValue,
    '\n計算:',
    checkValue
  );

  res.send('1|OK');
});

// 使用者付款完後回到此頁
router.get('/clientReturn', (req, res) => {
  console.log('使用者完成付款導回:', req.query);
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>付款完成</title>
        <meta http-equiv="refresh" content="2;url=/" />
      </head>
      <body>
        <h2>付款完成，2 秒後自動跳轉回首頁...</h2>
        <p>如果沒有跳轉，請 <a href="/">點此回首頁</a></p>
      </body>
    </html>
  `);
});

module.exports = router;