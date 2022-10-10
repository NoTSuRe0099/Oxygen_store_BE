export const isAuthenticated = (req, res, next) => {
  const token = req?.cookies['connect.sid'];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Un-Authorized/no token',
    });
  }
  next();
};
