const UserModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const users = {
  CreateUser: async (req, res) => {
    const password = req.body.passWord;
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        res.status(505).json(err);
      } else {
        const newUser = new UserModel({
          email: req.body.email,
          password: hash,
          role: req.body.role,
          nom: req.body.nom,
          prenom: req.body.prenom,
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

  EditUser: async (req, res) => {},

  DeleteUser: async (req, res) => {},
};
module.exports = users;
