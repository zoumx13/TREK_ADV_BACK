const UserModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const path = require("path");
const nodemailer = require("nodemailer");

const maxAge = 3 * 24 * 60 * 60 * 1000;
const users = {
  // INSCRIPTION USER & CREATION GUIDE
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
          dateInscription: Date()
        });
        newUser.save((err, data) => {
          if (err) {
            res.status(500).json({ message: "Impossible de s'enregistrer" });
          } else {
            res.status(200).json(data);
          }
        });
      }
    });
  },
  //CONNEXION
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
                message: "Connect??",
              });
            }
          }
        });
      }
    });
  },
  // CONTEXT USER
  GetUser: async (req, res) => {
    const userId = req.body.userId;
    const filter = { _id: userId };
    UserModel.findOne(filter, (err, data) => {
      if (err) {
        res.status(404).json({ message: "Echec" });
      } else {
        res.json({
          message: "rel??ve r??ussi:",
          profil: {
            nom: data.nom,
            prenom: data.prenom,
            identifiant: data.identifiant,
            role: data.role,
            photo_profil: data.photo_profil,
            annees_exp: data.annees_exp,
            description: data.description,
          }
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
          message: "rel??ve r??ussi:",
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
    const userId = req.user._id;
    const filter = { _id: userId };
    const password = req.body.password;

    if (password) {
      const saltRounds = 10;

      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          res.status(505).json(err);
        } else {
          const updateUser = {
            nom: req.body.nom,
            prenom: req.body.prenom,
            identifiant: req.body.identifiant,
            description: req.body.description,
            password: hash,
          };

          UserModel.findOneAndUpdate(filter, updateUser, (err) => {
            if (err) {
              res.status(500).json({ message: "Echec" });
            } else {
              res.json({ message: "information mise a jour" });
            }
          });
        }
      });
    } else {
      const updateUser = {
        nom: req.body.nom,
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
    }
  },
  UpdateUserPicture: async (req, res) => {
    if (req.file) {
      const name = req.file.filename;
      const token = String(req.get("Authorization")).split(" ")[1];
      if (token) {
        /* D??cryptage du token */
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
  updatePicture: async (req, res) => {
    // V??rification de la pr??sence d'un fichier
    if (!req.file) {
      return res.json({ message: "Echec" });
    }

    // R??cup??ration de l'utilisateur
    const user = req.user;

    try {
      // Suppression de l'ancienne image
      if (user.photo_profil && user.photo_profil !== "defaultprofil.jpg") {
        const filePath = path.join(
          __dirname,
          "../client/public/uploads/users/" + user.photo_profil
        );

        await fs.unlink(filePath);
      }

      // Mise ?? jour de la photo de profil de l'utilisateur
      user.photo_profil = req.file.filename;
      await user.save();
      res.json({ message: req.file.filename });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  },
  updateImgUser: async (req, res) => {
    if (req.file) {
      const name = req.file.filename;
      const id = req.params.idGuide;
      if (id) {
        const filter = { _id: id };

        const updateImage = {
          photo_profil: name,
        };

        UserModel.findOneAndUpdate(filter, updateImage, (err) => {
          if (err) {
            res.status(500).json(err);
          } else {
            res.json({ message: name });
          }
        });
      } else {
        res.json({ message: "Echec 1" });
      }
    } else {
      res.json({ message: "Echec 2" });
    }
  },
  Admin: async (req, res) => {
    console.log("Bien connect?? en Admin !");
  },

  // EditUser: async (req, res) => {},

  // DeleteUser: async (req, res) => {},

  ListGuide: async (req, res) => {
    const userSearch = [];
    UserModel.find({ role: "guide" }, (err, users) => {
      if (err) {
        res.status(404).json({ message: "Echec" });
      } else {
        users.forEach(function (user) {
          userSearch.push({
            id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            description: user.description,
            annees_exp: user.annees_exp,
            identifiant: user.identifiant,
            photo_profil: user.photo_profil,
          });
        });
        res.json(userSearch);
      }
    });
  },
  //MODIFIER GUIDE ADMIN/GUIDE
  modifyUserGuide: async (req, res) => {
    const { identifiant, password, nom, prenom, annees_exp, description } =
      req.body;

    const updateData = {
      identifiant: identifiant,
      password: password,
      nom: nom,
      prenom: prenom,
      annees_exp: annees_exp,
      description: description,
    };

    try {
      const guideModified = await UserModel.findByIdAndUpdate(
        req.params.idGuide,

        { $set: updateData },
        { new: true }
      );
      res.status(200).json(guideModified);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  //SUPPRIMER GUIDE ADMIN
  deleteGuide: (req, res) => {
    UserModel.findByIdAndRemove({ _id: req.params.id }, (err, data) => {
      if (err) {
        res.status(404).json({ message: "error", err });
      } else {
        console.log("Guide supprim??", data);
        res.status(200).json({ message: "data", data });
      }
    });
  },
  //CREATION MAIL GUIDE
  MailGuide: async (req, res) => {
    const password = req.body.password;
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "liliane.grant25@ethereal.email",
        pass: "GcyumymqpsEPceAuHT",
      },
    });
    console.log("pouet", password);
    let info = await transporter.sendMail({
      from: '"Trek Adventure" <trekadventure@example.com>', // sender address
      to: req.body.mail, // list of receivers
      subject: "Inscription Guide TA", // Subject line
      text:
        "Bonjour, bienvenue sur le site Trek Adventure. Connectez vous avec le mot de passe ci-apr??s : " +
        password, // plain text body
      // html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    res.status(200).json({message : "mail password sent"})
  },

};
module.exports = users;
