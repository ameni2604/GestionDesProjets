const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
// Importation des validateurs et du middleware de validation
const { registerValidator, loginValidator } = require("../validators/userValidator");
const validateRequest = require("../middlewares/validateRequest");
// Route d'inscription
router.post("/register", registerValidator, validateRequest, (req, res) =>
    authController.register(req, res)
);

// Route de connexion
router.post("/login", loginValidator, validateRequest, (req, res) =>
    authController.login(req, res)
);

module.exports = router;
