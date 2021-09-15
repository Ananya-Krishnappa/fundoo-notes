const jwt = require("jsonwebtoken");

const anonOps = [{ method: "POST", urls: ["/register", "/login", "/forgotPassword", "/resetPassword"] }];

module.exports = function (req, res, next) {
  if (anonOps.find((op) => op.method === req.method && op.urls.find((url) => req.url.startsWith(url)))) {
    next();
  } else {
    let token = req.headers["authorization"];
    if (token != null && token.startsWith("Bearer")) {
      token = token.substring(7, token.length - 1);
      jwt.verify(token, process.env.APP_SECRET);
      next();
    } else {
      //next(new Error("Not Authorized!"));
      res.statusCode = 401;
      res.end();
    }
  }
};
