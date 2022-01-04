const AUTH_ERROR = { message: 'Authentication Error' };

export const isAuth = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(AUTH_ERROR);
  }
  req.userId = req.user.id;
  next();
};
