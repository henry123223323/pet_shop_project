const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    // 登入成功後導回前端
    res.redirect('http://localhost:3000/');
  }
);

module.exports = router;