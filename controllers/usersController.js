const UserModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const usersModel = require("../models/usersModel");
const maxAge = 3 * 24 * 60 * 60 * 1000;
const users = {
  CreateUser: async (req, res) => {
    const password = req.body.password;
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        res.status(505).json(err);
      } else {
        const newUser = new UserModel({
          identifiant: req.body.identifiant,
          password: hash,
          role: req.body.role,
          nom: req.body.nom,
          prenom: req.body.prenom,
          annees_exp: req.body.annees_exp,
          photo_profil: req.body.photo_profil,
        });
        newUser.save((err) => {
          if (err) {
            res.status(500).json({ message: "Impossible de s'enregistrer" });
          } else {
            res.status(200).json({ message: "Utilisateur enregistré " });
          }
        });
      }
    });
  },
  SignIn: async (req, res) => {
    const identifiant = req.body.identifiant;
    const password = req.body.password;

    UserModel.findOne({ identifiant: identifiant }, (err, data) => {
      if (!data) {
        res.status(404).json({ message: "Echec1" });
      } else {
        bcrypt.compare(password, data.password, (error, hash) => {
          if (error) {
            res.status(404).json({ message: "Echec2" });
          } else {
            if (!hash) {
              res.status(404).json({ message: "Echec3" });
            } else {
              const token = jwt.sign(
                {
                  userId: data._id,
                  userIdentifiant: data.identifiant,
                  userRole: data.role,
                },
                process.env.DB_TOKEN_SECRET_KEY,
                { expiresIn: maxAge }
              );
              res.json(token);
            }
          }
        });
      }
    });
  },
  GetUser: async (req, res) => {
    const userId = req.body.userId;
    const filter = { _id: userId };
    UserModel.findOne(filter, (err, data) => {
      if (err) {
        res.status(404).json({ message: "Echec" });
      } else {
        res.json({
          message: "reléve réussi:",
          profil: {
            nom: data.nom,
            identifiant: data.identifiant,
            role: data.role,
          },
        });
      }
    });
  },
  Admin: async (req, res) => {
    console.log("Bien connecté en Admin !");
  },

  EditUser: async (req, res) => { },

  DeleteUser: async (req, res) => { },

  CheckToken: async (req, res) => {
    const token = String(req.get("Authorization")).split(" ")[1];
console.log("entrer controller")
    if (token) {
      jwt.verify(token, process.env.DB_TOKEN_SECRET_KEY, (err, data) => {
        if (err) {
          console.log("retour JSON");
           res.json({ identifiant: 'Invité', userRole: "aucun" });
          // req.identifiant = "Invité",
          //   req.userRole = "aucun";
        } else {
          res.json({ identifiant: data.identifiant, userRole: data.userRole, id: data.userId });
          // req.user = data.userId;
          // req.identifiant = data.identifiant,
          //   req.userRole = data.userRole;
        }
      });
    } else {
      console.log("retour JSON");
      res.json({ identifiant: 'Invité', userRole: "aucun" });
      // req.identifiant = "Invité",
      //   req.userRole = "aucun";
    }
  },
};
module.exports = users;
