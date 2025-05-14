const express = require('express');
const router = express.Router();
const passport = require('passport');

// ✅ 導向 Google 登入，加上 log
router.get('/google', (req, res, next) => {
  console.log('➡️ /auth/google 被打到了！');
  next();
}, passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// ✅ Google 登入回調
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log('✅ Google 登入成功，導回前端');
    res.redirect('http://localhost:3000/');
  }
);

module.exports = router;