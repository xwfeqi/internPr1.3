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
        let user = await User.findOne({ accountId: profile.id, provider: 'facebook' });

        if (!user) {
          let email = profile.emails ? profile.emails[0].value : `${profile.id}@facebook.com`;

          const existingUser = await User.findOne({ email: email });
          if (existingUser) {
            existingUser.accountId = profile.id;
            existingUser.provider = 'facebook';
            await existingUser.save();
            const tokens = tokenService.generateTokens({ userId: existingUser._id, email: existingUser.email });
            await tokenService.saveToken(existingUser._id, tokens.refreshToken);
            return cb(null, { user: existingUser, tokens });
          } else {
            console.log('Adding new Facebook user to DB..');
            user = new User({
              name: profile.displayName,
              email: email,
              accountId: profile.id,
              provider: 'facebook',
              registeredDate: new Date()
            });
            await user.save();
            const tokens = tokenService.generateTokens({ userId: user._id, email: user.email });
            await tokenService.saveToken(user._id, tokens.refreshToken);
            return cb(null, { user, tokens });
          }
        } else {
          console.log('Facebook User already exists in DB..');
          const tokens = tokenService.generateTokens({ userId: user._id, email: user.email });
          await tokenService.saveToken(user._id, tokens.refreshToken);
          return cb(null, { user, tokens });
        }
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);

passport.serializeUser((data, done) => {
  done(null, data.user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

router.get('/', passport.authenticate('facebook', { scope: ['email'] }));

router.get(
  '/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/auth/facebook/error',
  }),
  function (req, res) {
    const { user, tokens } = req.user;
    res.redirect(`${process.env.CLIENT_URL}/profile?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
  }
);

router.get('/error', (req, res) => res.send('Error logging in via Facebook..'));

module.exports = router;
