const { userTokenValidator } = require("../utils/userTokenManager");

const userAuth = (req, res, next) => {
  const { jwt = "" } = req.cookies;
  const user = userTokenValidator(jwt);
  if (user) {
    req.user = user;
    next();
  } else {
    res.redirect("/user/login");
  }
};

module.exports = userAuth;
