const jwt = require("jsonwebtoken");

const tokenMiddle = {
  token: (req, res, next) => {
    const token = String(req.get("Authorization")).split(" ")[1];
    if (token) {
      /* Décryptage du token */
      jwt.verify(token, process.env.DB_TOKEN_SECRET_KEY, (err, data) => {
        req.body.userId = data.userId;
        next();
      });
    }
  },
  tokenPicture: (req, res, next) => {
    const token = String(req.get("Authorization")).split(" ")[1];
    if (token) {
      /* Décryptage du token */
      jwt.verify(token, "secret", (err, data) => {
        next();
      });
    }
  },
};
module.exports = tokenMiddle;
