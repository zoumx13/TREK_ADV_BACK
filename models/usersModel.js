//Modèle utilisateur

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    ID: mongoose.ObjectId,
    identifiant: String,
    password: String,
    nom: String,
    prenom: String,
    role: { type: String, enum: ['admin', 'guide', 'client'] },
    annees_exp: Number,
    photo_profil:String,
    description: String
});
module.exports = mongoose.model("User", userSchema);