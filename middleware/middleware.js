const jwt = require("jsonwebtoken");

const middleware = {
  authentication(req, res, next) {
    console.log("Lancement middleware");
    const cookie_token = req.cookie.jwt;
    if (cookie_token) {
      jwt.verify(cookie_token, process.env.DB_TOKEN_SECRET_KEY, (err, data) => {
        if (err) {
          res.status(401).json({ message: "Vous n'êtes pas identifié !" });
          res.cookie("jwt", "", {maxAge: 1 });
        } else {
          req.user = data;
          next();
        }
      });
    } else {
      res.status(404).json({ message: "Vous n'êtes pas identifié !" });
    }
  },
};

module.exports = middleware;
