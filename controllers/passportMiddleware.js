const GooglePlusTokenStrategy = require('passport-google-plus-token');
const passport = require('passport');
const User = require('../models/userModel');

passport.use(
  new GooglePlusTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      passReqToCallback: true
    },
    async function (req, accessToken, refreshToken, profile, done) {
      try {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);

        // Kiểm tra user có tồn tại

        const user = await User.findOne({
          authGoogleId: profile.id,
          authType: 'google'
        });
        console.log(user);
        if (user) return done(null, user);
        console.log(profile.emails[0].value);
        console.log(profile.id);

        // Chưa có tài khoản
        try {
          const newUser = await User.create({
            authType: 'google',
            email: profile.emails[0].value,
            authGoogleId: profile.id
          });
          console.log(newUser);
          return done(null, newUser);
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
