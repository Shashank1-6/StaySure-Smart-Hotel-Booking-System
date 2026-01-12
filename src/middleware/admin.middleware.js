const isAdmin = (req, res, next) => {
  // TEMP: Hardcoded admin check
  // Later this will be replaced by real auth
  const role = req.headers["x-role"];

  if (role !== "ADMIN") {
    return res.status(403).json({
      message: "Admin access required"
    });
  }

  next();
};

module.exports = isAdmin;
