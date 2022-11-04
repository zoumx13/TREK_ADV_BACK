const jwt = require("jsonwebtoken");

const middleware = {
  authentication(req, res, next) {
    const token = String(req.get("Authorization")).split(" ")[1];

    if (token) {
      jwt.verify(token, process.env.DB_TOKEN_SECRET_KEY, (err, data) => {
        if (err) {
          res.status(401).json({ message: "Vous n'êtes pas identifié !" });
        } else {
          if (data.role == "admin") {
            req.user = data.userId;
            (req.identifiant = data.identifiant), (req.role = data.role);
            next();
          } else {
            res
              .status(401)
              .json({ message: "Accès restreint à l'administrateur" });
          }
        }
      });
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  },
};

module.exports = middleware;
