const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/google/callback', // Callback URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { email, name } = profile._json;
        let user = await User.findOne({ email });

        if (!user) {
          user = new User({
            email,
            name,
            googleId: profile.id,
            role: 'user', // Default role for Google OAuth users
          });
          await user.save();
        }

        return done(null, user); // Pass user to Passport
      } catch (error) {
        console.error('Error during Google OAuth authentication:', error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;
