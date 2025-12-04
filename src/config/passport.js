const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");

const initPassport = () => {
  const clientID = process.env.FACEBOOK_APP_ID;
  const clientSecret = process.env.FACEBOOK_APP_SECRET;
  const callbackURL = process.env.FACEBOOK_CALLBACK_URL;
  if (!clientID || !clientSecret || !callbackURL) return;

  passport.use(
    new FacebookStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
        profileFields: ["id", "emails", "name", "displayName"],
        enableProof: true
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const facebookId = profile.id;
          const email = profile.emails && profile.emails[0] && profile.emails[0].value ? profile.emails[0].value : undefined;
          const name = profile.displayName || undefined;

          let user = await User.findOne({ $or: [{ facebookId }, email ? { email } : null].filter(Boolean) });
          if (!user) {
            user = await User.create({
              email,
              role: "citizen",
              provider: "facebook",
              facebookId,
              name
            });
          } else {
            if (!user.facebookId) {
              user.facebookId = facebookId;
              await user.save();
            }
          }
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );
};

module.exports = initPassport;
