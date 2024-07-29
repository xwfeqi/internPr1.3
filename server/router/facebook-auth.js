const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const express = require('express');
const User = require('../models/user-model');
const tokenService = require('../services/token-service');

const router = express.Router();
require('dotenv').config();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_SECRET_KEY,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'emails']
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        console.log('Facebook profile received:', profile);
        
        let user = await User.findOne({ accountId: profile.id, provider: 'facebook' });
        
        if (!user) {
          let email = profile.emails ? profile.emails[0].value : `${profile.id}@facebook.com`;
          
          // Перевірка чи вже існує користувач з такою ж електронною поштою
          const existingUser = await User.findOne({ email: email });
          if (existingUser) {
            // Оновлення існуючого користувача для додавання accountId та provider
            existingUser.accountId = profile.id;
            existingUser.provider = 'facebook';
            await existingUser.save();
            console.log('Existing user updated:', existingUser);
            return cb(null, existingUser);
          } else {
            console.log('Adding new Facebook user to DB..');
            user = new User({
              accountId: profile.id,
              name: profile.displayName,
              provider: 'facebook',
              email: email
            });
            await user.save();
            console.log('New user added:', user);
          }
        } else {
          console.log('Facebook User already exists in DB..');
        }
        
        const tokens = tokenService.generateTokens({ userId: user._id });
        await tokenService.saveToken(user._id, tokens.refreshToken);
        console.log('Tokens generated and saved:', tokens);
        
        const userWithTokens = { ...user.toObject(), accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
        return cb(null, userWithTokens);
      } catch (err) {
        console.error('Error during Facebook authentication:', err);
        return cb(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

router.get('/', (req, res, next) => {
  console.log('Received GET /auth/facebook');
  next();
}, passport.authenticate('facebook', { scope: ['email'] }));

router.get(
  '/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/auth/facebook/error',
  }),
  function (req, res) {
    const { accessToken, refreshToken } = req.user;
    console.log('Facebook authentication successful, redirecting to profile page with tokens');
    res.redirect(`http://localhost:3000/profile?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  }
);

router.get('/success', async (req, res) => {
  const userInfo = {
    id: req.user.id,
    displayName: req.user.name,
    provider: req.user.provider,
  };
  res.json({ message: 'Login successful', user: userInfo });
});

router.get('/error', (req, res) => res.send('Error logging in via Facebook..'));

router.get('/signout', (req, res) => {
  try {
    req.session.destroy(function (err) {
      console.log('session destroyed.');
    });
    res.json({ message: 'User signed out' });
  } catch (err) {
    res.status(400).send({ message: 'Failed to sign out Facebook user' });
  }
});

module.exports = router;
