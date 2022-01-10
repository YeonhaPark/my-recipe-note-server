import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from '../config.js';
import db from '../models/index.js';
// mongoose에서 가져옴
const { User } = db;
const { auth } = config;
const { googleClientId, googleClientSecret } = auth;

// 해당하는 유저를 찾았을때 해당 유저의 정보가 밑의 user 아규먼트로 넘어옴.
passport.serializeUser((user, done) => {
  console.log('serialize user called', user);
  return done(null, user.id);
});

// turn id into user model instance
passport.deserializeUser((id, done) => {
  console.log('deserialize user calleld');
  User.findOne({ where: { id } }).then((user) => {
    return done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ where: { googleId: profile.id } }).then((existingUser) => {
        if (existingUser) {
          console.log('existing user', existingUser);
          done(null, existingUser);
        } else {
          // make a new record
          console.log('new user');
          new User({ googleId: profile.id }) // profile.id 정보를 db에 저장
            .save()
            .then((user) => done(null, user));
        }
      });
    }
  )
);
