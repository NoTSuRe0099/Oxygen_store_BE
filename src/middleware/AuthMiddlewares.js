export const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: 'Un-Authorized/no token',
    });
  }
  return next();
};

export const authorizeRoles =
  (...roles) =>
    (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(401).json({
          success: false,
          message: `Role: ${req.user.role} is not allowed to access this resouce `,
        });
      }

      return next();
    };
