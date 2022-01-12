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
    successRedirect: `${process.env.CORS_ALLOW_ORIGIN}/main`,
    failureRedirect: `${process.env.CORS_ALLOW_ORIGIN}/login`,
  })
);

router.get('/api/logout', (req, res) => {
  req.logout();
  res.send(req.user);
});

router.get('/api/current_user', (req, res) => {
  res.send(req.user);
  res.setHeader('Access-Control-Allow-Headers', 'Set-Cookie');
});

export default router;
