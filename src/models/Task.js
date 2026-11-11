
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

    titre: {
        type: String,
        required: [true, "Le titre de la tache est obligatoire"],
        trim: true,
        minlength: 3,
        maxlength: 150
    },

    description: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: ""
    },

    // Statut limité aux trois valeurs demandées
    statut: {
        type: String,
        enum: ["todo", "doing", "done"],
        default: "todo"
    },

    deadline: {
        type: Date,
        default: null
    },

    // Houni kol tache tetba3 projet mo3ayen
    projet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },

    // El manager ynajem yaffecti tache l'utilisateur
    utilisateurAssigne: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }

}, {
    timestamps: true
});

// Index pour faciliter les recherches
taskSchema.index({ projet: 1 });
taskSchema.index({ utilisateurAssigne: 1 });
taskSchema.index({ statut: 1 });

module.exports = mongoose.model("Task", taskSchema);
