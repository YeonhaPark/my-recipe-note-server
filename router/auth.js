import passport from 'passport';
import express from 'express';

const router = express.Router();

router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${
      process.env.NODE_ENV === 'development'
        ? process.env.CLIENT_SERVER_DEV
        : process.env.CLIENT_SERVER_PROD
    }/login`,
  }),
  (req, res) => {
    res.redirect(
      `${
        process.env.NODE_ENV === 'development'
          ? process.env.CLIENT_SERVER_DEV
          : process.env.CLIENT_SERVER_PROD
      }/main`
    );
  }
);

router.get('/api/logout', (req, res) => {
  req.logout();
  res.send(req.user);
});

router.get('/api/current_user', (req, res) => {
  res.send(req.user);
});

export default router;
