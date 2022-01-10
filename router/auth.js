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
    failureRedirect: `${process.env.CORS_ALLOW_ORIGIN}/login`,
  }),
  (req, res) => {
    res.redirect(`${process.env.CORS_ALLOW_ORIGIN}/main`);
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
