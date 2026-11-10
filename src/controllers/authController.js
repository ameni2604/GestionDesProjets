
const authService = require("../services/authService");

class AuthController {

    // Inscription
    async register(req, res) {
        try {
            const user = await authService.register(req.body);

            return res.status(201).json({
                message: "Utilisateur cree avec succes",
                user
            });

        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    // Connexion
    async login(req, res) {
        try {
            const { login, password } = req.body;

            const result = await authService.login(login, password);

            return res.status(200).json({
                message: "Connexion reussie",
                ...result
            });

        } catch (error) {
            return res.status(401).json({
                message: error.message
            });
        }
    }
}

module.exports = new AuthController();
