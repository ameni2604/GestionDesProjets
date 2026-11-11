
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

class AuthService {

    // Inscription d'un nouvel utilisateur
    async register(data) {

        const existingUser = await userRepository.findByLogin(data.login);

        if (existingUser) {
            throw new Error("Login deja utilise");
        }

        // houni ncryptiw el mot de passe bel bcrypt
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await userRepository.create({
            nom: data.nom,
            login: data.login,
            password: hashedPassword,
            role: data.role
        });

        return {
            id: user._id,
            nom: user.nom,
            login: user.login,
            role: user.role
        };
    }

    // Connexion d'un utilisateur
    async login(login, password) {

        const user = await userRepository.findByLogin(login);
        if (!user) {
            throw new Error("Login ou mot de passe incorrect");
        }

        // houni n9arnou el mot de passe bel version cryptée
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Login ou mot de passe incorrect");
        }

        // Génération du token JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        return {
            token,
            user: {
                id: user._id,
                nom: user.nom,
                login: user.login,
                role: user.role
            }
        };
    }
}

module.exports = new AuthService();
