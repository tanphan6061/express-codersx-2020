const db = require("../db");
module.exports.requireAuth = function (req, res, next) {
  let url = req.originalUrl;
  let urlNoCheck = ['/books','']
  if (url != '/auth/login')
    res.cookie('directTo', url);

  let baseUrl = req.baseUrl;
  if (!req.signedCookies.userId && urlNoCheck.indexOf(baseUrl)<0) {
    return res.redirect("/auth/login");
  }

  let user = db
    .get("users")
    .find({ id: req.signedCookies.userId })
    .value();
  if (user)
    res.locals.user = user;
  if (!user && urlNoCheck.indexOf(baseUrl)<0) return res.redirect("/auth/login");
  next();
};
