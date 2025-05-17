const session = require('express-session');
const passport = require('passport');


require('./passportGoogle'); // 讀取 passport 策略設定
require('./passportFacebook');

function initPassportAuth(app) {
  // 1. 啟用 session
  app.use(session({
    secret: process.env.SESSION_SECRET || 'HowSmoat9876789',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // 上線要設成 true (https)
      maxAge: 1000 * 60 * 60 * 24 // 1 天
    }
  }));

  // 2. 啟用 passport 登入管理
  app.use(passport.initialize());
  app.use(passport.session());

  // 3. 掛載 Google 登入路由
  // ✅ 3. 延遲載入登入路由
  const authGoogle = require('../routes/authGoogle');
  const authFacebook = require('../routes/authFacebook');

  app.use('/auth', authGoogle);
  app.use('/auth', authFacebook);
}

module.exports = initPassportAuth;