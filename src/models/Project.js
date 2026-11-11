
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({

    nom: {
        type: String,
        required: [true, "Le nom du projet est obligatoire"],
        trim: true,
        minlength: 3,
        maxlength: 100
    },

    description: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: ""
    },

    // Houni kol projet 3andou proprietaire (User)
    proprietaire: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    statut: {
        type: String,
        enum: ["en_cours", "termine", "en_pause"],
        default: "en_cours"
    }

}, {
    timestamps: true
});

// Index bech nlawjou b proprietaire b sor3a
projectSchema.index({ proprietaire: 1 });

module.exports = mongoose.model("Project", projectSchema);
