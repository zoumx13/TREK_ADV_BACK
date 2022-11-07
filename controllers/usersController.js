const UserModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
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
          photo_profil: "defaultprofil.jpg",
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
              res.json({
                token: token,
                userRole: data.role,
                message: "Connecté",
              });
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
            photo_profil: data.photo_profil,
          },
        });
      }
    });
  },
  GetProfilUser: async (req, res) => {
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
            prenom: data.prenom,
            photo_profil: data.photo_profil,
            description: data.description,
          },
        });
      }
    });
  },
  ModifyProfilUser: async (req, res) => {
    const userId = req.body.userId;
    const filter = { _id: userId };

    const updateUser = {
      name: req.body.nom,
      prenom: req.body.prenom,
      identifiant: req.body.identifiant,
      description: req.body.description,
    };
    UserModel.findOneAndUpdate(filter, updateUser, (err) => {
      if (err) {
        res.status(500).json({ message: "Echec" });
      } else {
        res.json({ message: "information mise a jour" });
      }
    });
  },
  UpdateUserPicture: async (req, res) => {
    if (req.file) {
      const name = req.file.filename;
      const token = String(req.get("Authorization")).split(" ")[1];
      if (token) {
        /* Décryptage du token */
        jwt.verify(token, process.env.DB_TOKEN_SECRET_KEY, (err, data) => {
          const userId = data.userId;
          const filter = { _id: userId };

          const updateUser = {
            photo_profil: name,
          };
          UserModel.findOne(filter, (err, data) => {
            if (err) {
              res.status(404).json({ message: "Echec" });
            } else {
              if (data.photo_profil) {
                console.log(data.photo_profil);
                const defaultprofil = "defaultprofil.jpg";
                console.log(defaultprofil);
                if (data.photo_profil != defaultprofil) {
                  const lastProfilPicture = data.photo_profil;
                  const path =
                    "../TREK-ADVENTURE-BACK/client/public/uploads/users/" +
                    lastProfilPicture;
                  fs.unlink(path, (err) => {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log("\nDeleted file:" + lastProfilPicture);
                    }
                  });
                }
              }
            }
          });

          UserModel.findOneAndUpdate(filter, updateUser, (err) => {
            if (err) {
              res.status(500).json(err);
            } else {
              res.json({ message: name });
            }
          });
        });
      } else {
        res.json({ message: "Echec" });
      }
    } else {
      res.json({ message: "Echec" });
    }
  },
  Admin: async (req, res) => {
    console.log("Bien connecté en Admin !");
  },

  EditUser: async (req, res) => {},

  DeleteUser: async (req, res) => {},

  CheckToken: async (req, res) => {
    const token = String(req.get("Authorization")).split(" ")[1];
    console.log("entrer controller");
    if (token) {
      jwt.verify(token, process.env.DB_TOKEN_SECRET_KEY, (err, data) => {
        if (err) {
          console.log("retour JSON");
          res.json({ identifiant: "Invité", userRole: "aucun" });
          // req.identifiant = "Invité",
          //   req.userRole = "aucun";
        } else {
          res.json({
            identifiant: data.identifiant,
            userRole: data.userRole,
            id: data.userId,
          });
          // req.user = data.userId;
          // req.identifiant = data.identifiant,
          //   req.userRole = data.userRole;
        }
      });
    } else {
      console.log("retour JSON");
      res.json({ identifiant: "Invité", userRole: "aucun" });
      // req.identifiant = "Invité",
      //   req.userRole = "aucun";
    }
  },
};
module.exports = users;
