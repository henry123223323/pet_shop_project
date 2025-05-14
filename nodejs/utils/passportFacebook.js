require('dotenv').config();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FB_CALLBACK_URL,
  profileFields: ['id', 'emails', 'name']
}, (accessToken, refreshToken, profile, done) => {
  console.log("✅ Facebook 登入成功", profile);
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));