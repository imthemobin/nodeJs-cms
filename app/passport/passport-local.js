const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
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
  "local.register",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      console.log(email, password);

      try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          return done(
            null,
            false,
            req.flash("errors", "چنین کاربری قبلا در سایت ثبت نام کرده است")
          );
        }

        let newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10),
        });

        await newUser.save();

        return done(null, newUser);
      } catch (err) {
        return done(
          err,
          false,
          req.flash(
            "errors",
            "ثبت نام با موفقیت انجام نشد لطفا دوباره سعی کنید"
          )
        );
      }
    }
  )
);
