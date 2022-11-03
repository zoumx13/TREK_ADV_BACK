const UserModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersModel = require("../models/usersModel");
const maxAge = 3 * 24 * 60 * 60 * 1000;
const users = {
  CreateUser: async (req, res) => {
    const password = req.body.passWord;
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
            res.status(200).json({ message: "utilisateur enregistré " });
          }
        });
      }
    });
  },
  SignIn: async (req, res) => {
    const identifiant = req.body.identifiant;
    const password = req.body.password;

    usersModel.findOne({ identifiant: identifiant }, (err, data) => {
      if (!data) {
        res.status(404).json({ message: "Echec" });
      } else {
        bcrypt.compare(password, data.password, (error, hash) => {
          if (error) {
            res.status(404).json({ message: "Echec" });
          } else {
            if (!hash) {
              res.status(404).json({ message: "Echec" });
            } else {
              const token = jwt.sign(
                {
                  userId: data._id,
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

  EditUser: async (req, res) => { },

  DeleteUser: async (req, res) => { },

  CheckToken: async (req, res) => {
    const token = String(req.get("Authorization")).split(" ")[1];

    if (token) {
      jwt.verify(token, process.env.DB_TOKEN_SECRET_KEY, (err, data) => {
        if (err) {
          req.identifiant = "Invité",
            req.userRole = "aucun";
        } else {
          req.user = data.userId;
          req.identifiant = data.identifiant,
            req.userRole = data.userRole;
        }
      });
    } else {
      req.identifiant = "Invité",
        req.userRole = "aucun";
    }
  },
};
module.exports = users;
