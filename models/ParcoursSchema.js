const mongoose = require("mongoose");

const ClientDetail = new mongoose.Schema(
    {
        idClient : {
            type: String,
            required: true,
        }, 

        etapeCompletee: [{
            nomEtape : String,
            date : String,
        }],
        
        finished : {
            type:Boolean,
            
        }
    
    })

const ReservationDetail = new mongoose.Schema(
    {
        dateReservation : {
            type: String,
            required: true,
        },
        idGuide : {
            type: String,
            required: true,
        },
        maxClients : {
            type: String,
            required: true,
        },
        clients : [ClientDetail]



    })
const EtapeDetail = new mongoose.Schema(
    {
        nomEtape : {
            type: String,
            required: true,
        },
        numeroEtape : {
            type: String,
            required: true,
        },
        localisation : {
            type: String,
            required: true,
        },
        descriptionEtape : {
            type: String,
        },
        imgIllustrationEtape: {
            // Stockez l'image dans un dossier static. Type = String à cause du chemin
            type: String,
            default: "./uploads/etapes/img_etapes.png"

        }

    })

const Parcours = new mongoose.Schema(
    {
        nomParcours: {
            type: String,
            required: true,
            unique: true,
        },
        dureeParcours: {
            type: String,
            required: true,
        },
        description : {
            type: String,
        },
        prix : {
            type: String,
            required: true,
        },
        imgIllustration : {
            // Stockez l'image dans un dossier static. Type = String à cause du chemin
            type: String,
            default: "./uploads/parcours/plan_avenir_montagne.jpg"

        },
        niveauDifficulte : {
            type : Number,
            required: true,
        },
        
        reservations: [ReservationDetail],

        etape : [EtapeDetail]   

    })

module.exports = mongoose.model("Parcours", Parcours)