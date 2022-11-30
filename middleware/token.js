const jwt = require("jsonwebtoken");
const UserModel = require("../models/usersModel");

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
  checkToken: async (req, res, next) => {
    // Récupération du token dans le header
    const token = String(req.get("Authorization")).split(" ")[1];

    // Vérification de la présence du token
    if (!token) {
      return res.status(401).json({ message: "Token obligatoire." });
    }

    try {
      // Vérification du token
      const data = jwt.verify(token, process.env.DB_TOKEN_SECRET_KEY);

      // Récupération de l'utilisateur
      const user = await UserModel.findOne({ _id: data.userId });

      // Vérification qu'un utilisateur a été trouvé
      if (!user) {
        throw new Error();
      }

      // Ajout de l'utilisateur à la requête
      req.user = user;

      // Passage à la suite
      next();
    } catch (e) {
      // Erreur de vérification du token ou utilisateur non trouvé
      res.status(401).json({ message: "Accès non autorisé" });
    }
  },
};
module.exports = tokenMiddle;
