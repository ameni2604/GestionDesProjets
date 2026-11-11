
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, "Le nom est obligatoire"],
        trim: true,
        minlength: 3,
        maxlength: 20
    },

    login: {
        type: String,
        required: [true, "Le login est obligatoire"],
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 20
    },

    password: {
        type: String,
        required: [true, "Le mot de passe est obligatoire"],
        select: false
    },

    role: {
        type: String,
        enum: ["user", "manager"],
        default: "user"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
