
const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// Route d'inscription
router.post("/register", (req, res) =>
    authController.register(req, res)
);

// Route de connexion
router.post("/login", (req, res) =>
    authController.login(req, res)
);

module.exports = router;
