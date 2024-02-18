const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("app/models/user");
const bcrypt = require("bcrypt");

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy({
    clientID: config.service.google.client_key,
    clientSecret: config.service.google.secret_key,
    callbackURL: config.service.google.callback_url,
    scope: [ 'profile', 'email' ]
  },
  async(token, refreshToken, profile, done) => {
    try {
      const user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        return done(null, user);
      }

      const newUser = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: profile.id,
      });

      await newUser.save();
      done(null, newUser);
    } catch (err) {
      done(err, null);
    }
  })
);

// Continue with your code...
